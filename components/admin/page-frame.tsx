// components/admin/page-frame.tsx
// Shared page frame for every /admin/* section, so all of them have the same
// margins, header, buttons and login screen. Same shapes as Epoch Skin's
// AdminPage / AdminPageHeader / adminBtn / AdminLoginScreen, in Jade's colours.
// Plain module (no "use client") so server pages can use it directly.
import AdminLoginForm from "@/components/AdminLoginForm"

export function AdminPage({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">{children}</main>
}

export function AdminPageHeader({
  eyebrow = "Admin", title, description, actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8">
      <div className="min-w-0">
        <p className="text-[10px] tracking-[0.26em] uppercase text-gold mb-1.5">{eyebrow}</p>
        <h1 className="font-display text-3xl sm:text-4xl text-cream leading-tight">{title}</h1>
        {description && <p className="text-sm text-mist/70 mt-1.5">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export { adminBtn } from "./admin-btn"

/** Square panel used for every card on every admin page. */
export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-surface border border-[#2a2336] p-4 sm:p-6 min-w-0 ${className}`}>{children}</div>
}

/** The site's existing login gate, dressed like the rest of the admin. */
export function AdminLogin({ message = "Enter the admin password." }: { message?: string }) {
  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 py-16 sm:py-24">
      <p className="text-[10px] tracking-[0.26em] uppercase text-gold mb-1.5">Jade the Gem</p>
      <h1 className="font-display text-4xl text-cream leading-tight">Admin sign in</h1>
      <p className="text-sm text-mist/70 mt-2 mb-6">{message}</p>
      <AdminLoginForm />
    </main>
  )
}
