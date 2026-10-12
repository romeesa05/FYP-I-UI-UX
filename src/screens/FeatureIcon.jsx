// Small line icons for the assessment factors (Results + SHAP screens).
const PATHS = {
  cycle: (
    <>
      <path d="M12 4.5a7.5 7.5 0 1 1-7.1 5.1" />
      <path d="M4.5 4.5v5h5" />
    </>
  ),
  scale: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M9 10a4 4 0 0 1 6 0M12 10l1.5-1.8" />
    </>
  ),
  hormone: (
    <>
      <circle cx="7" cy="12" r="2.5" />
      <circle cx="17" cy="7" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
      <path d="M9.3 11 14.8 8M9.3 13l5.5 3" />
    </>
  ),
  activity: <path d="M3 12h4l2.5-6 5 12 2.5-6h4" />,
  sleep: <path d="M19.5 14.5A7.5 7.5 0 1 1 9.5 4.5a6 6 0 0 0 10 10Z" />,
};

export default function FeatureIcon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
