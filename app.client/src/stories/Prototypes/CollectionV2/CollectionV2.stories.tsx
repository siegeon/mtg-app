import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { ThreeZoneAppShell } from './ThreeZoneAppShell.stories';

// Reuse components from other stories
const ManaPipGroup = ({ activeColors = [], onToggle }: {
  activeColors?: ('W' | 'U' | 'B' | 'R' | 'G' | 'C')[];
  onToggle?: (color: 'W' | 'U' | 'B' | 'R' | 'G' | 'C') => void;
}) => {
  const colors: ('W' | 'U' | 'B' | 'R' | 'G' | 'C')[] = ['W', 'U', 'B', 'R', 'G', 'C'];

  const colorMap = {
    W: { bg: '#FFF8E7', border: '#D4B896' },
    U: { bg: '#87CEEB', border: '#4682B4' },
    B: { bg: '#2F2F2F', border: '#1A1A1A' },
    R: { bg: '#FA8072', border: '#CD5C5C' },
    G: { bg: '#9CAF88', border: '#6B8E5A' },
    C: { bg: '#9CA3AF', border: '#6B7280' },
  };

  return (
    <div className="flex items-center gap-1">
      {colors.map((color) => {
        const colors = colorMap[color];
        const isActive = activeColors.includes(color);

        return (
          <motion.button
            key={color}
            type="button"
            onClick={() => onToggle?.(color)}
            className={`
              relative w-5 h-5 rounded-full border-[0.5px]
              ${isActive ? 'ring-2 ring-violet-500 ring-offset-1' : ''}
            `}
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.border,
            }}
            whileHover={{ scale: 1.1, brightness: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={isActive ? { scale: [1, 1.05, 1] } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        );
      })}
    </div>
  );
};

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

const StatCard = ({ label, value, variant = 'default' }: {
  label: string;
  value: string | number;
  variant?: 'default' | 'success';
}) => (
  <motion.div
    className="bg-white/[0.03] border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-white/[0.05] transition-colors duration-200"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
  >
    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className={`text-lg font-medium leading-none ${
      variant === 'success'
        ? 'text-green-600 dark:text-green-400'
        : 'text-gray-900 dark:text-gray-100'
    }`}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </p>
  </motion.div>
);

const Dropdown = ({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 pl-3 pr-8 bg-slate-800/50 border border-white/10 rounded text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
    >
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
  </div>
);

// Sample card data
const sampleCards = [
  { id: 1, name: 'Lightning Bolt', type: 'Instant', rarity: 'Common', price: '$0.50', quantity: 4 },
  { id: 2, name: 'Tarmogoyf', type: 'Creature', rarity: 'Mythic', price: '$45.00', quantity: 2 },
  { id: 3, name: 'Force of Will', type: 'Instant', rarity: 'Mythic', price: '$85.00', quantity: 1 },
  { id: 4, name: 'Path to Exile', type: 'Instant', rarity: 'Uncommon', price: '$3.50', quantity: 4 },
  { id: 5, name: 'Snapcaster Mage', type: 'Creature', rarity: 'Rare', price: '$25.00', quantity: 3 },
  { id: 6, name: 'Brainstorm', type: 'Instant', rarity: 'Common', price: '$1.00', quantity: 4 },
];

const CardGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
    {sampleCards.map((card) => (
      <motion.div
        key={card.id}
        className="bg-slate-800/30 border border-white/10 rounded-lg p-3 hover:bg-slate-800/50 transition-colors duration-200 group"
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Card image placeholder */}
        <div className="w-full aspect-[5/7] bg-slate-700 rounded mb-2 flex items-center justify-center">
          <span className="text-slate-500 text-xs">Card Image</span>
        </div>

        {/* Card info */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">
            {card.name}
          </h3>
          <p className="text-xs text-slate-400">{card.type}</p>
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-0.5 rounded ${
              card.rarity === 'Mythic' ? 'bg-red-500/20 text-red-400' :
              card.rarity === 'Rare' ? 'bg-orange-500/20 text-orange-400' :
              card.rarity === 'Uncommon' ? 'bg-slate-500/20 text-slate-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {card.rarity}
            </span>
            <span className="text-xs text-green-400">{card.price}</span>
          </div>
          <div className="text-xs text-slate-500">Qty: {card.quantity}</div>
        </div>
      </motion.div>
    ))}
  </div>
);

interface CollectionV2Props {
  variant?: 'empty' | 'one-filter' | 'three-filters' | 'mobile';
}

const CollectionV2 = ({ variant = 'empty' }: CollectionV2Props) => {
  const [activeColors, setActiveColors] = useState<('W' | 'U' | 'B' | 'R' | 'G' | 'C')[]>(
    variant === 'one-filter' ? ['U'] :
    variant === 'three-filters' ? ['U', 'R'] : []
  );
  const [rarity, setRarity] = useState(
    variant === 'one-filter' ? 'Rare' :
    variant === 'three-filters' ? 'Rare' : 'Any Rarity'
  );
  const [priceRange, setPriceRange] = useState(
    variant === 'three-filters' ? '$5-25' : 'Any Price'
  );
  const [sortBy, setSortBy] = useState('Name (A-Z)');

  const filterChips = [];
  if (activeColors.length > 0) {
    activeColors.forEach(color => {
      const colorNames = { W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green', C: 'Colorless' };
      filterChips.push({
        label: colorNames[color],
        onRemove: () => setActiveColors(prev => prev.filter(c => c !== color))
      });
    });
  }
  if (rarity !== 'Any Rarity') {
    filterChips.push({
      label: rarity,
      onRemove: () => setRarity('Any Rarity')
    });
  }
  if (priceRange !== 'Any Price') {
    filterChips.push({
      label: priceRange,
      onRemove: () => setPriceRange('Any Price')
    });
  }

  const resultCount = filterChips.length === 0 ? { showing: 1203, total: 1203 } :
                     filterChips.length === 1 ? { showing: 847, total: 1203 } :
                     { showing: 247, total: 1203 };

  const filterControls = (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-300">Colors:</span>
        <ManaPipGroup
          activeColors={activeColors}
          onToggle={(color) => {
            setActiveColors(prev =>
              prev.includes(color)
                ? prev.filter(c => c !== color)
                : [...prev, color]
            );
          }}
        />
      </div>

      <Dropdown
        label="Rarity"
        options={['Any Rarity', 'Mythic', 'Rare', 'Uncommon', 'Common']}
        value={rarity}
        onChange={setRarity}
      />

      <Dropdown
        label="Price"
        options={['Any Price', '$0-5', '$5-25', '$25+']}
        value={priceRange}
        onChange={setPriceRange}
      />

      <Dropdown
        label="Sort"
        options={['Name (A-Z)', 'Price (Low-High)', 'Price (High-Low)', 'CMC (Low-High)']}
        value={sortBy}
        onChange={setSortBy}
      />
    </div>
  );

  const statsStrip = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatCard label="Total Cards" value={1203} />
      <StatCard label="Unique Cards" value={847} />
      <StatCard label="Total Value" value="$2,847.50" variant="success" />
    </div>
  );

  return (
    <ThreeZoneAppShell
      currentPage="Collection"
      activeNav="collection"
      filterControls={filterControls}
      filterChips={filterChips}
      resultCounter={resultCount}
    >
      {/* Stats strip in main area */}
      {statsStrip}

      {/* Card grid */}
      <CardGrid />
    </ThreeZoneAppShell>
  );
};

const meta = {
  title: 'Prototypes/CollectionV2/CollectionV2',
  component: CollectionV2,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Collection V2 Prototype

The restructured Collection page following the three-zone UI model. Demonstrates the complete integration of all components.

## Three-Zone Implementation

1. **Left Rail**: Navigation (unchanged from existing)
2. **Top Bar**: Three-row query structure
   - Row 1: Breadcrumb "Home › Collection" + Global Search (220px)
   - Row 2: Mana pips + Rarity/Price/Sort dropdowns (30px tall, consistent styling)
   - Row 3: Filter chips + "Showing X of Y cards" counter (height always reserved)
3. **Main Area**: Results display
   - Stats strip (3 metric cards) at top
   - Responsive card grid (4-6 columns)

## Key Improvements

- Stats moved from left rail to main area (follows three-zone rule)
- Filters consolidated in top bar row 2 (no more left filter panel)
- Filter chips show active filters with remove functionality
- Consistent 30px height for all filter controls
- Weight 500 for stat values (clean, not heavy)
- Responsive grid adapts from 4-6 columns
- All animations follow motion stack (hover feedback, spring physics)

## Story Variants

- **Empty**: No active filters, showing all cards
- **OneFilterActive**: Single filter applied
- **ThreeFiltersActive**: Multiple filters for complex filtering demo
- **Mobile**: 380px viewport for responsive behavior
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
} satisfies Meta<typeof CollectionV2>;

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