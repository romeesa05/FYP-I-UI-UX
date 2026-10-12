import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppScreen, FlowHeader } from './AppScreen';
import { predictRisk, readLatestResult, readSavedResults } from './assessmentData';

/*
 * What-If Lifestyle Simulator
 * Sliders map back onto the assessment answers and re-run predictRisk(), so when the real
 * model replaces predictRisk the simulator uses it automatically.
 */
const SLIDERS = [
  {
    key: 'activity',
    label: 'Physical Activity',
    min: 0,
    max: 7,
    step: 1,
    format: (v) => `${v} day${v === 1 ? '' : 's'}/week`,
    fromAnswer: { low: 1, some: 3, high: 5 },
    toAnswer: (v) => (v <= 1 ? 'low' : v <= 3 ? 'some' : 'high'),
  },
  {
    key: 'sleep',
    label: 'Sleep',
    min: 4,
    max: 10,
    step: 0.5,
    format: (v) => `${v} hrs/night`,
    fromAnswer: { poor: 5, fair: 6.5, good: 8 },
    toAnswer: (v) => (v < 6 ? 'poor' : v < 7 ? 'fair' : 'good'),
  },
  {
    key: 'bmi',
    label: 'BMI',
    min: 16,
    max: 40,
    step: 0.5,
    format: (v) => v.toFixed(1),
    fromAnswer: { under: 17.5, healthy: 22, over: 27, obese: 32, unsure: 25 },
    toAnswer: (v) => (v < 18.5 ? 'under' : v < 25 ? 'healthy' : v < 30 ? 'over' : 'obese'),
  },
];

function startValues(answers) {
  return Object.fromEntries(SLIDERS.map((s) => [s.key, s.fromAnswer[answers[s.key]] ?? s.min]));
}

function Slider({ def, value, onChange }) {
  const pct = ((value - def.min) / (def.max - def.min)) * 100;
  const id = `sim-${def.key}`;
  return (
    <div className="sm-slider">
      <div className="sm-slider-top">
        <label htmlFor={id} className="sm-slider-label">
          {def.label}
        </label>
        <span className="sm-slider-value">{def.format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={def.min}
        max={def.max}
        step={def.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`sm-range sm-range--${def.key}`}
        style={{ '--pct': `${pct}%` }}
        aria-valuetext={def.format(value)}
      />
    </div>
  );
}

export default function SimulatorScreen() {
  const navigate = useNavigate();
  const base = readLatestResult() ?? readSavedResults()[0] ?? null;
  const answers = base?.answers;

  const [values, setValues] = useState(() => (answers ? startValues(answers) : {}));
  const [touched, setTouched] = useState({});
  const [simulated, setSimulated] = useState(null);

  if (!answers) {
    return (
      <AppScreen showNav={false}>
        <FlowHeader title="What-If Simulator" onBack={() => navigate('/home')} />
        <main className="fl-main">
          <section className="fl-card sm-empty">
            <h2 className="fl-card-title">Take the assessment first</h2>
            <p className="sm-empty-text">
              The simulator starts from your latest risk estimate, so it needs one assessment before you can try changes.
            </p>
            <button type="button" className="fl-primary" onClick={() => navigate('/assessment')}>
              Start Assessment
            </button>
          </section>
        </main>
      </AppScreen>
    );
  }

  const change = (key, v) => {
    setValues((s) => ({ ...s, [key]: v }));
    setTouched((t) => ({ ...t, [key]: true }));
  };

  const simulate = () => {
    const next = { ...answers };
    SLIDERS.forEach((s) => {
      if (touched[s.key]) next[s.key] = s.toAnswer(values[s.key]);
    });
    setSimulated(predictRisk(next).score);
  };

  const reset = () => {
    setValues(startValues(answers));
    setTouched({});
    setSimulated(null);
  };

  const diff = simulated == null ? null : simulated - base.score;

  return (
    <AppScreen showNav={false}>
      <FlowHeader title="What-If Simulator" onBack={() => navigate('/home')}>
        <p className="fl-subtitle">See how lifestyle changes may affect your risk score.</p>
      </FlowHeader>

      <main className="fl-main sm-main">
        <h2 className="sm-heading">Adjust Your Lifestyle</h2>

        <div className="sm-sliders">
          {SLIDERS.map((def) => (
            <Slider key={def.key} def={def} value={values[def.key]} onChange={(v) => change(def.key, v)} />
          ))}
        </div>

        <button type="button" className="fl-primary" onClick={simulate}>
          Simulate Changes
        </button>
        <button type="button" className="fl-outline sm-reset" onClick={reset}>
          Reset
        </button>

        <div className="sm-estimates" aria-live="polite">
          <div className="sm-estimate sm-estimate--current">
            <span className="sm-estimate-label">Current Estimate</span>
            <span className="sm-estimate-value">{base.score}%</span>
          </div>
          <div className="sm-estimate sm-estimate--sim">
            <span className="sm-estimate-label">Simulated Estimate</span>
            <span className="sm-estimate-value">{simulated == null ? '—' : `${simulated}%`}</span>
            {diff != null && (
              <span className="sm-estimate-diff">
                {diff === 0 ? 'No change' : `${diff < 0 ? '−' : '+'}${Math.abs(diff)} points`}
              </span>
            )}
          </div>
        </div>

        <p className="sm-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </svg>
          <span>
            This is a simulated estimate, not a guarantee of prevention or treatment. The model may not capture every
            relationship between lifestyle and PCOS.
          </span>
        </p>
      </main>
    </AppScreen>
  );
}
