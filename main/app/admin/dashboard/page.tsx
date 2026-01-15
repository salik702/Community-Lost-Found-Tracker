"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Shield,
  LogOut,
  Search,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Package,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Loader2,
  Home,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { AdminItemDialog } from "@/components/admin-item-dialog"

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

type Admin = {
  adminId: number
  email: string
  name: string | null
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  useEffect(() => {
    checkSession()
  }, [])

  useEffect(() => {
    if (admin) {
      fetchItems()
    }
  }, [admin])

  const checkSession = async () => {
    try {
      const response = await fetch("/api/admin/session")
      const data = await response.json()

      if (!data.authenticated) {
        router.push("/admin/login")
        return
      }

      setAdmin(data.admin)
    } catch (error) {
      router.push("/admin/login")
    }
  }

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/items")
      const data = await response.json()

      if (Array.isArray(data)) {
        const mappedItems = data.map((item: any) => ({
          id: item.ItemID,
          title: item.ItemName,
          description: item.Description,
          category: item.Status ? item.Status.toLowerCase() : 'lost',
          location: item.location ? item.location.LocationName : (item.LocationFoundOrLost ? item.LocationFoundOrLost.toString() : 'Unknown'),
          date: item.DateReported,
          image_url: item.ImageURL,
          contact_info: item.user ? (item.user.Email || item.user.Contact || 'No Contact') : 'Contact Admin',
          status: item.Status === 'Recovered' ? 'resolved' : 'active',
          created_at: item.DateReported || new Date().toISOString(),
          user: item.user ? {
            Name: item.user.Name,
            Email: item.user.Email,
            Contact: item.user.Contact,
          } : undefined
        }));
        setItems(mappedItems)
        if (selectedItem) {
          const updatedSelectedItem = mappedItems.find(i => i.id === selectedItem.id);
          if (updatedSelectedItem) {
            setSelectedItem(updatedSelectedItem);
          }
        }
      } else {
        setItems([])
      }
    } catch (error) {
      console.error("Failed to fetch items:", error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contact_info.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const stats = {
    total: items.length,
    lost: items.filter((i) => i.category === "lost").length,
    found: items.filter((i) => i.category === "found").length,
    stolen: items.filter((i) => i.category === "stolen").length,
    resolved: items.filter((i) => i.status === "resolved").length,
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome, {admin?.name || admin?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-red-400 border-red-500/30 hover:bg-red-500/10 bg-transparent"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          {[
            { label: "Total Items", value: stats.total, icon: Package, color: "text-blue-400" },
            { label: "Lost", value: stats.lost, icon: AlertTriangle, color: "text-yellow-400" },
            { label: "Found", value: stats.found, icon: CheckCircle, color: "text-green-400" },
            { label: "Stolen", value: stats.stolen, icon: AlertTriangle, color: "text-red-400" },
            { label: "Resolved", value: stats.resolved, icon: CheckCircle, color: "text-cyan-400" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items, locations, or contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-border/50"
            />
          </div>
          <div className="flex gap-2">
            {["all", "lost", "found", "stolen"].map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(category)}
                className={categoryFilter === category ? "bg-primary" : ""}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={fetchItems} className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-lg">All Reported Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Item</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Location</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contact</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredItems.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                                  <Package className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium line-clamp-1">{item.title}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="line-clamp-1">{item.location}</span>
                            </div>
                          </td>
                          <td className="p-4 hidden lg:table-cell">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(item.date).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {item.contact_info.includes("@") ? (
                                <a href={`mailto:${item.contact_info}`} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                                  <Mail className="h-4 w-4" />
                                  <span className="hidden xl:inline line-clamp-1">{item.contact_info}</span>
                                </a>
                              ) : (
                                <a href={`tel:${item.contact_info}`} className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300">
                                  <Phone className="h-4 w-4" />
                                  <span className="hidden xl:inline">{item.contact_info}</span>
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)} className="gap-2">
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>

                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No items found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <AdminItemDialog
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onUpdate={fetchItems}
      />
    </div>
  )
}
