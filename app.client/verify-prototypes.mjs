import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const STORYBOOK_BASE = 'http://localhost:6006';
const SCREENSHOTS_DIR = './verification-screenshots';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const stories = [
  {
    name: 'MtgCard-docs',
    url: `${STORYBOOK_BASE}/?path=/docs/prototypes-deckbuilder-mtgcard--docs`,
    description: 'MtgCard documentation page'
  },
  {
    name: 'CardGrid',
    url: `${STORYBOOK_BASE}/?path=/story/prototypes-deckbuilder--card-grid`,
    description: 'CardGrid prototype story'
  },
  {
    name: 'DeckZone',
    url: `${STORYBOOK_BASE}/?path=/story/prototypes-deckbuilder--deck-zone`,
    description: 'DeckZone prototype story'
  },
  {
    name: 'DeckBuilderPrototype',
    url: `${STORYBOOK_BASE}/?path=/story/prototypes-deckbuilder--deck-builder-prototype`,
    description: 'DeckBuilderPrototype story'
  }
];

async function verifyStory(page, story) {
  console.log(`\\n=== Verifying ${story.name} ===`);

  const errors = [];

  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });

  // Listen for page errors
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  try {
    // Navigate to story
    console.log(`Navigating to: ${story.url}`);
    await page.goto(story.url, { waitUntil: 'networkidle', timeout: 10000 });

    // Wait for story to load
    await page.waitForTimeout(2000);

    // Take initial screenshot
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${story.name}-initial.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`Screenshot saved: ${screenshotPath}`);

    // Check for MTG cards in the DOM
    const cardElements = await page.$$('[data-testid*="card"], .mtg-card, [class*="card"]');
    console.log(`Found ${cardElements.length} potential card elements`);

    // Test hover interactions if cards exist
    if (cardElements.length > 0) {
      console.log('Testing hover interactions...');

      // Hover on first card element
      await cardElements[0].hover();
      await page.waitForTimeout(500);

      // Take screenshot with hover
      const hoverScreenshotPath = path.join(SCREENSHOTS_DIR, `${story.name}-hover.png`);
      await page.screenshot({
        path: hoverScreenshotPath,
        fullPage: true
      });
      console.log(`Hover screenshot saved: ${hoverScreenshotPath}`);

      // Check for transform/animation styles after hover
      const cardStyle = await cardElements[0].getAttribute('style');
      const hasTransform = cardStyle && (cardStyle.includes('transform') || cardStyle.includes('transition'));
      console.log(`Card has transform/animation styles: ${hasTransform}`);
    }

    // Look for deck zone interactions (if applicable)
    const deckZoneElements = await page.$$('[data-testid*="deck"], .deck-zone, [class*="deck"]');
    if (deckZoneElements.length > 0) {
      console.log(`Found ${deckZoneElements.length} deck zone elements`);

      // Test clicking card to add to deck if this is the DeckBuilderPrototype
      if (story.name === 'DeckBuilderPrototype' && cardElements.length > 0) {
        console.log('Testing card-to-deck interaction...');
        await cardElements[0].click();
        await page.waitForTimeout(1000);

        // Take screenshot after click interaction
        const interactionScreenshotPath = path.join(SCREENSHOTS_DIR, `${story.name}-interaction.png`);
        await page.screenshot({
          path: interactionScreenshotPath,
          fullPage: true
        });
        console.log(`Interaction screenshot saved: ${interactionScreenshotPath}`);
      }
    }

    return {
      success: true,
      errors,
      cardCount: cardElements.length,
      deckZoneCount: deckZoneElements.length,
      screenshots: [
        `${story.name}-initial.png`,
        cardElements.length > 0 ? `${story.name}-hover.png` : null,
        story.name === 'DeckBuilderPrototype' ? `${story.name}-interaction.png` : null
      ].filter(Boolean)
    };

  } catch (error) {
    console.error(`Failed to verify ${story.name}:`, error.message);
    return {
      success: false,
      errors: [...errors, `Navigation Error: ${error.message}`],
      cardCount: 0,
      deckZoneCount: 0,
      screenshots: []
    };
  }
}

async function runVerification() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  const results = {};

  for (const story of stories) {
    results[story.name] = await verifyStory(page, story);
  }

  await browser.close();

  // Print summary
  console.log('\\n=== VERIFICATION SUMMARY ===');
  for (const [name, result] of Object.entries(results)) {
    console.log(`\\n${name}:`);
    console.log(`  Success: ${result.success}`);
    console.log(`  Cards found: ${result.cardCount}`);
    console.log(`  Deck zones found: ${result.deckZoneCount}`);
    console.log(`  Screenshots: ${result.screenshots.length}`);
    if (result.errors.length > 0) {
      console.log(`  Errors: ${result.errors.length}`);
      result.errors.forEach(error => console.log(`    - ${error}`));
    }
  }

  return results;
}

// Run the verification
runVerification().catch(console.error);