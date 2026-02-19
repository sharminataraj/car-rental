import React from "react";
import "./App.css";

function SimpleApp() {
  console.log("SimpleApp component rendering");
  
  return (
    <div className="app" style={{ 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          InJee Car Rental Dashboard
        </h1>
        <p style={{ color: '#666', fontSize: '18px', marginBottom: '30px' }}>
          This is a simple version of the app to test if React is rendering correctly.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px' 
        }}>
          <div style={{ 
            background: '#3b82f6', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>8</div>
            <div style={{ fontSize: '14px', opacity: '0.9' }}>Total Fleet</div>
          </div>
          
          <div style={{ 
            background: '#10b981', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>7</div>
            <div style={{ fontSize: '14px', opacity: '0.9' }}>Available</div>
          </div>
          
          <div style={{ 
            background: '#f59e0b', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>1</div>
            <div style={{ fontSize: '14px', opacity: '0.9' }}>Rented</div>
          </div>
        </div>
        
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <button style={{ 
            background: '#8b5cf6', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onClick={() => {
            console.log("Button clicked!");
            alert("App is interactive! React is working correctly.");
          }}
          onMouseOver={(e) => e.target.style.background = '#7c3aed'}
          onMouseOut={(e) => e.target.style.background = '#8b5cf6'}
          >
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;
