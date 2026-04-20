import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoxfieldCollection } from './MoxfieldCollection';

const meta = {
  title: 'Prototypes/Collection/Moxfield-Style',
  component: MoxfieldCollection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Moxfield-Style Collection Browser Prototype

This prototype replicates Moxfield's collection browsing experience, providing users with powerful filtering, sorting, and viewing options for their MTG card collection.

### Key Features

- **Dual View Modes**: Toggle between detailed grid view and compact list view
- **Comprehensive Filtering**: Filter by colors, rarity, price ranges, and search by name
- **Smart Sorting**: Sort by name, price, quantity, rarity, or set
- **Collection Statistics**: Real-time stats showing total cards, unique cards, and collection value
- **Signature Animation**: Same card-from-position hover preview as the deck list
- **Keyboard Navigation**: Full accessibility with focus-triggered previews

### The Collection Experience

The collection browser shows a realistic MTG collection ranging from budget commons to high-value vintage cards like Black Lotus and Power 9. This demonstrates how the interface handles collections of varying value and size.

### Usage Instructions

1. **View Toggle**: Switch between Grid and List views using the toggle buttons
2. **Filtering**: Use the left sidebar to filter by colors, rarity, price ranges
3. **Search**: Type in the search box to find specific cards by name
4. **Sorting**: Use the dropdown to sort by different criteria
5. **Preview**: Hover over any card to see the full-size preview animation
6. **Keyboard**: Tab through cards and use focus to trigger previews

### Animation Consistency

The card hover animation uses the same "materialize from position" pattern as the deck list, ensuring a consistent user experience across different parts of the MTG app.
        `
      }
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#111827' },
        { name: 'light', value: '#ffffff' }
      ]
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', background: '#111827' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MoxfieldCollection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Main Collection Browser Story
 *
 * The primary story showcasing the complete collection browsing experience with filtering, sorting, and dual view modes.
 *
 * **To explore the features:**
 * 1. Toggle between Grid and List views in the top-right corner
 * 2. Use the filter sidebar to narrow down cards by color, rarity, or price
 * 3. Try searching for specific cards like "Lightning Bolt" or "Jace"
 * 4. Hover over cards to see the signature preview animation
 * 5. Change sorting options to see different organization methods
 *
 * **Collection highlights:**
 * - High-value vintage cards (Black Lotus, Power 9)
 * - Modern staples (Lightning Bolt, Counterspell, Sol Ring)
 * - Variety of rarities and price points
 * - Realistic quantities showing an active player's collection
 */
export const Default: Story = {
  name: 'Collection Browser',
  args: {},
};

/**
 * ## Grid View Focus
 *
 * This story demonstrates the grid view specifically, which is optimal for browsing large collections
 * and getting a visual overview of card artwork.
 */
export const GridView: Story = {
  name: 'Grid View',
  args: {},
  parameters: {
    docs: {
      description: {
        story: `
### Grid View Features

The grid view provides:
- **Visual browsing** with card artwork prominently displayed
- **Rarity borders** color-coded by card rarity (common=gray, uncommon=silver, rare=gold, mythic=orange)
- **Quantity badges** showing how many copies you own
- **Price overlays** for quick value reference
- **Hover animations** that scale and lift cards with the preview

Best for: Visual browsing, identifying cards by artwork, getting collection overview
        `
      }
    }
  }
};

/**
 * ## List View Focus
 *
 * This story highlights the list view, which is more compact and data-dense for detailed analysis.
 */
export const ListView: Story = {
  name: 'List View',
  args: {},
  parameters: {
    docs: {
      description: {
        story: `
### List View Features

The list view provides:
- **Compact display** showing more cards per screen
- **Detailed information** including type, set, rarity, and price in columns
- **Efficient scanning** for specific cards or data analysis
- **Thumbnail previews** with full hover animations
- **Easy sorting** by various criteria in a tabular format

Best for: Inventory management, finding specific cards, analyzing collection value
        `
      }
    }
  }
};

/**
 * ## Filter & Search Demo
 *
 * This story showcases the powerful filtering and search capabilities.
 */
export const FilterDemo: Story = {
  name: 'Filtering & Search',
  args: {},
  parameters: {
    docs: {
      description: {
        story: `
### Filtering Capabilities

Test these filtering features:

1. **Color Filters**: Click color buttons (W, U, B, R, G, C) to filter by mana colors
2. **Rarity Filters**: Check boxes to filter by common, uncommon, rare, or mythic
3. **Price Range Filters**: Select radio buttons to filter by price brackets
4. **Search**: Type card names like "Bolt", "Jace", or "Sol" to find specific cards
5. **Combine Filters**: Use multiple filters together for precise searches

**Pro tip**: Try filtering for "mythic" rarity and "$20-$100" price range to see valuable cards in your collection.
        `
      }
    }
  }
};

/**
 * ## Animation Showcase
 *
 * This story focuses on demonstrating the hover animation system and interactions.
 */
export const AnimationShowcase: Story = {
  name: 'Hover Animations',
  args: {},
  parameters: {
    docs: {
      description: {
        story: `
### Animation Testing

Focus on testing these animated interactions:

1. **Card Hover**: Move mouse over any card to see the preview materialize
2. **Grid Animations**: Cards scale up and lift on hover with smooth easing
3. **List Animations**: List items slide right with hover indication
4. **View Transitions**: Toggle between Grid/List to see smooth fade transitions
5. **Filter Animations**: Button states and transitions respond to interactions
6. **Keyboard Focus**: Tab through cards to see focus-triggered animations

The animations use the same Motion library and timing constants as other MTG app components for consistency.
        `
      }
    }
  }
};

/**
 * ## Mobile/Responsive Story
 *
 * Testing the collection browser at mobile viewport sizes to ensure responsive design.
 */
export const Responsive: Story = {
  name: 'Mobile Layout',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: `
### Mobile Considerations

On smaller screens:
- Grid adjusts to fewer columns (2-3 cards wide)
- Filter sidebar remains accessible but may need scrolling
- Touch interactions work with hover animations
- List view becomes more prominent for mobile browsing
- Preview positioning adjusts to stay on screen

Test swiping, tapping, and touch interactions to ensure mobile-friendly experience.
        `
      }
    }
  }
};