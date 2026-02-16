import type { Metadata } from "next";
import { Montserrat, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Fonts ──────────────────────────────────────────── */
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

/* ── Metadata ────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL("https://jade-the-gem-dj.vercel.app"),
  title: {
    default: "DJ Jade the Gem | 504 Creative | Fire Mixes & Live Energy",
    template: "%s | DJ Jade the Gem",
  },
  description:
    "New Orleans DJ bringing fire mixes and electrifying live energy to clubs, festivals, and private events. Book DJ Jade the Gem for your next event.",
  keywords: [
    "DJ Jade the Gem",
    "New Orleans DJ",
    "504 DJ",
    "NOLA nightlife",
    "club DJ",
    "festival DJ",
    "book a DJ",
    "504 creative",
  ],
  authors: [{ name: "DJ Jade the Gem" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jade-the-gem-dj.vercel.app",
    siteName: "DJ Jade the Gem",
    title: "DJ Jade the Gem | 504 Creative | Fire Mixes & Live Energy",
    description:
      "New Orleans DJ — fire mixes, live energy, clubs, festivals & private events.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DJ Jade the Gem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DJ Jade the Gem | 504 Creative",
    description: "Fire Mixes & Live Energy from New Orleans",
    creator: "@jluhvv",
    images: ["/images/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

/* ── Layout ──────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${bebas.variable}`}
    >
      <body className="bg-background text-white antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
