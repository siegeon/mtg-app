import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronUp,
  ChevronDown,
  Calendar,
  DollarSign,
  Library,
  Play
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { DURATIONS, EASINGS, useAnimationVariants } from '../../lib/motion';
import { mockDecks, getColorIdentityDisplay, mockPreviewCards, type DeckSummary } from './mockDecksData';

interface HoveredCardState {
  card: any;
  position: { x: number; y: number };
}


const formatPrice = (value: number) => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value.toFixed(0)}`;
};

const DeckRow: React.FC<{
  deck: DeckSummary;
  isSelected: boolean;
  onClick: () => void;
}> = ({ deck, isSelected, onClick }) => {
  const { card, transition } = useAnimationVariants();

  return (
    <motion.tr
      className={cn(
        'border-b border-gray-700/50 cursor-pointer transition-colors',
        'hover:bg-violet-500/5 hover:border-violet-500/20',
        isSelected && 'bg-violet-500/10 border-violet-500/30'
      )}
      onClick={onClick}
      variants={card}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      transition={transition}
    >
      {/* Deck Name & Commander */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-slate-700 overflow-hidden flex-shrink-0">
            {deck.thumbnail ? (
              <img
                src={deck.thumbnail}
                alt={deck.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Library size={16} className="text-slate-400" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-white flex items-center gap-2">
              {deck.name}
              <span className="text-lg">
                {getColorIdentityDisplay(deck.colorIdentity)}
              </span>
            </div>
            {deck.commander && (
              <div className="text-sm text-slate-400">
                {deck.commander}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Format */}
      <td className="px-4 py-3 text-slate-300 font-medium">
        {deck.format}
      </td>

      {/* Price */}
      <td className="px-4 py-3">
        <span className="text-green-400 font-mono font-semibold">
          {formatPrice(deck.totalValue)}
        </span>
      </td>

      {/* Last Edited */}
      <td className="px-4 py-3 text-slate-400 text-sm">
        {deck.lastEdited}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <button
          className="p-1.5 rounded hover:bg-violet-500/20 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Handle play/edit action
          }}
        >
          <Play size={16} className="text-violet-400" />
        </button>
      </td>
    </motion.tr>
  );
};

const SortHeader: React.FC<{
  label: string;
  field: string;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}> = ({ label, field, sortField, sortDirection, onSort }) => {
  const isActive = sortField === field;

  return (
    <button
      className="flex items-center gap-2 w-full text-left hover:text-violet-300 transition-colors"
      onClick={() => onSort(field)}
    >
      <span className="font-medium">{label}</span>
      <div className="flex flex-col">
        <ChevronUp
          size={12}
          className={cn(
            'transition-colors -mb-1',
            isActive && sortDirection === 'asc' ? 'text-violet-400' : 'text-slate-600'
          )}
        />
        <ChevronDown
          size={12}
          className={cn(
            'transition-colors -mt-1',
            isActive && sortDirection === 'desc' ? 'text-violet-400' : 'text-slate-600'
          )}
        />
      </div>
    </button>
  );
};

const DeckPreview: React.FC<{
  deck: DeckSummary | null;
  onCardHover: (card: any, element: HTMLElement) => void;
  onCardLeave: () => void;
}> = ({ deck, onCardHover, onCardLeave }) => {
  if (!deck) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <Library className="mx-auto text-slate-600" size={48} />
          <div>
            <h3 className="text-lg font-medium text-slate-400">Select a Deck</h3>
            <p className="text-sm text-slate-500 mt-1">
              Choose a deck to see its preview and key cards
            </p>
          </div>
        </div>
      </div>
    );
  }

  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleCardHover = (card: any, index: number) => {
    const element = cardRefs.current[index];
    if (element) {
      onCardHover(card, element);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Deck Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-slate-700 overflow-hidden flex-shrink-0">
            {deck.thumbnail ? (
              <img
                src={deck.thumbnail}
                alt={deck.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Library size={24} className="text-slate-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-white">{deck.name}</h2>
              <span className="text-2xl">
                {getColorIdentityDisplay(deck.colorIdentity)}
              </span>
            </div>
            <p className="text-slate-400 mb-3">{deck.description}</p>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Library size={14} />
                <span>{deck.totalCards} cards</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <DollarSign size={14} />
                <span className="font-mono font-semibold">
                  ${deck.totalValue.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={14} />
                <span>{deck.lastEdited}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Cards Preview */}
      <div className="flex-1 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Key Cards</h3>
        <div className="space-y-3">
          {mockPreviewCards.slice(0, 8).map((card, index) => (
            <motion.button
              key={`${card.name}-${index}`}
              ref={(el) => { if (el) cardRefs.current[index] = el; }}
              className="w-full flex items-center gap-3 p-2 rounded hover:bg-slate-800/50 transition-colors text-left"
              onMouseEnter={() => handleCardHover(card, index)}
              onMouseLeave={onCardLeave}
              whileHover={{ x: 4 }}
              transition={{ duration: DURATIONS.micro, ease: EASINGS.easeOut }}
            >
              <div className="w-8 h-8 bg-slate-700 rounded-sm flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-white font-medium hover:text-violet-300 transition-colors">
                  {card.name}
                </div>
                <div className="text-slate-400 text-sm">{card.type_line}</div>
              </div>
              <div className="text-green-400 font-mono text-sm font-semibold">
                ${card.prices.usd}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <motion.button
            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-150"
            whileHover={{ y: -1, boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Play size={16} />
            Open in Builder
          </motion.button>
          <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 px-4 rounded-md transition-colors">
            View Full List
          </button>
        </div>
      </div>
    </div>
  );
};

export const DecksView: React.FC = () => {
  const [selectedDeck, setSelectedDeck] = useState<DeckSummary | null>(mockDecks[0]);
  const [sortField, setSortField] = useState('lastEdited');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [hoveredCard, setHoveredCard] = useState<HoveredCardState | null>(null);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedDecks = [...mockDecks].sort((a, b) => {
    let aVal: any = a[sortField as keyof DeckSummary];
    let bVal: any = b[sortField as keyof DeckSummary];

    if (sortField === 'lastEdited') {
      // Simple sort by string for demo
      aVal = a.lastEdited;
      bVal = b.lastEdited;
    }

    if (typeof aVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    if (typeof aVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  const handleCardHover = (card: any, element: HTMLElement) => {
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

  return (
    <div className="relative h-screen bg-slate-950 text-white overflow-hidden">
      {/* Main Layout - Two Columns */}
      <div className="grid grid-cols-[1fr_400px] h-full">
        {/* Left Column - Deck Table */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700/50">
            <h1 className="text-2xl font-bold mb-2">My Decks</h1>
            <p className="text-slate-400">
              Manage your deck collection and brew new strategies
            </p>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-slate-950/95 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <SortHeader
                      label="Deck"
                      field="name"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <SortHeader
                      label="Format"
                      field="format"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <SortHeader
                      label="Value"
                      field="totalValue"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <SortHeader
                      label="Last Edited"
                      field="lastEdited"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {sortedDecks.map((deck) => (
                  <DeckRow
                    key={deck.id}
                    deck={deck}
                    isSelected={selectedDeck?.id === deck.id}
                    onClick={() => setSelectedDeck(deck)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Deck Preview */}
        <div className="bg-slate-900/50 border-l border-gray-700/50">
          <DeckPreview
            deck={selectedDeck}
            onCardHover={handleCardHover}
            onCardLeave={handleCardLeave}
          />
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
                <div className="text-green-400 font-bold">${hoveredCard.card.prices.usd}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};