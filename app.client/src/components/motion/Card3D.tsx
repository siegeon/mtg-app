import React, { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useAnimationVariants, calculate3DTilt, coloredGlow } from '@/lib/motion'

interface Card3DProps {
  children: React.ReactNode
  className?: string
  mtgColor?: 'white' | 'blue' | 'black' | 'red' | 'green' | 'colorless' | 'multicolor'
  onClick?: () => void
  foil?: boolean
}

/**
 * 3D Card Component - The Primary Interaction Surface
 * Implements hover tilt, lift, tap press, and optional foil shimmer
 */
export function Card3D({
  children,
  className = '',
  mtgColor,
  onClick,
  foil = false
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const { shouldReduceMotion, card, transition } = useAnimationVariants()

  const handleMouseMove = (e: React.MouseEvent) => {
    if (shouldReduceMotion || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const newTilt = calculate3DTilt(rect, e.clientX, e.clientY)
    setTilt(newTilt)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const glowEffect = mtgColor ? coloredGlow(mtgColor) : {}

  return (
    <motion.div
      ref={cardRef}
      className={`relative cursor-pointer ${className}`}
      style={{
        perspective: '1000px'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      variants={card}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      transition={transition}
    >
      <motion.div
        className="w-full h-full"
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          ...glowEffect
        }}
        transition={{ duration: 0.1 }}
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Foil Shimmer Overlay */}
        {foil && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
            style={{
              background: `linear-gradient(
                ${tilt.rotateY * 2 + 45}deg,
                transparent 30%,
                rgba(255, 255, 255, 0.2) 50%,
                transparent 70%
              )`,
              mixBlendMode: 'overlay'
            }}
            animate={{
              opacity: isHovered ? 0.8 : 0.3
            }}
          />
        )}

        {/* Specular Highlight */}
        {isHovered && !shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              background: `radial-gradient(
                circle at ${50 + tilt.rotateY}% ${50 + tilt.rotateX}%,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 50%
              )`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {children}
      </motion.div>
    </motion.div>
  )
}