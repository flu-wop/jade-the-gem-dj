import { Instagram, Music, Twitter, Mail } from "lucide-react";

const socialLinks = [
  {
    icon: Instagram,
    href: "https://instagram.com/jluhvv",
    label: "Instagram",
  },
  {
    icon: Music,
    href: "https://soundcloud.com/jadethegem888",
    label: "SoundCloud",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/jluhvv",
    label: "Twitter",
  },
  {
    icon: Mail,
    href: "mailto:booking@djjadethegem.com",
    label: "Email",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-display text-neon-green mb-4">
              DJ JADE THE GEM
            </h3>
            <p className="text-gray-400">
              504 Creative | Fire Mixes & Live Energy
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/music"
                  className="text-gray-400 hover:text-neon-green transition-colors"
                >
                  Music & Mixes
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="text-gray-400 hover:text-neon-green transition-colors"
                >
                  Upcoming Events
                </a>
              </li>
              <li>
                <a
                  href="/bookings"
                  className="text-gray-400 hover:text-neon-green transition-colors"
                >
                  Book Me
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-neon-green transition-colors"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-surface border border-white/20 rounded-full flex items-center justify-center hover:bg-neon-green hover:border-neon-green hover:text-background transition-all hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 text-center text-gray-500">
          <p>
            © {currentYear} DJ Jade the Gem. All rights reserved. Made with 💚
            in NOLA
          </p>
        </div>
      </div>
    </footer>
  );
}
