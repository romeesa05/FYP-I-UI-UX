// Shared UI pieces for the Login and Sign Up screens (web version).
// Layout and colours follow the Login reference picture.
import { useId, useState } from 'react';
import { useTheme } from './theme';
import ThemeToggle from './ThemeToggle';
import './AuthScreens.css';

/* ---------- Icons ---------- */
function EyeIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="m3 3 18 18" />}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7Z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7a4.6 4.6 0 0 0-3.6-1.9c-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9a4.9 4.9 0 0 0-4.1 2.5c-1.8 3-.5 7.5 1.2 10 .9 1.2 1.9 2.6 3.2 2.5 1.3 0 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.3-1.2 3.1-2.5.6-.8 1.1-1.7 1.4-2.7a4.3 4.3 0 0 1-2.8-4.2ZM14 5.4c.7-.8 1.2-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4Z" />
    </svg>
  );
}

/* ---------- Brand ---------- */
export function LotusLogo({ size = 46 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className="auth-logo"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M32 10 C25 19 25 33 32 44 C39 33 39 19 32 10 Z" />
      <path d="M29.5 43.5 C20 42 13 34.5 11 23 C20 24 26 30 29 38" />
      <path d="M34.5 43.5 C44 42 51 34.5 53 23 C44 24 38 30 35 38" />
      <path d="M24 50 C27.5 47 30 46.5 32 46.5 C34 46.5 36.5 47 40 50" />
    </svg>
  );
}

/* ---------- Screen shell ---------- */
export function AuthLayout({ children }) {
  const { theme } = useTheme();
  return (
    <div className="auth-root" data-theme={theme}>
      <main className="auth-screen">
        <div className="auth-content">
          <div className="auth-toggle">
            <ThemeToggle />
          </div>
          <div className="auth-logo-row">
            <LotusLogo />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

export function AuthHeader({ title, subtitle }) {
  return (
    <header className="auth-header">
      <h1 className="auth-title">{title}</h1>
      <p className="auth-subtitle">{subtitle}</p>
    </header>
  );
}

/* ---------- Login / Sign Up pills ---------- */
function Tab({ label, selected, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={`auth-tab${selected ? ' is-active' : ''}`}
      onClick={selected ? undefined : onClick}
    >
      {label}
    </button>
  );
}

export function AuthTabs({ active, onLogin, onSignUp }) {
  return (
    <div className="auth-tabs" role="tablist" aria-label="Account">
      <Tab label="Login" selected={active === 'login'} onClick={onLogin} />
      <Tab label="Sign Up" selected={active === 'signup'} onClick={onSignUp} />
    </div>
  );
}

/* ---------- Form controls ---------- */
export function Field({ label, placeholder, password = false, type = 'text', name, autoComplete }) {
  const id = useId();
  const [hidden, setHidden] = useState(password);
  const inputType = password ? (hidden ? 'password' : 'text') : type;

  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={id}>
        {label}
      </label>
      <div className="auth-input-wrap">
        <input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoCapitalize="none"
          spellCheck={false}
          className="auth-input"
        />
        {password && (
          <button
            type="button"
            className="auth-eye"
            onClick={() => setHidden(!hidden)}
            aria-label={hidden ? 'Show password' : 'Hide password'}
          >
            <EyeIcon open={hidden} />
          </button>
        )}
      </div>
    </div>
  );
}

export function CheckRow({ children, name, defaultChecked = false }) {
  const id = useId();
  return (
    <div className="auth-check-row">
      <input id={id} name={name} type="checkbox" className="auth-checkbox" defaultChecked={defaultChecked} />
      <label htmlFor={id} className="auth-check-box" aria-hidden="true">
        <CheckIcon />
      </label>
      <label htmlFor={id} className="auth-check-label">
        {children}
      </label>
    </div>
  );
}

export function PrimaryButton({ title, onClick, type = 'submit' }) {
  return (
    <button type={type} className="auth-primary" onClick={onClick}>
      {title}
    </button>
  );
}

function SocialButton({ icon, label }) {
  return (
    <button type="button" className="auth-social">
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function SocialButtons() {
  return (
    <div>
      <p className="auth-or">or</p>
      <div className="auth-social-list">
        <SocialButton icon={<GoogleIcon />} label="Continue with Google" />
        <SocialButton icon={<AppleIcon />} label="Continue with Apple" />
      </div>
    </div>
  );
}
