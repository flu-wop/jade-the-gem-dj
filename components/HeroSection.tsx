'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Music, Headphones } from 'lucide-react';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-6 pt-24 pb-20">

      {/* ── R3F canvas — gem particle field ── */}
      <HeroCanvas />

      {/* Text-contrast gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-transparent to-background z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40 z-[1] pointer-events-none" />

      {/* Noise grain */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none z-[2]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Holographic globe logo ── */}
      <div className="relative z-10 animate-float mb-8">
        <div className="absolute inset-[-20px] rounded-full bg-gradient-to-br from-plum via-jade to-gold opacity-30 blur-2xl animate-pulse-glow" />
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden ring-2 ring-gold/30 shadow-[0_0_60px_#4a3f8f66,0_0_120px_#2a7a6f33]">
          <Image
            src="/images/logo-holo-globe.png"
            alt="DJ Jade the Gem — Hidden Gem globe logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* ── Headline ── */}
      <div className="relative z-10 text-center max-w-3xl">
        <p className="section-label mb-3" style={{ animationDelay: '0.1s' }}>
          504 Creative · New Orleans
        </p>

        <h1
          className="font-display leading-none text-[clamp(3.5rem,12vw,8rem)] text-holo drop-shadow-[0_0_30px_rgba(74,63,143,0.6)]"
          style={{ animationDelay: '0.2s' }}
        >
          DJ JADE
          <br />
          THE GEM
        </h1>

        <p
          className="font-sub text-[clamp(0.9rem,2.5vw,1.3rem)] text-mist tracking-widest uppercase mt-4 mb-10"
          style={{ animationDelay: '0.35s' }}
        >
          DJ · Producer · Hidden Gem
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/music" className="btn-primary">
            <Music size={15} />
            Listen Now
          </Link>
          <Link href="/bookings" className="btn-secondary">
            <Headphones size={15} />
            Book Me
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-mist/30 text-[10px] font-sub tracking-widest uppercase animate-bounce z-10">
        <span>Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-mist/30 to-transparent" />
      </div>
    </section>
  );
}
