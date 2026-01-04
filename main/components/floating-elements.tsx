"use client"

import { motion } from "framer-motion"

export function FloatingElements() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating geometric shapes */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute top-[20%] left-[10%] w-16 h-16 border-2 border-blue-500/20 rounded-lg"
      />
      <motion.div
        animate={{
          y: [0, 40, 0],
          rotate: [0, -180, -360],
        }}
        transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute top-[60%] right-[15%] w-20 h-20 border-2 border-red-500/20 rounded-full"
      />
      <motion.div
        animate={{
          y: [0, -50, 0],
          x: [0, 30, 0],
        }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute bottom-[30%] left-[20%] w-12 h-12 border-2 border-indigo-500/20"
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute top-[40%] right-[30%] w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[20%] right-[10%] w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-xl"
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
        `,
          backgroundSize: "100px 100px",
        }}
      />
    </div>
  )
}
