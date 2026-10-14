"use client"
// components/admin/LogoutButton.tsx
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" })
    router.push("/admin")
    router.refresh()
  }

  return (
    <button onClick={handleLogout} className="text-xs text-mist/70 hover:text-cream transition-colors">
      Log out
    </button>
  )
}
