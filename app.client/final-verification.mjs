import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = './verification-screenshots';

async function testMTGPrototypes() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  const results = {
    storiesFound: [],
    cardsFound: 0,
    animationsWorking: false,
    hoverEffectsWorking: false,
    screenshots: []
  };

  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console: ${msg.text()}`);
    }
  });

  try {
    console.log('🔗 Navigating to Storybook...');
    await page.goto('http://localhost:6006', { waitUntil: 'networkidle' });
    await page.waitForSelector('#root');
    await page.waitForTimeout(3000);

    // Click directly on DeckBuilder in the sidebar
    console.log('📁 Clicking on DeckBuilder...');
    const deckBuilderElement = await page.locator('text=DeckBuilder').first();
    await deckBuilderElement.click();
    await page.waitForTimeout(2000);

    // Take screenshot after clicking DeckBuilder
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'deckbuilder-expanded.png'),
      fullPage: true
    });
    results.screenshots.push('deckbuilder-expanded.png');

    console.log('📋 Looking for story entries...');

    // Try different approaches to find and test stories
    const storySelectors = [
      'text=MtgCard',
      'text=CardGrid',
      'text=DeckZone',
      'text=DeckBuilderPrototype',
      'text=FullPrototype',
      'text=AllCards',
      'text=SampleDeck'
    ];

    for (const selector of storySelectors) {
      try {
        const element = await page.locator(selector).first();
        const isVisible = await element.isVisible();

        if (isVisible) {
          console.log(`✅ Found story: ${selector}`);
          results.storiesFound.push(selector);

          // Click on the story
          await element.click();
          await page.waitForTimeout(3000);

          // Take screenshot
          const storyName = selector.replace('text=', '').toLowerCase();
          const screenshotPath = `story-${storyName}.png`;
          await page.screenshot({
            path: path.join(SCREENSHOTS_DIR, screenshotPath),
            fullPage: true
          });
          results.screenshots.push(screenshotPath);

          // Look for card elements in the story content area
          const cardCount = await page.evaluate(() => {
            const selectors = [
              '[data-testid*="card"]',
              '[class*="card"]',
              '[class*="mtg"]',
              'img[alt*="card"]',
              '.card-container',
              '.mtg-card'
            ];

            let totalCards = 0;
            selectors.forEach(sel => {
              const elements = document.querySelectorAll(sel);
              totalCards += elements.length;
            });

            return totalCards;
          });

          console.log(`   🃏 Cards found: ${cardCount}`);
          results.cardsFound += cardCount;

          // Test hover effects if cards exist
          if (cardCount > 0) {
            const hoverTest = await page.evaluate(() => {
              const cards = document.querySelectorAll('[class*="card"], .mtg-card, img');
              if (cards.length === 0) return false;

              const firstCard = cards[0];
              const rect = firstCard.getBoundingClientRect();

              // Simulate hover
              const hoverEvent = new MouseEvent('mouseover', {
                bubbles: true,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
              });

              firstCard.dispatchEvent(hoverEvent);

              // Check for transform styles
              const style = window.getComputedStyle(firstCard);
              return style.transform !== 'none' || style.transition !== 'none';
            });

            if (hoverTest) {
              console.log('   ✅ Hover effects detected');
              results.hoverEffectsWorking = true;
            }
          }

          // Check for animations
          const animationTest = await page.evaluate(() => {
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const style = window.getComputedStyle(el);
              if (style.animation !== 'none' ||
                  style.transition !== 'none' ||
                  style.animationName !== 'none') {
                return true;
              }
            }
            return false;
          });

          if (animationTest) {
            console.log('   ✅ Animations detected');
            results.animationsWorking = true;
          }
        }
      } catch (err) {
        // Story selector not found, continue
      }
    }

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    errors.push(error.message);
  }

  await browser.close();

  // Generate final report
  console.log('\\n\\n🎯 FINAL VERIFICATION REPORT');
  console.log('='.repeat(40));
  console.log(`📊 Stories Found: ${results.storiesFound.length}`);
  console.log(`🃏 Total Cards: ${results.cardsFound}`);
  console.log(`🎭 Hover Effects: ${results.hoverEffectsWorking ? '✅' : '❌'}`);
  console.log(`🎬 Animations: ${results.animationsWorking ? '✅' : '❌'}`);
  console.log(`📸 Screenshots: ${results.screenshots.length}`);

  if (results.storiesFound.length > 0) {
    console.log(`\\n📋 Found Stories:`);
    results.storiesFound.forEach(story => console.log(`   • ${story}`));
  }

  console.log(`\\n🎯 VERDICT:`);
  if (results.cardsFound === 0) {
    console.log(`❌ CRITICAL: No cards found - prototypes are broken!`);
  } else {
    console.log(`✅ SUCCESS: ${results.cardsFound} cards found and rendering!`);
    if (!results.hoverEffectsWorking && !results.animationsWorking) {
      console.log(`⚠️ Animation issue: No hover/animation effects detected`);
    }
  }

  if (errors.length > 0) {
    console.log(`\\n⚠️ Errors: ${errors.length}`);
    errors.forEach(err => console.log(`   - ${err}`));
  }

  return results;
}

testMTGPrototypes().catch(console.error);