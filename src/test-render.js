// Test if React app is rendering correctly
console.log("=== Starting React App Test ===");

// Check if we're in a browser environment
if (typeof window === 'undefined') {
  console.error("ERROR: This script must be run in a browser environment");
} else {
  console.log("Browser environment detected");
  
  // Check if React is loaded
  if (typeof React === 'undefined') {
    console.error("ERROR: React not loaded");
  } else {
    console.log("React loaded:", React.version);
  }
  
  // Check if ReactDOM is loaded
  if (typeof ReactDOM === 'undefined') {
    console.error("ERROR: ReactDOM not loaded");
  } else {
    console.log("ReactDOM loaded");
  }
  
  // Check if root div exists
  const rootDiv = document.getElementById('root');
  if (!rootDiv) {
    console.error("ERROR: Root div not found");
  } else {
    console.log("Root div found:", rootDiv);
    
    // Check if root div has children
    if (rootDiv.children.length === 0) {
      console.warn("Root div has no children - React app not rendering");
    } else {
      console.log("Root div has children:", rootDiv.children.length, "elements");
      console.log("First child:", rootDiv.firstChild);
    }
  }
  
  // Check if there are any errors in the console
  const errors = [];
  const originalError = console.error;
  console.error = function(...args) {
    errors.push(args);
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    if (errors.length > 0) {
      console.error("\n=== Console Errors ===");
      errors.forEach((err, index) => {
        console.error(`Error ${index + 1}:`, err);
      });
    } else {
      console.log("\nNo errors in console");
    }
  }, 2000);
}

console.log("\n=== Test completed ===");
