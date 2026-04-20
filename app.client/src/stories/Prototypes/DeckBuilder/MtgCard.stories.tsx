import type { Meta, StoryObj } from '@storybook/react';
import { MtgCard } from './MtgCard';
import { mockCards } from './mockData';

const meta: Meta<typeof MtgCard> = {
  title: 'Prototypes/DeckBuilder/MtgCard',
  component: MtgCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        },
        {
          name: 'light',
          value: '#f5f5f5',
        },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    card: {
      description: 'MTG Card data in Scryfall format',
      control: { type: 'object' }
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof MtgCard>;

// Primary Stories
export const LightningBolt: Story = {
  args: {
    card: mockCards[0], // Lightning Bolt
  },
};

export const Counterspell: Story = {
  args: {
    card: mockCards[1], // Counterspell
  },
};

export const SolRing: Story = {
  args: {
    card: mockCards[2], // Sol Ring
  },
};

export const ExpensiveCard: Story = {
  args: {
    card: mockCards[5], // Black Lotus - has foil effect
  },
  parameters: {
    docs: {
      description: {
        story: 'Expensive cards (>$50) show a special foil shimmer effect on hover.',
      },
    },
  },
};

export const Multicolor: Story = {
  args: {
    card: mockCards[9], // Nicol Bolas, Planeswalker
  },
  parameters: {
    docs: {
      description: {
        story: 'Multicolor cards show gradient mana cost styling.',
      },
    },
  },
};

// Interactive Demo
export const InteractiveDemo: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
      <div className="text-center">
        <h3 className="text-white text-lg font-bold mb-4">Red Instant</h3>
        <MtgCard card={mockCards[0]} />
      </div>
      <div className="text-center">
        <h3 className="text-white text-lg font-bold mb-4">Blue Counter</h3>
        <MtgCard card={mockCards[1]} />
      </div>
      <div className="text-center">
        <h3 className="text-white text-lg font-bold mb-4">Artifact Ramp</h3>
        <MtgCard card={mockCards[2]} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing multiple cards with different color identities. Hover over each card to see the 3D tilt effect and color-themed glow.',
      },
    },
  },
};

// Animation Showcase
export const AnimationShowcase: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div className="text-center text-white space-y-2">
        <h2 className="text-2xl font-bold">MTG Card Animation Showcase</h2>
        <p className="text-gray-300">
          Hover, click, and move your cursor around each card to experience video-game quality animations
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {mockCards.slice(0, 4).map((card, index) => (
          <MtgCard
            key={card.name}
            card={card}
            onClick={() => alert(`Clicked ${card.name}`)}
          />
        ))}
      </div>
      <div className="text-center text-gray-400 text-sm space-y-1">
        <p>✨ Features: 3D tilt tracking, hover lift with shadow, color-themed glow</p>
        <p>🎮 Video-game quality: Spring physics, smooth transforms, specular highlights</p>
        <p>💎 Premium cards (&gt;$50) show foil shimmer effect</p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete animation showcase demonstrating all card interaction effects.',
      },
    },
  },
};