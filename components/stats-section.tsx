"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Package, Users, CheckCircle2, TrendingUp, Activity } from "lucide-react"

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
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
  }, [value, isInView])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

const stats = [
  {
    icon: Package,
    value: 2547,
    suffix: "+",
    label: "Items Tracked",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: CheckCircle2,
    value: 1823,
    suffix: "",
    label: "Items Recovered",
    color: "green",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Users,
    value: 12458,
    suffix: "+",
    label: "Community Members",
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    value: 72,
    suffix: "%",
    label: "Success Rate",
    color: "red",
    gradient: "from-red-500 to-orange-500",
  },
]

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-950/20 to-background" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Activity className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-muted-foreground">Real-time Statistics</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Making an{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Impact</span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
            >
              <motion.div
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
                className="relative group h-full"
              >
                {/* Glow effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                />

                {/* Card */}
                <div className="relative h-full glass rounded-2xl p-6 lg:p-8 border-border/50 group-hover:border-blue-500/30 transition-colors">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} mb-4`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </motion.div>

                  {/* Value */}
                  <div className="space-y-1">
                    <motion.div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    </motion.div>
                    <div className="text-sm lg:text-base text-muted-foreground">{stat.label}</div>
                  </div>

                  {/* Decorative line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} rounded-b-2xl origin-left`}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
