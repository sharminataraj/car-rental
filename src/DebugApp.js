import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimpleLayout from "./components/Dashboard/SimpleLayout";
import UltraSimpleDashboard from "./pages/UltraSimpleDashboard";
import "./App.css";

console.log("DebugApp.js imported");

function DebugApp() {
  console.log("DebugApp component rendered");
  
  return (
    <Router>
      <div className="app" style={{ border: '2px solid red', minHeight: '100vh', padding: '10px' }}>
        <h1 style={{ color: 'red' }}>Debug App is Rendering!</h1>
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
            <div style={{ border: '2px solid blue', padding: '10px', margin: '10px 0' }}>
              <h2>Route: /</h2>
              <SimpleLayout>
                <div style={{ border: '2px solid green', padding: '10px' }}>
                  <h3>SimpleLayout Children</h3>
                  <UltraSimpleDashboard />
                </div>
              </SimpleLayout>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

console.log("DebugApp component defined");

export default DebugApp;
