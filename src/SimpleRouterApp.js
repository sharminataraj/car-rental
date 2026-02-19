import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function HomePage() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1>Home Page</h1>
      <p>Welcome to InJee Car Rental Dashboard</p>
    </div>
  );
}

function App() {
  console.log("App component rendered");
  
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
