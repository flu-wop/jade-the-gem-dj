"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CartButton from "@/components/CartButton";

const links = [
  { label: "Music",    href: "/music" },
  { label: "Events",   href: "/events" },
  { label: "Merch",    href: "/#merch" },
  { label: "Bookings", href: "/bookings" },
  { label: "Press",    href: "/press" },
  { label: "Merch Build", href: "/merch-build" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 inset-x-0 z-50 transition-all duration-300
        ${scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-plum/20 py-3"
          : "bg-transparent py-5"
        }
      `}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Swap src once you have the globe PNG */}
          <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-gold/30 animate-pulse-glow">
            <Image
              src="/images/logo-holo-globe.png"
              alt="DJ Jade the Gem"
              fill
              className="object-contain"
              onError={(e) => {
                // fallback to text if image missing
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <span className="font-display text-xl text-holo hidden sm:block leading-none">
            JADE THE GEM
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="
                  font-sub text-xs tracking-[0.2em] uppercase
                  text-mist/60 hover:text-gold
                  transition-colors duration-200
                  relative
                  after:absolute after:bottom-[-4px] after:left-0
                  after:w-0 hover:after:w-full
                  after:h-px after:bg-gold
                  after:transition-all after:duration-300
                "
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Book CTA + Cart */}
        <div className="hidden md:flex items-center gap-5">
          <CartButton />
          <Link href="/bookings" className="inline-flex btn-primary py-2.5">
            Book Me
          </Link>
        </div>

        {/* Mobile cart + hamburger */}
        <div className="md:hidden flex items-center gap-4">
          <CartButton />
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-mist/70 hover:text-gold transition-colors p-2"
          aria-label="Toggle menu"
        >
          <div className={`w-5 h-0.5 bg-current mb-1.5 transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-5 h-0.5 bg-current mb-1.5 transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-plum/20 px-6 py-6">
          <ul className="flex flex-col gap-5">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-sub text-sm tracking-[0.2em] uppercase text-mist/70 hover:text-gold transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/bookings"
                onClick={() => setOpen(false)}
                className="btn-primary w-full justify-center"
              >
                Book Me
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
