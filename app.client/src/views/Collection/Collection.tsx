import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, stagger, useAnimate } from 'motion/react';
import { ChevronDown, Search, AlertCircle } from 'lucide-react';
import { ManaPipGroup } from '../../elements/ManaPip/ManaPip';
import { useAppShell } from '../../contexts/AppShellContext';
import { CardImageWithHover } from '../../components/CardImage';
import { useCardsSearch, useDefaultCollection, type CollectionCard } from '../../hooks/useCardsApi';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Utility function for rarity colors (moved from mock data)
const getRarityColor = (rarity: string): string => {
  switch (rarity.toLowerCase()) {
    case 'mythic':
      return '#ff6b35';
    case 'rare':
      return '#ffd700';
    case 'uncommon':
      return '#c0c0c0';
    case 'common':
      return '#000000';
    default:
      return '#666666';
  }
};

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

interface CardGridProps {
  cards?: CollectionCard[];
  variant?: 'empty' | 'one-filter' | 'three-filters' | 'mobile';
  isLoading?: boolean;
  error?: Error | null;
}

// Performance optimization: Memoized card component
const CardItem = memo(({ card, index, reducedMotion }: {
  card: CollectionCard;
  index: number;
  reducedMotion: boolean;
}) => (
  <motion.div
    className="card-item bg-slate-800/30 border border-white/10 rounded-lg p-3 hover:bg-slate-800/50 transition-colors duration-200 group relative overflow-hidden"
    initial={reducedMotion ? {} : { opacity: 0, y: 20, scale: 0.9 }}
    whileHover={reducedMotion ? {} : {
      y: -4,
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(139, 92, 246, 0.1)"
    }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20,
      mass: 0.8
    }}
  >
    {/* Card image */}
    <div className="w-full aspect-[5/7] mb-2">
      {card.image_uris?.normal ? (
        <CardImageWithHover
          name={card.name}
          imageUris={card.image_uris}
          size="normal"
          className="w-full h-full"
        />
      ) : (
        <div className="w-full h-full bg-slate-700 border border-white/10 rounded flex items-center justify-center">
          <span className="text-xs text-slate-400">Card Image</span>
        </div>
      )}
    </div>

    {/* Card info */}
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors line-clamp-1">
        {card.name}
      </h3>

      {/* Mana cost if available */}
      {card.mana_cost && (
        <div className="text-xs text-slate-400 font-mono">
          {card.mana_cost}
        </div>
      )}

      <p className="text-xs text-slate-400 line-clamp-1">{card.type_line}</p>

      <div className="flex items-center justify-between">
        <span
          className={`text-xs px-2 py-0.5 rounded capitalize relative ${
            card.rarity === 'mythic' ? 'animate-pulse' : ''
          }`}
          style={{
            backgroundColor: `${getRarityColor(card.rarity)}20`,
            color: getRarityColor(card.rarity)
          }}
        >
          {card.rarity === 'mythic' && !reducedMotion && (
            <motion.span
              className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded blur-sm -z-10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          {card.rarity}
        </span>
        <span className="text-xs text-green-400 font-mono">
          ${card.prices.usd}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Qty: {card.quantity}</span>
        {card.foil_quantity && card.foil_quantity > 0 && (
          <span className="text-amber-400 text-xs">✨ {card.foil_quantity} foil</span>
        )}
      </div>

      {/* Set info */}
      <div className="text-xs text-slate-600 uppercase tracking-wider">
        {card.set_code}
      </div>
    </div>
  </motion.div>
));

const CardGrid = ({ cards = [], variant = 'empty', isLoading = false, error = null }: CardGridProps) => {
  const [scope, animate] = useAnimate();
  const [visibleCount, setVisibleCount] = useState(24); // Start with 24 cards
  const reducedMotion = useReducedMotion();

  // For demo purposes, limit the display based on variant, but add windowing for performance
  const displayCards = useMemo(() => {
    let baseCards = cards;
    if (variant === 'empty') baseCards = cards.slice(0, 6);
    else if (variant === 'one-filter') baseCards = cards.slice(0, 12);

    // For large collections, only render visible cards + buffer
    return baseCards.slice(0, Math.min(visibleCount, baseCards.length));
  }, [cards, variant, visibleCount]);

  // Load more cards when scrolling near the bottom
  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 24, cards.length));
  }, [cards.length]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < cards.length) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('load-more-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [visibleCount, cards.length, handleLoadMore]);

  // Animate cards in with stagger when they change (respects prefers-reduced-motion)
  useEffect(() => {
    if (scope.current && !reducedMotion) {
      animate(
        ".card-item",
        { opacity: 1, y: 0, scale: 1 },
        {
          delay: stagger(0.05),
          duration: 0.4,
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      );
    } else if (scope.current && reducedMotion) {
      // Instant reveal for reduced motion users
      animate(
        ".card-item",
        { opacity: 1, y: 0, scale: 1 },
        { duration: 0 }
      );
    }
  }, [displayCards.length, animate, scope, reducedMotion]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-slate-600 border-t-violet-500 rounded-full mr-3"
        />
        <span className="text-slate-400">Loading cards...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <AlertCircle className="w-8 h-8 text-orange-400 mr-3" />
        <div className="text-center">
          <p className="text-slate-400 mb-2">API currently unavailable</p>
          <p className="text-xs text-slate-500">Cards will appear once the backend is running</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!cards.length) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-slate-400 mb-2">No cards found</p>
          <p className="text-xs text-slate-500">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={scope} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {displayCards.map((card, index) => (
          <CardItem
            key={card.id}
            card={card}
            index={index}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>

      {/* Load more sentinel for infinite scroll */}
      {visibleCount < cards.length && (
        <div
          id="load-more-sentinel"
          className="h-10 flex items-center justify-center text-slate-400"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-slate-600 border-t-violet-500 rounded-full"
          />
          <span className="ml-2 text-sm">Loading more cards...</span>
        </div>
      )}
    </div>
  );
};

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

  // Build search query from filters
  const searchQuery = useMemo(() => {
    let query = searchTerm.trim();

    // Add color filters to search query
    if (activeColors.length > 0) {
      const colorQuery = activeColors.map(color => {
        const colorMap = { W: 'white', U: 'blue', B: 'black', R: 'red', G: 'green', C: 'colorless' };
        return `c:${colorMap[color] || color.toLowerCase()}`;
      }).join(' OR ');
      query = query ? `${query} (${colorQuery})` : `(${colorQuery})`;
    }

    return query;
  }, [searchTerm, activeColors]);

  // Use API hooks
  const searchQuery_enabled = Boolean(searchQuery);
  const {
    data: searchResults = [],
    isLoading: isSearchLoading,
    error: searchError
  } = useCardsSearch({
    q: searchQuery,
    limit: 60
  });

  const {
    data: defaultCollection = [],
    isLoading: isDefaultLoading,
    error: defaultError
  } = useDefaultCollection();

  // Choose which data to use
  const apiCards = searchQuery_enabled ? searchResults : defaultCollection;
  const isLoading = searchQuery_enabled ? isSearchLoading : isDefaultLoading;
  const error = searchQuery_enabled ? searchError : defaultError;

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

  // Apply client-side filters and sorting to API results
  const filteredCards = useMemo(() => {
    if (!apiCards.length) return [];

    let cards = apiCards.filter(card => {
      // Rarity filter (colors and search are handled by API query)
      if (rarity !== 'Any Rarity') {
        if (card.rarity !== rarity.toLowerCase()) return false;
      }

      // Price range filter
      if (priceRange !== 'Any Price') {
        const price = parseFloat(card.prices.usd);
        switch (priceRange) {
          case '$0-5': return price <= 5;
          case '$5-25': return price > 5 && price <= 25;
          case '$25+': return price > 25;
          default: return true;
        }
      }

      return true;
    });

    // Sort cards
    if (sortBy !== 'Name (A-Z)') {
      cards = [...cards].sort((a, b) => {
        switch (sortBy) {
          case 'Price (Low-High)':
            return parseFloat(a.prices.usd) - parseFloat(b.prices.usd);
          case 'Price (High-Low)':
            return parseFloat(b.prices.usd) - parseFloat(a.prices.usd);
          case 'CMC (Low-High)':
            return a.cmc - b.cmc;
          default:
            return a.name.localeCompare(b.name);
        }
      });
    }

    return cards;
  }, [apiCards, rarity, priceRange, sortBy]);

  // Calculate result counts
  const totalCards = filteredCards.length;

  const resultCount = { showing: filteredCards.length, total: totalCards };

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

  return (
    <CardGrid
      cards={filteredCards}
      variant={variant}
      isLoading={isLoading}
      error={error}
    />
  );
};