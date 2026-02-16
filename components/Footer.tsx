import Link from "next/link";
import { Instagram, Music, Twitter, Mail } from "lucide-react";
import { socialLinks } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Instagram,
  SoundCloud: Music,
  X: Twitter,
};

const pages = [
  { href: "/music", label: "Music" },
  { href: "/events", label: "Events" },
  { href: "/bookings", label: "Bookings" },
  { href: "/about", label: "About" },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-1">
            <p className="font-display text-4xl text-neon-green tracking-wide leading-none mb-2">
              DJ JADE<br />THE GEM
            </p>
            <p className="text-sm text-white/50 mt-3">
              504 Creative · New Orleans, LA
            </p>
            <a
              href="mailto:booking@djjadethegem.com"
              className="inline-flex items-center gap-2 text-sm text-neon-green hover:underline mt-3"
            >
              <Mail size={14} />
              booking@djjadethegem.com
            </a>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
              Navigate
            </p>
            <ul className="space-y-2">
              {pages.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-neon-green transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
              Follow
            </p>
            <ul className="space-y-3">
              {socialLinks.map((s) => {
                const Icon = iconMap[s.platform] ?? Music;
                return (
                  <li key={s.platform}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-sm text-white/60 hover:text-neon-green transition-colors group"
                    >
                      <Icon
                        size={16}
                        className="group-hover:scale-110 transition-transform"
                      />
                      {s.handle}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} DJ Jade the Gem. All rights reserved.
          Made with 💚 in New Orleans.
        </div>
      </div>
    </footer>
  );
}
