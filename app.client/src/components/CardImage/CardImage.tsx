import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageIcon, AlertCircle } from 'lucide-react';

export interface CardImageProps {
  /** Card name for alt text and error fallback */
  name: string;
  /** Scryfall image URIs object */
  imageUris: {
    normal: string;
    small: string;
  };
  /** Size variant - determines which image URI to use */
  size?: 'small' | 'normal';
  /** Additional CSS classes */
  className?: string;
}

type ImageState = 'loading' | 'loaded' | 'error';

export const CardImage = ({
  name,
  imageUris,
  size = 'normal',
  className = ''
}: CardImageProps) => {
  const [imageState, setImageState] = useState<ImageState>('loading');
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = useCallback(() => {
    setImageState('loaded');
  }, []);

  const handleImageError = useCallback(() => {
    setImageState('error');
  }, []);

  // Intersection Observer for advanced lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // Start loading when image is 100px away from viewport
        rootMargin: '100px',
        threshold: 0.01
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [shouldLoad]);

  const imageUrl = size === 'small' ? imageUris.small : imageUris.normal;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-slate-700 rounded ${className}`}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 400px' }}
    >
      {/* Loading skeleton */}
      <AnimatePresence>
        {imageState === 'loading' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 animate-pulse" />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            />
            <ImageIcon
              className="relative z-10 text-slate-400"
              size={24}
              aria-label="Loading card image"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      <AnimatePresence>
        {imageState === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center"
          >
            <AlertCircle className="text-red-400 mb-2" size={20} />
            <div className="text-xs text-slate-400 leading-tight">
              <div className="font-medium mb-1">Image unavailable</div>
              <div className="opacity-75">{name}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual image */}
      {imageState !== 'error' && shouldLoad && (
        <motion.img
          src={imageUrl}
          alt={`${name} card image`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: imageState === 'loaded' ? 1 : 0,
            scale: imageState === 'loaded' ? 1 : 1.1
          }}
          transition={{
            duration: 0.3,
            ease: 'easeOut'
          }}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      )}
    </div>
  );
};

// Higher-order component for card hover effects
export const CardImageWithHover = ({ children, ...props }: { children?: React.ReactNode } & CardImageProps) => (
  <motion.div
    whileHover={{
      y: -2,
      rotateX: 5,
      rotateY: 5,
      scale: 1.02
    }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20
    }}
    className="transform-gpu will-change-transform"
    style={{
      perspective: 1000,
      transformStyle: 'preserve-3d'
    }}
  >
    <CardImage {...props} />
    {children}
  </motion.div>
);