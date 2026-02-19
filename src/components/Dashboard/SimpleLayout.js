import React from "react";
import "./DashboardLayout.css";

const SimpleLayout = ({ children, onLogout }) => {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Simple fixed sidebar */}
      <aside className="sidebar open">
        <div className="sidebar-header">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18.7 19.2c.2 0 .4-.1.5-.2.2-.2.3-.5.2-.7-.3-.6-.7-1.1-1.2-1.6L15 14.2V16c0 .3-.1.5-.3.7-.2.2-.5.3-.7.3H7c-.3 0-.5-.1-.7-.3-.2-.2-.3-.5-.3-.7V8c0-.3.1-.5.3-.7.2-.2.5-.3.7-.3h7c.3 0 .5.1.7.3.2.2.3.5.3.7v1.8l3-2.8c.5-.5.9-1.1 1.2-1.6.1-.2.1-.4.2-.7-.1-.3-.4-.5-.7-.5H4.7c-.3 0-.5.2-.7.5-.2.3-.2.6 0 .8L10 11.2V8.3L3.8 14c-.6.5-.9 1.3-.9 2 0 1.1.9 2 2 2h8c.3 0 .5-.1.7-.3.2-.2.3-.5.3-.7V14.2l2.7 2.4c.2.2.4.3.7.3z"/>
            </svg>
            <h1>InJee Rental</h1>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="/dashboard" className="nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Dashboard</span>
          </a>
          <a href="/vehicles" className="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18.7 19.2c.2 0 .4-.1.5-.2.2-.2.3-.5.2-.7-.3-.6-.7-1.1-1.2-1.6L15 14.2V16c0 .3-.1.5-.3.7-.2.2-.5.3-.7.3H7c-.3 0-.5-.1-.7-.3-.2-.2-.3-.5-.3-.7V8c0-.3.1-.5.3-.7.2-.2.5-.3.7-.3h7c.3 0 .5.1.7.3.2.2.3.5.3.7v1.8l3-2.8c.5-.5.9-1.1 1.2-1.6.1-.2.1-.4.2-.7-.1-.3-.4-.5-.7-.5H4.7c-.3 0-.5.2-.7.5-.2.3-.2.6 0 .8L10 11.2V8.3L3.8 14c-.6.5-.9 1.3-.9 2 0 1.1.9 2 2 2h8c.3 0 .5-.1.7-.3.2-.2.3-.5.3-.7V14.2l2.7 2.4c.2.2.4.3.7.3z"/>
            </svg>
            <span>Vehicle Fleet</span>
          </a>
          <a href="/rentals" className="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Rentals</span>
          </a>
          <a href="/analytics" className="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
            <span>Analytics</span>
          </a>
          <a href="/maintenance" className="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Maintenance</span>
          </a>
          <a href="/settings" className="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span>Settings</span>
          </a>
        </nav>

        {user && (
          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <div className="breadcrumb">
              <span>Dashboard</span>
            </div>
          </div>
          {user && (
            <div className="header-right">
              <div className="user-menu">
                <div className="user-avatar">{user.name.charAt(0)}</div>
                <div className="user-details">
                  <div className="user-name">{user.name}</div>
                  <div className="user-role">{user.role}</div>
                </div>
              </div>
            </div>
          )}
        </header>
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SimpleLayout;
