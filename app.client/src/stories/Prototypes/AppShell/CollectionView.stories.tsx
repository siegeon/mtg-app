import type { Meta, StoryObj } from '@storybook/react-vite';
import { CollectionView } from './CollectionView';

const meta = {
  title: 'Prototypes/AppShell/CollectionView',
  component: CollectionView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Collection Management View

Moxfield-style card collection browser with advanced filtering and detailed card inspection.

## Layout Pattern
- **Left Column**: Filterable 6-column card grid with search and filter pills
- **Right Column**: Detailed card inspector with ownership info and actions
- **Signature Interaction**: Card hover → floating full-resolution preview

## Key Features
- **Smart Filters**: Color identity, rarity, price ranges with live counts
- **Visual Grid**: Card thumbnails with quantity, rarity, and value indicators
- **Collection Stats**: Total cards and estimated value in header
- **Advanced Search**: Filter by card name or type line
- **Ownership Tracking**: Regular and foil quantities with value calculations
- **Expensive Card Markers**: Star icons for high-value cards ($50+)
- **Rarity Color Coding**: Standard MTG rarity colors (white/silver/gold/orange)

## Filter System
Interactive filter pills with visual feedback:
- **Color Identity**: MTG mana symbols with color dots
- **Rarity Levels**: Common, Uncommon, Rare, Mythic
- **Price Ranges**: Budget vs expensive card filtering
- **Multi-select**: Combine multiple filters for precise searches

## Card Inspection
Right panel provides comprehensive card details:
- **High-res Image**: Full card art display
- **Oracle Text**: Complete rules text
- **Set Information**: Set name, code, and rarity
- **Ownership Data**: Quantity breakdown with foil tracking
- **Value Calculation**: Individual and total collection value
- **Quick Actions**: Add to deck, price history

## Collection Highlights
Mock data includes iconic MTG cards:
- **Power 9**: Black Lotus ($25,000)
- **Staples**: Sol Ring, Lightning Bolt, Counterspell
- **Modern/Legacy**: Tarmogoyf, Jace TMS, Demonic Tutor
- **Value Range**: From $0.15 commons to $25,000 vintage

Perfect reference for collection management UX patterns.
        `
      }
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CollectionView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default collection view with all filter pills active, showing the complete card grid with Lightning Bolt selected for detailed inspection.'
      }
    }
  }
};

export const BlueCardsFiltered: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Collection filtered to show only blue cards, demonstrating the color filter system with mana symbol indicators.'
      }
    }
  }
};

export const ExpensiveCardsOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Filtered view showing only high-value cards ($50+), highlighting the star markers and expensive card detection system.'
      }
    }
  }
};

export const MythicRareFilter: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Collection filtered to show only mythic rare cards, demonstrating the rarity-based filtering with orange rarity indicators.'
      }
    }
  }
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile responsive view. In production, this would show a single-column layout with collapsible detail panel.'
      }
    }
  }
};