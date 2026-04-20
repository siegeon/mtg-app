import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  Library,
  Search,
  ScanLine,
  Archive,
  TrendingUp,
  DollarSign,
  Settings,
  Plus,
  ChevronRight,
  Bookmark,
  Play,
  Zap,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface CollectionShellProps {
  /** Current page context for breadcrumb */
  currentPage?: string;
  /** Active navigation item */
  activeNav?: string;
  /** Main content to display */
  children?: React.ReactNode;
  /** Navigation item click handler */
  onNavClick?: (navId: string) => void;
  /** Primary CTA click handler */
  onCTAClick?: (label: string) => void;
  /** Global search component for top bar row 1 */
  globalSearch?: React.ReactNode;
  /** Filter controls for top bar row 2 */
  filterControls?: React.ReactNode;
  /** Filter chips for top bar row 3 */
  filterChips?: { label: string; onRemove(): void }[];
  /** Result counter for top bar row 3 */
  resultCounter?: { showing: number; total: number };
}

const getPrimaryAction = (activeNav?: string) => {
  const actionMap = {
    decks: { label: 'New Deck', icon: Plus },
    collection: { label: 'Add Cards', icon: Plus },
    cards: { label: 'Save Search', icon: Bookmark },
    scan: { label: 'Start Scan', icon: Play },
    storage: { label: 'New Location', icon: Plus },
    'trade-scout': { label: 'New Match Rule', icon: Zap },
    prices: { label: 'Add to Watchlist', icon: Plus }
  };

  return activeNav ? actionMap[activeNav as keyof typeof actionMap] : null;
};

const sidebarSections = [
  {
    label: 'COLLECTION',
    items: [
      { id: 'decks', label: 'Decks', icon: Library },
      { id: 'collection', label: 'Collection', icon: Archive },
      { id: 'cards', label: 'Cards', icon: Search }
    ]
  },
  {
    label: 'AI TOOLS',
    items: [
      { id: 'scan', label: 'Scan', icon: ScanLine },
      { id: 'storage', label: 'Storage', icon: Archive },
      { id: 'trade-scout', label: 'Trade Scout', icon: TrendingUp },
      { id: 'prices', label: 'Prices', icon: DollarSign }
    ]
  }
];

const NavItem = ({ item, isActive, onClick }: { item: any; isActive: boolean; onClick?: () => void }) => {
  const Icon = item.icon;

  return (
    <motion.button
      className={cn(
        'flex items-center gap-3 w-full px-4 py-3 text-left rounded-sm transition-all duration-150',
        'text-slate-400 font-medium hover:text-slate-100',
        'hover:bg-violet-500/10 hover:translate-x-1',
        isActive && 'bg-violet-500/20 text-violet-400'
      )}
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon size={18} />
      <span className="text-sm">{item.label}</span>
    </motion.button>
  );
};

// Filter chip component for row 3
const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <motion.div
    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-medium border border-violet-500/30"
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
  >
    <span className="select-none">{label}</span>
    <motion.button
      type="button"
      onClick={onRemove}
      className="flex items-center justify-center w-4 h-4 rounded-full bg-violet-600/20 hover:bg-violet-600/40 text-violet-600 dark:text-violet-400 transition-colors duration-150"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Remove ${label} filter`}
    >
      <span className="text-xs">×</span>
    </motion.button>
  </motion.div>
);

export const CollectionShell: React.FC<CollectionShellProps> = ({
  currentPage = 'Dashboard',
  activeNav,
  children,
  onNavClick,
  onCTAClick,
  globalSearch,
  filterControls,
  filterChips = [],
  resultCounter
}) => {
  const primaryAction = getPrimaryAction(activeNav);
  const hasFilterControls = !!filterControls;
  const hasFilterChips = filterChips.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900/20 via-slate-900 to-black">
      {/* Left Sidebar - Navigation Zone */}
      <div className="fixed left-0 top-0 h-full w-56 bg-slate-950/90 border-r border-white/10 backdrop-blur-sm">
        <div className="flex flex-col h-full">
          {/* Logo/Brand Area */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-white font-semibold">MTG App</h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 space-y-6">
            {sidebarSections.map((section) => (
              <div key={section.label}>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-4">
                  {section.label}
                </h2>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      isActive={activeNav === item.id}
                      onClick={() => onNavClick?.(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="p-4 border-t border-white/10 space-y-3">
            {/* Primary CTA Button */}
            {primaryAction && (
              <motion.button
                className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-150"
                onClick={() => onCTAClick?.(primaryAction.label)}
                whileHover={{ y: -1, boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <primaryAction.icon size={16} />
                {primaryAction.label}
              </motion.button>
            )}

            {/* Settings */}
            <NavItem
              item={{ id: 'settings', label: 'Settings', icon: Settings }}
              isActive={activeNav === 'settings'}
              onClick={() => onNavClick?.('settings')}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-56 min-h-screen">
        {/* Three-Row Top Bar - Query Zone */}
        <header className="bg-slate-950/50 border-b border-white/10 backdrop-blur-sm">
          {/* Row 1: Breadcrumb + Global Search */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-white/5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-slate-400">
              <Home size={16} />
              <ChevronRight size={14} />
              <span className="text-white font-medium">{currentPage}</span>
            </div>

            {/* Global Search */}
            <div className="w-56">
              {globalSearch || (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    placeholder="Search cards..."
                    className="w-full bg-slate-800/50 border border-white/10 rounded-md pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Filter Controls (conditional) */}
          {hasFilterControls && (
            <div className="h-14 px-6 flex items-center gap-4 border-b border-white/5">
              {filterControls}
            </div>
          )}

          {/* Row 3: Filter Chips + Result Counter (height always reserved) */}
          <div className="h-12 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {filterChips.map((chip, index) => (
                <FilterChip
                  key={`${chip.label}-${index}`}
                  label={chip.label}
                  onRemove={chip.onRemove}
                />
              ))}
            </div>
            {resultCounter && (
              <span className="text-xs text-slate-400 font-mono tabular-nums">
                Showing {resultCounter.showing.toLocaleString()} of {resultCounter.total.toLocaleString()} cards
                {resultCounter.unique && (
                  <>
                    {' · '}
                    <span>{resultCounter.unique.toLocaleString()} unique</span>
                  </>
                )}
                {resultCounter.value && (
                  <>
                    {' · '}
                    <span className="text-emerald-400">{resultCounter.value}</span>
                  </>
                )}
              </span>
            )}
          </div>
        </header>

        {/* Main Content - Results Zone */}
        <main className="p-6">
          {children || (
            <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-slate-800 rounded-lg mx-auto flex items-center justify-center">
                  <Library className="text-slate-500" size={32} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">Main Content Area</h2>
                  <p className="text-slate-400">This is where page results will be displayed</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Sample filter controls component
const SampleFilterControls = () => (
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-300">Colors:</span>
      <div className="flex items-center gap-1">
        {[
          { color: 'W', bg: '#FFF8E7', border: '#D4B896' },
          { color: 'U', bg: '#87CEEB', border: '#4682B4' },
          { color: 'B', bg: '#2F2F2F', border: '#1A1A1A' },
          { color: 'R', bg: '#FA8072', border: '#CD5C5C' },
          { color: 'G', bg: '#9CAF88', border: '#6B8E5A' },
          { color: 'C', bg: '#9CA3AF', border: '#6B7280' },
        ].map(({ color, bg, border }) => (
          <motion.button
            key={color}
            type="button"
            className="w-5 h-5 rounded-full border-[0.5px]"
            style={{ backgroundColor: bg, borderColor: border }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          />
        ))}
      </div>
    </div>

    <select className="h-8 px-3 bg-slate-800/50 border border-white/10 rounded text-sm text-white">
      <option>Any Rarity</option>
      <option>Mythic</option>
      <option>Rare</option>
      <option>Uncommon</option>
      <option>Common</option>
    </select>

    <select className="h-8 px-3 bg-slate-800/50 border border-white/10 rounded text-sm text-white">
      <option>Any Price</option>
      <option>$0-5</option>
      <option>$5-25</option>
      <option>$25+</option>
    </select>

    <select className="h-8 px-3 bg-slate-800/50 border border-white/10 rounded text-sm text-white">
      <option>Name (A-Z)</option>
      <option>Price (Low-High)</option>
      <option>Price (High-Low)</option>
      <option>CMC (Low-High)</option>
    </select>
  </div>
);

const meta = {
  title: 'Prototypes/Collection/CollectionShell',
  component: CollectionShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Three-Zone App Shell Prototype

Extension of the existing AppShell with support for a 3-row top bar structure following the three-zone UI model.

## Three Zones

1. **Left Rail** = Navigation (existing sidebar)
2. **Top Bar** = Query (3 rows: breadcrumb+search, filters, chips+counter)
3. **Main Area** = Results (stats strip + content grid)

## Top Bar Structure

- **Row 1**: Breadcrumb + Global Search (220px width, always visible)
- **Row 2**: Filter Controls (conditional, only renders if filterControls prop provided)
- **Row 3**: Filter Chips + Result Counter (height always reserved for layout stability)

## Key Changes from AppShell

- 3-row header structure instead of single row
- Support for filter controls in row 2
- Filter chips with remove functionality in row 3
- Result counter display
- Height reserved for row 3 even when empty
        `
      }
    }
  },
  argTypes: {
    currentPage: { control: 'text' },
    activeNav: {
      control: 'select',
      options: ['decks', 'collection', 'cards', 'scan', 'storage', 'trade-scout', 'prices', 'settings']
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CollectionShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 'Collection',
    activeNav: 'collection',
  },
};

export const WithFilterControls: Story = {
  args: {
    currentPage: 'Collection',
    activeNav: 'collection',
    filterControls: <SampleFilterControls />,
    resultCounter: { showing: 1203, total: 1203 },
  },
};

export const WithActiveFilters: Story = {
  args: {
    currentPage: 'Collection',
    activeNav: 'collection',
    filterControls: <SampleFilterControls />,
    filterChips: [
      { label: 'Blue', onRemove: () => console.log('Remove Blue') },
      { label: 'Rare', onRemove: () => console.log('Remove Rare') },
      { label: 'CMC ≤ 3', onRemove: () => console.log('Remove CMC') },
    ],
    resultCounter: { showing: 247, total: 1203 },
  },
};

export const NoFiltersPage: Story = {
  args: {
    currentPage: 'Deck Detail',
    activeNav: 'decks',
    resultCounter: { showing: 60, total: 60 },
  },
};