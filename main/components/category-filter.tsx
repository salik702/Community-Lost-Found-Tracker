"use client"

import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Package, PackageCheck, AlertTriangle, Grid3x3 } from "lucide-react"

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "all"

  const handleFilter = (category: string) => {
    if (category === "all") {
      router.push("/")
    } else {
      router.push(`/?category=${category}`)
    }
  }

  const categories = [
    { value: "all", label: "All Items", icon: Grid3x3, color: "hover:border-primary/50" },
    { value: "lost", label: "Lost", icon: Package, color: "hover:border-orange-500/50" },
    { value: "found", label: "Found", icon: PackageCheck, color: "hover:border-green-500/50" },
    { value: "stolen", label: "Stolen", icon: AlertTriangle, color: "hover:border-red-500/50" },
  ]

  return (
    <div className="relative inline-flex flex-wrap gap-2 p-2 rounded-xl bg-muted/30 backdrop-blur-sm border border-border/50">
      {categories.map((category) => {
        const Icon = category.icon
        const isActive = currentCategory === category.value
        return (
          <motion.div
            key={category.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => handleFilter(category.value)}
              className={`relative ${!isActive && category.color} transition-colors duration-300`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-primary rounded-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {category.label}
              </span>
            </Button>
          </motion.div>
        )
      })}
    </div>
  )
}
