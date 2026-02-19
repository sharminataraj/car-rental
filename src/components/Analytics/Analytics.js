import React from "react";
import "./Analytics.css";

const Analytics = () => {
  return (
    <div className="analytics">
      <div className="page-header">
        <div className="header-content">
          <h1>Analytics</h1>
          <p className="subtitle">View detailed analytics and reports for your car rental business</p>
        </div>
      </div>

      <div className="section">
        <h2>Business Reports</h2>
        <div className="placeholder-content">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18"/>
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
          </svg>
          <h3>Analytics feature coming soon</h3>
          <p>This section will display detailed analytics with charts and reports on revenue, utilization, and customer behavior</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
