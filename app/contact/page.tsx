import type { Metadata } from "next";
import { Instagram, Music, Twitter, Mail } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Contact | DJ Jade the Gem",
  description:
    "Get in touch with DJ Jade the Gem for booking inquiries, collaborations, or just to say hello.",
};

const socialLinks = [
  {
    platform: "Instagram",
    handle: "@jluhvv",
    url: "https://instagram.com/jluhvv",
    icon: Instagram,
    color: "text-pink-500",
  },
  {
    platform: "SoundCloud",
    handle: "jadethegem888",
    url: "https://soundcloud.com/jadethegem888",
    icon: Music,
    color: "text-orange-500",
  },
  {
    platform: "X (Twitter)",
    handle: "@jluhvv",
    url: "https://twitter.com/jluhvv",
    icon: Twitter,
    color: "text-blue-400",
  },
  {
    platform: "Email",
    handle: "booking@djjadethegem.com",
    url: "mailto:booking@djjadethegem.com",
    icon: Mail,
    color: "text-neon-green",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="section-title">Get In Touch</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Let's connect! Whether you want to book me for an event, collaborate
            on a project, or just chat about music.
          </p>
        </div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {socialLinks.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-8 flex items-center gap-6 hover:scale-105 transition-all group"
            >
              <div
                className={`${social.color} group-hover:scale-110 transition-transform`}
              >
                <social.icon className="w-12 h-12" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-display text-white mb-1">
                  {social.platform}
                </div>
                <div className="text-gray-400">{social.handle}</div>
              </div>
              <div className="text-neon-green opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
                →
              </div>
            </a>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="glass-card p-8 text-center">
            <h3 className="text-2xl font-display text-neon-purple mb-4">
              Booking Inquiries
            </h3>
            <p className="text-gray-400 mb-6">
              Ready to book me for your event? Fill out the booking form for a
              quick response.
            </p>
            <a href="/bookings" className="btn-primary">
              Request a Quote
            </a>
          </div>

          <div className="glass-card p-8 text-center">
            <h3 className="text-2xl font-display text-neon-green mb-4">
              Press & Media
            </h3>
            <p className="text-gray-400 mb-6">
              Need press photos, bio, or media kit? Send me an email and I'll
              get you sorted.
            </p>
            <a
              href="mailto:booking@djjadethegem.com?subject=Press%20Inquiry"
              className="btn-secondary"
            >
              Email for Press Kit
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="glass-card p-12 text-center">
          <h2 className="text-3xl font-display text-neon-gold mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join the mailing list for exclusive updates, new releases, and event
            announcements
          </p>
          <div className="max-w-2xl mx-auto">
            <NewsletterForm />
          </div>
        </div>

        {/* Response Time Note */}
        <div className="mt-12 text-center text-gray-500">
          <p>I typically respond to inquiries within 24-48 hours.</p>
          <p className="mt-2">
            For urgent booking requests, please DM me on Instagram{" "}
            <a
              href="https://instagram.com/jluhvv"
              className="text-neon-green hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @jluhvv
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
