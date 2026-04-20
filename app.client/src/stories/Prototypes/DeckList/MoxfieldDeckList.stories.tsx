import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoxfieldDeckList } from './MoxfieldDeckList';

const meta = {
  title: 'Prototypes/DeckList/Moxfield-Style',
  component: MoxfieldDeckList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Moxfield-Style Deck List Prototype

This prototype replicates Moxfield's proven deck list UX pattern as the foundation for MTG App's deck viewing experience.

### Key Features

- **Left-column text list**: Cards organized by category (Creatures, Planeswalkers, Instants, etc.)
- **Signature animation**: Card images "materialize from text" on hover - the text position is the origin point
- **Keyboard accessible**: Focus triggers the same preview animation as hover
- **Expandable sections**: Click section headers to collapse/expand categories
- **Real Scryfall data**: Uses actual MTG card images and pricing

### The Hero Animation

The core requirement is the card-from-text hover animation. When you hover over (or focus) a card name:

1. The card image appears to **emerge from the text itself** - not slide in from off-screen
2. Animation timing is crisp (180-250ms) with proper easing
3. Card preview includes image, name, type, and price
4. Positioning is intelligent - cards appear to the right with appropriate offset

### Usage Notes

- Hover over any card name in the left column to see the animation
- Use Tab navigation to test keyboard accessibility
- Click section headers to expand/collapse categories
- All animations respect \`prefers-reduced-motion\`

This faithful reproduction ensures we start from Moxfield's proven patterns rather than inventing new ones.
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
} satisfies Meta<typeof MoxfieldDeckList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Main Deck List Story
 *
 * The primary story showcasing the Moxfield-style deck list with the signature card-from-text animation.
 *
 * **To test the animation:**
 * 1. Hover over any card name in the left column
 * 2. Watch the card image materialize from the text position
 * 3. Try keyboard navigation with Tab and watch focus trigger the same animation
 *
 * **Key elements:**
 * - Commander section with special styling
 * - Expandable categories (Creatures, Planeswalkers, Instants, etc.)
 * - Quantity, name, mana cost, and price display
 * - Right sidebar with placeholder for mana curve
 */
export const Default: Story = {
  name: 'Moxfield-Style Deck List',
  args: {},
};

/**
 * ## Animation Focus Story
 *
 * This story highlights the card-from-text animation specifically.
 * The same component, but with documentation focused on the animation behavior.
 */
export const AnimationShowcase: Story = {
  name: 'Card-from-Text Animation',
  args: {},
  parameters: {
    docs: {
      description: {
        story: `
### Testing the Signature Animation

This is the same deck list, but focus on testing the **card-from-text animation**:

1. **Hover Test**: Move your mouse over different card names in the left column
2. **Keyboard Test**: Use Tab to navigate and watch focus trigger the animation
3. **Position Test**: Notice how cards materialize from the exact text position
4. **Timing Test**: Animation feels crisp at ~225ms duration

The card image should appear to "emerge from the text" rather than sliding in from elsewhere. This matches Moxfield's proven UX pattern that users expect.
        `
      }
    }
  }
};

/**
 * ## Mobile/Responsive Story
 *
 * Testing the deck list at smaller viewport sizes to ensure the animation
 * and layout work properly on different screen sizes.
 */
export const Responsive: Story = {
  name: 'Responsive Layout',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Testing the deck list layout and animations on mobile/tablet screen sizes.'
      }
    }
  }
};