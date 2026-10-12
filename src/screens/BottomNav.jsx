import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const ICONS = {
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1v-8.5Z" />
    </>
  ),
  exercise: (
    <>
      <path d="M6.5 8v8M17.5 8v8M3.5 10v4M20.5 10v4M6.5 12h11" />
    </>
  ),
  nutrition: (
    <>
      <path d="M12 8c-1.2-1.4-3-1.9-4.6-1.4C5 7.3 4 9.6 4.5 12.4 5.1 16 7.4 20 9.6 20c1 0 1.5-.6 2.4-.6s1.4.6 2.4.6c2.2 0 4.5-4 5.1-7.6.5-2.8-.5-5.1-2.9-5.8-1.6-.5-3.4 0-4.6 1.4Z" />
      <path d="M12 8c0-2 .8-3.6 2.6-4.4" />
    </>
  ),
  track: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M8 3v4M16 3v4M4 10h16" />
      <circle cx="12" cy="15" r="1.6" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
};

const ITEMS = [
  { to: '/home', label: 'Home', icon: 'home' },
  { to: '/exercise', label: 'Exercise', icon: 'exercise' },
  { to: '/nutrition', label: 'Nutrition', icon: 'nutrition' },
  { to: '/track', label: 'Track', icon: 'track' },
  { to: '/profile', label: 'Profile', icon: 'profile' },
];

export default function BottomNav() {
  return (
    <nav className="bn" aria-label="Main">
      {ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} replace className={({ isActive }) => `bn-item${isActive ? ' is-active' : ''}`}>
          <span className="bn-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {ICONS[item.icon]}
            </svg>
          </span>
          <span className="bn-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
