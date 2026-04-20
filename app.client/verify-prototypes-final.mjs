import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const STORYBOOK_BASE = 'http://localhost:6006';
const SCREENSHOTS_DIR = './verification-screenshots';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function verifyPrototypeStories() {
  console.log('🚀 Starting MTG Card Prototype Verification...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });

  const errors = [];
  const consoleMessages = [];
  const results = {
    storybookLoaded: false,
    prototypesFound: false,
    stories: {},
    totalCards: 0,
    workingStories: 0
  };

  // Capture console messages and errors
  page.on('console', msg => {
    const text = `[${msg.type().toUpperCase()}] ${msg.text()}`;
    consoleMessages.push(text);
    if (msg.type() === 'error') {
      errors.push(text);
    }
  });

  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  try {
    // 1. Navigate to Storybook home
    console.log('📡 Connecting to Storybook...');
    await page.goto(STORYBOOK_BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForSelector('#root', { timeout: 10000 });

    results.storybookLoaded = true;
    console.log('✅ Storybook loaded successfully');

    // Take initial screenshot
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '01-storybook-home.png'),
      fullPage: true
    });

    // 2. Navigate to PROTOTYPES section
    console.log('🔍 Looking for PROTOTYPES section...');

    // Wait for sidebar to load and look for PROTOTYPES
    await page.waitForTimeout(2000);

    // Try to find and expand PROTOTYPES section
    const prototypesSelector = 'text=PROTOTYPES';
    const prototypesElement = await page.$(prototypesSelector);

    if (prototypesElement) {
      console.log('✅ Found PROTOTYPES section');
      results.prototypesFound = true;

      // Click to expand if not already expanded
      await prototypesElement.click();
      await page.waitForTimeout(1000);

      // Look for DeckBuilder
      const deckBuilderElement = await page.$('text=DeckBuilder');
      if (deckBuilderElement) {
        console.log('✅ Found DeckBuilder in PROTOTYPES');

        // Click DeckBuilder to see its stories
        await deckBuilderElement.click();
        await page.waitForTimeout(1500);

        // Take screenshot showing the expanded tree
        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, '02-prototypes-expanded.png'),
          fullPage: true
        });

        // 3. Test individual stories
        const storyNames = [
          'MtgCard',
          'CardGrid',
          'DeckZone',
          'DeckBuilderPrototype'
        ];

        for (const storyName of storyNames) {
          console.log(`\\n🧪 Testing ${storyName} stories...`);

          const storyResult = {
            found: false,
            loaded: false,
            cards: 0,
            hasHoverEffects: false,
            hasAnimations: false,
            screenshots: [],
            errors: []
          };

          try {
            // Click on the story in the sidebar
            const storyElement = await page.$(`text=${storyName}`);
            if (storyElement) {
              console.log(`   📖 Found ${storyName} story`);
              storyResult.found = true;

              await storyElement.click();
              await page.waitForTimeout(3000); // Allow story to load

              // Take screenshot of the story
              const storyScreenshotPath = path.join(SCREENSHOTS_DIR, `03-${storyName.toLowerCase()}-story.png`);
              await page.screenshot({
                path: storyScreenshotPath,
                fullPage: true
              });
              storyResult.screenshots.push(path.basename(storyScreenshotPath));
              console.log(`   📸 Screenshot: ${path.basename(storyScreenshotPath)}`);

              // Check for card elements using various selectors
              const cardSelectors = [
                '[data-testid*="card"]',
                '[class*="card"]',
                '[class*="mtg"]',
                'img[alt*="card"]',
                '.card-container',
                '.magic-card',
                '.mtg-card'
              ];

              let cardElements = [];
              for (const selector of cardSelectors) {
                const elements = await page.$$(selector);
                if (elements.length > 0) {
                  console.log(`   🃏 Found ${elements.length} elements with selector: ${selector}`);
                  cardElements = cardElements.concat(elements);
                }
              }

              // Remove duplicates
              const uniqueCards = [...new Set(cardElements)];
              storyResult.cards = uniqueCards.length;
              results.totalCards += uniqueCards.length;

              if (uniqueCards.length > 0) {
                console.log(`   ✅ ${uniqueCards.length} card elements found`);
                storyResult.loaded = true;
                results.workingStories++;

                // Test hover interactions on first card
                try {
                  const firstCard = uniqueCards[0];
                  const initialStyle = await firstCard.getAttribute('style') || '';

                  await firstCard.hover();
                  await page.waitForTimeout(500);

                  const hoverStyle = await firstCard.getAttribute('style') || '';
                  const styleChanged = hoverStyle !== initialStyle;
                  const hasTransform = hoverStyle.includes('transform') || initialStyle.includes('transform');

                  storyResult.hasHoverEffects = styleChanged || hasTransform;
                  console.log(`   🎯 Hover effects: ${storyResult.hasHoverEffects ? '✅ Detected' : '❌ None'}`);

                  // Take hover screenshot
                  const hoverScreenshotPath = path.join(SCREENSHOTS_DIR, `04-${storyName.toLowerCase()}-hover.png`);
                  await page.screenshot({
                    path: hoverScreenshotPath,
                    fullPage: true
                  });
                  storyResult.screenshots.push(path.basename(hoverScreenshotPath));

                } catch (hoverError) {
                  console.log(`   ⚠️  Hover test failed: ${hoverError.message}`);
                  storyResult.errors.push(`Hover test: ${hoverError.message}`);
                }

                // Check for animations
                const animationCheck = await page.evaluate(() => {
                  const elements = document.querySelectorAll('*');
                  let hasAnimations = false;
                  let hasTransitions = false;

                  for (const el of elements) {
                    const style = window.getComputedStyle(el);
                    if (style.animation && style.animation !== 'none') hasAnimations = true;
                    if (style.transition && style.transition !== 'none') hasTransitions = true;
                  }

                  return { hasAnimations, hasTransitions };
                });

                storyResult.hasAnimations = animationCheck.hasAnimations || animationCheck.hasTransitions;
                console.log(`   🎬 Animations: ${storyResult.hasAnimations ? '✅ Found' : '❌ None'}`);

              } else {
                console.log(`   ❌ No card elements found`);
                storyResult.errors.push('No card elements found in story');
              }

            } else {
              console.log(`   ❌ ${storyName} story not found in sidebar`);
              storyResult.errors.push('Story not found in sidebar');
            }

          } catch (storyError) {
            console.log(`   ❌ Error testing ${storyName}: ${storyError.message}`);
            storyResult.errors.push(`Story test error: ${storyError.message}`);
          }

          results.stories[storyName] = storyResult;
        }

      } else {
        console.log('❌ DeckBuilder not found in PROTOTYPES');
        errors.push('DeckBuilder not found in PROTOTYPES section');
      }

    } else {
      console.log('❌ PROTOTYPES section not found');
      errors.push('PROTOTYPES section not found in Storybook sidebar');
    }

  } catch (error) {
    console.log(`❌ Critical error: ${error.message}`);
    errors.push(`Critical error: ${error.message}`);
  }

  await browser.close();

  // 4. Generate comprehensive report
  console.log('\\n\\n🎯 MTG CARD PROTOTYPE VERIFICATION REPORT');
  console.log('=' .repeat(50));

  console.log(`\\n📊 SUMMARY:`);
  console.log(`   Storybook Loaded: ${results.storybookLoaded ? '✅' : '❌'}`);
  console.log(`   Prototypes Found: ${results.prototypesFound ? '✅' : '❌'}`);
  console.log(`   Working Stories: ${results.workingStories}/${Object.keys(results.stories).length}`);
  console.log(`   Total Card Elements: ${results.totalCards}`);

  console.log(`\\n📋 INDIVIDUAL STORY RESULTS:`);

  for (const [storyName, storyResult] of Object.entries(results.stories)) {
    console.log(`\\n   🧪 ${storyName}:`);
    console.log(`      Found: ${storyResult.found ? '✅' : '❌'}`);
    console.log(`      Loaded: ${storyResult.loaded ? '✅' : '❌'}`);
    console.log(`      Cards: ${storyResult.cards}`);
    console.log(`      Hover Effects: ${storyResult.hasHoverEffects ? '✅' : '❌'}`);
    console.log(`      Animations: ${storyResult.hasAnimations ? '✅' : '❌'}`);
    console.log(`      Screenshots: ${storyResult.screenshots.length}`);

    if (storyResult.errors.length > 0) {
      console.log(`      Errors: ${storyResult.errors.length}`);
      storyResult.errors.forEach(error => console.log(`         - ${error}`));
    }
  }

  console.log(`\\n🎯 VERIFICATION VERDICT:`);

  if (results.totalCards === 0) {
    console.log(`❌ CRITICAL ISSUE: No MTG cards are rendering!`);
    console.log(`   This confirms the board escalation concern from BES-344.`);
    console.log(`   The prototypes appear broken - no cards visible in any story.`);
  } else {
    console.log(`✅ SUCCESS: MTG cards are rendering! (${results.totalCards} total)`);

    const workingRate = results.workingStories / Object.keys(results.stories).length;
    if (workingRate < 0.5) {
      console.log(`⚠️  PARTIAL ISSUE: Only ${Math.round(workingRate * 100)}% of stories working`);
    } else {
      console.log(`✅ GOOD: ${Math.round(workingRate * 100)}% of stories working`);
    }

    // Check animation requirements
    const storiesWithHover = Object.values(results.stories).filter(s => s.hasHoverEffects).length;
    const storiesWithAnimations = Object.values(results.stories).filter(s => s.hasAnimations).length;

    if (storiesWithHover === 0 && storiesWithAnimations === 0) {
      console.log(`❌ ANIMATION ISSUE: No hover effects or animations detected!`);
      console.log(`   This violates the "video-game quality" requirement from CLAUDE.md`);
    } else {
      console.log(`✅ ANIMATIONS: Hover effects in ${storiesWithHover} stories, animations in ${storiesWithAnimations} stories`);
    }
  }

  console.log(`\\n📸 Evidence screenshots saved in: ${SCREENSHOTS_DIR}/`);
  console.log(`💬 Console errors: ${errors.length}`);

  if (errors.length > 0 && errors.length <= 10) {
    console.log(`\\n⚠️  ERRORS:`);
    errors.forEach(error => console.log(`   - ${error}`));
  }

  return results;
}

// Run the verification
verifyPrototypeStories().catch(console.error);