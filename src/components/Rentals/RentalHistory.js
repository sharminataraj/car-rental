import React from "react";
import "./RentalHistory.css";

const RentalHistory = () => {
  return (
    <div className="rental-history">
      <div className="page-header">
        <div className="header-content">
          <h1>Rental History</h1>
          <p className="subtitle">View and manage your complete rental history</p>
        </div>
      </div>

      <div className="section">
        <h2>All Rental Transactions</h2>
        <div className="placeholder-content">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <h3>Rental history feature coming soon</h3>
          <p>This section will display all past rentals with detailed information and export options</p>
        </div>
      </div>
    </div>
  );
};

export default RentalHistory;
