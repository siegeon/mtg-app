import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CardGrid } from './CardGrid';
import { DeckZone } from './DeckZone';
import type { MtgCard as CardType } from './mockData';
import { mockCards } from './mockData';
import { useAnimationVariants, DURATIONS, EASINGS } from '../../../lib/motion';

interface DeckCard {
  card: CardType;
  quantity: number;
  id: string;
}

interface DeckBuilderPrototypeProps {
  className?: string;
}

export function DeckBuilderPrototype({ className = '' }: DeckBuilderPrototypeProps) {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Deck state
  const [mainboard, setMainboard] = useState<DeckCard[]>([]);
  const [sideboard, setSideboard] = useState<DeckCard[]>([]);
  const [deckName, setDeckName] = useState("My Deck");

  // Animation variants with reduced motion support
  const { shouldReduceMotion, transition } = useAnimationVariants();

  // Add card to deck with spring animation
  const handleCardClick = useCallback((card: CardType) => {
    const existingCard = mainboard.find(item => item.card.name === card.name);

    if (existingCard) {
      // Increase quantity if less than 4
      if (existingCard.quantity < 4) {
        setMainboard(prev => prev.map(item =>
          item.id === existingCard.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      // Add new card
      const newCard: DeckCard = {
        card,
        quantity: 1,
        id: `${card.name}-${Date.now()}` // Simple ID generation
      };
      setMainboard(prev => [...prev, newCard]);
    }
  }, [mainboard]);

  // Remove card from deck
  const handleRemoveCard = useCallback((cardId: string, zone: 'mainboard' | 'sideboard') => {
    if (zone === 'mainboard') {
      setMainboard(prev => prev.filter(item => item.id !== cardId));
    } else {
      setSideboard(prev => prev.filter(item => item.id !== cardId));
    }
  }, []);

  // Change card quantity
  const handleQuantityChange = useCallback((cardId: string, newQuantity: number, zone: 'mainboard' | 'sideboard') => {
    const updateZone = zone === 'mainboard' ? setMainboard : setSideboard;

    updateZone(prev => prev.map(item =>
      item.id === cardId ? { ...item, quantity: newQuantity } : item
    ));
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const themeClasses = isDarkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gray-50 text-gray-900';

  return (
    <motion.div
      className={`min-h-screen transition-colors duration-300 ${themeClasses} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : DURATIONS.state }}
    >
      {/* Header */}
      <motion.header
        className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-900/95' : 'border-gray-200 bg-white/95'} backdrop-blur-sm sticky top-0 z-10`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : DURATIONS.state, ease: EASINGS.easeOut }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              transition={{ duration: DURATIONS.micro }}
            >
              <div className="text-2xl">⚡</div>
              <div>
                <h1 className="text-xl font-bold">MTG Deck Builder</h1>
                <p className="text-xs text-gray-500">Video-Game Quality Prototype</p>
              </div>
            </motion.div>

            {/* Header Controls */}
            <div className="flex items-center space-x-4">
              {/* Deck Name Input */}
              <motion.input
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className={`
                  px-3 py-1 rounded-lg border font-medium text-sm
                  ${isDarkMode
                    ? 'bg-gray-800 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                  }
                  focus:outline-none focus:ring-2 transition-all
                `}
                placeholder="Deck name..."
                whileFocus={shouldReduceMotion ? {} : { scale: 1.02 }}
              />

              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className={`
                  p-2 rounded-lg border transition-all duration-200
                  ${isDarkMode
                    ? 'border-gray-600 hover:bg-gray-800 text-gray-300 hover:text-white'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                  }
                `}
                whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <motion.div
                  animate={{ rotate: isDarkMode ? 0 : 180 }}
                  transition={{ duration: shouldReduceMotion ? 0 : DURATIONS.state }}
                >
                  {isDarkMode ? '🌙' : '☀️'}
                </motion.div>
              </motion.button>

              {/* Reduced Motion Indicator */}
              {shouldReduceMotion && (
                <motion.div
                  className="text-xs text-gray-500 flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span>🎯</span>
                  <span>Reduced Motion</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Layout */}
      <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: shouldReduceMotion ? 0 : 0.2,
          duration: shouldReduceMotion ? 0 : DURATIONS.state
        }}
      >
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Card Grid - 2/3 width on xl+ screens */}
          <motion.div
            className="xl:col-span-2"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.3,
              duration: shouldReduceMotion ? 0 : DURATIONS.state
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Available Cards</h2>
                <div className="text-sm text-gray-500">
                  Click cards to add to deck
                </div>
              </div>

              <CardGrid
                cards={mockCards}
                onCardClick={handleCardClick}
                className={isDarkMode ? '' : 'text-gray-900'}
              />
            </div>
          </motion.div>

          {/* Deck Zone - 1/3 width on xl+ screens */}
          <motion.div
            className="xl:col-span-1"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.4,
              duration: shouldReduceMotion ? 0 : DURATIONS.state
            }}
          >
            <div className="sticky top-24">
              <DeckZone
                deckName={deckName}
                mainboard={mainboard}
                sideboard={sideboard}
                onRemoveCard={handleRemoveCard}
                onQuantityChange={handleQuantityChange}
                className={isDarkMode ? '' : 'bg-white border-gray-200 text-gray-900'}
              />

              {/* Quick Stats */}
              <motion.div
                className={`
                  mt-4 p-4 rounded-lg border text-sm
                  ${isDarkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-200'
                  }
                `}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.6,
                  duration: shouldReduceMotion ? 0 : DURATIONS.state
                }}
              >
                <h4 className="font-semibold mb-2">Deck Stats</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Total Cards:</span>
                    <span>{mainboard.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unique Cards:</span>
                    <span>{mainboard.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. CMC:</span>
                    <span>
                      {mainboard.length > 0
                        ? (mainboard.reduce((sum, item) => sum + (item.card.cmc * item.quantity), 0) /
                           mainboard.reduce((sum, item) => sum + item.quantity, 0)).toFixed(1)
                        : '0.0'
                      }
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.main>

      {/* Floating Add Indicator */}
      <AnimatePresence>
        {mainboard.length === 0 && (
          <motion.div
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: shouldReduceMotion ? 0 : DURATIONS.state }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👆</span>
              <div className="text-sm">
                <div className="font-medium">Get Started</div>
                <div className="text-blue-100">Click any card to add to deck</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default DeckBuilderPrototype;