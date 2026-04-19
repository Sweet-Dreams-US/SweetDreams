"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Script from "next/script";
import styles from "./WorkContactForm.module.css";

// Turnstile site key (same as /book and /solutions)
const TURNSTILE_SITE_KEY = "0x4AAAAAACJodExIWnZ-7sQq";

// Interest options with brand colors (red / yellow / blue)
const INTEREST_OPTIONS = [
  { label: "Brand Film", color: "#e63636" },
  { label: "Commercial / Ad", color: "#F4C430" },
  { label: "Event Coverage", color: "#4A90E2" },
  { label: "Social Content", color: "#e63636" },
  { label: "Aerial / Drone", color: "#F4C430" },
  { label: "Internal / Recruiting", color: "#4A90E2" },
  { label: "Web Development", color: "#e63636" },
  { label: "Not Sure Yet", color: "#F4C430" },
] as const;

// Note: gtag and turnstile are declared globally in other components
// and Next.js merges these declarations. We avoid re-declaring them here
// to prevent "All declarations must have identical modifiers" errors.

interface WorkContactFormProps {
  /** 'inline' renders as a section on the page; 'modal' renders as a popup overlay */
  mode: "inline" | "modal";
  /** For modal mode: controls visibility */
  isOpen?: boolean;
  /** For modal mode: close handler */
  onClose?: () => void;
  /** Optional pre-selected interest based on where the CTA was clicked */
  prefilledInterest?: string;
  /** Heading override (e.g. "Love this project? Let's build yours.") */
  heading?: string;
  /** Subtext override */
  subtext?: string;
}

export default function WorkContactForm({
  mode,
  isOpen = true,
  onClose,
  prefilledInterest,
  heading = "LET'S TALK",
  subtext = "Tell us about your project. We respond within 24 hours.",
}: WorkContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interests: prefilledInterest ? [prefilledInterest] : ([] as string[]),
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update interests if prefilledInterest changes (e.g. different CTA clicked)
  useEffect(() => {
    if (prefilledInterest) {
      setFormData((prev) => ({
        ...prev,
        interests: prev.interests.includes(prefilledInterest)
          ? prev.interests
          : [prefilledInterest],
      }));
    }
  }, [prefilledInterest]);

  const renderTurnstile = useCallback(() => {
    if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
      try {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            setTurnstileToken(token);
            setTurnstileError(null);
          },
          "error-callback": () => {
            setTurnstileError("Verification failed. Please try again.");
            setTurnstileToken(null);
          },
          "expired-callback": () => {
            setTurnstileToken(null);
            setTurnstileError("Verification expired. Please verify again.");
          },
          theme: mode === "modal" ? "light" : "dark",
          size: "flexible",
        });
      } catch (error) {
        console.error("Turnstile render error:", error);
      }
    }
  }, [mode]);

  useEffect(() => {
    // For modal mode, only render turnstile when visible
    if (mode === "modal" && !isOpen) {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
      return;
    }

    if (window.turnstile) renderTurnstile();

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [renderTurnstile, mode, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (mode === "modal" && isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mode, isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    if (mode !== "modal" || !isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, isOpen, onClose]);

  const toggleInterest = (label: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(label)
        ? prev.interests.filter((i) => i !== label)
        : [...prev.interests, label],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTurnstileError(null);

    if (!turnstileToken) {
      setTurnstileError("Please complete the verification.");
      return;
    }
    if (!formData.phone || !formData.name) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: "",
          message: `From /work page. Interested in: ${
            formData.interests.join(", ") || "Not specified"
          }\n\n${formData.message}`,
          preferredDate: "",
          preferredTime: "",
          turnstileToken,
        }),
      });

      if (response.ok) {
        setStatus("success");
        // Fire Google Ads conversion
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
          window.gtag("event", "ads_conversion_Book_appointment_1", {});
        }
        setFormData({
          name: "",
          email: "",
          phone: "",
          interests: prefilledInterest ? [prefilledInterest] : [],
          message: "",
        });
        setTurnstileToken(null);
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      } else {
        setStatus("error");
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      }
    } catch {
      setStatus("error");
    }
  };

  const formContent = (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={renderTurnstile}
      />

      {status === "success" ? (
        <div className={styles.success}>
          <h3 className={styles.successTitle}>Message sent!</h3>
          <p className={styles.successText}>
            We&apos;ll be in touch within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Your name"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="(555) 555-5555"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="you@company.com"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              What are you interested in? (select all that apply)
            </label>
            <div className={styles.interestTags}>
              {INTEREST_OPTIONS.map((option) => {
                const isSelected = formData.interests.includes(option.label);
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => toggleInterest(option.label)}
                    className={`${styles.interestTag} ${
                      isSelected ? styles.interestTagActive : ""
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: option.color,
                            background: option.color,
                            color: option.color === "#F4C430" ? "#000" : "#fff",
                          }
                        : {}
                    }
                  >
                    <span
                      className={styles.checkbox}
                      style={
                        isSelected
                          ? {
                              borderColor: option.color === "#F4C430" ? "#000" : "#fff",
                              background: option.color === "#F4C430" ? "#000" : "#fff",
                            }
                          : {}
                      }
                    >
                      {isSelected && (
                        <span className={styles.checkmark} style={{ color: option.color }}>
                          &#10003;
                        </span>
                      )}
                    </span>
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tell us more (optional)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={styles.textarea}
              rows={3}
              placeholder="Describe your project or goals..."
            />
          </div>

          <div ref={turnstileRef} className={styles.turnstile} />
          {turnstileError && <p className={styles.error}>{turnstileError}</p>}

          <button
            type="submit"
            className={styles.submit}
            disabled={status === "loading"}
          >
            {status === "loading" ? "SENDING..." : "SEND MESSAGE"}
          </button>

          {status === "error" && (
            <p className={styles.error}>Something went wrong. Please try again.</p>
          )}
        </form>
      )}
    </>
  );

  // INLINE MODE — renders as a section on the page
  if (mode === "inline") {
    return (
      <section className={styles.inlineSection}>
        <div className={styles.inlineContainer}>
          <h2 className={styles.inlineTitle}>{heading}</h2>
          <p className={styles.inlineSubtext}>{subtext}</p>
          {formContent}
        </div>
      </section>
    );
  }

  // MODAL MODE — renders as popup via portal
  if (!mounted || !isOpen) return null;

  const modal = (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button
          type="button"
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close"
        >
          &#x2715;
        </button>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{heading}</h2>
          <p className={styles.modalSubtext}>{subtext}</p>
        </div>
        <div className={styles.modalBody}>{formContent}</div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
