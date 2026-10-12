/*
 * Shared frame for every in-app screen (anything behind sign-in).
 *
 *   <AppScreen>
 *     <AppHeader title="Nutrition" subtitle="…" />
 *     <main className="hd-main">…</main>
 *   </AppScreen>
 *
 * - AppScreen applies the light/dark theme and adds the bottom navigation bar.
 * - AppHeader draws the maroon header and ALWAYS includes the light/dark toggle,
 *   so every new screen built on it gets the toggle automatically.
 * Styles live in HomeScreen.css (hd-* classes).
 */
import { useTheme } from './theme';
import BottomNav from './BottomNav';
import ThemeToggle from './ThemeToggle';
import './HomeScreen.css';
import './FlowScreens.css';
import './ToolScreens.css';
import './TrackScreens.css';

export function AppScreen({ children, showNav = true }) {
  const { theme } = useTheme();
  return (
    <div className="hd-root" data-theme={theme}>
      <div className={`hd-screen${showNav ? '' : ' hd-screen--no-nav'}`}>
        {children}
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}

/*
 * title / subtitle — simple screens
 * children         — custom header content (e.g. the Home greeting) instead of title
 * actions          — extra buttons shown after the theme toggle (e.g. avatar)
 * compact          — shorter header for screens without an overlapping hero card
 */
export function AppHeader({ title, subtitle, children, actions, compact = false }) {
  return (
    <header className={`hd-header${compact ? ' hd-header--compact' : ''}`}>
      <div className="hd-header-row">
        <div className="hd-header-text">
          {children ?? <h1 className="hd-name">{title}</h1>}
        </div>
        <div className="hd-header-actions">
          <ThemeToggle variant="glass" />
          {actions}
        </div>
      </div>
      {subtitle && <p className="hd-motto">{subtitle}</p>}
    </header>
  );
}

/*
 * Light header for step-by-step flows (Assessment, Results, SHAP …):
 * back chevron, optional centred title, and the light/dark toggle on the right.
 * Use with <AppScreen showNav={false}>.
 */
export function FlowHeader({ title, onBack, children }) {
  return (
    <header className="fl-header">
      <div className="fl-header-row">
        <button type="button" className="fl-back" onClick={onBack} aria-label="Go back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        {title ? <h1 className="fl-title">{title}</h1> : <div className="fl-header-slot">{children}</div>}
        <ThemeToggle />
      </div>
      {title && children}
    </header>
  );
}
