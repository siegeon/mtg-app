import type { Meta, StoryObj } from '@storybook/react';
import { CardGrid } from './CardGrid';
import { mockCards } from './mockData';

const meta: Meta<typeof CardGrid> = {
  title: 'Prototypes/DeckBuilder/CardGrid',
  component: CardGrid,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    cards: {
      description: 'Array of MTG cards to display',
      control: { type: 'object' }
    },
    onCardClick: { action: 'card-clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof CardGrid>;

// Primary story with all cards
export const AllCards: Story = {
  args: {
    cards: mockCards,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete card grid showing all mock cards with search, sort, and staggered entrance animations.',
      },
    },
  },
};

// Subset of cards for focused viewing
export const SmallCollection: Story = {
  args: {
    cards: mockCards.slice(0, 4),
  },
  parameters: {
    docs: {
      description: {
        story: 'Smaller collection perfect for testing layouts and animations.',
      },
    },
  },
};

// Expensive cards only
export const ExpensiveCards: Story = {
  args: {
    cards: mockCards.filter(card => parseFloat(card.prices.usd) >= 10),
  },
  parameters: {
    docs: {
      description: {
        story: 'Only high-value cards showing premium foil effects.',
      },
    },
  },
};

// Interactive demo with detailed layout
export const InteractiveDemo: Story = {
  render: () => (
    <div className="min-h-screen p-6 space-y-6">
      <div className="text-center text-white space-y-2">
        <h1 className="text-3xl font-bold">MTG Card Grid - Interactive Demo</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Experience video-game quality animations with staggered card entrance,
          smooth search filtering, and responsive grid layout. Try searching for
          specific cards or sorting by different criteria.
        </p>
      </div>

      <CardGrid
        cards={mockCards}
        onCardClick={(card) => {
          alert(`Clicked: ${card.name}\nPrice: $${card.prices.usd}\nType: ${card.type_line}`);
        }}
      />

      <div className="text-center text-gray-400 text-sm space-y-1 pt-8">
        <p>✨ Features: Staggered entrance (60ms), responsive grid, real-time search</p>
        <p>🎮 Interactions: Hover effects, click feedback, smooth transitions</p>
        <p>📊 Smart stats: Live color distribution counts</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete interactive demo showing all grid features and animations.',
      },
    },
  },
};

// Animation showcase
export const AnimationShowcase: Story = {
  render: () => (
    <div className="min-h-screen p-6 space-y-8">
      <div className="text-center text-white space-y-4">
        <h1 className="text-3xl font-bold">Animation Showcase</h1>
        <p className="text-gray-300">
          Watch the staggered entrance animation - each card appears 60ms after the previous one
        </p>
        <button
          onClick={() => window.location.reload()}
          className="
            bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg
            transition-colors duration-200 font-medium
          "
        >
          ↻ Replay Entrance Animation
        </button>
      </div>

      <CardGrid cards={mockCards} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the staggered entrance animation pattern with reload functionality.',
      },
    },
  },
};

// Responsive layout test
export const ResponsiveLayout: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div className="text-white text-center space-y-2">
        <h2 className="text-2xl font-bold">Responsive Grid Layout</h2>
        <p className="text-gray-300">
          Grid adapts: 1 column (mobile) → 2 (sm) → 3 (lg) → 4 (xl) → 5 (2xl)
        </p>
      </div>

      <CardGrid
        cards={mockCards.slice(0, 6)}
        onCardClick={(card) => console.log('Card clicked:', card.name)}
      />

      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>Resize your browser window to see responsive breakpoints in action</p>
        <p>Tailwind breakpoints: sm(640px) → lg(1024px) → xl(1280px) → 2xl(1536px)</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Test responsive grid behavior across different screen sizes.',
      },
    },
  },
};