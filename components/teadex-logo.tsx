"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function TeadexLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const steamRef = useRef<HTMLDivElement>(null)

  // Determine dimensions based on size prop
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
  }[size]

  useEffect(() => {
    // Create steam particles for animation
    if (steamRef.current) {
      const createSteamParticle = () => {
        const particle = document.createElement("div")
        particle.className = "absolute w-1.5 h-1.5 rounded-full bg-green-100/40 dark:bg-green-100/30"

        // Random position within the steam area
        const left = Math.random() * 30 + 35 // 35-65% from left
        particle.style.left = `${left}%`
        particle.style.bottom = "100%"

        // Random size
        const particleSize = Math.random() * 4 + 2
        particle.style.width = `${particleSize}px`
        particle.style.height = `${particleSize}px`

        // Add to the steam container
        steamRef.current?.appendChild(particle)

        // Animate upward
        const duration = Math.random() * 1500 + 1000
        const keyframes = [
          {
            transform: "translateY(0) scale(1)",
            opacity: 0.7,
          },
          {
            transform: `translateY(-${Math.random() * 30 + 20}px) translateX(${Math.random() * 10 - 5}px) scale(${Math.random() * 1.2 + 0.5})`,
            opacity: 0,
          },
        ]

        particle.animate(keyframes, {
          duration,
          easing: "ease-out",
          fill: "forwards",
        })

        // Remove particle after animation
        setTimeout(() => {
          particle.remove()
        }, duration)
      }

      // Create steam particles at intervals
      const interval = setInterval(createSteamParticle, 300)

      return () => clearInterval(interval)
    }
  }, [])

  return (
    <div className="relative" style={{ width: dimensions.width, height: dimensions.height }}>
      {/* Cup Container */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Cup Body */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-3/5 bg-gradient-to-b from-green-500 to-green-600 rounded-b-full rounded-t-lg overflow-hidden border-2 border-white dark:border-gray-800">
          {/* Tea Liquid */}
          <div className="absolute bottom-0 left-0 right-0 h-4/5 bg-gradient-to-b from-green-400 to-green-500 overflow-hidden">
            {/* Tea Surface with ripple animation */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-green-300 opacity-40 animate-ripple"></div>
          </div>

          {/* Tea Leaf */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-1/3 h-1/3">
            <motion.div
              className="w-full h-full bg-green-700 rounded-full"
              animate={{
                rotate: [0, 5, -5, 0],
                y: [0, -1, 1, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 3,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

        {/* Cup Handle */}
        <div className="absolute bottom-1/4 right-1/4 w-1/5 h-1/3 border-r-2 border-b-2 border-t-2 border-green-600 rounded-r-full"></div>

        {/* Cup Saucer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/8 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>

        {/* Steam */}
        <div
          ref={steamRef}
          className="absolute bottom-full left-0 w-full h-1/2 overflow-hidden pointer-events-none"
        ></div>

        {/* Cup Face */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/5 h-1/5"
          animate={{
            y: [0, 2, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3,
            ease: "easeInOut",
          }}
        >
          {/* Eyes */}
          <motion.div
            className="absolute top-0 left-1/4 w-1/5 h-1/2 bg-gray-800 rounded-full"
            animate={{
              scaleY: [1, 0.3, 1],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 3,
              repeatDelay: 2,
            }}
          />
          <motion.div
            className="absolute top-0 right-1/4 w-1/5 h-1/2 bg-gray-800 rounded-full"
            animate={{
              scaleY: [1, 0.3, 1],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 3,
              repeatDelay: 2,
            }}
          />

          {/* Smile */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-1/3 border-b-2 border-gray-800 rounded-b-full"
            animate={{
              width: ["60%", "50%", "60%"],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 3,
              repeatDelay: 2,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
