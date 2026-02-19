import React from "react";
import "./ActiveRentals.css";

const ActiveRentals = () => {
  return (
    <div className="active-rentals">
      <div className="page-header">
        <div className="header-content">
          <h1>Active Rentals</h1>
          <p className="subtitle">Manage currently active vehicle rentals</p>
        </div>
      </div>

      <div className="section">
        <h2>Currently Active Rentals</h2>
        <div className="placeholder-content">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <h3>Active rentals feature coming soon</h3>
          <p>This section will display all currently active rentals with management options</p>
        </div>
      </div>
    </div>
  );
};

export default ActiveRentals;
