import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { mockCommander, mockDeckSections, deckTotals, type DeckCard, type DeckSection } from './mockDeckData';
import { DURATIONS, EASINGS } from '../../../lib/motion';

interface HoveredCardState {
  card: DeckCard;
  position: { x: number; y: number };
}

interface CardEntryProps {
  card: DeckCard;
  onCardHover: (card: DeckCard, element: HTMLElement) => void;
  onCardLeave: () => void;
}

function CardEntry({ card, onCardHover, onCardLeave }: CardEntryProps) {
  const cardRef = useRef<HTMLLIElement>(null);

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

  const renderManaSymbols = (manaCost: string) => {
    if (!manaCost) return null;
    const symbols = manaCost.match(/\{[^}]+\}/g) || [];

    return symbols.map((symbol, index) => {
      const cleanSymbol = symbol.replace(/[{}]/g, '');
      const getSymbolStyle = (sym: string) => {
        const baseStyle = 'inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold border border-gray-600 mr-1';
        switch(sym) {
          case 'W': return `${baseStyle} bg-yellow-100 text-black`;
          case 'U': return `${baseStyle} bg-blue-500 text-white`;
          case 'B': return `${baseStyle} bg-gray-900 text-white border-gray-400`;
          case 'R': return `${baseStyle} bg-red-500 text-white`;
          case 'G': return `${baseStyle} bg-green-500 text-white`;
          case 'C': return `${baseStyle} bg-gray-400 text-black`;
          default:
            // Numeric costs
            if (/^\d+$/.test(sym)) return `${baseStyle} bg-gray-500 text-white`;
            return `${baseStyle} bg-gray-600 text-white`;
        }
      };

      return (
        <span key={index} className={getSymbolStyle(cleanSymbol)}>
          {cleanSymbol}
        </span>
      );
    });
  };

  return (
    <motion.li
      ref={cardRef}
      className="flex items-center gap-2 py-0.5 px-1 rounded text-sm hover:bg-gray-750/40 cursor-pointer focus-within:bg-gray-750/40 group transition-colors"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onCardLeave}
      onFocus={handleFocus}
      onBlur={onCardLeave}
      tabIndex={0}
      whileHover={{
        x: 2,
        transition: { duration: DURATIONS.immediate, ease: EASINGS.easeOut }
      }}
    >
      {/* Quantity */}
      <span className="text-gray-400 text-xs w-5 flex-shrink-0 font-mono tabular-nums">
        {card.quantity}
      </span>

      {/* Card Name */}
      <span className="text-gray-200 hover:text-blue-300 transition-colors flex-1 group-focus:text-blue-300 font-medium">
        {card.name}
      </span>

      {/* Mana Cost */}
      {card.mana_cost && (
        <div className="flex items-center flex-shrink-0">
          {renderManaSymbols(card.mana_cost)}
        </div>
      )}

      {/* Price */}
      <span className="text-gray-400 text-xs w-12 text-right flex-shrink-0 font-mono tabular-nums">
        ${card.prices.usd}
      </span>
    </motion.li>
  );
}

interface SectionProps {
  section: DeckSection;
  onCardHover: (card: DeckCard, element: HTMLElement) => void;
  onCardLeave: () => void;
}

function DeckSection({ section, onCardHover, onCardLeave }: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6">
      {/* Section Header */}
      <motion.button
        className="flex items-center w-full py-1.5 px-2 bg-[#2a2a2a] border border-gray-600/50 rounded hover:bg-[#333333] transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500/50"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ x: 1 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          <motion.span
            className="text-gray-400"
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: DURATIONS.micro }}
          >
            ▶
          </motion.span>
          <span className="font-semibold text-white">{section.title}</span>
          <span className="text-gray-400 text-sm">({section.totalCards})</span>
        </div>
      </motion.button>

      {/* Section Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATIONS.state, ease: EASINGS.easeOut }}
            className="overflow-hidden"
          >
            <ul className="mt-2 space-y-1">
              {section.cards.map((card, index) => (
                <CardEntry
                  key={`${card.name}-${index}`}
                  card={card}
                  onCardHover={onCardHover}
                  onCardLeave={onCardLeave}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MoxfieldDeckList() {
  const [hoveredCard, setHoveredCard] = useState<HoveredCardState | null>(null);

  const handleCardHover = (card: DeckCard, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    // Position the card image to the right of the text, slightly offset
    const position = {
      x: rect.right + 20, // 20px offset to the right
      y: rect.top - 50    // Offset up to center on the card name
    };

    setHoveredCard({ card, position });
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  return (
    <div className="relative bg-[#1a1a1a] min-h-screen text-white">
      {/* Main Layout - Two Columns */}
      <div className="grid grid-cols-[380px_1fr] gap-6 p-4">
        {/* Left Column - Deck List */}
        <div className="space-y-6">
          {/* Deck Header */}
          <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-3">
            <h1 className="text-2xl font-bold mb-2">Atraxa +1/+1 Counters</h1>
            <p className="text-gray-400 mb-4">Commander deck focused on proliferate and +1/+1 counter synergies</p>

            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-gray-400">Cards:</span>
                <span className="ml-2 font-semibold">{deckTotals.totalCards}</span>
              </div>
              <div>
                <span className="text-gray-400">Value:</span>
                <span className="ml-2 font-semibold">${deckTotals.totalValue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Commander */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-lg p-3">
            <h2 className="text-lg font-semibold mb-2 text-purple-300">Commander</h2>
            <CardEntry
              card={mockCommander}
              onCardHover={handleCardHover}
              onCardLeave={handleCardLeave}
            />
          </div>

          {/* Deck Sections */}
          <div className="space-y-4">
            {mockDeckSections.map((section) => (
              <DeckSection
                key={section.title}
                section={section}
                onCardHover={handleCardHover}
                onCardLeave={handleCardLeave}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Mana Curve & Stats */}
        <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Mana Curve</h3>
          <div className="text-gray-400 text-center py-8">
            Mana curve visualization would go here
          </div>

          <h3 className="text-lg font-semibold mb-4 mt-8">Color Distribution</h3>
          <div className="text-gray-400 text-center py-8">
            Color pie chart would go here
          </div>
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
              duration: DURATIONS.immediate,
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
                <div className="text-green-400 font-bold">${hoveredCard.card.prices.usd}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MoxfieldDeckList;