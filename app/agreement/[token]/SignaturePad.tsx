'use client';

/**
 * Draw-to-sign pad. Pointer events cover mouse, touch, and stylus alike;
 * touch-action none stops the page from scrolling mid stroke on mobile.
 * The canvas continuously tracks its container width (ResizeObserver) so
 * it always spans the full section — including layouts that settle after
 * mount and window resizes — and existing ink is preserved on resize.
 * Emits a transparent PNG data URL after every stroke (null when cleared).
 */
import { useEffect, useRef, useState } from 'react';
import styles from './agreement.module.css';

const PAD_HEIGHT = 160;

export default function SignaturePad({
  onChange,
}: {
  onChange: (dataUrl: string | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastInk = useRef<string | null>(null);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const applyPenSettings = (ctx: CanvasRenderingContext2D, dpr: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0e0e0e';
    };

    const fit = () => {
      const width = canvas.offsetWidth;
      if (!width) return;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width === Math.round(width * dpr)) return;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(PAD_HEIGHT * dpr);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      applyPenSettings(ctx, dpr);

      // Restore any existing ink at the new size.
      if (lastInk.current) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, width, PAD_HEIGHT);
        img.src = lastInk.current;
      }
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    drawing.current = true;
    canvasRef.current!.setPointerCapture(e.pointerId);
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    // A dot for taps, so even the smallest mark registers.
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();
    setHasInk(true);
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function end() {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      lastInk.current = dataUrl;
      onChange(dataUrl);
    }
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    lastInk.current = null;
    setHasInk(false);
    onChange(null);
  }

  return (
    <div className={styles.sigPadWrap}>
      <canvas
        ref={canvasRef}
        className={styles.sigPad}
        style={{ height: PAD_HEIGHT, touchAction: 'none' }}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        onPointerCancel={end}
      />
      {!hasInk && <span className={styles.sigHint}>Sign here</span>}
      <button type="button" className={styles.sigClear} onClick={clear}>
        Clear
      </button>
    </div>
  );
}
