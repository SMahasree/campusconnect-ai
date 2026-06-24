import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfileDropdown from './UserProfileDropdown';

export default function TopNavbar() {
  const navigate = useNavigate();

  return (
    <header className="topnav-saas">
      <div className="topnav-left">
        <div className="topnav-logo" onClick={() => navigate('/dashboard')} role="button" tabIndex={0}>
          <span className="topnav-logo-icon">💜</span>
          <div className="topnav-logo-text">
            <div className="topnav-logo-name">CampusConnect AI</div>
            <div className="topnav-logo-tag">Smart Lost & Found for Modern Campuses</div>
          </div>
        </div>
      </div>

      <div className="topnav-center">
        <div className="searchbar">
          <input placeholder="Search items, locations, categories…" />
          <span className="search-kbd">⌘K</span>
        </div>
      </div>

      <div className="topnav-right">
        <button className="icon-btn" aria-label="Notifications" onClick={() => navigate('/notifications')}>
          🔔
        </button>
        <UserProfileDropdown />
      </div>
    </header>
  );
}

