import { chromium } from 'playwright';

async function debugCardRendering() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const errors = [];
  const logs = [];

  page.on('console', msg => {
    const message = `[${msg.type().toUpperCase()}] ${msg.text()}`;
    logs.push(message);
    console.log(message);
  });

  page.on('pageerror', error => {
    const message = `PAGE ERROR: ${error.message}`;
    errors.push(message);
    console.log(message);
  });

  try {
    console.log('🔍 Testing Lightning Bolt story specifically...');
    await page.goto('http://localhost:6006/iframe.html?args=&id=prototypes-deckbuilder-mtgcard--lightning-bolt', {
      waitUntil: 'networkidle',
      timeout: 10000
    });
    await page.waitForTimeout(5000);

    const cardImages = await page.$$('img[alt*="Lightning Bolt"], img[alt*="card"]');
    console.log(`🃏 Card-specific images found: ${cardImages.length}`);

    const allImages = await page.$$('img');
    console.log(`🖼️ Total images found: ${allImages.length}`);

    // Check for any network failures
    const failedNetworkRequests = await page.evaluate(() => {
      const performanceEntries = performance.getEntriesByType('resource');
      return performanceEntries.filter(entry => entry.transferSize === 0 && entry.name.includes('scryfall')).length;
    });
    console.log(`🌐 Failed Scryfall image requests: ${failedNetworkRequests}`);

    // Check if MtgCard component is rendered
    const mtgCardElements = await page.$$('[class*="motion"]');
    console.log(`⚛️ Motion/React elements found: ${mtgCardElements.length}`);

    // Check the DOM structure
    const bodyContent = await page.evaluate(() => {
      const body = document.body;
      return {
        hasRoot: !!document.getElementById('root'),
        childCount: body.children.length,
        innerHTML: body.innerHTML.slice(0, 500) + '...'
      };
    });

    console.log('📊 DOM Structure:', JSON.stringify(bodyContent, null, 2));

  } catch (error) {
    console.log(`❌ Navigation Error: ${error.message}`);
    errors.push(error.message);
  }

  await browser.close();

  console.log(`\n📋 Summary:`);
  console.log(`- Console messages: ${logs.length}`);
  console.log(`- Errors: ${errors.length}`);

  return { errors, logs };
}

debugCardRendering().catch(console.error);