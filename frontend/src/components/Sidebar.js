import React, { useContext, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: '📊 Dashboard' },
  { to: '/items', label: '📦 Browse Items' },
  { to: '/create-item', label: '➕ Post Item' },
  { to: '/matches', label: '🎯 Smart Matches' },
  { to: '/claims', label: '📋 Claims' },
  { to: '/leaderboard', label: '🏆 Leaderboard' },
  { to: '/profile', label: '👤 Profile' },
  { to: '/settings', label: '⚙️ Settings', disabled: true },
  { to: '/logout', label: '🚪 Logout', isLogout: true }
];

export default function Sidebar() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = useMemo(() => navItems, []);

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="brand-mark" aria-hidden>
            C
          </div>
          <div className="brand-text">
            <div className="brand-name">CampusConnect AI</div>
            <div className="brand-tag">Smart Lost & Found for Modern Campuses</div>
          </div>

          <button className="icon-btn" onClick={() => setCollapsed(v => !v)} aria-label="Toggle sidebar">
            {collapsed ? '»' : '«'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {items.map((it) => {
            if (it.isLogout) {
              return (
                <button
                  key={it.to}
                  className="sidebar-link logout"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                >
                  {it.label}
                </button>
              );
            }

            if (it.disabled) {
              return (
                <div key={it.to} className="sidebar-link disabled">
                  {it.label}
                </div>
              );
            }

            return (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {it.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open sidebar">
        ☰
      </button>
    </>
  );
}

