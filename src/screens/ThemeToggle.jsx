import { useTheme } from './theme';
import './ThemeToggle.css';

/*
 * Sun / moon button that switches between light and dark mode.
 * variant: "surface" — for pale/dark app surfaces (Login, Sign Up)
 *          "glass"   — for the maroon hero and splash (always on a dark backdrop)
 */
export default function ThemeToggle({ variant = 'surface', className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      className={`theme-toggle theme-toggle--${variant} ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
    >
      <svg
        className="theme-toggle-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        key={theme}
      >
        {isDark ? (
          // sun — tap to go light
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          // moon — tap to go dark
          <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
        )}
      </svg>
    </button>
  );
}
