"use client"
// Hides public-site chrome (the footer) on /admin/*, like the Navbar already does.
import { usePathname } from "next/navigation"

export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return pathname?.startsWith("/admin") ? null : <>{children}</>
}
