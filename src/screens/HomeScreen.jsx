import { useNavigate } from 'react-router-dom';
import { AppHeader, AppScreen } from './AppScreen';
import { readLatestResult, readSavedResults } from './assessmentData';
import { USER } from './user';


function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function Icon({ children, size = 22, strokeWidth = 1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const QUICK_ACTIONS = [
  {
    key: 'journal',
    to: '/track',
    label: 'Cycle Journal',
    icon: (
      <>
        <rect x="5" y="4" width="14" height="16" rx="2.5" />
        <path d="M9 2.5v3M15 2.5v3M8.5 10h7M8.5 13.5h4.5" />
      </>
    ),
  },
  {
    key: 'food',
    to: '/nutrition',
    label: 'Food Checker',
    icon: (
      <>
        <path d="M4 11h16a8 8 0 0 1-16 0Z" />
        <path d="M9 7.5c0-1.5 1-2 1-3.5M13 7.5c0-1.5 1-2 1-3.5M8 20h8" />
      </>
    ),
  },
  {
    key: 'progress',
    to: '/progress',
    label: 'Progress',
    icon: <path d="M5 19V11M10 19V6M15 19v-5M20 19V9M3.5 19h17" />,
  },
  {
    key: 'assistant',
    label: 'AI Assistant',
    icon: (
      <>
        <path d="M5 17.5V7a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 7v6.5a2.5 2.5 0 0 1-2.5 2.5H9l-4 3.5Z" />
        <path d="M9 9.5h6M9 12.5h3.5" />
      </>
    ),
  },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const last = readLatestResult() ?? readSavedResults()[0] ?? null;
  return (
    <AppScreen>
      {/* ---------- Maroon header (theme toggle is built into AppHeader) ---------- */}
      <AppHeader
        subtitle="Small steps create big changes."
        actions={
          <button type="button" className="hd-avatar" aria-label="Open profile" onClick={() => navigate('/profile')}>
            {USER.initials}
          </button>
        }
      >
        <p className="hd-hello">{greeting()},</p>
        <h1 className="hd-name">{USER.firstName}</h1>
      </AppHeader>

        <main className="hd-main">
          {/* ---------- Risk assessment card ---------- */}
          <section className="hd-risk" aria-labelledby="risk-title">
            <div className="hd-risk-top">
              <span className="hd-risk-badge">
                <Icon size={22}>
                  <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
                  <path d="M9 3.5h6v2.5H9zM8.5 11l2 2 4-4M8.5 16.5h7" />
                </Icon>
              </span>
              <div className="hd-risk-copy">
                <h2 id="risk-title" className="hd-risk-title">PCOS Risk Assessment</h2>
                <span className="hd-status">{last ? `Last result: ${last.score}%` : 'No assessment yet'}</span>
              </div>
            </div>
            <p className="hd-risk-text">Answer a few questions to get your personalized risk estimate, with the factors that shaped it.</p>
            <button type="button" className="hd-cta" onClick={() => navigate('/assessment')}>
              <span>Start Assessment</span>
              <Icon size={18} strokeWidth={2}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </Icon>
            </button>
            <p className="hd-risk-note">Takes about 5 minutes. Your answers stay private.</p>
          </section>

          {/* ---------- What-If simulator entry ---------- */}
          <button type="button" className="hd-sim" onClick={() => navigate('/simulator')}>
            <span className="hd-sim-icon" aria-hidden="true">
              <Icon size={22}>
                <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
                <circle cx="15" cy="7" r="2" />
                <circle cx="9" cy="17" r="2" />
              </Icon>
            </span>
            <span className="hd-sim-text">
              <span className="hd-sim-title">What-If Simulator</span>
              <span className="hd-sim-sub">See how activity, sleep and weight could change your estimate</span>
            </span>
            <span className="hd-sim-go" aria-hidden="true">
              <Icon size={18} strokeWidth={2}>
                <path d="m9 6 6 6-6 6" />
              </Icon>
            </span>
          </button>

          {/* ---------- Quick actions ---------- */}
          <section aria-labelledby="qa-title">
            <h2 id="qa-title" className="hd-section-title">Quick Actions</h2>
            <div className="hd-actions">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  className={`hd-action hd-action--${a.key}`}
                  onClick={a.to ? () => navigate(a.to) : undefined}
                >
                  <span className="hd-action-icon">
                    <Icon>{a.icon}</Icon>
                  </span>
                  <span className="hd-action-label">{a.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ---------- Wellness tip ---------- */}
          <section className="hd-tip" aria-labelledby="tip-title">
            <span className="hd-tip-icon">
              <Icon size={20}>
                <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3Z" />
              </Icon>
            </span>
            <div>
              <h2 id="tip-title" className="hd-tip-title">Today’s Wellness Tip</h2>
              <p className="hd-tip-text">
                A 10-minute walk after meals can help keep blood sugar steadier. Try one after lunch today.
              </p>
            </div>
          </section>
        </main>

    </AppScreen>
  );
}
