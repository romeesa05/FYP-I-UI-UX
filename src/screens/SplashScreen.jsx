import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashScreen.css";

/*
 * PCOS — Splash / Onboarding
 * Matches the splash reference picture: maroon-to-mauve silk backdrop,
 * lotus mark, centred headline, lavender "Get Started" pill and page dots.
 */

const SLIDES = [
  {
    title: "Your PCOS\nJourney, Supported\nby AI",
    body: "Personalized insights, smarter predictions, healthier you",
  },
  {
    title: "Know Your Risk and Why",
    body: "A short questionnaire, a model-generated estimate, and the factors behind it",
  },
  {
    title: "See How Small Changes Add Up",
    body: "Track your cycle and symptoms, and explore what-if lifestyle changes",
  },
  {
    title: "Guidance Tailored to You",
    body: "Personalized nutrition and lifestyle steps to support your wellbeing",
  },
];

/* ---------- Lotus mark (thin three-petal line art) ---------- */
function Lotus({ size = 84 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className="sp-logo"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
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

/* ---------- Flowing maroon silk backdrop ---------- */
function Silk() {
  const id = useId().replace(/:/g, "");
  return (
    <svg className="sp-silk" viewBox="0 0 400 860" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-base`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#46122F" />
          <stop offset="0.45" stopColor="#62223D" />
          <stop offset="0.75" stopColor="#6E3550" />
          <stop offset="1" stopColor="#7E5470" />
        </linearGradient>
        <linearGradient id={`${id}-fold`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#A3677D" stopOpacity="0" />
          <stop offset="0.55" stopColor="#A3677D" stopOpacity="0.75" />
          <stop offset="1" stopColor="#8A4F63" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`${id}-shadow`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3E0F28" stopOpacity="0.85" />
          <stop offset="1" stopColor="#3E0F28" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-low`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9F8297" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#B38096" stopOpacity="0.45" />
          <stop offset="1" stopColor="#651F38" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F1DCE8" stopOpacity="0" />
          <stop offset="0.5" stopColor="#F1DCE8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#F1DCE8" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="400" height="860" fill={`url(#${id}-base)`} />

      {/* upper-right light fold */}
      <path className="sp-drift" d="M120 0 C220 60 200 180 300 230 C360 260 400 240 420 220 L420 0 Z" fill={`url(#${id}-fold)`} />
      {/* diagonal fold sweeping across the middle */}
      <path className="sp-drift sp-drift--slow" d="M-20 300 C90 230 190 250 260 180 C320 120 380 140 420 110 L420 260 C340 300 300 380 200 380 C110 380 50 420 -20 470 Z" fill={`url(#${id}-fold)`} opacity="0.75" />
      {/* deep shadow fold on the left */}
      <path d="M-20 0 L110 0 C70 120 120 220 40 330 C10 370 -10 380 -20 390 Z" fill={`url(#${id}-shadow)`} />
      {/* lower silk wave */}
      <path className="sp-drift" d="M-20 560 C60 480 160 520 230 470 C300 420 360 450 420 400 L420 860 L-20 860 Z" fill={`url(#${id}-low)`} opacity="0.55" />
      <path className="sp-drift sp-drift--slow" d="M-20 700 C80 640 200 700 290 620 C340 580 380 600 420 570 L420 860 L-20 860 Z" fill={`url(#${id}-shadow)`} opacity="0.45" />

      {/* soft sheen highlights along the folds */}
      <g fill="none" strokeLinecap="round">
        <path d="M-20 310 C90 240 190 260 260 190 C320 130 380 150 420 120" stroke={`url(#${id}-sheen)`} strokeWidth="2" />
        <path d="M-20 575 C60 495 160 535 230 485 C300 435 360 465 420 415" stroke={`url(#${id}-sheen)`} strokeWidth="1.6" />
        <path d="M140 0 C230 70 210 180 310 235" stroke={`url(#${id}-sheen)`} strokeWidth="1.4" />
      </g>
    </svg>
  );
}

const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function SplashScreen() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  const goTo = (i) => setIndex(Math.min(SLIDES.length - 1, Math.max(0, i)));

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50) goTo(index + 1);
    if (dx > 50) goTo(index - 1);
    touchStartX.current = null;
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") goTo(index + 1);
    if (e.key === "ArrowLeft") goTo(index - 1);
  };

  const slide = SLIDES[index];

  return (
    <div className="sp-root">
      <main className="sp-screen" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onKeyDown={onKeyDown}>
        <Silk />

        <section className="sp-center" key={index} aria-live="polite">
          <Lotus />
          <h1 className="sp-title">{slide.title}</h1>
          <p className="sp-body">{slide.body}</p>
        </section>

        <footer className="sp-footer">
          <button type="button" className="sp-btn" onClick={() => navigate("/signup")}>
            <span>Get Started</span>
            <ArrowRight />
          </button>

          <div className="sp-dots" role="tablist" aria-label="Onboarding steps">
            {SLIDES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Step ${i + 1} of ${SLIDES.length}`}
                className={`sp-dot${i === index ? " is-active" : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
