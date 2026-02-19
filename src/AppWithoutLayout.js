import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UltraSimpleDashboard from "./pages/UltraSimpleDashboard";
import "./App.css";

function AppWithoutLayout() {
  console.log("AppWithoutLayout component rendered");
  
  return (
    <Router>
      <div className="app">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        
        <Routes>
          <Route path="/" element={
            <div style={{ 
              padding: '20px', 
              fontFamily: 'Arial, sans-serif', 
              backgroundColor: '#f0f0f0',
              minHeight: '100vh'
            }}>
              <h1>App Without Layout</h1>
              <p>This version of the app removes SimpleLayout to test if it's causing the issue:</p>
              <UltraSimpleDashboard />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default AppWithoutLayout;
