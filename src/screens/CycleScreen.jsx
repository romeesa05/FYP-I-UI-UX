import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppScreen, FlowHeader } from './AppScreen';
import { SYMPTOMS, analyse, loadJournal, saveJournal, toKey, today } from './cycleData';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function monthGrid(year, month) {
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: first.getDay() }, () => null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}

const fmtMonth = (d) => d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const fmtDay = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

export default function CycleScreen() {
  const navigate = useNavigate();
  const now = today();
  const [journal, setJournal] = useState(loadJournal);
  const [view, setView] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selected, setSelected] = useState(now);
  const selKey = toKey(selected);
  const [draft, setDraft] = useState(() => journal.entries[selKey] ?? { period: false, symptoms: [] });
  const [saved, setSaved] = useState(false);

  const info = useMemo(() => analyse(journal.entries), [journal]);
  const cells = monthGrid(view.getFullYear(), view.getMonth());
  const isFuture = selected > now;
  const isToday = selKey === toKey(now);
  const cycleDay = info.cycleDay(selected);

  const pick = (d) => {
    setSelected(d);
    setDraft(journal.entries[toKey(d)] ?? { period: false, symptoms: [] });
    setSaved(false);
  };

  const shiftMonth = (n) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));

  const toggleSymptom = (s) => {
    setSaved(false);
    setDraft((d) => ({
      ...d,
      symptoms: d.symptoms.includes(s) ? d.symptoms.filter((x) => x !== s) : [...d.symptoms, s],
    }));
  };

  const save = () => {
    // The first real entry replaces the sample data.
    const entries = journal.sample ? {} : { ...journal.entries };
    if (draft.period || draft.symptoms.length) entries[selKey] = draft;
    else delete entries[selKey];
    saveJournal(entries);
    setJournal({ sample: false, entries });
    setSaved(true);
  };

  return (
    <AppScreen>
      <FlowHeader title="Cycle Tracker" onBack={() => navigate('/home')} />

      <main className="fl-main cy-main">
        {journal.sample && (
          <p className="cy-sample">Showing sample entries. Your first saved log replaces them.</p>
        )}

        {/* ---------- Calendar ---------- */}
        <section className="cy-cal" aria-label="Cycle calendar">
          <div className="cy-cal-head">
            <h2 className="cy-month">{fmtMonth(view)}</h2>
            <div className="cy-nav">
              <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="cy-grid" role="grid">
            {WEEKDAYS.map((w) => (
              <span key={w} className="cy-wd" role="columnheader">
                {w}
              </span>
            ))}
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} className="cy-cell is-empty" />;
              const k = toKey(d);
              const entry = journal.entries[k];
              const flags = {
                period: info.periodSet.has(k),
                predicted: info.predicted.has(k),
                fertile: info.fertile.has(k),
                ovulation: info.ovulation.has(k),
                logged: !!entry?.symptoms?.length,
              };
              const label = [
                fmtDay(d),
                flags.period && 'period',
                flags.predicted && 'predicted period',
                flags.ovulation && 'estimated ovulation',
                flags.fertile && 'fertile window',
                flags.logged && 'symptoms logged',
              ]
                .filter(Boolean)
                .join(', ');
              const cls = [
                'cy-cell',
                flags.period && 'is-period',
                flags.predicted && 'is-predicted',
                k === selKey && 'is-selected',
                k === toKey(now) && 'is-today',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <button key={k} type="button" className={cls} onClick={() => pick(d)} aria-label={label} aria-pressed={k === selKey}>
                  <span className="cy-num">{d.getDate()}</span>
                  <span className="cy-dots" aria-hidden="true">
                    {flags.ovulation && <i className="cy-dot cy-dot--ovulation" />}
                    {flags.fertile && <i className="cy-dot cy-dot--fertile" />}
                    {flags.logged && <i className="cy-dot cy-dot--logged" />}
                  </span>
                </button>
              );
            })}
          </div>

          <ul className="cy-legend">
            <li><i className="cy-key cy-key--period" />Period</li>
            <li><i className="cy-key cy-key--fertile" />Fertile window</li>
            <li><i className="cy-key cy-key--ovulation" />Ovulation</li>
            <li><i className="cy-key cy-key--logged" />Logged</li>
          </ul>
        </section>

        {/* ---------- Day entry ---------- */}
        <section className="fl-card cy-entry" aria-labelledby="entry-title">
          <h2 id="entry-title" className="cy-entry-title">
            {isToday ? 'Today' : fmtDay(selected)} – Day {cycleDay ?? '—'}
          </h2>
          {info.predictedStart && (
            <p className="cy-entry-sub">
              Next period expected around{' '}
              {info.predictedStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, based on a{' '}
              {info.cycleLength}-day cycle.
            </p>
          )}

          <h3 className="cy-entry-label">Symptoms</h3>
          <div className="cy-chips">
            <button
              type="button"
              className={`cy-chip cy-chip--period${draft.period ? ' is-on' : ''}`}
              aria-pressed={draft.period}
              onClick={() => {
                setSaved(false);
                setDraft((d) => ({ ...d, period: !d.period }));
              }}
              disabled={isFuture}
            >
              Period day
            </button>
            {SYMPTOMS.map((s) => (
              <button
                key={s}
                type="button"
                className={`cy-chip${draft.symptoms.includes(s) ? ' is-on' : ''}`}
                aria-pressed={draft.symptoms.includes(s)}
                onClick={() => toggleSymptom(s)}
                disabled={isFuture}
              >
                {s}
              </button>
            ))}
          </div>

          {isFuture && <p className="cy-entry-sub">You can log entries up to today.</p>}

          <button type="button" className="cy-save" onClick={save} disabled={isFuture}>
            {saved ? 'Entry saved' : isToday ? 'Log Today' : 'Save Entry'}
          </button>
        </section>

        <p className="cy-footnote">Predictions are estimates from your logged periods and may be less accurate with irregular cycles.</p>
      </main>
    </AppScreen>
  );
}
