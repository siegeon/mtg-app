import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { MtgCard as CardType } from './mockData';
import { getCardColor } from './mockData';
import { calculate3DTilt, coloredGlow, DURATIONS, EASINGS } from '../../../lib/motion';

interface MtgCardProps {
  card: CardType;
  onClick?: () => void;
  className?: string;
}

export function MtgCard({ card, onClick, className = '' }: MtgCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const newTilt = calculate3DTilt(rect, e.clientX, e.clientY);
    setTilt(newTilt);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const cardColor = getCardColor(card);
  const colorGlow = coloredGlow(cardColor);

  // Format mana cost for display (remove curly braces)
  const formatManaCost = (manaCost: string) => {
    return manaCost.replace(/[{}]/g, '');
  };

  // Price formatting
  const price = parseFloat(card.prices.usd);
  const formattedPrice = price >= 1000
    ? `$${(price / 1000).toFixed(1)}k`
    : `$${price.toFixed(2)}`;

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative w-64 h-88 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900
        rounded-lg overflow-hidden cursor-pointer select-none
        border border-gray-600 group ${className}
      `}
      style={{
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        y: isHovered ? -8 : 0,
        boxShadow: isHovered
          ? `0 20px 40px rgba(0,0,0,0.3), ${colorGlow.boxShadow}`
          : '0 4px 8px rgba(0,0,0,0.1)'
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: DURATIONS.micro, ease: EASINGS.easeOut }
      }}
      whileTap={{
        scale: 0.97,
        transition: { duration: DURATIONS.immediate, ...EASINGS.spring }
      }}
      transition={{
        duration: DURATIONS.micro,
        ease: EASINGS.easeOut
      }}
    >
      {/* Card Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <motion.img
          src={card.image_uris.normal}
          alt={card.name}
          className="w-full h-full object-cover"
          loading="lazy"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: DURATIONS.state, ease: EASINGS.easeOut }}
        />

        {/* Specular Highlight Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
          style={{
            background: `linear-gradient(
              ${45 + tilt.rotateY * 2}deg,
              transparent 0%,
              rgba(255,255,255,0.1) 40%,
              rgba(255,255,255,0.2) 50%,
              rgba(255,255,255,0.1) 60%,
              transparent 100%
            )`
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: DURATIONS.micro }}
        />

        {/* Price Badge */}
        <motion.div
          className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-bold"
          animate={{
            scale: isHovered ? 1.1 : 1,
            y: isHovered ? -2 : 0,
          }}
          transition={{ duration: DURATIONS.micro, ease: EASINGS.easeOut }}
        >
          {formattedPrice}
        </motion.div>
      </div>

      {/* Card Details */}
      <div className="p-4 space-y-3">
        {/* Card Name */}
        <motion.h3
          className="text-lg font-bold text-white truncate"
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: DURATIONS.micro }}
        >
          {card.name}
        </motion.h3>

        {/* Mana Cost and Type */}
        <div className="flex justify-between items-center">
          <motion.span
            className={`
              px-3 py-1 rounded-full text-sm font-bold text-white
              ${cardColor === 'red' ? 'bg-red-600' : ''}
              ${cardColor === 'blue' ? 'bg-blue-600' : ''}
              ${cardColor === 'green' ? 'bg-green-600' : ''}
              ${cardColor === 'white' ? 'bg-gray-100 text-gray-900' : ''}
              ${cardColor === 'black' ? 'bg-gray-900' : ''}
              ${cardColor === 'colorless' ? 'bg-gray-500' : ''}
              ${cardColor === 'multicolor' ? 'bg-gradient-to-r from-red-500 via-blue-500 to-green-500' : ''}
            `}
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotateY: tilt.rotateY * 0.5,
            }}
            transition={{ duration: DURATIONS.micro }}
          >
            {formatManaCost(card.mana_cost) || 'Free'}
          </motion.span>

          <motion.span
            className="text-gray-400 text-sm"
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: DURATIONS.micro }}
          >
            {card.type_line}
          </motion.span>
        </div>

        {/* Oracle Text (truncated) */}
        <motion.p
          className="text-gray-300 text-sm line-clamp-3"
          animate={{
            opacity: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: DURATIONS.micro }}
        >
          {card.oracle_text}
        </motion.p>
      </div>

      {/* Foil shine effect for expensive cards */}
      {price > 50 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              conic-gradient(
                from ${(tilt.rotateY + tilt.rotateX) * 10}deg at 50% 50%,
                transparent 0deg,
                rgba(255, 215, 0, 0.1) 72deg,
                rgba(255, 255, 255, 0.2) 144deg,
                rgba(255, 215, 0, 0.1) 216deg,
                transparent 288deg,
                transparent 360deg
              )
            `,
          }}
          animate={{
            opacity: isHovered ? 0.6 : 0,
          }}
          transition={{ duration: DURATIONS.state }}
        />
      )}
    </motion.div>
  );
}

export default MtgCard;