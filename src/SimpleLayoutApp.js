import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SimpleLayout from "./components/Dashboard/SimpleLayout";
import UltraSimpleDashboard from "./pages/UltraSimpleDashboard";

function SimpleLayoutApp() {
  console.log("SimpleLayoutApp component rendered");
  
  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={
            <SimpleLayout>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h2>UltraSimpleDashboard Content</h2>
                <UltraSimpleDashboard />
              </div>
            </SimpleLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default SimpleLayoutApp;
