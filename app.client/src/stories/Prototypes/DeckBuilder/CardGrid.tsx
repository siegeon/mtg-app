import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MtgCard } from './MtgCard';
import type { MtgCard as CardType } from './mockData';
import { mockCards } from './mockData';
import { DURATIONS, EASINGS } from '../../../lib/motion';

interface CardGridProps {
  cards?: CardType[];
  onCardClick?: (card: CardType) => void;
  className?: string;
}

export function CardGrid({
  cards = mockCards,
  onCardClick,
  className = ''
}: CardGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'cmc' | 'price'>('name');

  // Filter and sort cards
  const filteredAndSortedCards = useMemo(() => {
    let filtered = cards.filter(card =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.type_line.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.oracle_text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort cards
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'cmc':
          return a.cmc - b.cmc;
        case 'price':
          return parseFloat(b.prices.usd) - parseFloat(a.prices.usd);
        default:
          return 0;
      }
    });

    return filtered;
  }, [cards, searchTerm, sortBy]);

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06, // 60ms stagger as specified
        delayChildren: 0.1,
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: DURATIONS.state,
        ease: EASINGS.easeOut
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: {
        duration: DURATIONS.micro,
        ease: EASINGS.easeIn
      }
    }
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header Controls */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATIONS.state }}
      >
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <motion.div
            className="relative flex-1 max-w-md"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: DURATIONS.micro }}
          >
            <input
              type="text"
              placeholder="Search cards by name, type, or text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg
                text-white placeholder-gray-400 focus:outline-none focus:ring-2
                focus:ring-blue-500 focus:border-transparent
                transition-all duration-200
              "
            />
            {searchTerm && (
              <motion.button
                onClick={() => setSearchTerm('')}
                className="
                  absolute right-3 top-1/2 transform -translate-y-1/2
                  text-gray-400 hover:text-white transition-colors
                "
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            )}
          </motion.div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3">
            <span className="text-gray-300 text-sm">Sort by:</span>
            <motion.select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'cmc' | 'price')}
              className="
                bg-gray-800 border border-gray-600 rounded-lg px-3 py-2
                text-white focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              whileFocus={{ scale: 1.02 }}
            >
              <option value="name">Name</option>
              <option value="cmc">Mana Cost</option>
              <option value="price">Price</option>
            </motion.select>
          </div>
        </div>

        {/* Results Count */}
        <motion.div
          className="text-gray-400 text-sm"
          key={filteredAndSortedCards.length} // Re-animate when count changes
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATIONS.micro }}
        >
          Showing {filteredAndSortedCards.length} of {cards.length} cards
          {searchTerm && (
            <span className="ml-2 text-blue-400">
              for "{searchTerm}"
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Card Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${searchTerm}-${sortBy}`} // Re-render when search or sort changes
          className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
            gap-6 justify-items-center
          "
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {filteredAndSortedCards.length === 0 ? (
            <motion.div
              className="col-span-full text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: DURATIONS.state }}
            >
              <div className="text-gray-400 space-y-2">
                <div className="text-6xl">🔍</div>
                <h3 className="text-lg font-semibold">No cards found</h3>
                <p className="text-sm">
                  Try adjusting your search terms or browse all cards
                </p>
              </div>
            </motion.div>
          ) : (
            filteredAndSortedCards.map((card, index) => (
              <motion.div
                key={`${card.name}-${index}`}
                variants={cardVariants}
                layout
                whileHover={{
                  scale: 1.02,
                  zIndex: 10,
                  transition: { duration: DURATIONS.micro }
                }}
              >
                <MtgCard
                  card={card}
                  onClick={() => onCardClick?.(card)}
                  className="w-full max-w-xs"
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Quick Stats Footer */}
      {filteredAndSortedCards.length > 0 && (
        <motion.div
          className="
            flex flex-wrap gap-4 justify-center items-center
            bg-gray-800/50 rounded-lg p-4 text-sm text-gray-300
          "
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: DURATIONS.state }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Red: {filteredAndSortedCards.filter(c => c.colors?.includes('R')).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Blue: {filteredAndSortedCards.filter(c => c.colors?.includes('U')).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Green: {filteredAndSortedCards.filter(c => c.colors?.includes('G')).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 rounded-full"></div>
            <span>White: {filteredAndSortedCards.filter(c => c.colors?.includes('W')).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-800 border border-gray-500 rounded-full"></div>
            <span>Black: {filteredAndSortedCards.filter(c => c.colors?.includes('B')).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Colorless: {filteredAndSortedCards.filter(c => !c.colors?.length).length}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default CardGrid;