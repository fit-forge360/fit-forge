import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/',          label: 'Dashboard', icon: '⚡' },
  { to: '/workout',   label: 'Workouts',  icon: '💪' },
  { to: '/nutrition', label: 'Nutrition', icon: '🥗' },
  { to: '/progress',  label: 'Progress',  icon: '📊' },
  { to: '/chat',      label: 'FitBot',    icon: '🤖' },
];

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="logo-icon">🏋️</div>
        FitForge
      </div>

      <div className="navbar-links">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            {icon} {label}
          </NavLink>
        ))}
      </div>

      <div className="navbar-right">
        <button className="btn btn-secondary btn-sm" onClick={logout}>
          Sign out
        </button>
      </div>
    </nav>
  );
}
