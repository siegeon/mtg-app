import { motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SkeletonCardProps {
  index?: number;
}

export const SkeletonCard = ({ index = 0 }: SkeletonCardProps) => {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="card-skeleton bg-slate-800/20 border border-white/5 rounded-lg p-3 relative overflow-hidden"
      initial={reducedMotion ? {} : { opacity: 0, y: 20, scale: 0.9 }}
      animate={reducedMotion ? { opacity: 1 } : {
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        delay: reducedMotion ? 0 : index * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8
      }}
    >
      {/* Shimmer effect overlay */}
      {!reducedMotion && (
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            translateX: ["100%", "200%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: index * 0.2
          }}
        />
      )}

      {/* Card image skeleton */}
      <div className="w-full aspect-[5/7] mb-2 bg-slate-700/30 rounded animate-pulse" />

      {/* Card info skeleton */}
      <div className="space-y-2">
        {/* Card name */}
        <div className="h-4 bg-slate-700/30 rounded animate-pulse" />

        {/* Mana cost */}
        <div className="h-3 bg-slate-700/20 rounded animate-pulse w-16" />

        {/* Type line */}
        <div className="h-3 bg-slate-700/20 rounded animate-pulse w-3/4" />

        {/* Rarity and price row */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-slate-700/20 rounded animate-pulse w-16" />
          <div className="h-4 bg-slate-700/20 rounded animate-pulse w-12" />
        </div>

        {/* Quantity row */}
        <div className="flex items-center justify-between">
          <div className="h-3 bg-slate-700/20 rounded animate-pulse w-12" />
          <div className="h-3 bg-slate-700/20 rounded animate-pulse w-16" />
        </div>

        {/* Set code */}
        <div className="h-3 bg-slate-700/20 rounded animate-pulse w-8" />
      </div>
    </motion.div>
  );
};

interface SkeletonGridProps {
  count?: number;
  variant?: 'empty' | 'one-filter' | 'three-filters' | 'mobile';
}

export const SkeletonGrid = ({ count = 24, variant = 'empty' }: SkeletonGridProps) => {
  // Adjust skeleton count based on variant
  const skeletonCount = (() => {
    if (variant === 'empty') return 6;
    if (variant === 'one-filter') return 12;
    return count;
  })();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <SkeletonCard key={`skeleton-${index}`} index={index} />
        ))}
      </div>
    </div>
  );
};