import { useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'

/**
 * MTG Animation System - Motion Utilities
 * Following video-game quality standards with accessibility support
 */

// Duration & Easing Standards
export const DURATIONS = {
  micro: 0.15,      // hover, press
  state: 0.3,       // toggle, select
  cinematic: 0.5,   // page, modal
  immediate: 0.08   // tap press
} as const

export const EASINGS = {
  easeOut: [0, 0.55, 0.45, 1],
  easeIn: [0.55, 0.055, 0.675, 0.19],
  spring: { type: "spring", stiffness: 300, damping: 30 }
} as const

// Card Interaction Variants
export const cardVariants = (shouldReduceMotion: boolean): Variants => ({
  idle: shouldReduceMotion
    ? { scale: 1, y: 0, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }
    : { scale: 1, y: 0, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" },

  hover: shouldReduceMotion
    ? { scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.15)" }
    : { scale: 1.05, y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" },

  tap: shouldReduceMotion
    ? { scale: 0.98 }
    : { scale: 0.97 }
})

// Page Transition Variants
export const pageVariants = (shouldReduceMotion: boolean): Variants => ({
  enter: shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, scale: 1 },

  exit: shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 20, scale: 0.95 }
})

// MTG Color Theme Based Variants
export const coloredGlow = (color: 'white' | 'blue' | 'black' | 'red' | 'green' | 'colorless' | 'multicolor') => {
  const glowColors = {
    white: '255, 255, 255',
    blue: '14, 104, 171',
    black: '21, 11, 0',
    red: '211, 32, 42',
    green: '0, 115, 62',
    colorless: '204, 194, 192',
    multicolor: '248, 214, 69'
  }

  const rgb = glowColors[color]
  return {
    boxShadow: `0 0 20px rgba(${rgb}, 0.3), 0 0 40px rgba(${rgb}, 0.1)`
  }
}

// Animation Hook with Accessibility
export const useAnimationVariants = () => {
  const shouldReduceMotion = useReducedMotion()

  return {
    shouldReduceMotion,
    card: cardVariants(shouldReduceMotion ?? false),
    page: pageVariants(shouldReduceMotion ?? false),
    transition: {
      duration: (shouldReduceMotion ?? false) ? DURATIONS.immediate : DURATIONS.micro,
      ease: EASINGS.easeOut
    }
  }
}

// 3D Tilt Effect for Cards
export const calculate3DTilt = (rect: DOMRect, clientX: number, clientY: number) => {
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const rotateX = (clientY - centerY) / 10
  const rotateY = (clientX - centerX) / 10

  return { rotateX: -rotateX, rotateY: rotateY }
}

// Spring Physics Config
export const springConfig = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30
}

// Layout Animation Config
export const layoutTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30
}