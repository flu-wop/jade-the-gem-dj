"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

// The title and the chevron are the toggle. The badge (counts, Clear/Reconcile
// buttons) sits beside them, not inside a button, so it stays valid HTML.
export default function Accordion({
  title, badge, defaultOpen = false, children,
}: {
  title: string;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="mt-3 bg-surface border border-[#2a2336] overflow-hidden">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 sm:px-5 py-3.5 hover:bg-surface-2 transition-colors">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="font-display text-lg sm:text-xl tracking-wide text-cream text-left py-1"
        >
          {title}
        </button>
        {badge && <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">{badge}</div>}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
          aria-expanded={open}
          className="ml-auto p-1 text-mist/60 hover:text-cream"
        >
          <ChevronDown size={18} className="transition-transform" style={{ transform: open ? "rotate(180deg)" : "none" }} aria-hidden />
        </button>
      </div>
      {open && <div className="px-4 sm:px-5 pb-5 border-t border-[#2a2336]">{children}</div>}
    </section>
  );
}
