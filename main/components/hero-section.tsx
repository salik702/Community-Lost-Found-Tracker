"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { ReportItemDialog } from "@/components/report-item-dialog"
import { CategoryFilter } from "@/components/category-filter"
import { ShieldCheck, Sparkles, Zap, Radio, Shield } from "lucide-react"
import Link from "next/link"

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden flex items-center">
      <div className="absolute top-4 right-4 z-20">
        <Link href="/admin/login">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass border-border/50 hover:border-blue-500/50 transition-colors"
          >
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-muted-foreground">Admin</span>
          </motion.div>
        </Link>
      </div>

      {/* Animated background elements */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[100px]" />
      </motion.div>

      {/* Glowing orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500 rounded-full blur-sm"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        className="absolute top-1/3 right-1/3 w-3 h-3 bg-red-500 rounded-full blur-sm"
      />
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
        className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-indigo-500 rounded-full blur-sm"
      />

      <div className="container relative z-10 mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto text-center space-y-10"
        >
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass border-blue-500/30 shadow-lg shadow-blue-500/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sparkles className="h-5 w-5 text-blue-400" />
            </motion.div>
            <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
              Community-Powered Recovery Platform
            </span>
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
          </motion.div>

          {/* Main heading with glitch effect */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight"
            >
              <span className="block text-foreground">Find What's</span>
              <motion.span
                className="block mt-2 bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent text-glow-blue animate-gradient"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
              >
                Lost
              </motion.span>
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight"
            >
              <span className="block text-foreground">Report What's</span>
              <motion.span
                className="block mt-2 bg-gradient-to-r from-red-400 via-red-500 to-orange-400 bg-clip-text text-transparent text-glow-red animate-gradient"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              >
                Stolen
              </motion.span>
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Join thousands helping their community recover lost items and track stolen property.
            <span className="text-blue-400"> Together</span>, we make a difference.
          </motion.p>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative group">
              {/* Glow effect behind button */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
              <ReportItemDialog />
            </motion.div>

            <div className="flex items-center gap-3 px-4 py-2 rounded-full glass">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <ShieldCheck className="h-5 w-5 text-green-400" />
              </motion.div>
              <span className="text-sm text-muted-foreground">Secure & Anonymous</span>
            </div>
          </motion.div>

          {/* Live stats ticker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-8 pt-8"
          >
            {[
              { icon: Zap, label: "Items Tracked", value: 2547, color: "blue" },
              { icon: Radio, label: "Live Reports", value: 156, color: "red" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl glass ${
                  stat.color === "blue" ? "border-blue-500/30" : "border-red-500/30"
                }`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color === "blue" ? "text-blue-400" : "text-red-400"}`} />
                <div className="text-left">
                  <div className="text-2xl font-bold">
                    <AnimatedCounter value={stat.value} suffix="+" />
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="pt-10"
          >
            <CategoryFilter />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="w-6 h-10 rounded-full border-2 border-blue-500/50 flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0], y: [0, 20] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-1.5 h-1.5 rounded-full bg-blue-500"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
