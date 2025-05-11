"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function TeaMascot() {
  const steamRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create steam particles
    if (steamRef.current) {
      const createSteamParticle = () => {
        const particle = document.createElement("div")
        particle.className = "absolute w-3 h-3 rounded-full bg-white/30 dark:bg-white/20"

        // Random position within the steam area
        const left = Math.random() * 30 + 35 // 35-65% from left
        particle.style.left = `${left}%`
        particle.style.bottom = "100%"

        // Random size
        const size = Math.random() * 10 + 5
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`

        // Add to the steam container
        steamRef.current?.appendChild(particle)

        // Animate upward
        const duration = Math.random() * 2000 + 2000
        const keyframes = [
          {
            transform: "translateY(0) scale(1)",
            opacity: 0.7,
          },
          {
            transform: `translateY(-${Math.random() * 50 + 50}px) translateX(${Math.random() * 20 - 10}px) scale(${Math.random() * 1.5 + 0.5})`,
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
    <div className="relative w-full h-full">
      {/* Tea Cup */}
      <motion.div
        className="absolute bottom-0 right-10 w-48 h-48"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Cup Body */}
        <div className="absolute bottom-0 right-0 w-40 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-b-full rounded-t-lg overflow-hidden border-4 border-white dark:border-gray-800">
          {/* Tea Liquid */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-amber-400 to-amber-600 overflow-hidden">
            {/* Tea Surface with ripple animation */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-amber-300 opacity-30 animate-ripple"></div>
          </div>

          {/* Tea Bag String */}
          <div className="absolute top-0 right-10 w-1 h-8 bg-gray-200"></div>

          {/* Tea Bag */}
          <div className="absolute top-8 right-8 w-6 h-8 bg-gray-700 rounded-b-lg"></div>
        </div>

        {/* Cup Handle */}
        <div className="absolute bottom-10 right-0 w-10 h-16 border-r-8 border-b-8 border-t-8 border-teal-500 rounded-r-full"></div>

        {/* Cup Saucer */}
        <div className="absolute bottom-0 right-0 w-48 h-6 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"></div>

        {/* Steam */}
        <div
          ref={steamRef}
          className="absolute bottom-full left-0 w-full h-32 overflow-hidden pointer-events-none"
        ></div>

        {/* Cup Face */}
        <div className="absolute bottom-16 left-10 w-20 h-10">
          {/* Eyes */}
          <motion.div
            className="absolute top-0 left-2 w-3 h-3 bg-gray-800 rounded-full"
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
            className="absolute top-0 right-2 w-3 h-3 bg-gray-800 rounded-full"
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
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-5 border-b-4 border-gray-800 rounded-b-full"
            animate={{
              width: [40, 30, 40],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 3,
              repeatDelay: 2,
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}
