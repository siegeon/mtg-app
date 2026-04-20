import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { MtgCard as CardType } from './mockData';
import { DURATIONS, EASINGS, springConfig } from '../../../lib/motion';

interface DeckCard {
  card: CardType;
  quantity: number;
  id: string; // For React keys and animations
}

interface DeckZoneProps {
  deckName?: string;
  mainboard?: DeckCard[];
  sideboard?: DeckCard[];
  onRemoveCard?: (cardId: string, zone: 'mainboard' | 'sideboard') => void;
  onQuantityChange?: (cardId: string, newQuantity: number, zone: 'mainboard' | 'sideboard') => void;
  className?: string;
}

export function DeckZone({
  deckName = "My Deck",
  mainboard = [],
  sideboard = [],
  onRemoveCard,
  onQuantityChange,
  className = ''
}: DeckZoneProps) {
  const [activeTab, setActiveTab] = useState<'mainboard' | 'sideboard'>('mainboard');

  // Calculate deck stats
  const mainboardCount = mainboard.reduce((sum, item) => sum + item.quantity, 0);
  const sideboardCount = sideboard.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = mainboard.reduce((sum, item) =>
    sum + (item.quantity * parseFloat(item.card.prices.usd)), 0
  );

  // Mana curve data (0-7+ CMC)
  const manaCurve = Array.from({ length: 8 }, (_, cmc) => {
    const count = mainboard
      .filter(item => cmc === 7 ? item.card.cmc >= 7 : item.card.cmc === cmc)
      .reduce((sum, item) => sum + item.quantity, 0);
    return { cmc: cmc === 7 ? '7+' : cmc.toString(), count };
  });

  const maxCurveCount = Math.max(...manaCurve.map(c => c.count), 1);

  // Animation variants
  const cardListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      }
    }
  };

  const cardItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { ...springConfig, duration: DURATIONS.state }
    },
    exit: {
      opacity: 0,
      x: 20,
      scale: 0.95,
      transition: { duration: DURATIONS.micro, ease: EASINGS.easeIn }
    }
  };

  const activeCards = activeTab === 'mainboard' ? mainboard : sideboard;
  const activeCount = activeTab === 'mainboard' ? mainboardCount : sideboardCount;

  return (
    <div className={`bg-gray-900 rounded-lg border border-gray-700 p-6 space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATIONS.state }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{deckName}</h2>
          <div className="text-sm text-gray-400">
            ${totalValue.toFixed(2)}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          {(['mainboard', 'sideboard'] as const).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                relative flex-1 py-2 px-4 text-sm font-medium rounded-md
                transition-colors duration-200
                ${activeTab === tab
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeTab === tab && (
                <motion.div
                  className="absolute inset-0 bg-blue-600 rounded-md"
                  layoutId="activeTab"
                  transition={springConfig}
                />
              )}
              <span className="relative">
                {tab === 'mainboard' ? 'Mainboard' : 'Sideboard'}
                <span className="ml-2 text-xs">
                  ({tab === 'mainboard' ? mainboardCount : sideboardCount})
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Mana Curve */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: DURATIONS.state }}
      >
        <h3 className="text-lg font-semibold text-white">Mana Curve</h3>
        <div className="grid grid-cols-8 gap-2 h-24">
          {manaCurve.map((item, index) => (
            <motion.div
              key={item.cmc}
              className="flex flex-col items-center justify-end space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{
                delay: 0.3 + (index * 0.1),
                duration: DURATIONS.state,
                ...springConfig
              }}
            >
              <motion.div
                className="w-full bg-blue-500 rounded-t min-h-1"
                style={{
                  height: `${(item.count / maxCurveCount) * 64}px`,
                  opacity: item.count > 0 ? 1 : 0.3
                }}
                whileHover={{
                  backgroundColor: '#3b82f6',
                  scale: 1.1,
                  transition: { duration: DURATIONS.micro }
                }}
              />
              <div className="text-xs text-gray-400 font-medium">{item.cmc}</div>
              <div className="text-xs text-white font-bold">{item.count}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Card List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {activeTab === 'mainboard' ? 'Mainboard' : 'Sideboard'} Cards
          </h3>
          <span className="text-sm text-gray-400">
            {activeCount}/60 cards
          </span>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={cardListVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-2"
            >
              {activeCards.length === 0 ? (
                <motion.div
                  className="text-center py-8 text-gray-500"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: DURATIONS.state }}
                >
                  <div className="space-y-2">
                    <div className="text-4xl">🃏</div>
                    <p>No cards in {activeTab}</p>
                    <p className="text-sm">Add cards from the grid to get started</p>
                  </div>
                </motion.div>
              ) : (
                activeCards.map((deckCard) => (
                  <motion.div
                    key={deckCard.id}
                    variants={cardItemVariants}
                    layout
                    className="
                      bg-gray-800 rounded-lg p-3 border border-gray-700
                      hover:border-gray-500 transition-colors group
                    "
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: '#374151',
                      transition: { duration: DURATIONS.micro }
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Card Image */}
                      <motion.div
                        className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: DURATIONS.micro }}
                      >
                        <img
                          src={deckCard.card.image_uris.normal}
                          alt={deckCard.card.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>

                      {/* Card Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">
                          {deckCard.card.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <span>{deckCard.card.mana_cost}</span>
                          <span>•</span>
                          <span>{deckCard.card.type_line}</span>
                          <span>•</span>
                          <span>${deckCard.card.prices.usd}</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => {
                            const newQuantity = Math.max(0, deckCard.quantity - 1);
                            if (newQuantity === 0) {
                              onRemoveCard?.(deckCard.id, activeTab);
                            } else {
                              onQuantityChange?.(deckCard.id, newQuantity, activeTab);
                            }
                          }}
                          className="
                            w-7 h-7 rounded-full bg-red-600 hover:bg-red-500
                            text-white text-sm font-bold
                            flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-all
                          "
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          −
                        </motion.button>

                        <motion.div
                          className="
                            w-8 h-8 rounded-lg bg-gray-700 border border-gray-600
                            text-white text-sm font-bold
                            flex items-center justify-center
                          "
                          key={deckCard.quantity}
                          initial={{ scale: 1.2, color: '#3b82f6' }}
                          animate={{ scale: 1, color: '#ffffff' }}
                          transition={{ duration: DURATIONS.micro, ...springConfig }}
                        >
                          {deckCard.quantity}
                        </motion.div>

                        <motion.button
                          onClick={() => {
                            if (deckCard.quantity < 4) {
                              onQuantityChange?.(deckCard.id, deckCard.quantity + 1, activeTab);
                            }
                          }}
                          className="
                            w-7 h-7 rounded-full bg-green-600 hover:bg-green-500
                            text-white text-sm font-bold
                            flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-all
                            disabled:opacity-50 disabled:cursor-not-allowed
                          "
                          disabled={deckCard.quantity >= 4}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default DeckZone;