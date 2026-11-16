import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppScreen, FlowHeader } from './AppScreen';
import { readLatestResult } from './assessmentData';
import { getRecommendations, SOURCES } from './recommendationsData';
import { fromQuizResult, SAMPLE_USERS } from './planMock';

const TABS = [
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'exercise', label: 'Exercise' },
  { id: 'lifestyle', label: 'Lifestyle' },
];
const SHOW_FIRST = 3;

const ICONS = {
  nutrition: <path d="M12 8c-1.2-1.4-3-1.9-4.6-1.4C5 7.3 4 9.6 4.5 12.4 5.1 16 7.4 20 9.6 20c1 0 1.5-.6 2.4-.6s1.4.6 2.4.6c2.2 0 4.5-4 5.1-7.6.5-2.8-.5-5.1-2.9-5.8-1.6-.5-3.4 0-4.6 1.4ZM12 8c0-2 .8-3.6 2.6-4.4" />,
  exercise: <path d="M6.5 8v8M17.5 8v8M3.5 10v4M20.5 10v4M6.5 12h11" />,
  lifestyle: <path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z" />,
  safety: <path d="M12 4 3 19h18L12 4ZM12 10v4M12 17h.01" />,
};

function Icon({ name }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* One recommendation: title + text + why; tap to see how-to, caution and sources */
function PlanItem({ rec }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={`pl-item${open ? ' is-open' : ''}`}>
      <button type="button" className="pl-item-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="rs-insight-icon"><Icon name={rec.category} /></span>
        <span className="pl-item-body">
          <span className="pl-item-title">{rec.title}</span>
          <span className="pl-item-text">{rec.text}</span>
          <span className="pl-why">Why: {rec.reason}</span>
        </span>
        <svg className="pl-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="pl-more">
          {rec.how && <p><strong>How to do it:</strong> {rec.how}</p>}
          {rec.caution && <p className="pl-caution">{rec.caution}</p>}
          <p className="pl-source">
            Source:{' '}
            {rec.sources.map((s, i) => (
              <span key={s}>
                {i > 0 && ' · '}
                <a href={SOURCES[s].url} target="_blank" rel="noreferrer">{SOURCES[s].short}</a>
              </span>
            ))}
          </p>
        </div>
      )}
    </li>
  );
}

export default function PlanScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const quiz = state?.result ?? readLatestResult();

  // Until the model is connected: the user's quiz result (if any) plus demo users
  const options = useMemo(
    () => [...(quiz ? [{ id: 'mine', label: 'Your result', note: 'From your assessment', data: fromQuizResult(quiz) }] : []), ...SAMPLE_USERS],
    [quiz],
  );
  const [selected, setSelected] = useState(options[0].id);
  const [tab, setTab] = useState('nutrition');
  const [showAll, setShowAll] = useState(false);

  const current = options.find((o) => o.id === selected) ?? options[0];
  const plan = useMemo(() => getRecommendations(current.data), [current]);

  // Top focus: the most important item from each area
  const focus = TABS.map((t) => plan[t.id][0]).filter(Boolean);
  const focusIds = new Set(focus.map((r) => r.id));
  const tabItems = plan[tab].filter((r) => !focusIds.has(r.id));
  const visible = showAll ? tabItems : tabItems.slice(0, SHOW_FIRST);

  const pick = (id) => { setSelected(id); setShowAll(false); };
  const pickTab = (id) => { setTab(id); setShowAll(false); };

  return (
    <AppScreen showNav={false}>
      <FlowHeader title="Your Personal Plan" onBack={() => navigate(-1)} />

      <main className="fl-main pl-main">
        <p className="pl-demo">Demo data until the prediction model is connected</p>
        <div className="nt-chips pl-users" role="group" aria-label="Choose whose plan to show">
          {options.map((o) => (
            <button key={o.id} type="button" className={`nt-chip${o.id === current.id ? ' is-active' : ''}`} onClick={() => pick(o.id)} aria-pressed={o.id === current.id}>
              {o.label}
            </button>
          ))}
        </div>
        <p className="pl-summary">
          {current.note} · Risk score {current.data.score}% ({plan.band})
        </p>

        {plan.safety.length > 0 && (
          <section className="pl-safety" aria-labelledby="pl-safety-title">
            <h2 id="pl-safety-title" className="pl-safety-title"><Icon name="safety" /> Important</h2>
            <ul className="pl-list">
              {plan.safety.map((r) => <PlanItem key={r.id} rec={r} />)}
            </ul>
          </section>
        )}

        <section className="fl-card pl-card" aria-labelledby="pl-focus-title">
          <h2 id="pl-focus-title" className="fl-card-title">Your top focus</h2>
          <ul className="pl-list">
            {focus.map((r) => <PlanItem key={r.id} rec={r} />)}
          </ul>
        </section>

        <div className="nt-chips pl-tabs" role="tablist" aria-label="Plan areas">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={`nt-chip${tab === t.id ? ' is-active' : ''}`} onClick={() => pickTab(t.id)}>
              {t.label} ({plan[t.id].length})
            </button>
          ))}
        </div>

        <section className="fl-card pl-card" role="tabpanel" aria-label={`More ${tab} tips`}>
          {visible.length === 0 ? (
            <p className="pl-empty">Nothing more here — your top focus covers it.</p>
          ) : (
            <ul className="pl-list">
              {visible.map((r) => <PlanItem key={r.id} rec={r} />)}
            </ul>
          )}
          {tabItems.length > SHOW_FIRST && (
            <button type="button" className="pl-more-btn" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show less' : `Show ${tabItems.length - SHOW_FIRST} more`}
            </button>
          )}
        </section>

        <p className="rs-disclaimer">
          This plan supports, but does not replace, advice from your doctor. Tap any tip to see how to do it and where it comes from.
        </p>
      </main>
    </AppScreen>
  );
}
