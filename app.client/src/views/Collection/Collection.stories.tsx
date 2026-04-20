import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collection } from './Collection';

const meta = {
  title: 'Views/Collection/Collection',
  component: Collection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Collection View

The Collection page following the three-zone UI model. Demonstrates the complete integration of all promoted components.

## Three-Zone Implementation

1. **Left Rail**: Navigation (unchanged from existing)
2. **Top Bar**: Three-row query structure
   - Row 1: Breadcrumb "Home › Collection" + Global Search
   - Row 2: Mana pips + Rarity/Price/Sort dropdowns
   - Row 3: Filter chips + "Showing X of Y cards" counter
3. **Main Area**: Results display
   - Responsive card grid (4-6 columns)

## Key Features

- Filter-capable archetype with all three top bar rows
- Filter controls consolidated in top bar row 2
- Filter chips show active filters with remove functionality
- Consistent styling for all filter controls
- Responsive grid adapts from 4-6 columns
- All animations follow motion stack (hover feedback, spring physics)
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['empty', 'one-filter', 'three-filters', 'mobile'],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Collection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'empty',
  },
};

export const Empty: Story = {
  args: {
    variant: 'empty',
  },
};

export const OneFilterActive: Story = {
  args: {
    variant: 'one-filter',
  },
};

export const ThreeFiltersActive: Story = {
  args: {
    variant: 'three-filters',
  },
};

export const Mobile: Story = {
  args: {
    variant: 'empty',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};