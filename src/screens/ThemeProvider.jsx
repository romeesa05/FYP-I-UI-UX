import { useCallback, useEffect, useMemo, useState } from 'react';
import { THEME_STORAGE_KEY, ThemeContext } from './theme';

const darkQuery = '(prefers-color-scheme: dark)';

function readPreference() {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch {
    /* storage blocked — fall back to system */
  }
  return 'system';
}

function systemIsDark() {
  return window.matchMedia?.(darkQuery).matches === true;
}

export default function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState(readPreference);
  const [systemDark, setSystemDark] = useState(systemIsDark);

  // Follow the OS/browser setting while the preference is "system".
  useEffect(() => {
    const mq = window.matchMedia?.(darkQuery);
    if (!mq) return undefined;
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const theme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  // Expose the active theme to global CSS (page background, scrollbars, form controls).
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }, [theme]);

  const setPreference = useCallback((next) => {
    setPreferenceState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage blocked — the choice still applies for this visit */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setPreference]);

  const value = useMemo(
    () => ({ preference, theme, setPreference, toggleTheme }),
    [preference, theme, setPreference, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
