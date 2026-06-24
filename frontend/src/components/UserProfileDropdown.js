import React, { useContext, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function UserProfileDropdown() {
  const auth = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const name = auth.user?.name || 'User';

  return (
    <div className="user-dd" onBlur={() => setOpen(false)}>
      <button className="user-dd-btn" onClick={() => setOpen(v => !v)}>
        <div className="user-avatar">{(name[0] || 'U').toUpperCase()}</div>
        <div className="user-meta">
          <div className="user-name">{name}</div>
          <div className="user-rep">⭐ Reputation</div>
        </div>
        <div className="chev">▾</div>
      </button>

      {open ? (
        <div className="user-dd-menu">
          <div className="user-dd-section">
            <div className="user-dd-label">Signed in as</div>
            <div className="user-dd-value">{name}</div>
          </div>
          <div className="user-dd-actions">
            <a className="user-dd-link" href="#/profile">
              View Profile
            </a>
          </div>
          <div className="user-dd-actions">
            <button className="user-dd-link danger" onClick={() => auth.logout()}>
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

