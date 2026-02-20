import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./DashboardLayout.css";
import { useCurrency } from "../../contexts/CurrencyContext";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currency, switchCurrency } = useCurrency();

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"} ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18.7 19.2c.2 0 .4-.1.5-.2.2-.2.3-.5.2-.7-.3-.6-.7-1.1-1.2-1.6L15 14.2V16c0 .3-.1.5-.3.7-.2.2-.5.3-.7.3H7c-.3 0-.5-.1-.7-.3-.2-.2-.3-.5-.3-.7V8c0-.3.1-.5.3-.7.2-.2.5-.3.7-.3h7c.3 0 .5.1.7.3.2.2.3.5.3.7v1.8l3-2.8c.5-.5.9-1.1 1.2-1.6.1-.2.1-.4.2-.7-.1-.3-.4-.5-.7-.5H4.7c-.3 0-.5.2-.7.5-.2.3-.2.6 0 .8L10 11.2V8.3L3.8 14c-.6.5-.9 1.3-.9 2 0 1.1.9 2 2 2h8c.3 0 .5-.1.7-.3.2-.2.3-.5.3-.7V14.2l2.7 2.4c.2.2.4.3.7.3z"/>
            </svg>
            <h1>InJee Rental</h1>
          </div>
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12"/>
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16"/>
              )}
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/" 
            className={`nav-item ${isActive("/") ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link 
            to="/vehicles" 
            className={`nav-item ${isActive("/vehicles") ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18.7 19.2c.2 0 .4-.1.5-.2.2-.2.3-.5.2-.7-.3-.6-.7-1.1-1.2-1.6L15 14.2V16c0 .3-.1.5-.3.7-.2.2-.5.3-.7.3H7c-.3 0-.5-.1-.7-.3-.2-.2-.3-.5-.3-.7V8c0-.3.1-.5.3-.7.2-.2.5-.3.7-.3h7c.3 0 .5.1.7.3.2.2.3.5.3.7v1.8l3-2.8c.5-.5.9-1.1 1.2-1.6.1-.2.1-.4.2-.7-.1-.3-.4-.5-.7-.5H4.7c-.3 0-.5.2-.7.5-.2.3-.2.6 0 .8L10 11.2V8.3L3.8 14c-.6.5-.9 1.3-.9 2 0 1.1.9 2 2 2h8c.3 0 .5-.1.7-.3.2-.2.3-.5.3-.7V14.2l2.7 2.4c.2.2.4.3.7.3z"/>
            </svg>
            <span>Vehicle Fleet</span>
          </Link>

          <Link 
            to="/rentals" 
            className={`nav-item ${isActive("/rentals") ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="9" x2="15" y2="9"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <span>Rentals</span>
          </Link>

          <Link 
            to="/rentals/active" 
            className={`nav-item ${isActive("/rentals/active") ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Active Rentals</span>
          </Link>

          <Link 
            to="/rentals/history" 
            className={`nav-item ${isActive("/rentals/history") ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span>Rental History</span>
          </Link>

          <Link 
            to="/analytics" 
            className={`nav-item ${isActive("/analytics") ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
            <span>Analytics</span>
          </Link>

          <Link 
            to="/maintenance" 
            className={`nav-item ${isActive("/maintenance") ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Maintenance</span>
          </Link>

          <Link 
            to="/settings" 
            className={`nav-item ${isActive("/settings") ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24m-8.48 8.48l4.24 4.24M1 12h6m6 0h6M4.22 4.22l4.24-4.24m8.48 8.48l4.24-4.24"/>
            </svg>
            <span>Settings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div className="breadcrumb">
              {location.pathname === "/" ? (
                <span>Dashboard</span>
              ) : (
                location.pathname.split("/").filter(Boolean).map((segment, index) => (
                  <span key={index}>
                    {index > 0 && <span className="breadcrumb-separator">/</span>}
                    {segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="header-right">
            <div className="currency-switch">
              <button onClick={switchCurrency} className="currency-btn">
                {currency === 'USD' ? 'USD' : '₹'}
              </button>
            </div>
            <div className="notification-bell">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="notification-badge">3</span>
            </div>
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search..." 
                className="search-input"
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <div className="theme-toggle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default DashboardLayout;
