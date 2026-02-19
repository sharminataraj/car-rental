import React from "react";
import "./App.css";

function MinimalApp() {
  console.log("MinimalApp is rendering");
  
  return (
    <div className="app">
      <h1>Car Rental Dashboard</h1>
      <p>This is a minimal version of the dashboard to test rendering</p>
      <div className="content">
        <div className="card">
          <h2>Vehicle Management</h2>
          <p>Manage your car fleet</p>
        </div>
        <div className="card">
          <h2>Rental Management</h2>
          <p>Create and manage rentals</p>
        </div>
        <div className="card">
          <h2>Analytics</h2>
          <p>View business analytics</p>
        </div>
      </div>
    </div>
  );
}

export default MinimalApp;
