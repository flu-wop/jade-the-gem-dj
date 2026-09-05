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
    <button
      onClick={handleLogout}
      style={{
        background: "none", border: "none", cursor: "pointer",
        color: "#6b6478", fontSize: 13, letterSpacing: "0.04em",
      }}
    >
      Log out
    </button>
  )
}
