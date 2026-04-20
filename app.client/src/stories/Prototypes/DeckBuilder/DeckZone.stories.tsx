import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DeckZone } from './DeckZone';
import { mockCards } from './mockData';

// Create some sample deck data
const sampleMainboard = [
  { card: mockCards[0], quantity: 4, id: '1' }, // Lightning Bolt x4
  { card: mockCards[1], quantity: 4, id: '2' }, // Counterspell x4
  { card: mockCards[2], quantity: 4, id: '3' }, // Sol Ring x4
  { card: mockCards[3], quantity: 1, id: '4' }, // Rhystic Study x1
  { card: mockCards[4], quantity: 4, id: '5' }, // Birds of Paradise x4
  { card: mockCards[6], quantity: 2, id: '6' }, // Doom Blade x2
  { card: mockCards[7], quantity: 3, id: '7' }, // Giant Growth x3
  { card: mockCards[8], quantity: 2, id: '8' }, // Wrath of God x2
];

const sampleSideboard = [
  { card: mockCards[5], quantity: 1, id: '9' },  // Black Lotus x1
  { card: mockCards[9], quantity: 1, id: '10' }, // Nicol Bolas x1
];

const meta: Meta<typeof DeckZone> = {
  title: 'Prototypes/DeckBuilder/DeckZone',
  component: DeckZone,
  parameters: {
    layout: 'centered',
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
    deckName: {
      description: 'Name of the deck',
      control: { type: 'text' }
    },
    mainboard: {
      description: 'Cards in the main deck',
      control: { type: 'object' }
    },
    sideboard: {
      description: 'Cards in the sideboard',
      control: { type: 'object' }
    },
    onRemoveCard: { action: 'card-removed' },
    onQuantityChange: { action: 'quantity-changed' },
  },
};

export default meta;
type Story = StoryObj<typeof DeckZone>;

export const EmptyDeck: Story = {
  args: {
    deckName: "New Deck",
    mainboard: [],
    sideboard: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty deck showing the initial state with mana curve and card list placeholders.',
      },
    },
  },
};

export const SampleDeck: Story = {
  args: {
    deckName: "Lightning Control",
    mainboard: sampleMainboard,
    sideboard: sampleSideboard,
  },
  parameters: {
    docs: {
      description: {
        story: 'Populated deck showing mana curve visualization, card quantities, and deck value.',
      },
    },
  },
};

export const ExpensiveDeck: Story = {
  args: {
    deckName: "Black Lotus Collection",
    mainboard: [
      { card: mockCards[5], quantity: 4, id: '1' }, // Black Lotus x4
      { card: mockCards[3], quantity: 4, id: '2' }, // Rhystic Study x4
      { card: mockCards[9], quantity: 2, id: '3' }, // Nicol Bolas x2
    ],
    sideboard: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'High-value deck demonstrating deck value calculation with expensive cards.',
      },
    },
  },
};

// Interactive story with state management
export const InteractiveDemo: Story = {
  render: () => {
    const [mainboard, setMainboard] = useState(sampleMainboard);
    const [sideboard, setSideboard] = useState(sampleSideboard);

    const handleRemoveCard = (cardId: string, zone: 'mainboard' | 'sideboard') => {
      if (zone === 'mainboard') {
        setMainboard(prev => prev.filter(card => card.id !== cardId));
      } else {
        setSideboard(prev => prev.filter(card => card.id !== cardId));
      }
    };

    const handleQuantityChange = (cardId: string, newQuantity: number, zone: 'mainboard' | 'sideboard') => {
      const updateZone = zone === 'mainboard' ? setMainboard : setSideboard;

      updateZone(prev => prev.map(card =>
        card.id === cardId ? { ...card, quantity: newQuantity } : card
      ));
    };

    return (
      <div className="max-w-md mx-auto">
        <DeckZone
          deckName="Interactive Demo Deck"
          mainboard={mainboard}
          sideboard={sideboard}
          onRemoveCard={handleRemoveCard}
          onQuantityChange={handleQuantityChange}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive deck zone where you can modify quantities, remove cards, and see real-time updates to the mana curve.',
      },
    },
  },
};

// Mana curve showcase
export const ManaCurveShowcase: Story = {
  args: {
    deckName: "Mana Curve Demo",
    mainboard: [
      // CMC 0
      { card: mockCards[5], quantity: 1, id: '1' }, // Black Lotus (0)
      // CMC 1
      { card: mockCards[0], quantity: 4, id: '2' }, // Lightning Bolt (1)
      { card: mockCards[2], quantity: 4, id: '3' }, // Sol Ring (1)
      { card: mockCards[4], quantity: 4, id: '4' }, // Birds of Paradise (1)
      { card: mockCards[7], quantity: 4, id: '5' }, // Giant Growth (1)
      // CMC 2
      { card: mockCards[1], quantity: 4, id: '6' }, // Counterspell (2)
      { card: mockCards[6], quantity: 4, id: '7' }, // Doom Blade (2)
      // CMC 3
      { card: mockCards[3], quantity: 3, id: '8' }, // Rhystic Study (3)
      // CMC 4
      { card: mockCards[8], quantity: 2, id: '9' }, // Wrath of God (4)
      // CMC 8
      { card: mockCards[9], quantity: 1, id: '10' }, // Nicol Bolas (8)
    ],
    sideboard: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates mana curve visualization with cards distributed across different mana costs.',
      },
    },
  },
};

// Animation showcase
export const AnimationShowcase: Story = {
  render: () => {
    const [key, setKey] = useState(0);

    return (
      <div className="space-y-6 max-w-md mx-auto">
        <div className="text-center text-white space-y-2">
          <h3 className="text-lg font-bold">Deck Zone Animations</h3>
          <p className="text-sm text-gray-300">
            Watch tab transitions, mana curve builds, and card list animations
          </p>
          <button
            onClick={() => setKey(prev => prev + 1)}
            className="
              bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg
              transition-colors duration-200 text-sm font-medium
            "
          >
            ↻ Replay Animations
          </button>
        </div>

        <DeckZone
          key={key}
          deckName="Animation Demo"
          mainboard={sampleMainboard}
          sideboard={sampleSideboard}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Showcases all animations: staggered card entrance, tab transitions with layoutId, and spring-physics mana curve.',
      },
    },
  },
};