import Link from "next/link";
import { Instagram, Music, Twitter, Mail, type LucideIcon } from "lucide-react";
import { socialLinks } from "@/lib/data";

const iconMap: Record<string, LucideIcon> = {
  Instagram,
  SoundCloud: Music,
  X: Twitter,
};

const pages = [
  { href: "/music",    label: "Music"     },
  { href: "/events",   label: "Events"    },
  { href: "/bookings", label: "Bookings"  },
  { href: "/press",    label: "Press Kit" },
  { href: "/refund-shipping", label: "Shipping & Refunds" },
  { href: "/privacy", label: "Privacy Policy" },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-plum/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-1">
            <p className="font-display text-4xl text-holo leading-none mb-2">
              DJ JADE<br />THE GEM
            </p>
            <p className="font-sub text-xs tracking-[0.2em] uppercase text-mist/40 mt-3">
              Hidden Gem · New Orleans, LA
            </p>
            <a
              href="mailto:jadedwheeler8@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-jade-light hover:text-jade transition-colors mt-3"
            >
              <Mail size={14} />
              jadedwheeler8@gmail.com
            </a>
          </div>

          {/* Links */}
          <div>
            <p className="font-sub text-[10px] tracking-[0.3em] uppercase text-mist/30 mb-4">Navigate</p>
            <ul className="space-y-2">
              {pages.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="font-body text-sm text-mist/50 hover:text-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <p className="font-sub text-[10px] tracking-[0.3em] uppercase text-mist/30 mb-4">Follow</p>
            <ul className="space-y-3">
              {socialLinks.map((s) => {
                const Icon = iconMap[s.platform] ?? Music;
                return (
                  <li key={s.platform}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 font-body text-sm text-mist/50 hover:text-jade-light transition-colors group"
                    >
                      <Icon size={15} className="group-hover:scale-110 transition-transform" />
                      {s.handle}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-plum/10 pt-6 text-center">
          <p className="font-sub text-[11px] tracking-[0.25em] uppercase text-jade-light/40 mb-2">
            Every set has a hidden gem in it.
          </p>
          <p className="font-body text-xs text-mist/20">
            © {new Date().getFullYear()} DJ Jade the Gem. All rights reserved. Made with 💜 in New Orleans.
          </p>
        </div>
      </div>
    </footer>
  );
}
