"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Calendar,
  Phone,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
} from "lucide-react"
import type { Item } from "@/components/items-grid"
import { format } from "date-fns"

interface ItemDetailsDialogProps {
  item: Item
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function ItemDetailsDialog({ item, open, onOpenChange, onUpdate }: ItemDetailsDialogProps) {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [authorName, setAuthorName] = useState("")
  const [commentText, setCommentText] = useState("")
  const [resolving, setResolving] = useState(false)

  if (!item) return null

  useEffect(() => {
    if (open && item?.id) {
      fetchComments()
    }
  }, [open, item?.id])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3001/api/items/${item?.id}/comments`)
      const data = await response.json()

      if (Array.isArray(data)) {
        const mappedComments = data.map((comment: any) => ({
          id: comment.CommentID,
          author_name: comment.user?.Name || "Anonymous",
          comment_text: comment.CommentText,
          created_at: comment.CommentDate
        }))
        setComments(mappedComments)
      } else {
        setComments([])
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName.trim() || !commentText.trim()) return

    try {
      setSubmitting(true)
      const response = await fetch(`http://localhost:3001/api/items/${item?.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author_name: authorName, comment_text: commentText }),
      })

      if (response.ok) {
        setAuthorName("")
        setCommentText("")
        fetchComments()
      }
    } catch (error) {
      console.error("Failed to submit comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleResolve = async () => {
    try {
      setResolving(true)
      const response = await fetch(`http://localhost:3001/api/items/${item?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      })

      if (response.ok) {
        onUpdate()
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Failed to resolve item:", error)
    } finally {
      setResolving(false)
    }
  }

  const getStatusBadge = (status: string, category: string) => {
    if (status === "resolved") {
      return (
        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 gap-1 px-3 py-1">
          <CheckCircle2 className="h-3 w-3" /> Resolved
        </Badge>
      )
    }
    const colors = {
      lost: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      found: "bg-green-500/20 text-green-400 border-green-500/30",
      stolen: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    return (
      <Badge className={`${colors[category as keyof typeof colors]} gap-1 px-3 py-1`}>
        <AlertCircle className="h-3 w-3" /> {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-none glass shadow-2xl">
        <div className="relative h-48 sm:h-56 md:h-64 w-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center border-b border-white/10 overflow-hidden">
          <DialogTitle className="sr-only">{item.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Details for {item.category} item: {item.title} found at {item.location} on {(() => {
              const d = new Date(item.date);
              return isNaN(d.getTime()) ? 'Date pending' : format(d, "PPP");
            })()}
          </DialogDescription>
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"
          />
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                <MapPin className="h-20 w-20 text-blue-400 relative" />
              </div>
              <span className="text-blue-400/50 font-medium">No image provided</span>
            </div>
          )}
          <div className="absolute top-4 left-4">{getStatusBadge(item.status, item.category)}</div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{item.title}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <MapPin className="h-4 w-4 text-blue-400" /> {item.location}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 shrink-0">
                  <Calendar className="h-4 w-4 text-blue-400" /> {(() => {
                    const d = new Date(item.date);
                    return isNaN(d.getTime()) ? 'Date pending' : format(d, "PPP");
                  })()}
                </div>
              </div>
            </div>
            {item.status === "active" && (
              <Button
                onClick={handleResolve}
                disabled={resolving}
                className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-white border-none shadow-lg shadow-cyan-900/20 shrink-0"
              >
                {resolving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                Mark as Resolved
              </Button>
            )}
          </div>

          <section className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" /> Reporter
            </h3>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="font-medium text-white">{item.user?.Name || 'Anonymous'}</p>
                  <p className="text-sm text-blue-400">{item.user?.Email}</p>
                </div>
                <div className="text-sm text-neutral-400">
                  <p>{item.user?.Location || 'Location not provided'}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-400" /> Description
                </h3>
                <p className="text-neutral-400 leading-relaxed text-lg">{item.description}</p>
              </section>

              <section className="space-y-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white/90">Community Discussion</h3>
                  <Badge variant="outline" className="bg-white/5 border-white/10">
                    {comments.length} Comments
                  </Badge>
                </div>

                <form onSubmit={handleSubmitComment} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Your Name"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="bg-black/20 border-white/10 focus:border-blue-500/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Add a helpful comment or sighted location..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="min-h-[100px] bg-black/20 border-white/10 focus:border-blue-500/50"
                    />
                    <Button disabled={submitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-500">
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                      Post Comment
                    </Button>
                  </div>
                </form>

                <div className="space-y-4">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500/50" />
                    </div>
                  ) : comments.length > 0 ? (
                    comments.map((comment) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={comment.id}
                        className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                      >
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center shrink-0 border border-white/10">
                          <User className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="space-y-1 group">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white/90">{comment.author_name}</span>
                            <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full">
                              Member
                            </span>
                          </div>
                          <p className="text-neutral-400 text-[15px] leading-relaxed">{comment.comment_text}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 pt-1">
                            <Clock className="h-3 w-3" /> {format(new Date(comment.created_at), "MMM d, h:mm a")}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
                      <MessageSquare className="h-8 w-8 text-neutral-600 mx-auto mb-3" />
                      <p className="text-neutral-500">No comments yet. Help out by providing info!</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="font-semibold text-white/90">Contact Reporter</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors group cursor-pointer">
                    <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20">
                      <Phone className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Contact Info</p>
                      <p className="text-sm">{item.contact_info}</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent border-white/10 hover:bg-white/10">
                  Send Message
                </Button>
              </section>

              <section className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  <h3 className="font-semibold text-white/90">Safety Tips</h3>
                </div>
                <ul className="space-y-3 text-xs text-neutral-400">
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    Always meet in a safe, public place.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    Never go alone to meet someone.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    Don't provide personal financial info.
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
