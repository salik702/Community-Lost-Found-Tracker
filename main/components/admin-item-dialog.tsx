"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Package,
  Loader2,
  CheckCircle,
  AlertTriangle,
  User,
  Edit,
  Save,
  X,
  Camera,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

type Item = {
  id: number
  title: string
  description: string
  category: "lost" | "found" | "stolen"
  location: string
  date: string
  image_url: string | null
  contact_info: string
  status: "active" | "resolved"
  created_at: string
  user?: {
    Name: string
    Email: string
    Contact?: string
  }
}

interface AdminItemDialogProps {
  item: Item | null
  open: boolean
  onClose: () => void
  onUpdate: () => void
}

export function AdminItemDialog({ item, open, onClose, onUpdate }: AdminItemDialogProps) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    location: item?.location || "",
    category: item?.category || "lost",
    reporter_name: item?.user?.Name || "",
    reporter_email: item?.user?.Email || "",
    reporter_phone: item?.user?.Contact || ""
  })

  useEffect(() => {
    if (item) {
      setEditData({
        title: item.title,
        description: item.description,
        location: item.location,
        category: item.category,
        reporter_name: item.user?.Name || "",
        reporter_email: item.user?.Email || "",
        reporter_phone: item.user?.Contact || ""
      })
      setIsEditing(false)
    }
  }, [item])

  if (!item) return null

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "lost":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "found":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "stolen":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  }

  const handleContact = async () => {
    if (item.contact_info.includes("@")) {
      setSending(true);
      try {
        const response = await fetch(`http://localhost:3001/api/items/${item.id}/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });

        if (response.ok) {
          toast.success("Email sent successfully!");
          setMessage("");
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || "Failed to send email");
        }
      } catch (error) {
        console.error("Failed to send email:", error);
        toast.error("An error occurred while sending email");
      } finally {
        setSending(false);
      }
    } else {
      window.open(`tel:${item.contact_info}`);
    }
  };

  const handleStatusUpdate = async (newStatus: "active" | "resolved") => {
    setUpdating(true)
    try {
      const response = await fetch(`http://localhost:3001/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, category: item.category }),
      })

      if (response.ok) {
        onUpdate()
        onClose()
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setUpdating(false)
    }
  }

  const handleSave = async () => {
    setUpdating(true)
    try {
      const formData = new FormData()
      formData.append("title", editData.title)
      formData.append("description", editData.description)
      formData.append("location", editData.location)
      formData.append("category", editData.category)
      formData.append("reporter_name", editData.reporter_name)
      formData.append("reporter_email", editData.reporter_email)
      formData.append("reporter_phone", editData.reporter_phone)

      const fileInput = document.getElementById('edit_image_file') as HTMLInputElement
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append('image', fileInput.files[0])
      }

      const response = await fetch(`http://localhost:3001/api/items/${item.id}`, {
        method: "PATCH",
        body: formData,
      })

      if (response.ok) {
        setIsEditing(false)
        toast.success("Changes saved successfully")
        onUpdate()
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.error || "Failed to save changes")
      }
    } catch (error) {
      console.error("Failed to save changes:", error)
      toast.error("An error occurred while saving")
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border-border/50 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="flex items-center gap-3">
              {!isEditing ? (
                <>
                  <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                  <span className="line-clamp-1">{item.title}</span>
                </>
              ) : (
                <span className="text-primary flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Item Details
                </span>
              )}
            </DialogTitle>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="hover:text-primary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
          <DialogDescription className="sr-only">
            Details and actions for the selected item.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!isEditing ? (
            <>
              {/* View Mode */}
              {item.image_url && (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={item.image_url || "/placeholder.svg"} alt={item.title} className="w-full h-64 object-cover" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span className="text-muted-foreground">Location:</span>
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    <span className="text-muted-foreground">Date:</span>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-green-400" />
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={item.status === "resolved" ? "default" : "secondary"}>{item.status}</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <User className="h-4 w-4 text-blue-400 mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">Reporter:</span>
                      <p className="font-medium text-white">{item.user?.Name || 'Anonymous'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <Mail className="h-4 w-4 text-cyan-400 mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <a href={`mailto:${item.user?.Email || item.contact_info}`} className="block text-cyan-400 hover:underline">
                        {item.user?.Email || item.contact_info}
                      </a>
                    </div>
                  </div>

                  {(item.user?.Contact || (!item.contact_info.includes("@") && item.contact_info)) && (
                    <div className="flex items-start gap-2 text-sm">
                      <Phone className="h-4 w-4 text-green-400 mt-0.5" />
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <a href={`tel:${item.user?.Contact || item.contact_info}`} className="block text-green-400 hover:underline">
                          {item.user?.Contact || item.contact_info}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Reported:</span>
                    <span>{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Description</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/50">
                <h4 className="font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Contact Reporter
                </h4>
                <Textarea
                  placeholder="Write a message to the reporter (optional)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="bg-background/50 border-border/50"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleContact}
                    disabled={sending}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : item.contact_info.includes("@") ? (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </>
                    ) : (
                      <>
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </>
                    )}
                  </Button>
                  {item.status === "active" ? (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate("resolved")}
                      disabled={updating}
                      className="flex-1 gap-2 text-green-400 border-green-500/30 hover:bg-green-500/10"
                    >
                      {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      Mark as Resolved
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate("active")}
                      disabled={updating}
                      className="flex-1 gap-2 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/10"
                    >
                      {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
                      Reopen
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Edit Mode */}
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_title">Item Title</Label>
                    <Input
                      id="edit_title"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_category">Status</Label>
                    <Select
                      value={editData.category}
                      onValueChange={(val: any) => setEditData({ ...editData, category: val })}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lost">Lost</SelectItem>
                        <SelectItem value="found">Found</SelectItem>
                        <SelectItem value="stolen">Stolen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_description">Description</Label>
                  <Textarea
                    id="edit_description"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={4}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_location">Location</Label>
                  <Input
                    id="edit_location"
                    value={editData.location}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_image_file">Update Image</Label>
                  <div className="flex gap-4 items-center">
                    <Input
                      id="edit_image_file"
                      type="file"
                      accept="image/*"
                      className="bg-background/50 cursor-pointer"
                    />
                    <Camera className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Leaving this empty will keep the current image.</p>
                </div>

                <div className="pt-4 border-t border-border/50 space-y-4">
                  <h4 className="font-medium flex items-center gap-2 text-primary">
                    <User className="h-4 w-4" />
                    Reporter Information
                  </h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="edit_reporter_name">Name</Label>
                      <Input
                        id="edit_reporter_name"
                        value={editData.reporter_name}
                        onChange={(e) => setEditData({ ...editData, reporter_name: e.target.value })}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="edit_reporter_email">Email</Label>
                        <Input
                          id="edit_reporter_email"
                          value={editData.reporter_email}
                          onChange={(e) => setEditData({ ...editData, reporter_email: e.target.value })}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit_reporter_phone">Phone</Label>
                        <Input
                          id="edit_reporter_phone"
                          value={editData.reporter_phone}
                          onChange={(e) => setEditData({ ...editData, reporter_phone: e.target.value })}
                          className="bg-background/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <Button
                    onClick={handleSave}
                    disabled={updating}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600"
                  >
                    {updating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
