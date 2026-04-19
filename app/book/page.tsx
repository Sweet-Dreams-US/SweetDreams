"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Script from "next/script";
import styles from "./book.module.css";

// Turnstile site key
const TURNSTILE_SITE_KEY = "0x4AAAAAACJodExIWnZ-7sQq";

export default function BookPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    preferredDate: "",
    preferredTime: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const renderTurnstile = useCallback(() => {
    if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
      try {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            setTurnstileToken(token);
            setTurnstileError(null);
          },
          'error-callback': () => {
            setTurnstileError("Verification failed. Please try again.");
            setTurnstileToken(null);
          },
          'expired-callback': () => {
            setTurnstileToken(null);
            setTurnstileError("Verification expired. Please verify again.");
          },
          theme: 'light',
          size: 'flexible',
        });
      } catch (error) {
        console.error("Turnstile render error:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (window.turnstile) {
      renderTurnstile();
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, [renderTurnstile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTurnstileError(null);

    if (!turnstileToken) {
      setTurnstileError("Please complete the verification.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      if (response.ok) {
        setStatus("success");

        // Fire Google Ads conversion
        if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'ads_conversion_Book_appointment_1', {});
        }

        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: "",
          preferredDate: "",
          preferredTime: "",
        });
        setTurnstileToken(null);
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      } else {
        const data = await response.json();
        if (data.error === "Invalid verification") {
          setTurnstileError("Verification failed. Please try again.");
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current);
          }
        }
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.page} data-cursor-hide>
      {/* Load Turnstile script */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={renderTurnstile}
      />

      {/* Book a Call Section */}
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>BOOK A CALL</h1>
          <p className={styles.subtitle}>
            Schedule a 15-minute discovery call to discuss your project and see how we can help bring your vision to life.
          </p>
        </div>

        {status === "success" ? (
          <div className={styles.successMessage}>
            <h2>Thank You!</h2>
            <p>We've received your request and will be in touch within 24 hours to confirm your call.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Your name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="your@email.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="company" className={styles.label}>Company / Business</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Your company name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="preferredDate" className={styles.label}>Preferred Date</label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className={styles.input}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="preferredTime" className={styles.label}>Preferred Time</label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">Select a time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>Tell us about your project</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="What are you looking to create? What's your timeline? Any other details..."
                rows={5}
              />
            </div>

            {/* Turnstile Widget */}
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <div ref={turnstileRef}></div>
              {turnstileError && (
                <p className={styles.errorMessage} style={{ marginTop: '0.5rem' }}>{turnstileError}</p>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={status === "loading" || !turnstileToken}
            >
              {status === "loading" ? "SUBMITTING..." : "REQUEST CALL"}
            </button>

            {status === "error" && (
              <p className={styles.errorMessage}>
                Something went wrong. Please try again or email us directly at jayvalleo@sweetdreams.us
              </p>
            )}
          </form>
        )}
      </div>

      {/* Music Studio Link */}
      <section className={styles.studioSection}>
        <div className={styles.studioContainer}>
          <p className={styles.miniTitle}>LOOKING FOR THE STUDIO?</p>
          <h2 className={styles.sectionTitle}>BOOK A RECORDING SESSION</h2>
          <p className={styles.sectionSubtitle}>
            Visit our dedicated music site to book recording studio sessions.
          </p>
          <a
            href="https://sweetdreamsmusic.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.submitButton}
            style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none', marginTop: '1rem' }}
          >
            VISIT SWEET DREAMS MUSIC
          </a>
        </div>
      </section>
    </div>
  );
}
