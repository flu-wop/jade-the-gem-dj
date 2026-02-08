import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DJ Jade the Gem | 504 Creative | Fire Mixes & Live Energy",
  description:
    "New Orleans DJ bringing fire mixes and electrifying live energy to clubs, festivals, and private events. Book DJ Jade the Gem for your next event.",
  keywords: [
    "DJ Jade the Gem",
    "New Orleans DJ",
    "504 DJ",
    "NOLA nightlife",
    "live DJ",
    "club DJ",
    "festival DJ",
    "private events",
  ],
  authors: [{ name: "DJ Jade the Gem" }],
  creator: "DJ Jade the Gem",
  publisher: "DJ Jade the Gem",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://djjadethegem.com",
    siteName: "DJ Jade the Gem",
    title: "DJ Jade the Gem | 504 Creative | Fire Mixes & Live Energy",
    description:
      "New Orleans DJ bringing fire mixes and electrifying live energy to clubs, festivals, and private events.",
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      <body className="font-sans bg-background text-white antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
