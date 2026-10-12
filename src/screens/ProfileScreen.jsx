import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppScreen, FlowHeader } from './AppScreen';
import { useTheme } from './theme';
import { USER } from './user';

const NOTIF_KEY = 'pcos-notifications';

function readNotif() {
  try {
    return localStorage.getItem(NOTIF_KEY) !== 'off';
  } catch {
    return true;
  }
}

const ICONS = {
  account: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M12 14.5v2" />
    </>
  ),
  notifications: (
    <>
      <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15Z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </>
  ),
  health: (
    <>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
      <path d="M8.5 12h2l1-2 1.5 4 1-2h1.5" />
    </>
  ),
  privacy: (
    <>
      <path d="M12 3.5 5 6.5v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9v-5Z" />
      <circle cx="12" cy="11" r="2" />
      <path d="M12 13v2.5" />
    </>
  ),
  appearance: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.5a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2-2.4 3.6M12 17h.01" />
    </>
  ),
  about: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
};

function RowIcon({ name }) {
  return (
    <span className="pf-row-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {ICONS[name]}
      </svg>
    </span>
  );
}

const Chevron = () => (
  <svg className="pf-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

function LinkRow({ icon, label, detail }) {
  return (
    <li>
      <button type="button" className="pf-row">
        <RowIcon name={icon} />
        <span className="pf-row-text">
          <span className="pf-row-label">{label}</span>
          {detail && <span className="pf-row-detail">{detail}</span>}
        </span>
        <Chevron />
      </button>
    </li>
  );
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { preference, setPreference } = useTheme();
  const [notifications, setNotifications] = useState(readNotif);

  const toggleNotif = () => {
    const next = !notifications;
    setNotifications(next);
    try {
      localStorage.setItem(NOTIF_KEY, next ? 'on' : 'off');
    } catch {
      /* ignore */
    }
  };

  return (
    <AppScreen>
      <FlowHeader title="Profile & Settings" onBack={() => navigate('/home')} />

      <main className="fl-main pf-main">
        <section className="pf-user">
          <span className="pf-avatar" aria-hidden="true">
            {USER.initials}
          </span>
          <div className="pf-user-text">
            <h2 className="pf-name">
              {USER.firstName} {USER.lastName}
            </h2>
            <p className="pf-email">{USER.email}</p>
            <button type="button" className="pf-edit">
              Edit Profile
            </button>
          </div>
        </section>

        <ul className="pf-list">
          <LinkRow icon="account" label="Account & Security" />
          <li>
            <div className="pf-row pf-row--static">
              <RowIcon name="notifications" />
              <span className="pf-row-text">
                <span className="pf-row-label" id="notif-label">
                  Notifications
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={notifications}
                aria-labelledby="notif-label"
                className={`pf-switch${notifications ? ' is-on' : ''}`}
                onClick={toggleNotif}
              >
                <span />
              </button>
            </div>
          </li>
          <LinkRow icon="health" label="Health Preferences" />
          <LinkRow icon="privacy" label="Privacy & Data" />
          <li>
            <div className="pf-row pf-row--static pf-row--stack">
              <div className="pf-row-head">
                <RowIcon name="appearance" />
                <span className="pf-row-label">Appearance</span>
              </div>
              <div className="pf-segment" role="radiogroup" aria-label="Theme">
                {[
                  ['system', 'System'],
                  ['light', 'Light'],
                  ['dark', 'Dark'],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    role="radio"
                    aria-checked={preference === val}
                    className={`pf-seg${preference === val ? ' is-active' : ''}`}
                    onClick={() => setPreference(val)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </li>
          <LinkRow icon="help" label="Help & Support" />
          <LinkRow icon="about" label="About" />
        </ul>

        <button type="button" className="pf-signout" onClick={() => navigate('/login', { replace: true })}>
          Sign Out
        </button>
      </main>
    </AppScreen>
  );
}
