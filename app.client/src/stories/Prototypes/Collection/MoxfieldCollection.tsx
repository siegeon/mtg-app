import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { mockCollection, collectionStats, filterOptions, type CollectionCard } from './mockCollectionData';
import { DURATIONS, EASINGS } from '../../../lib/motion';

interface HoveredCardState {
  card: CollectionCard;
  position: { x: number; y: number };
}

interface FilterState {
  search: string;
  colors: string[];
  rarities: string[];
  types: string[];
  sets: string[];
  priceRange: { min: number; max: number } | null;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'price' | 'rarity' | 'quantity' | 'set';
type SortOrder = 'asc' | 'desc';

interface CardGridItemProps {
  card: CollectionCard;
  onCardHover: (card: CollectionCard, element: HTMLElement) => void;
  onCardLeave: () => void;
}

function CardGridItem({ card, onCardHover, onCardLeave }: CardGridItemProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      onCardHover(card, cardRef.current);
    }
  };

  const handleFocus = () => {
    if (cardRef.current) {
      onCardHover(card, cardRef.current);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-600/50';
      case 'uncommon': return 'border-gray-400/40';
      case 'rare': return 'border-yellow-500/60';
      case 'mythic': return 'border-orange-500/60';
      default: return 'border-gray-600/50';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative bg-[#2a2a2a] rounded overflow-hidden cursor-pointer group border ${getRarityColor(card.rarity)}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onCardLeave}
      onFocus={handleFocus}
      onBlur={onCardLeave}
      tabIndex={0}
      whileHover={{
        scale: 1.03,
        y: -2,
        transition: { duration: DURATIONS.immediate, ease: EASINGS.easeOut }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: DURATIONS.immediate }
      }}
    >
      {/* Card Image */}
      <div className="aspect-[5/7] overflow-hidden">
        <motion.img
          src={card.image_uris.normal}
          alt={card.name}
          className="w-full h-full object-cover"
          loading="lazy"
          animate={{
            scale: 1,
          }}
          whileHover={{
            scale: 1.1,
            transition: { duration: DURATIONS.state }
          }}
        />
      </div>

      {/* Card Info Overlay */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATIONS.micro }}
      >
        <div className="text-white text-sm font-semibold truncate">{card.name}</div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-gray-300 text-xs">x{card.quantity}</span>
          <span className="text-green-400 text-xs font-bold">${card.prices.usd}</span>
        </div>
      </motion.div>

      {/* Quantity Badge */}
      {card.quantity > 1 && (
        <motion.div
          className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
          animate={{
            scale: 1,
          }}
          whileHover={{
            scale: 1.2,
            transition: { duration: DURATIONS.micro }
          }}
        >
          {card.quantity}
        </motion.div>
      )}
    </motion.div>
  );
}

interface CardListItemProps {
  card: CollectionCard;
  onCardHover: (card: CollectionCard, element: HTMLElement) => void;
  onCardLeave: () => void;
}

function CardListItem({ card, onCardHover, onCardLeave }: CardListItemProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      onCardHover(card, cardRef.current);
    }
  };

  const handleFocus = () => {
    if (cardRef.current) {
      onCardHover(card, cardRef.current);
    }
  };

  const formatManaCost = (manaCost: string) => {
    if (!manaCost) return '';
    return manaCost.replace(/[{}]/g, '');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-silver-400';
      case 'rare': return 'text-yellow-400';
      case 'mythic': return 'text-orange-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer group transition-colors"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onCardLeave}
      onFocus={handleFocus}
      onBlur={onCardLeave}
      tabIndex={0}
      whileHover={{
        x: 4,
        transition: { duration: DURATIONS.micro, ease: EASINGS.easeOut }
      }}
    >
      {/* Small Card Image */}
      <div className="w-12 h-17 bg-gray-700 rounded overflow-hidden flex-shrink-0">
        <img
          src={card.image_uris.normal}
          alt={card.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Card Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-white font-semibold truncate group-hover:text-blue-300 group-focus:text-blue-300">
            {card.name}
          </span>
          {card.mana_cost && (
            <span className="text-gray-400 text-sm font-mono flex-shrink-0">
              {formatManaCost(card.mana_cost)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400 truncate">{card.type_line}</span>
          <span className={`${getRarityColor(card.rarity)} capitalize`}>
            {card.rarity}
          </span>
          <span className="text-gray-500 truncate">{card.set_name}</span>
        </div>
      </div>

      {/* Quantity and Price */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-gray-400 text-sm font-mono">x{card.quantity}</span>
        <span className="text-green-400 text-sm font-bold">${card.prices.usd}</span>
      </div>
    </motion.div>
  );
}

export function MoxfieldCollection() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [hoveredCard, setHoveredCard] = useState<HoveredCardState | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    colors: [],
    rarities: [],
    types: [],
    sets: [],
    priceRange: null
  });

  // Filter and sort cards
  const filteredAndSortedCards = useMemo(() => {
    let filtered = mockCollection.filter(card => {
      // Search filter
      if (filters.search && !card.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Color filter
      if (filters.colors.length > 0) {
        const hasMatchingColor = filters.colors.some(color =>
          card.colors?.includes(color) || (color === 'C' && (!card.colors || card.colors.length === 0))
        );
        if (!hasMatchingColor) return false;
      }

      // Rarity filter
      if (filters.rarities.length > 0 && !filters.rarities.includes(card.rarity)) {
        return false;
      }

      // Type filter
      if (filters.types.length > 0) {
        const hasMatchingType = filters.types.some(type =>
          card.type_line.includes(type)
        );
        if (!hasMatchingType) return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const price = parseFloat(card.prices.usd);
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false;
        }
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'price':
          compareValue = parseFloat(a.prices.usd) - parseFloat(b.prices.usd);
          break;
        case 'quantity':
          compareValue = a.quantity - b.quantity;
          break;
        case 'rarity':
          const rarityOrder = { common: 0, uncommon: 1, rare: 2, mythic: 3 };
          compareValue = rarityOrder[a.rarity] - rarityOrder[b.rarity];
          break;
        case 'set':
          compareValue = a.set_name.localeCompare(b.set_name);
          break;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  }, [filters, sortBy, sortOrder]);

  const handleCardHover = (card: CollectionCard, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    // Position card preview to the right of the element
    const position = {
      x: rect.right + 20,
      y: rect.top - 50
    };

    setHoveredCard({ card, position });
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const toggleFilter = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentFilter = prev[filterType] as string[];
      if (currentFilter.includes(value)) {
        return {
          ...prev,
          [filterType]: currentFilter.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentFilter, value]
        };
      }
    });
  };

  return (
    <div className="relative bg-[#1a1a1a] min-h-screen text-white">
      <div className="flex">
        {/* Filter Sidebar */}
        <div className="w-80 bg-[#2a2a2a] border-r border-gray-700 p-4 space-y-4 max-h-screen overflow-y-auto">
          <h2 className="text-2xl font-bold">Collection</h2>

          {/* Collection Stats */}
          <div className="bg-[#333333] border border-gray-600 rounded p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Cards:</span>
              <span className="font-semibold">{collectionStats.totalCards}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Unique Cards:</span>
              <span className="font-semibold">{collectionStats.uniqueCards}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Value:</span>
              <span className="font-semibold text-green-400">${collectionStats.totalValue.toFixed(2)}</span>
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-semibold mb-2">Search</label>
            <input
              type="text"
              placeholder="Search cards..."
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2">Colors</label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.colors.map(color => (
                <motion.button
                  key={color}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                    filters.colors.includes(color)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => toggleFilter('colors', color)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {color}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Rarity Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2">Rarity</label>
            <div className="space-y-1">
              {filterOptions.rarities.map(rarity => (
                <label key={rarity} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="text-blue-600"
                    checked={filters.rarities.includes(rarity)}
                    onChange={() => toggleFilter('rarities', rarity)}
                  />
                  <span className="capitalize text-sm">{rarity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2">Price Range</label>
            <div className="space-y-1">
              {filterOptions.priceRanges.map((range, index) => (
                <label key={index} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    className="text-blue-600"
                    checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
                    onChange={() => setFilters(prev => ({ ...prev, priceRange: range }))}
                  />
                  <span className="text-sm">{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Header Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">
                Cards ({filteredAndSortedCards.length})
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Controls */}
              <select
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [SortBy, SortOrder];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-desc">Price (High-Low)</option>
                <option value="price-asc">Price (Low-High)</option>
                <option value="quantity-desc">Quantity (High-Low)</option>
                <option value="rarity-desc">Rarity (Mythic-Common)</option>
              </select>

              {/* View Toggle */}
              <div className="flex rounded-lg overflow-hidden border border-gray-600">
                <motion.button
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => setViewMode('grid')}
                  whileHover={{ backgroundColor: viewMode === 'grid' ? undefined : '#374151' }}
                >
                  Grid
                </motion.button>
                <motion.button
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => setViewMode('list')}
                  whileHover={{ backgroundColor: viewMode === 'list' ? undefined : '#374151' }}
                >
                  List
                </motion.button>
              </div>
            </div>
          </div>

          {/* Cards Display */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATIONS.state }}
                className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2"
              >
                {filteredAndSortedCards.map((card, index) => (
                  <motion.div
                    key={`${card.name}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATIONS.micro, delay: index * 0.02 }}
                  >
                    <CardGridItem
                      card={card}
                      onCardHover={handleCardHover}
                      onCardLeave={handleCardLeave}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATIONS.state }}
                className="space-y-2"
              >
                {filteredAndSortedCards.map((card, index) => (
                  <motion.div
                    key={`${card.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: DURATIONS.micro, delay: index * 0.01 }}
                  >
                    <CardListItem
                      card={card}
                      onCardHover={handleCardHover}
                      onCardLeave={handleCardLeave}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card Preview - The Signature Animation */}
      <AnimatePresence>
        {hoveredCard && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            initial={{
              opacity: 0,
              scale: 0.8,
              x: hoveredCard.position.x,
              y: hoveredCard.position.y,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: hoveredCard.position.x,
              y: hoveredCard.position.y,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: { duration: DURATIONS.immediate }
            }}
            transition={{
              duration: DURATIONS.micro * 1.5,
              ease: EASINGS.easeOut
            }}
            style={{
              transform: `translate3d(${hoveredCard.position.x}px, ${hoveredCard.position.y}px, 0)`,
            }}
          >
            {/* Card Image Container */}
            <motion.div
              className="bg-gray-800 rounded-lg p-2 shadow-2xl border border-gray-600"
              initial={{ rotateY: -15 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: DURATIONS.micro, ease: EASINGS.easeOut }}
            >
              <img
                src={hoveredCard.card.image_uris.normal}
                alt={hoveredCard.card.name}
                className="w-48 rounded-md"
                loading="eager"
              />

              {/* Card Info */}
              <div className="mt-2 p-2 text-sm">
                <div className="font-semibold text-white">{hoveredCard.card.name}</div>
                <div className="text-gray-400">{hoveredCard.card.type_line}</div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-gray-500">{hoveredCard.card.set_name}</div>
                  <div className="text-green-400 font-bold">${hoveredCard.card.prices.usd}</div>
                </div>
                <div className="text-blue-400 text-xs mt-1">Qty: {hoveredCard.card.quantity}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MoxfieldCollection;