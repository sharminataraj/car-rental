const puppeteer = require('puppeteer-core');

(async () => {
  try {
    // Try to connect to Chrome (we need Chrome installed)
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/google-chrome'
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('📱 Loading page:', 'http://localhost:3000');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Wait for React to render
    await page.waitForTimeout(2000);
    
    // Check if root div has children
    const hasChildren = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    });
    
    if (hasChildren) {
      console.log('✅ React app is rendering!');
      
      // Take screenshot for debugging
      await page.screenshot({ path: 'render-test.png', fullPage: true });
      console.log('📸 Screenshot saved as: render-test.png');
      
      // Get text content from the page
      const pageText = await page.evaluate(() => {
        return document.body.innerText;
      });
      
      console.log('📄 Page content preview:', pageText.substring(0, 200));
      
    } else {
      console.log('❌ Root div is empty! React app not rendering.');
    }
    
    await browser.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('Failed to launch the browser')) {
      console.log('\nℹ️  Please install Chrome browser or use a different browser executable.');
      console.log('ℹ️  You can install Chrome with: sudo apt update && sudo apt install -y google-chrome-stable');
    }
  }
})();
