import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardSearch } from '../components/search/CardSearch';

const meta: Meta<typeof CardSearch> = {
  title: 'Features/CardSearch',
  component: CardSearch,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Card Search Component

A comprehensive card search interface for the MTG App featuring:

## Key Features
- **Full-text search** with debounced input for optimal performance
- **Advanced filtering** by colors, type, mana cost, set, and rarity
- **Dual view modes** - Grid and List views with smooth transitions
- **Real-time results** with loading states and pagination
- **Responsive design** that works on all screen sizes
- **Animation-first** design with Motion animations throughout

## Search Capabilities
- Search card names, types, and abilities
- Filter by mana colors (WUBRG)
- Filter by converted mana cost range
- Sort by name, mana cost, set, rarity, or price
- Pagination for large result sets

## Performance
- Debounced search (300ms) to avoid excessive API calls
- Lazy loading for card images
- Optimized animations with \`will-change\` properties
- Virtualization ready for large datasets

## API Integration
Connects to \`/api/cards/search\` endpoint with comprehensive query parameters for all filtering options.
        `,
      },
    },
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof CardSearch>;

export const Default: Story = {
  render: () => <CardSearch />,
  parameters: {
    docs: {
      description: {
        story: 'The default card search interface with all features enabled.',
      },
    },
  },
};

export const DarkMode: Story = {
  render: () => <CardSearch />,
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Card search in dark mode - all components adapt automatically.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dark bg-gray-900 min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export const MobileView: Story = {
  render: () => <CardSearch />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-responsive layout with collapsed filters and optimized touch interactions.',
      },
    },
  },
};

export const TabletView: Story = {
  render: () => <CardSearch />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tablet layout showing the responsive grid adaptation.',
      },
    },
  },
};