// components/admin/sections.ts
// Admin section list, shared by the nav shell (client) and the admin home (server).
// Kept out of AdminShell.tsx because that file is a client module.
import { Home, Sparkles, ShoppingBag, CalendarDays, Disc3, SlidersHorizontal, Activity } from "lucide-react"

export const ADMIN_SECTIONS = [
  { href: "/admin",          label: "Home",     icon: Home },
  { href: "/admin/insights", label: "Insights", icon: Sparkles },
  { href: "/admin/orders",   label: "Orders",   icon: ShoppingBag },
  { href: "/admin/events",   label: "Events",   icon: CalendarDays },
  { href: "/admin/tracks",   label: "Releases", icon: Disc3 },
  { href: "/admin/settings", label: "Settings", icon: SlidersHorizontal },
  { href: "/admin/system",   label: "System",   icon: Activity },
]
