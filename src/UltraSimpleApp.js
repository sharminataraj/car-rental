import React from "react";

function UltraSimpleApp() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#3b82f6', marginBottom: '20px' }}>
          Hello, World! 🌍
        </h1>
        <p style={{ color: '#64748b', fontSize: '18px' }}>
          This is a basic React app to test rendering.
        </p>
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#d1fae5',
          color: '#065f46',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          ✅ App is rendering successfully!
        </div>
      </div>
    </div>
  );
}

export default UltraSimpleApp;
