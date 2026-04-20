import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const STORYBOOK_BASE = 'http://localhost:6006';
const SCREENSHOTS_DIR = './verification-screenshots';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Corrected story URLs based on actual story files
const stories = [
  {
    name: 'MtgCard-LightningBolt',
    url: `${STORYBOOK_BASE}/?path=/story/prototypes-deckbuilder-mtgcard--lightning-bolt`,
    description: 'MtgCard Lightning Bolt story'
  },
  {
    name: 'MtgCard-Docs',
    url: `${STORYBOOK_BASE}/?path=/docs/prototypes-deckbuilder-mtgcard--lightning-bolt`,
    description: 'MtgCard documentation page'
  },
  {
    name: 'CardGrid-AllCards',
    url: `${STORYBOOK_BASE}/?path=/story/prototypes-deckbuilder-cardgrid--all-cards`,
    description: 'CardGrid with all cards'
  },
  {
    name: 'DeckZone-SampleDeck',
    url: `${STORYBOOK_BASE}/?path=/story/prototypes-deckbuilder-deckzone--sample-deck`,
    description: 'DeckZone with sample deck data'
  },
  {
    name: 'DeckZone-InteractiveDemo',
    url: `${STORYBOOK_BASE}/?path=/story/prototypes-deckbuilder-deckzone--interactive-demo`,
    description: 'DeckZone interactive demo'
  },
  {
    name: 'DeckBuilderPrototype-FullPrototype',
    url: `${STORYBOOK_BASE}/?path=/story/prototypes-deckbuilder-deckbuilderprototype--full-prototype`,
    description: 'Complete DeckBuilder prototype'
  }
];

async function verifyStory(page, story) {
  console.log(`\\n=== Verifying ${story.name} ===`);

  const errors = [];
  const consoleMessages = [];

  // Listen for console messages
  page.on('console', msg => {
    const message = `[${msg.type().toUpperCase()}] ${msg.text()}`;
    consoleMessages.push(message);
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });

  // Listen for page errors
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  try {
    console.log(`Navigating to: ${story.url}`);
    await page.goto(story.url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Wait for Storybook to fully load
    await page.waitForSelector('#storybook-root', { timeout: 10000 });
    await page.waitForTimeout(3000); // Allow animations to settle

    // Take initial screenshot
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${story.name}-loaded.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`Screenshot saved: ${screenshotPath}`);

    // Look for MTG cards using multiple selectors
    const cardSelectors = [
      '[data-testid*="card"]',
      '[class*="card"]',
      '[class*="mtg"]',
      '.card-container',
      '.card-wrapper',
      '.magic-card',
      '.mtg-card'
    ];

    let cardElements = [];
    for (const selector of cardSelectors) {
      const elements = await page.$$(selector);
      cardElements = cardElements.concat(elements);
      if (elements.length > 0) {
        console.log(`Found ${elements.length} elements with selector: ${selector}`);
      }
    }

    // Remove duplicates
    const uniqueCards = [...new Set(cardElements)];
    console.log(`Total unique card elements found: ${uniqueCards.length}`);

    // Test hover interactions if cards exist
    let hasHoverEffects = false;
    if (uniqueCards.length > 0) {
      console.log('Testing hover interactions...');

      // Get initial transform styles
      const initialStyle = await uniqueCards[0].getAttribute('style') || '';

      // Hover and check for style changes
      await uniqueCards[0].hover();
      await page.waitForTimeout(800); // Allow transform animation

      const hoverStyle = await uniqueCards[0].getAttribute('style') || '';
      hasHoverEffects = hoverStyle !== initialStyle ||
                        hoverStyle.includes('transform') ||
                        initialStyle.includes('transform');

      console.log(`Card hover styles changed: ${hasHoverEffects}`);
      console.log(`Initial style: ${initialStyle.substring(0, 100)}...`);
      console.log(`Hover style: ${hoverStyle.substring(0, 100)}...`);

      // Take screenshot with hover
      const hoverScreenshotPath = path.join(SCREENSHOTS_DIR, `${story.name}-hover.png`);
      await page.screenshot({
        path: hoverScreenshotPath,
        fullPage: true
      });
      console.log(`Hover screenshot saved: ${hoverScreenshotPath}`);
    }

    // Look for deck zone elements
    const deckZoneSelectors = [
      '[data-testid*="deck"]',
      '[class*="deck"]',
      '.deck-zone',
      '.deck-container',
      '.deck-area'
    ];

    let deckElements = [];
    for (const selector of deckZoneSelectors) {
      const elements = await page.$$(selector);
      deckElements = deckElements.concat(elements);
    }
    const uniqueDeckElements = [...new Set(deckElements)];

    // Test deck interactions for DeckBuilderPrototype
    let deckInteractionTested = false;
    if (story.name.includes('DeckBuilderPrototype') && uniqueCards.length > 0) {
      console.log('Testing card-to-deck interaction...');

      // Click the first card
      await uniqueCards[0].click();
      await page.waitForTimeout(1500); // Allow animation
      deckInteractionTested = true;

      // Take interaction screenshot
      const interactionScreenshotPath = path.join(SCREENSHOTS_DIR, `${story.name}-interaction.png`);
      await page.screenshot({
        path: interactionScreenshotPath,
        fullPage: true
      });
      console.log(`Interaction screenshot saved: ${interactionScreenshotPath}`);
    }

    // Check for animation-related classes/styles
    const animationIndicators = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let hasAnimations = false;
      let hasTransitions = false;
      let staggered = false;

      for (const el of elements) {
        const style = window.getComputedStyle(el);
        if (style.animation !== 'none') hasAnimations = true;
        if (style.transition !== 'none') hasTransitions = true;
        if (el.style.animationDelay || el.style.transitionDelay) staggered = true;
      }

      return { hasAnimations, hasTransitions, staggered };
    });

    const screenshots = [
      `${story.name}-loaded.png`,
      uniqueCards.length > 0 ? `${story.name}-hover.png` : null,
      deckInteractionTested ? `${story.name}-interaction.png` : null
    ].filter(Boolean);

    return {
      success: true,
      errors,
      consoleMessages: consoleMessages.slice(0, 10), // Limit console output
      cardCount: uniqueCards.length,
      deckZoneCount: uniqueDeckElements.length,
      hasHoverEffects,
      animationFeatures: animationIndicators,
      deckInteractionTested,
      screenshots
    };

  } catch (error) {
    console.error(`Failed to verify ${story.name}:`, error.message);
    return {
      success: false,
      errors: [...errors, `Navigation Error: ${error.message}`],
      consoleMessages,
      cardCount: 0,
      deckZoneCount: 0,
      hasHoverEffects: false,
      animationFeatures: { hasAnimations: false, hasTransitions: false, staggered: false },
      deckInteractionTested: false,
      screenshots: []
    };
  }
}

async function runVerification() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();

  const results = {};

  for (const story of stories) {
    results[story.name] = await verifyStory(page, story);
    await page.waitForTimeout(1000); // Brief pause between tests
  }

  await browser.close();

  // Print comprehensive summary
  console.log('\\n\\n=== COMPREHENSIVE VERIFICATION RESULTS ===');

  let totalCards = 0;
  let workingStories = 0;
  let storiesWithHoverEffects = 0;
  let storiesWithAnimations = 0;

  for (const [name, result] of Object.entries(results)) {
    console.log(`\\n📋 ${name}:`);
    console.log(`   ✅ Loaded: ${result.success}`);
    console.log(`   🃏 Cards Found: ${result.cardCount}`);
    console.log(`   🏠 Deck Zones: ${result.deckZoneCount}`);
    console.log(`   🎯 Hover Effects: ${result.hasHoverEffects ? '✅ Working' : '❌ None detected'}`);
    console.log(`   🎬 Animations: ${result.animationFeatures.hasAnimations ? '✅' : '❌'} | Transitions: ${result.animationFeatures.hasTransitions ? '✅' : '❌'} | Staggered: ${result.animationFeatures.staggered ? '✅' : '❌'}`);
    console.log(`   📸 Screenshots: ${result.screenshots.length}`);

    if (result.errors.length > 0) {
      console.log(`   ⚠️  Errors: ${result.errors.length}`);
    }

    // Aggregated stats
    totalCards += result.cardCount;
    if (result.success && result.cardCount > 0) workingStories++;
    if (result.hasHoverEffects) storiesWithHoverEffects++;
    if (result.animationFeatures.hasAnimations || result.animationFeatures.hasTransitions) storiesWithAnimations++;
  }

  console.log(`\\n\\n🎯 SUMMARY VERDICT:`);
  console.log(`   📊 Total Cards Rendered: ${totalCards}`);
  console.log(`   ✅ Working Stories: ${workingStories}/${stories.length}`);
  console.log(`   🎯 Stories with Hover Effects: ${storiesWithHoverEffects}/${stories.length}`);
  console.log(`   🎬 Stories with Animations: ${storiesWithAnimations}/${stories.length}`);

  if (totalCards === 0) {
    console.log(`\\n❌ CRITICAL ISSUE: No MTG cards are rendering in any stories!`);
  } else if (storiesWithHoverEffects === 0) {
    console.log(`\\n⚠️  ANIMATION ISSUE: No hover effects detected - video-game quality missing!`);
  } else {
    console.log(`\\n✅ PROTOTYPES FUNCTIONAL: Cards rendering with animations!`);
  }

  return results;
}

// Run the verification
runVerification().catch(console.error);