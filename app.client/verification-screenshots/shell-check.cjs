const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const results = [];
  for (const [path, expectText] of [
    ['/', 'MTG App'],
    ['/decks', 'New Deck'],
    ['/collection', 'Add Cards'],
    ['/scan', 'Start Scan'],
    ['/trade-scout', 'New Match Rule'],
  ]) {
    await p.goto('http://localhost:5175' + path, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);
    const html = await p.content();
    results.push({ path, has: html.includes(expectText) });
    await p.screenshot({ path: 'verification-screenshots/shell-' + (path === '/' ? 'home' : path.slice(1)) + '.png' });
  }
  console.log(JSON.stringify(results, null, 2));
  await b.close();
})();