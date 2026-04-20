import type { Meta, StoryObj } from '@storybook/react-vite';
import { Decks } from './Decks';
import { AppShellProvider } from '../../contexts/AppShellContext';

const meta = {
  title: 'Views/Decks/Decks',
  component: Decks,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Decks View (Three-Zone Pattern)

The promoted deck management view that follows the three-zone pattern with AppShell integration.

## Three-Zone Layout Pattern
- **Left Rail**: Handled by AppShell (navigation, brand)
- **Top Bar Row 1**: Handled by AppShell (breadcrumb "Home › Decks")
- **Top Bar Row 2**: View-supplied filter controls (search input + format dropdown + sort dropdown)
- **Top Bar Row 3**: View-supplied filter chips + result counter ("Showing N of M decks")
- **Main Area**: Deck table + right-side preview panel

## Key Features
- **AppShell Integration**: Uses \`useAppShell\` hook to provide filter controls, chips, and counter
- **Sortable Deck Table**: Name, Format, Value, Last Edited with interactive headers
- **Live Filtering**: Search by deck name/commander, filter by format
- **Deck Preview Panel**: Selected deck details with key cards and actions
- **Card Hover Previews**: Floating card images with 3D tilt animation
- **Responsive Design**: Two-column layout with proper overflow handling

## Animation Details
- **Row Hover**: Violet accent with left indicator line and chevron icon (z-index 20)
- **Card Preview**: Scale + opacity + rotateY entrance animation
- **Sort Headers**: Interactive chevron indicators
- **Action Buttons**: Lift on hover with violet glow
- **All animations respect prefers-reduced-motion**

## Data & Filtering
- Search filters deck names and commanders
- Format dropdown with dynamic options from deck data
- Sort options: Last Edited, Name (A-Z), Format, Value (High-Low)
- Filter chips show active filters with remove functionality
- Result counter shows filtered vs total deck counts

Perfect implementation of the three-zone pattern for deck management.
        `
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AppShellProvider>
        <div style={{ height: '100vh', background: '#020617' }}>
          <Story />
        </div>
      </AppShellProvider>
    ),
  ],
} satisfies Meta<typeof Decks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default decks view integrated with three-zone pattern. Shows search input, format dropdown, and sort controls in the top bar, with filter chips and result counter.'
      }
    }
  }
};

export const WithFilters: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the view with active filters applied. Shows how filter chips appear and the result counter updates dynamically.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    // This would simulate applying filters in a real Storybook interaction
    const canvas = canvasElement;
    const searchInput = canvas.querySelector('input[placeholder="Search decks..."]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = 'Atraxa';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

export const MobileLayout: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile responsive view showing how the deck table and preview panel adapt to smaller screens.'
      }
    }
  }
};