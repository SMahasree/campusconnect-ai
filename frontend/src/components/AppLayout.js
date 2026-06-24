import React from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <TopNavbar />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}

