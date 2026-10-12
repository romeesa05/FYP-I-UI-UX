import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppScreen, FlowHeader } from './AppScreen';
import FeatureIcon from './FeatureIcon';
import { readLatestResult } from './assessmentData';

function formatValue(v) {
  const sign = v >= 0 ? '+' : '−';
  return `${sign}${Math.abs(v).toFixed(2)}`;
}

export default function ShapScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const result = state?.result ?? readLatestResult();

  if (!result) return <Navigate to="/assessment" replace />;

  const rows = result.contributions;
  // leave headroom so the largest bar fills ~75% of the track, as in the reference
  const max = Math.max(...rows.map((r) => Math.abs(r.value)), 0.01) / 0.75;

  return (
    <AppScreen showNav={false}>
      <FlowHeader title="SHAP Explainability" onBack={() => navigate('/results', { state: { result } })} />

      <main className="fl-main sh-main">
        <h2 className="sh-heading">What influenced your result?</h2>
        <p className="sh-intro">These factors contributed most to your model’s prediction.</p>

        <ul className="sh-list">
          {rows.map((r) => {
            const up = r.value >= 0;
            return (
              <li key={r.feature} className={`sh-row ${up ? 'is-up' : 'is-down'}`}>
                <div className="sh-row-top">
                  <span className="sh-icon">
                    <FeatureIcon name={r.icon} size={16} />
                  </span>
                  <span className="sh-name">{r.label}</span>
                  <span className="sh-value">{formatValue(r.value)}</span>
                </div>
                <div
                  className="sh-track"
                  role="img"
                  aria-label={`${r.label}: ${up ? 'increases' : 'decreases'} risk by ${Math.abs(r.value).toFixed(2)}`}
                >
                  <span style={{ width: `${(Math.abs(r.value) / max) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>

        <div className="sh-legend">
          <span className="sh-legend-item">
            <span className="sh-dot is-up" aria-hidden="true" />
            Increases risk (+)
          </span>
          <span className="sh-legend-item">
            <span className="sh-dot is-down" aria-hidden="true" />
            Decreases risk (−)
          </span>
        </div>

        <p className="sh-note">
          SHAP shows how much each factor pushed your estimate up or down. It explains the model’s prediction, not the cause
          of PCOS.
        </p>
      </main>

      <svg className="sh-wave" viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 50 C80 20 150 70 230 45 C300 22 350 40 400 30 L400 90 L0 90 Z" fill="var(--fl-wave-1)" />
        <path d="M0 68 C90 45 170 85 250 62 C320 44 360 60 400 52 L400 90 L0 90 Z" fill="var(--fl-wave-2)" />
      </svg>
    </AppScreen>
  );
}
