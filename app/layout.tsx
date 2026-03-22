import type { Metadata } from "next";
import { Montserrat, Bebas_Neue, Bungee, Anton } from "next/font/google";
import Script from "next/script";
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

// Bold condensed — section headings, Weekly Mixes header, merch section title
const bungee = Bungee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bungee",
  display: "swap",
});

// Ultra-condensed bold — merch card titles, sub-labels
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
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
    "DJ Jade The Gem — New Orleans merch, fire mixes, and live energy. 504 Creative. Book your event or shop the drop.",
  keywords: [
    "DJ Jade The Gem",
    "New Orleans merch",
    "New Orleans DJ",
    "504 DJ",
    "NOLA mixes",
    "NOLA nightlife",
    "club DJ",
    "festival DJ",
    "book a DJ",
    "504 creative",
    "Hidden Gem tee",
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
      className={`${montserrat.variable} ${bebas.variable} ${bungee.variable} ${anton.variable}`}
    >
      <head>
        {/* Snipcart styles */}
        <link
          rel="stylesheet"
          href="https://cdn.snipcart.com/themes/v3.7.3/default/snipcart.css"
        />
      </head>
      <body className="bg-background text-white antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />

        {/* Snipcart cart widget */}
        <div
          hidden
          id="snipcart"
          data-api-key="ZjJjMjEwZTItNjE2Yy00MzJkLWI0MDQtOTYyYmI3MTEyYzgwNjM5MDk4MDA2OTM4MzczMzI4"
          data-currency="usd"
        />
        <Script
          src="https://cdn.snipcart.com/themes/v3.7.3/default/snipcart.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
