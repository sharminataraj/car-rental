const fs = require('fs');
const path = require('path');

// List of files to check
const filesToCheck = [
  'src/App.js',
  'src/components/Dashboard/SimpleLayout.js',
  'src/pages/UltraSimpleDashboard.js',
  'src/components/Vehicles/VehicleManagement.js',
  'src/components/Rentals/RentalManagement.js'
];

filesToCheck.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Try to parse the file content
    const module = require('module');
    const vm = require('vm');
    
    const sandbox = {
      module: {},
      exports: {},
      require: function() {},
      console: console,
      process: process,
      React: {},
      useState: function() {},
      useEffect: function() {},
      useRef: function() {},
      useNavigate: function() {}
    };
    
    // Create a context
    const context = vm.createContext(sandbox);
    
    // Add React imports
    const modifiedContent = `
      const React = ${JSON.stringify(sandbox.React)};
      const useState = ${JSON.stringify(sandbox.useState)};
      const useEffect = ${JSON.stringify(sandbox.useEffect)};
      const useRef = ${JSON.stringify(sandbox.useRef)};
      const useNavigate = ${JSON.stringify(sandbox.useNavigate)};
      
      ${content}
    `;
    
    // Compile the code
    const script = new vm.Script(modifiedContent, { filename: filePath });
    
    // Run the script (will throw error if syntax is bad)
    script.runInContext(context);
    
    console.log(`✅ ${filePath} - Syntax is valid`);
  } catch (error) {
    console.log(`❌ ${filePath} - ${error.message}`);
  }
});

console.log('\nChecking imports and exports:');
filesToCheck.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for export default
    if (!content.includes('export default')) {
      console.log(`⚠️  ${filePath} - No export default found`);
    }
    
    // Check for imports
    const importStatements = content.match(/import.*from.*;/g);
    if (importStatements) {
      console.log(`📦 ${filePath} - Found ${importStatements.length} import statements`);
    }
  } catch (error) {
    console.log(`❌ ${filePath} - Error reading file: ${error.message}`);
  }
});
