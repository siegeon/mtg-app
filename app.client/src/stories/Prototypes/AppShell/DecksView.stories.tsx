import type { Meta, StoryObj } from '@storybook/react-vite';
import { DecksView } from './DecksView';

const meta = {
  title: 'Prototypes/AppShell/DecksView',
  component: DecksView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Deck Library View

Moxfield-style deck collection management with signature card hover previews.

## Layout Pattern
- **Left Column**: Sortable deck table with thumbnails, metadata, and actions
- **Right Column**: Selected deck preview with key cards and quick actions
- **Signature Interaction**: Card names → floating card image on hover

## Key Features
- **Sortable columns**: Name, Format, Value, Last Edited
- **Deck thumbnails**: Commander/key card images for visual recognition
- **Color identity**: MTG mana symbols for quick deck identification
- **Value formatting**: Large values display as "$1.2k" format
- **Card hover preview**: Smooth animation with 3D tilt effect
- **Selection state**: Selected deck highlighted with violet accent
- **Quick actions**: Play button for immediate deck access

## Animation Details
- **Row hover**: Subtle lift with violet accent reveal
- **Card preview**: Scale + opacity with rotateY entrance
- **Sort headers**: Interactive chevron indicators
- **Action buttons**: Lift on hover with violet glow
- **All animations respect prefers-reduced-motion**

## Data Structure
Mock data includes 8 diverse decks across formats:
- Commander decks with legendary creature commanders
- Competitive Modern/Standard/Pioneer builds
- Price ranges from budget ($125) to expensive ($850+)
- Realistic last-edited timestamps
- Color identity representation with mana symbols

Perfect reference implementation for deck management UX patterns.
        `
      }
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DecksView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default deck library view with Atraxa +1/+1 Counters deck selected, showing the complete Moxfield-style layout with sortable deck table and preview panel.'
      }
    }
  }
};

export const MobileBreakpoint: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile view showing responsive behavior. In production, this would stack the columns or show a simplified single-column layout.'
      }
    }
  }
};

export const TabletBreakpoint: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tablet view demonstrating the layout at medium screen sizes. The deck preview panel maintains good proportions.'
      }
    }
  }
};