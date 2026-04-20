import { chromium } from 'playwright';

async function debugStorybook() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Collect all console messages and errors
  const consoleMessages = [];
  const errors = [];

  page.on('console', msg => {
    const text = `[${msg.type().toUpperCase()}] ${msg.text()}`;
    consoleMessages.push(text);
    console.log(text);
  });

  page.on('pageerror', error => {
    const errorText = `PAGE ERROR: ${error.message}`;
    errors.push(errorText);
    console.log(errorText);
  });

  page.on('requestfailed', request => {
    const failText = `FAILED REQUEST: ${request.url()} - ${request.failure()?.errorText}`;
    console.log(failText);
  });

  try {
    console.log('Navigating to Storybook home page...');
    await page.goto('http://localhost:6006', { waitUntil: 'networkidle', timeout: 15000 });

    console.log('\\nWaiting for page to load...');
    await page.waitForTimeout(5000);

    console.log('\\nChecking page content...');
    const title = await page.title();
    console.log(`Page title: ${title}`);

    // Check for various Storybook elements
    const rootElement = await page.$('#storybook-root');
    console.log(`#storybook-root found: ${!!rootElement}`);

    const rootElement2 = await page.$('#root');
    console.log(`#root found: ${!!rootElement2}`);

    // Check for any error messages on the page
    const bodyText = await page.textContent('body');
    const hasErrorKeywords = /error|failed|cannot|404|500/i.test(bodyText);
    console.log(`Page contains error keywords: ${hasErrorKeywords}`);

    if (hasErrorKeywords) {
      console.log('\\nBody content preview (first 500 chars):');
      console.log(bodyText.substring(0, 500) + '...');
    }

    // Try to find story navigation
    const navElements = await page.$$('[role="tree"], .sidebar, .story-list, [data-nodetype]');
    console.log(`Navigation elements found: ${navElements.length}`);

    // Take screenshot for debugging
    await page.screenshot({ path: 'storybook-debug.png', fullPage: true });
    console.log('\\nDebug screenshot saved as storybook-debug.png');

    console.log(`\\n=== Console Messages (${consoleMessages.length}) ===`);
    consoleMessages.forEach(msg => console.log(msg));

    console.log(`\\n=== Errors (${errors.length}) ===`);
    errors.forEach(err => console.log(err));

  } catch (error) {
    console.error('Failed to debug Storybook:', error.message);
  }

  await browser.close();
}

debugStorybook().catch(console.error);