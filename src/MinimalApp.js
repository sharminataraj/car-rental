import React from "react";
import "./App.css";

function MinimalApp() {
  console.log("MinimalApp is rendering!");
  
  return (
    <div className="app" style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: '#333'
    }}>
      <h1>React App is Working!</h1>
      <p>This is a minimal test to verify React is rendering correctly.</p>
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#4CAF50', 
        color: 'white', 
        borderRadius: '5px' 
      }}>
        ✅ React is rendering successfully!
      </div>
    </div>
  );
}

export default MinimalApp;
