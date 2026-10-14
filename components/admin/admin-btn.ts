// components/admin/admin-btn.ts
// Button class strings shared by every admin page (Epoch Skin's adminBtn, in
// Jade's colours). Kept in its own module so client and server code can both
// import it without a cycle.
export const adminBtn = {
  primary:
    "inline-flex items-center justify-center gap-1.5 h-10 px-4 text-[11px] tracking-[0.16em] uppercase bg-gold text-background font-semibold hover:bg-[#e2c04f] transition-colors disabled:opacity-50",
  secondary:
    "inline-flex items-center justify-center gap-1.5 h-10 px-4 text-[11px] tracking-[0.16em] uppercase border border-[#2a2336] bg-surface text-mist hover:border-gold hover:text-cream transition-colors disabled:opacity-50",
}
