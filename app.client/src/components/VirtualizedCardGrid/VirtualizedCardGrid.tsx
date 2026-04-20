import { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'motion/react';
import { CardImageWithHover } from '../CardImage';
import { type CollectionCard } from '../../hooks/useCardsApi';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Utility function for rarity colors
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

interface VirtualizedCardGridProps {
  cards: CollectionCard[];
  columns?: number;
  itemHeight?: number;
  gap?: number;
}

export const VirtualizedCardGrid = ({
  cards,
  columns = 6,
  itemHeight = 320,
  gap = 16
}: VirtualizedCardGridProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Calculate rows and items per row
  const rows = useMemo(() => {
    const result: CollectionCard[][] = [];
    for (let i = 0; i < cards.length; i += columns) {
      result.push(cards.slice(i, i + columns));
    }
    return result;
  }, [cards, columns]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight + gap,
    overscan: 5, // Render 5 extra rows for smoother scrolling
    getItemKey: (index) => `row-${index}`,
  });

  return (
    <div
      ref={parentRef}
      className="h-96 overflow-auto"
      style={{
        contain: 'strict'
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          if (!row) return null;

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className="grid gap-4 h-full"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  padding: `0 ${gap / 2}px`
                }}
              >
                {row.map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface CardItemProps {
  card: CollectionCard;
  reducedMotion: boolean;
}

const CardItem = ({ card, reducedMotion }: CardItemProps) => (
  <motion.div
    className="card-item bg-slate-800/30 border border-white/10 rounded-lg p-3 hover:bg-slate-800/50 transition-colors duration-200 group relative overflow-hidden"
    initial={reducedMotion ? {} : { opacity: 0, y: 20, scale: 0.9 }}
    animate={reducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
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
      <CardImageWithHover
        name={card.name}
        imageUris={card.image_uris}
        size="normal"
        className="w-full h-full"
      />
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
);