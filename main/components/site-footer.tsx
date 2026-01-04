"use client"

import { LicenseModal } from "@/components/license-modal"
import { Heart } from "lucide-react"

export function SiteFooter() {
    return (
        <footer className="w-full py-6 mt-20 border-t border-border/40 bg-background/50 backdrop-blur-sm relative z-10">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>© 2026 Salik Ahmad.</span>
                    <span className="hidden md:inline">|</span>
                    <span className="flex items-center gap-1">
                        Built with <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> for the community
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <LicenseModal />
                    <a
                        href="https://github.com/salik702/Community-Lost-Found-Tracker"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    )
}
