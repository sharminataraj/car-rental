const http = require('http');
const fs = require('fs');

console.log('🧪 Simple HTML parsing test');
console.log('==========================');

// Function to make HTTP GET request
const get = (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
};

// Function to extract script tags
const extractScripts = (html) => {
  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  return html.match(scriptRegex) || [];
};

// Function to extract CSS links
const extractStyles = (html) => {
  const styleRegex = /<link\s+rel="stylesheet"[^>]*>/gi;
  return html.match(styleRegex) || [];
};

// Test function
async function runTest() {
  try {
    console.log('📱 Loading homepage...');
    const html = await get('http://localhost:3000');
    console.log('✅ HTML received');
    
    // Parse the HTML
    const scripts = extractScripts(html);
    const styles = extractStyles(html);
    
    console.log(`📜 Script tags found: ${scripts.length}`);
    console.log(`🎨 CSS links found: ${styles.length}`);
    
    // Check for root div
    if (html.includes('<div id="root"')) {
      console.log('✅ Root div present');
    }
    
    // Check for bundle.js
    if (html.includes('bundle.js')) {
      console.log('✅ Main JavaScript bundle present');
    }
    
    // Check for CSS bundle
    if (html.includes('main.css')) {
      console.log('✅ Main CSS bundle present');
    }
    
    // Extract some basic stats from the page
    const title = html.match(/<title>([^<]*)<\/title>/);
    if (title) {
      console.log(`📄 Title: ${title[1]}`);
    }
    
    const meta = html.match(/<meta name="description" content="([^"]*)"/);
    if (meta) {
      console.log(`📝 Description: ${meta[1]}`);
    }
    
    // Check bundle content
    console.log('\n🔍 Checking main JavaScript bundle...');
    const scriptUrls = scripts
      .filter(script => script.includes('src="'))
      .map(script => script.match(/src="([^"]*)"/)[1]);
    
    const bundleUrl = scriptUrls.find(url => url.includes('bundle.js'));
    
    if (bundleUrl) {
      const fullUrl = bundleUrl.startsWith('http') 
        ? bundleUrl 
        : 'http://localhost:3000' + bundleUrl;
        
      try {
        console.log(`📥 Loading ${fullUrl}...`);
        const bundle = await get(fullUrl);
        
        console.log(`📦 Bundle size: ${(bundle.length / 1024).toFixed(1)} KB`);
        
        // Check if the bundle includes our component
        if (bundle.includes('MinimalApp')) {
          console.log('✅ MinimalApp component is in the bundle');
        }
        
        if (bundle.includes('React')) {
          console.log('✅ React is in the bundle');
        }
        
        if (bundle.includes('render')) {
          console.log('✅ React render function is present');
        }
        
      } catch (error) {
        console.error('❌ Failed to load bundle:', error.message);
      }
    }
    
    console.log('\n✅ Test completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Please make sure the development server is running');
      console.log('💡 Run: npm start');
    }
  }
}

runTest();
