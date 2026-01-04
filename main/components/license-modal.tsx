"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Share2, Copy, Github } from "lucide-react"

export function LicenseModal() {
  const [isOpen, setIsOpen] = useState(false)

  const licenseText = [
    {
      title: "MIT License",
      content: "Copyright (c) 2026 Salik Ahmad",
    },
    {
      title: "Permissions",
      content:
        "Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.",
    },
    {
      title: "Conditions",
      content:
        "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
    },
    {
      title: "Attribution Required",
      content:
        "Any usage of this repository for sharing, forking, or redistribution must explicitly attribute 'Salik Ahmad' as the original author.",
      highlight: true,
    },
    {
      title: "Disclaimer",
      content:
        "THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-primary transition-colors relative group"
        >
          <Shield className="w-4 h-4 mr-2" />
          License
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-primary">
            <Shield className="w-6 h-6" />
            Project License
          </DialogTitle>
          <DialogDescription>
            Terms and conditions for using Community Lost & Found Tracker
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6 py-4"
          >
            {licenseText.map((section, index) => (
              <motion.div
                key={index}
                variants={item}
                className={`p-4 rounded-lg border ${
                  section.highlight
                    ? "bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                    : "bg-card border-border"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    section.highlight ? "text-primary" : "text-foreground"
                  }`}
                >
                  {section.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}

            <motion.div variants={item} className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() =>
                  window.open(
                    "https://github.com/salik702/Community-Lost-Found-Tracker",
                    "_blank"
                  )
                }
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Copy className="w-4 h-4" />
                Copy License
              </Button>
            </motion.div>
          </motion.div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
