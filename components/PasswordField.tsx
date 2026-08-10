'use client';

/**
 * Password input with a Show/Hide toggle. Style-agnostic: pass the page's
 * own input class; the toggle positions itself inside the field.
 */
import { useState } from 'react';

export default function PasswordField({
  value,
  onChange,
  className,
  autoComplete,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        className={className}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        style={{ paddingRight: 62 }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: '#16a34a',
          fontWeight: 700,
          fontSize: 12.5,
          cursor: 'pointer',
          fontFamily: 'inherit',
          padding: '4px 2px',
        }}
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
