import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppShell } from './AppShell';

const meta = {
  title: 'Prototypes/AppShell/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# MTG App Shell Prototype

The main application shell featuring autoclaude's visual language with MTG-specific navigation.

## Visual DNA
- **Background**: Deep violet-to-black gradient bleeding from corners
- **Sidebar**: Fixed 220px width with MTG navigation sections
- **Accent Color**: Violet-500 (#8b5cf6) for CTAs and active states
- **Typography**: Near-white primary, slate-400 secondary
- **Animations**: Motion-based hover effects with spring physics

## Navigation Structure
- **COLLECTION**: Decks, Collection, Cards (Moxfield-style)
- **AI TOOLS**: Scan, Storage, Trade Scout, Prices (wedge features)
- **SYSTEM**: Settings

## Key Interactions
- Sidebar items translate-x on hover with spring animations
- Primary CTA ("+ New Deck") lifts with violet glow
- Search input with focus states and violet ring
- All animations respect prefers-reduced-motion
        `
      }
    }
  },
  argTypes: {
    currentPage: {
      control: 'text',
      description: 'Current page shown in breadcrumb'
    },
    activeNav: {
      control: 'select',
      options: [
        'decks',
        'collection',
        'cards',
        'scan',
        'storage',
        'trade-scout',
        'prices',
        'settings'
      ],
      description: 'Currently active navigation item'
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 'Dashboard',
    activeNav: undefined,
  },
};

export const DecksActive: Story = {
  args: {
    currentPage: 'Decks',
    activeNav: 'decks',
  },
};

export const CollectionActive: Story = {
  args: {
    currentPage: 'Collection',
    activeNav: 'collection',
  },
};

export const ScanActive: Story = {
  args: {
    currentPage: 'Scan Cards',
    activeNav: 'scan',
  },
};

export const SettingsActive: Story = {
  args: {
    currentPage: 'Settings',
    activeNav: 'settings',
  },
};

export const WithCustomContent: Story = {
  args: {
    currentPage: 'Deck Builder',
    activeNav: 'decks',
    children: (
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Deck Builder</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="bg-slate-700/50 border border-white/10 rounded-md p-4 hover:bg-slate-700/70 transition-colors"
              >
                <div className="w-full h-24 bg-slate-600 rounded mb-3"></div>
                <h3 className="text-white font-medium">Sample Card {i + 1}</h3>
                <p className="text-slate-400 text-sm">Example content</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
};