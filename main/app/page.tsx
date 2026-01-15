import { HeroSection } from "@/components/hero-section"
import { ItemsGrid } from "@/components/items-grid"
import { StatsSection } from "@/components/stats-section"
import { ParticleBackground } from "@/components/particle-background"
import { FloatingElements } from "@/components/floating-elements"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <FloatingElements />
      <div className="relative z-10">
        <HeroSection />
        <StatsSection />
        <ItemsGrid />
        <SiteFooter />
      </div>
    </div>
  )
}
