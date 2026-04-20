import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Grid,
  List,
  Package,
  Star
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { DURATIONS, EASINGS, useAnimationVariants } from '../../lib/motion';
import {
  mockCollection,
  filterOptions,
  getRarityColor,
  filterCollection,
  type CollectionCard,
  type FilterOption
} from './mockCollectionData';

interface HoveredCardState {
  card: CollectionCard;
  position: { x: number; y: number };
}

interface FilterPillProps {
  filter: FilterOption;
  isActive: boolean;
  onClick: () => void;
}

const FilterPill: React.FC<FilterPillProps> = ({ filter, isActive, onClick }) => {
  return (
    <motion.button
      className={cn(
        'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150',
        'border flex items-center gap-2',
        isActive
          ? 'bg-violet-500 border-violet-500 text-white'
          : 'bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/70 hover:border-slate-500'
      )}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {filter.color && (
        <div
          className="w-3 h-3 rounded-full border border-black/20"
          style={{ backgroundColor: filter.color }}
        />
      )}
      <span>{filter.label}</span>
      <span className="text-xs opacity-70">({filter.count})</span>
    </motion.button>
  );
};

interface CardGridItemProps {
  card: CollectionCard;
  isSelected: boolean;
  onClick: () => void;
  onCardHover: (card: CollectionCard, element: HTMLElement) => void;
  onCardLeave: () => void;
}

const CardGridItem: React.FC<CardGridItemProps> = ({
  card,
  isSelected,
  onClick,
  onCardHover,
  onCardLeave
}) => {
  const { card: cardVariants, transition } = useAnimationVariants();
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      onCardHover(card, cardRef.current);
    }
  };

  const totalValue = (parseFloat(card.prices.usd) * card.quantity).toFixed(2);
  const isExpensive = parseFloat(card.prices.usd) >= 50;

  return (
    <motion.button
      ref={cardRef}
      className={cn(
        'bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-left transition-all duration-150',
        'hover:bg-slate-700/70 hover:border-slate-600',
        isSelected && 'bg-violet-500/10 border-violet-500/50'
      )}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onCardLeave}
      variants={cardVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      transition={transition}
    >
      {/* Card Image Placeholder */}
      <div className="w-full aspect-[0.715] bg-slate-700 rounded-md mb-3 overflow-hidden">
        <img
          src={card.image_uris.small}
          alt={card.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Card Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-white text-sm leading-tight hover:text-violet-300 transition-colors">
            {card.name}
          </h3>
          {isExpensive && (
            <Star size={12} className="text-yellow-400 flex-shrink-0 ml-1 mt-0.5" />
          )}
        </div>

        <div className="text-xs text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span>{card.set_code.toUpperCase()}</span>
            <span
              className="font-semibold"
              style={{ color: getRarityColor(card.rarity) }}
            >
              {card.rarity.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono">×{card.quantity}</span>
            <div className="text-right">
              <div className="text-green-400 font-semibold">${card.prices.usd}</div>
              {card.quantity > 1 && (
                <div className="text-green-300 text-[10px] font-mono">
                  = ${totalValue}
                </div>
              )}
            </div>
          </div>

          {card.foil_quantity && (
            <div className="text-yellow-400 text-[10px]">
              ✨ {card.foil_quantity} foil
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
};

const CardDetail: React.FC<{
  card: CollectionCard | null;
}> = ({ card }) => {
  if (!card) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <Package className="mx-auto text-slate-600" size={48} />
          <div>
            <h3 className="text-lg font-medium text-slate-400">Select a Card</h3>
            <p className="text-sm text-slate-500 mt-1">
              Choose a card to see detailed information
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalValue = parseFloat(card.prices.usd) * card.quantity;
  const foilValue = card.foil_quantity ? parseFloat(card.prices.usd) * card.foil_quantity * 1.5 : 0;

  return (
    <div className="h-full flex flex-col">
      {/* Card Image */}
      <div className="p-6">
        <div className="w-full max-w-sm mx-auto aspect-[0.715] bg-slate-700 rounded-lg overflow-hidden">
          <img
            src={card.image_uris.normal}
            alt={card.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Card Details */}
      <div className="flex-1 px-6 pb-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">{card.name}</h2>
          <p className="text-slate-400">{card.type_line}</p>
        </div>

        <div className="space-y-3">
          {/* Mana Cost */}
          {card.mana_cost && (
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-1">Mana Cost</h4>
              <div className="text-slate-400 font-mono">{card.mana_cost}</div>
            </div>
          )}

          {/* Oracle Text */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-1">Oracle Text</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              {card.oracle_text}
            </p>
          </div>

          {/* Set Info */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-1">Set</h4>
            <div className="text-slate-400 text-sm">
              {card.set_name} ({card.set_code.toUpperCase()})
            </div>
            <div
              className="text-sm font-semibold mt-1"
              style={{ color: getRarityColor(card.rarity) }}
            >
              {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
            </div>
          </div>

          {/* Ownership & Value */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Collection</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Regular copies:</span>
                <span className="font-semibold text-white">×{card.quantity}</span>
              </div>
              {card.foil_quantity && (
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">✨ Foil copies:</span>
                  <span className="font-semibold text-yellow-400">×{card.foil_quantity}</span>
                </div>
              )}
              <div className="border-t border-slate-700 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Unit price:</span>
                  <span className="font-semibold text-green-400">${card.prices.usd}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total value:</span>
                  <span className="font-bold text-green-400">
                    ${(totalValue + foilValue).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {card.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-2">
          <motion.button
            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-150"
            whileHover={{ y: -1, boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            Add to Deck
          </motion.button>
          <button className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2 px-4 rounded-md transition-colors">
            View Price History
          </button>
        </div>
      </div>
    </div>
  );
};

export const CollectionView: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(mockCollection[0]);
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredCard, setHoveredCard] = useState<HoveredCardState | null>(null);

  const handleFilterToggle = (filterId: string) => {
    if (filterId === 'all') {
      setActiveFilters(['all']);
      return;
    }

    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters.filter(f => f !== 'all'), filterId];

    setActiveFilters(newFilters.length === 0 ? ['all'] : newFilters);
  };

  const filteredCards = filterCollection(mockCollection, activeFilters).filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.type_line.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardHover = (card: CollectionCard, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const position = {
      x: rect.right + 20,
      y: rect.top - 50
    };

    setHoveredCard({ card, position });
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const collectionValue = mockCollection.reduce((sum, card) => {
    const regular = parseFloat(card.prices.usd) * card.quantity;
    const foil = card.foil_quantity ? parseFloat(card.prices.usd) * card.foil_quantity * 1.5 : 0;
    return sum + regular + foil;
  }, 0);

  return (
    <div className="relative h-screen bg-slate-950 text-white overflow-hidden">
      {/* Main Layout */}
      <div className="grid grid-cols-[1fr_400px] h-full">
        {/* Left Column - Collection Grid */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">My Collection</h1>
                <p className="text-slate-400">
                  {mockCollection.length} cards • ${collectionValue.toFixed(0)} total value
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded transition-colors',
                    viewMode === 'grid' ? 'bg-violet-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  )}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded transition-colors',
                    viewMode === 'list' ? 'bg-violet-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  )}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search your collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-md pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((filter) => (
                <FilterPill
                  key={filter.id}
                  filter={filter}
                  isActive={activeFilters.includes(filter.id)}
                  onClick={() => handleFilterToggle(filter.id)}
                />
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="flex-1 overflow-auto p-6">
            <motion.div
              className="grid grid-cols-6 gap-4"
              layout
              transition={{ duration: DURATIONS.state, ease: EASINGS.easeOut }}
            >
              <AnimatePresence mode="popLayout">
                {filteredCards.map((card) => (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: DURATIONS.micro }}
                  >
                    <CardGridItem
                      card={card}
                      isSelected={selectedCard?.id === card.id}
                      onClick={() => setSelectedCard(card)}
                      onCardHover={handleCardHover}
                      onCardLeave={handleCardLeave}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Card Detail */}
        <div className="bg-slate-900/50 border-l border-gray-700/50">
          <CardDetail card={selectedCard} />
        </div>
      </div>

      {/* Card Hover Preview */}
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
              duration: DURATIONS.immediate,
              ease: EASINGS.easeOut
            }}
          >
            <motion.div
              className="bg-slate-800 rounded-lg p-2 shadow-2xl border border-slate-600"
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
              <div className="mt-2 p-2 text-sm">
                <div className="font-semibold text-white">{hoveredCard.card.name}</div>
                <div className="text-slate-400">{hoveredCard.card.type_line}</div>
                <div className="flex justify-between mt-1">
                  <span className="text-green-400 font-bold">${hoveredCard.card.prices.usd}</span>
                  <span className="text-slate-400">×{hoveredCard.card.quantity}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};