"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function ReportItemDialog() {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const data = {
      reporter_name: formData.get("reporter_name"),
      reporter_email: formData.get("reporter_email"),
      reporter_phone: formData.get("reporter_phone"),
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      location: formData.get("location"),
      date: formData.get("date"),
      image_url: formData.get("image_url") || null,
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value as string | Blob);
        }
      });

      const fileInput = document.getElementById('image_file') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formDataToSend.append('image', fileInput.files[0]);
      }

      setSubmitting(true)
      const response = await fetch("http://localhost:3001/api/items", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        setOpen(false)
        router.refresh()
        toast.success("Item reported successfully!")
        window.location.reload()
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit item");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" className="relative overflow-hidden group shadow-lg shadow-primary/20">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{ x: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <span className="relative flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Report an Item
            </span>
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <DialogHeader>
            <DialogTitle>Report an Item</DialogTitle>
            <DialogDescription>
              Share details about a lost, found, or stolen item to help the community.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reporter_name">Your Name *</Label>
              <Input id="reporter_name" name="reporter_name" placeholder="Name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" placeholder="e.g., Blue Backpack" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Status *</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lost">Lost</SelectItem>
                  <SelectItem value="found">Found</SelectItem>
                  <SelectItem value="stolen">Stolen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide detailed information about the item..."
                required
                rows={4}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" name="location" placeholder="e.g., Central Park" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" name="date" type="date" required />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reporter_email">Your Email *</Label>
                <Input id="reporter_email" name="reporter_email" type="email" placeholder="your.email@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reporter_phone">Your Mobile Number</Label>
                <Input id="reporter_phone" name="reporter_phone" type="tel" placeholder="+92 3XX XXXXXXX" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL (optional)</Label>
                <Input id="image_url" name="image_url" type="url" placeholder="https://example.com/image.jpg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_file">Or Upload Image</Label>
                <Input id="image_file" name="image_file" type="file" accept="image/*" className="cursor-pointer" />
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
