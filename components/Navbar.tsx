"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/music", label: "Music" },
  { href: "/events", label: "Events" },
  { href: "/bookings", label: "Bookings" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-white/10 shadow-xl shadow-black/60"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl md:text-3xl tracking-wide text-neon-green hover:text-white transition-colors"
        >
          DJ JADE THE GEM
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                isActive(href)
                  ? "text-neon-green"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link href="/bookings" className="btn-primary text-xs py-2 px-5">
            Book Me
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 text-white hover:text-neon-green transition-colors"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-surface/95 backdrop-blur-md border-t border-white/10">
          <nav className="flex flex-col px-4 py-6 gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
                  isActive(href)
                    ? "bg-neon-green/10 text-neon-green border-l-4 border-neon-green pl-3"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link href="/bookings" className="btn-primary mt-4 text-xs py-3">
              Book Me
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
