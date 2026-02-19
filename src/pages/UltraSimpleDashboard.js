import React from "react";
import "./DashboardHome.css";

const UltraSimpleDashboard = () => {
  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to the InJee Car Rental Dashboard</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon available">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="1"/>
              <circle cx="15" cy="9" r="1"/>
              <path d="M9 15h6"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Total Fleet</h3>
            <div className="metric-value">8</div>
            <div className="metric-change positive">
              <span>↑ 12%</span>
              <span className="metric-change-label">from last month</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon rented">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Available Vehicles</h3>
            <div className="metric-value">7</div>
            <div className="metric-change positive">
              <span>↑ 8%</span>
              <span className="metric-change-label">from yesterday</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Currently Rented</h3>
            <div className="metric-value">1</div>
            <div className="metric-change negative">
              <span>↓ 2%</span>
              <span className="metric-change-label">from yesterday</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon maintenance">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Maintenance</h3>
            <div className="metric-value">0</div>
            <div className="metric-change neutral">
              <span>—</span>
              <span className="metric-change-label">no change</span>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-button primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>Add New Vehicle</span>
          </button>
          <button className="action-button secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Create Rental</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UltraSimpleDashboard;
