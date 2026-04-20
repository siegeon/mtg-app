import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Search } from 'lucide-react';
import { ManaPipGroup } from '../../elements/ManaPip/ManaPip';
import { useAppShell } from '../../contexts/AppShellContext';

// Sample card data
const sampleCards = [
  { id: 1, name: 'Lightning Bolt', type: 'Instant', rarity: 'Common', price: '$0.50', quantity: 4 },
  { id: 2, name: 'Tarmogoyf', type: 'Creature', rarity: 'Mythic', price: '$45.00', quantity: 2 },
  { id: 3, name: 'Force of Will', type: 'Instant', rarity: 'Mythic', price: '$85.00', quantity: 1 },
  { id: 4, name: 'Path to Exile', type: 'Instant', rarity: 'Uncommon', price: '$3.50', quantity: 4 },
  { id: 5, name: 'Snapcaster Mage', type: 'Creature', rarity: 'Rare', price: '$25.00', quantity: 3 },
  { id: 6, name: 'Brainstorm', type: 'Instant', rarity: 'Common', price: '$1.00', quantity: 4 },
];

const Dropdown = ({ options, value, onChange }: {
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

export interface CollectionProps {
  variant?: 'empty' | 'one-filter' | 'three-filters' | 'mobile';
}

export const Collection = ({ variant = 'empty' }: CollectionProps) => {
  const { setFilterControls, setFilterChips, setResultCounter } = useAppShell();
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
  const [searchTerm, setSearchTerm] = useState('');

  const filterChips: { label: string; onRemove(): void }[] = [];
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
  if (searchTerm.trim()) {
    filterChips.push({
      label: `"${searchTerm.trim()}"`,
      onRemove: () => setSearchTerm('')
    });
  }

  const resultCount = filterChips.length === 0 ? { showing: 1203, total: 1203 } :
                     filterChips.length === 1 ? { showing: 847, total: 1203 } :
                     { showing: 247, total: 1203 };

  const filterControlsElement = useMemo(() => (
    <div className="flex items-center gap-4">
      {/* Card Search */}
      <div className="relative w-52">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
        <input
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-8 pl-9 pr-3 bg-slate-800/50 border border-white/10 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>

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
        options={['Any Rarity', 'Mythic', 'Rare', 'Uncommon', 'Common']}
        value={rarity}
        onChange={setRarity}
      />

      <Dropdown
        options={['Any Price', '$0-5', '$5-25', '$25+']}
        value={priceRange}
        onChange={setPriceRange}
      />

      <Dropdown
        options={['Name (A-Z)', 'Price (Low-High)', 'Price (High-Low)', 'CMC (Low-High)']}
        value={sortBy}
        onChange={setSortBy}
      />
    </div>
  ), [searchTerm, activeColors, rarity, priceRange, sortBy]);

  // Update AppShell context whenever state changes
  useEffect(() => {
    setFilterControls(filterControlsElement);
    setFilterChips(filterChips);
    setResultCounter(resultCount);
  }, [setFilterControls, setFilterChips, setResultCounter, filterControlsElement, activeColors, rarity, priceRange, searchTerm]);

  return <CardGrid />;
};