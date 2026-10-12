// PCOS app theme — colors, sizes and the shared light/dark mode state (web version).
// Screen styling uses CSS variables switched by the data-theme attribute;
// these JS tokens are for places that need a value in code (e.g. SVG fills).
import { createContext, useContext } from 'react';

export const palette = {
  maroon: '#441525',
  burgundy: '#642830',
  richPeriwinkle: '#685EE6',
  blue: '#A285CC',
  softLavender: '#BFA1C4',
  midnight: '#141218',
  deepWine: '#2A1A1E',
  crimson: '#582242',
  white: '#FFFFFF',
};

const light = {
  background: '#F5F3F8',
  surface: '#FFFFFF',
  input: '#F8F6FA',
  border: '#E5DFEA',
  text: '#241923',
  textSecondary: '#706775',
  muted: '#938A98',
  link: palette.burgundy,
  logo: palette.burgundy,
  tabActive: palette.richPeriwinkle,
};

const dark = {
  background: palette.midnight,
  surface: '#21191F',
  input: '#30232F',
  border: '#44313F',
  text: '#F8F3F8',
  textSecondary: '#C3B8C5',
  muted: '#9B8E9D',
  link: palette.softLavender, // no burgundy text on dark surfaces
  logo: palette.softLavender,
  tabActive: palette.richPeriwinkle,
};

export const radius = { input: 16, card: 22, pill: 999 };

export const primaryGradient = [palette.burgundy, palette.maroon];

/* ---------- Light / dark mode ---------- */
// preference: "system" | "light" | "dark"  (what the user chose, saved in the browser)
// theme:      "light" | "dark"             (what is actually shown right now)
export const THEME_STORAGE_KEY = 'pcos-theme';

export const ThemeContext = createContext({
  preference: 'system',
  theme: 'light',
  setPreference: () => {},
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeColors() {
  const { theme } = useTheme();
  return theme === 'dark' ? { ...dark, isDark: true } : { ...light, isDark: false };
}
