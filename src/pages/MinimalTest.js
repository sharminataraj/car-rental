import React from "react";

const MinimalTest = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>React App is Working!</h1>
      <p style={{ color: '#666', fontSize: '18px' }}>
        This is a minimal test to verify that React is rendering correctly.
      </p>
      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#333', fontSize: '20px' }}>Test Details:</h2>
        <ul style={{ color: '#666' }}>
          <li>React version: 18.2.0</li>
          <li>Rendering component: MinimalTest</li>
          <li>Date: {new Date().toString()}</li>
        </ul>
      </div>
    </div>
  );
};

export default MinimalTest;
