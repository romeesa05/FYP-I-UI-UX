import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppScreen, FlowHeader } from './AppScreen';
import FeatureIcon from './FeatureIcon';
import { isResultSaved, readLatestResult, saveResult } from './assessmentData';

const EXPLAIN = {
  cycle: 'Your answer about cycle regularity',
  bmi: 'Your BMI range',
  androgen: 'Signs of higher androgen levels (hair growth or acne)',
  activity: 'How active you are during the week',
  sleep: 'Your usual sleep quality',
};

function ScoreRing({ score }) {
  const r = 84;
  const c = 2 * Math.PI * r;
  return (
    <div className="rs-ring">
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r={r} fill="none" stroke="var(--fl-ring-track)" strokeWidth="12" />
        <circle
          className="rs-ring-arc"
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="var(--fl-periwinkle)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * c} ${c}`}
          transform="rotate(-90 100 100)"
        />
      </svg>
      <div className="rs-ring-text">
        <span className="rs-score">{score}%</span>
        <span className="rs-score-label">Model-estimated risk score</span>
      </div>
    </div>
  );
}

function InsightRow({ item }) {
  const [open, setOpen] = useState(false);
  const up = item.value >= 0;
  return (
    <li className={`rs-insight${open ? ' is-open' : ''}`}>
      <button type="button" className="rs-insight-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="rs-insight-icon">
          <FeatureIcon name={item.icon} />
        </span>
        <span className="rs-insight-name">{item.label}</span>
        <span className={`rs-sign ${up ? 'is-up' : 'is-down'}`} aria-label={up ? 'Increases risk' : 'Decreases risk'}>
          {up ? '+' : '−'}
        </span>
      </button>
      {open && (
        <p className="rs-insight-more">
          {EXPLAIN[item.feature]} ({item.answer}) {up ? 'raised' : 'lowered'} your estimate.
        </p>
      )}
    </li>
  );
}

export default function ResultsScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const result = state?.result ?? readLatestResult();
  const [saved, setSaved] = useState(() => (result ? isResultSaved(result) : false));

  if (!result) return <Navigate to="/assessment" replace />;

  const onSave = () => {
    if (saveResult(result)) setSaved(true);
  };

  return (
    <AppScreen showNav={false}>
      <FlowHeader title="Your Assessment Results" onBack={() => navigate('/home')} />

      <main className="fl-main">
        <ScoreRing score={result.score} />
        <p className="rs-band">{result.band}</p>

        <p className="rs-disclaimer">
          This is a risk prediction, not a diagnosis. Use it to guide your next steps with a healthcare professional.
        </p>

        <section className="fl-card rs-insights" aria-labelledby="ki-title">
          <h2 id="ki-title" className="fl-card-title">Key Insights</h2>
          <ul className="rs-insight-list">
            {result.contributions.slice(0, 4).map((c) => (
              <InsightRow key={c.feature} item={c} />
            ))}
          </ul>
        </section>

        <button type="button" className="fl-primary" onClick={() => navigate('/shap', { state: { result } })}>
          <span>View SHAP insights</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>

        {result.sample ? (
          <p className="rs-disclaimer">This is a sample result for demonstration.</p>
        ) : (
        <button type="button" className="fl-outline" onClick={onSave} disabled={saved}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {saved ? (
              <path d="m5 12 5 5 9-10" />
            ) : (
              <>
                <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
                <path d="M9 3.5h6v3H9zM9 12h6M9 15.5h4" />
              </>
            )}
          </svg>
          <span>{saved ? 'Result saved' : 'Save Result'}</span>
        </button>
        )}
      </main>
    </AppScreen>
  );
}
