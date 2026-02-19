import React from "react";
import SimpleLayout from "./components/Dashboard/SimpleLayout";

function TestSimpleLayout() {
  console.log("TestSimpleLayout component rendered");
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1>Testing SimpleLayout</h1>
      <p>Check if SimpleLayout renders content:</p>
      
      <div style={{ marginTop: '20px' }}>
        <SimpleLayout>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2>SimpleLayout Content</h2>
            <p>This is the content inside SimpleLayout.</p>
            <p>If you can see this, the layout is working!</p>
          </div>
        </SimpleLayout>
      </div>
    </div>
  );
}

export default TestSimpleLayout;
