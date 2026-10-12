import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppScreen, FlowHeader } from './AppScreen';
import { predictRisk, readSavedResults } from './assessmentData';

const RANGES = [
  { id: '1M', label: '1M', days: 31 },
  { id: '3M', label: '3M', days: 92 },
  { id: '6M', label: '6M', days: 183 },
  { id: '1Y', label: '1Y', days: 366 },
];

/* Sample history shown until the user saves their own results (Results → Save Result). */
function sampleHistory() {
  const sets = [
    [150, { bmi: 'over', androgen: 'none', cycle: 'somewhat', activity: 'some', sleep: 'fair' }],
    [118, { bmi: 'over', androgen: 'mild', cycle: 'somewhat', activity: 'low', sleep: 'good' }],
    [84, { bmi: 'obese', androgen: 'none', cycle: 'highly', activity: 'some', sleep: 'fair' }],
    [47, { bmi: 'over', androgen: 'mild', cycle: 'somewhat', activity: 'some', sleep: 'fair' }],
    [12, { bmi: 'over', androgen: 'mild', cycle: 'somewhat', activity: 'some', sleep: 'poor' }],
  ];
  const now = Date.now();
  return sets.map(([daysAgo, answers]) => ({
    ...predictRisk(answers),
    date: new Date(now - daysAgo * 86400000).toISOString(),
    sample: true,
  }));
}

function loadHistory() {
  const saved = readSavedResults();
  const base = saved.length ? { history: saved, isSample: false } : { history: sampleHistory(), isSample: true };
  return { ...base, now: Date.now() };
}

const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function TrendChart({ points }) {
  const W = 320;
  const H = 190;
  const pad = { l: 40, r: 14, t: 12, b: 28 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  if (points.length < 2) {
    return (
      <div className="pg-chart-empty">
        <p>Save at least two assessments in this period to see a trend.</p>
      </div>
    );
  }

  const t0 = new Date(points[0].date).getTime();
  const t1 = new Date(points[points.length - 1].date).getTime();
  const x = (p) => pad.l + ((new Date(p.date).getTime() - t0) / Math.max(1, t1 - t0)) * iw;
  const y = (v) => pad.t + ih - (v / 100) * ih;
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(p).toFixed(1)} ${y(p.score).toFixed(1)}`).join(' ');
  const area = `${line} L${x(points[points.length - 1]).toFixed(1)} ${pad.t + ih} L${pad.l} ${pad.t + ih} Z`;

  // month labels, spaced evenly between first and last point
  const labels = [];
  const seen = new Set();
  points.forEach((p) => {
    const m = new Date(p.date).toLocaleDateString('en-US', { month: 'short' });
    if (!seen.has(m)) {
      seen.add(m);
      labels.push({ m, x: x(p) });
    }
  });
  const last = points[points.length - 1];

  return (
    <svg className="pg-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Risk score trend from ${points[0].score}% to ${last.score}%`}>
      <defs>
        <linearGradient id="pg-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--pg-line)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--pg-line)" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      {[0, 30, 60, 90].map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className="pg-grid" />
          <text x={pad.l - 8} y={y(v) + 4} className="pg-axis" textAnchor="end">
            {v}%
          </text>
        </g>
      ))}
      <path d={area} fill="url(#pg-area)" />
      <path d={line} fill="none" stroke="var(--pg-line)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={x(p)} cy={y(p.score)} r="3.5" fill="var(--fl-card)" stroke="var(--pg-line)" strokeWidth="2" />
      ))}
      <circle cx={x(last)} cy={y(last.score)} r="9" fill="var(--pg-line)" opacity="0.22" />
      <circle cx={x(last)} cy={y(last.score)} r="5" fill="var(--pg-line)" />
      {labels.map((l) => (
        <text key={l.m} x={l.x} y={H - 8} className="pg-axis" textAnchor="middle">
          {l.m}
        </text>
      ))}
    </svg>
  );
}

export default function ProgressScreen() {
  const navigate = useNavigate();
  const [range, setRange] = useState('6M');

  const [{ history, isSample, now }] = useState(loadHistory);

  const days = RANGES.find((r) => r.id === range).days;
  const cutoff = now - days * 86400000;
  const inRange = history
    .filter((r) => new Date(r.date).getTime() >= cutoff)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const list = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <AppScreen showNav={false}>
      <FlowHeader title="Progress & History" onBack={() => navigate('/home')} />

      <main className="fl-main pg-main">
        <div className="pg-range" role="radiogroup" aria-label="Time range">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={range === r.id}
              className={`pg-range-btn${range === r.id ? ' is-active' : ''}`}
              onClick={() => setRange(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <section className="fl-card pg-card" aria-labelledby="trend-title">
          <h2 id="trend-title" className="fl-card-title">Risk Score Trend</h2>
          <TrendChart points={inRange} />
        </section>

        <p className="pg-caution">
          Changes in a model-estimated score don’t confirm a change in PCOS status. Discuss trends with your doctor.
        </p>

        <section aria-labelledby="past-title">
          <div className="pg-past-head">
            <h2 id="past-title" className="pg-past-title">Past Assessments</h2>
            {isSample && <span className="pg-sample">Sample data</span>}
          </div>
          <ul className="pg-list">
            {list.map((r, i) => (
              <li key={r.date}>
                <button
                  type="button"
                  className={`pg-item${i === 0 ? ' is-latest' : ''}`}
                  onClick={() => navigate('/results', { state: { result: r } })}
                >
                  <span className="pg-item-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
                      <path d="M9 3.5h6v2.5H9zM8.5 11l2 2 4-4M8.5 16.5h7" />
                    </svg>
                  </span>
                  <span className="pg-item-date">{fmtDate(r.date)}</span>
                  <span className="pg-item-score">{r.score}%</span>
                </button>
              </li>
            ))}
          </ul>
          {isSample && (
            <p className="pg-sample-note">Take an assessment and tap Save Result to start your own history.</p>
          )}
        </section>
      </main>
    </AppScreen>
  );
}
