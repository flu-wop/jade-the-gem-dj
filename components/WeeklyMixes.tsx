"use client";

import weeklyMixes, { type WeeklyMix } from "@/data/weeklyMixes";

// ─── Single mix card ──────────────────────────────────────────────────────────

function MixCard({ mix }: { mix: WeeklyMix }) {
  // "2025-03-15" → "March 15, 2025"
  const formatted = new Date(mix.date + "T00:00:00").toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="wm-card">
      <div className="wm-meta">
        <span className="wm-date">{formatted}</span>
      </div>

      {/* Anton font on mix title */}
      <h3 className="wm-title">{mix.title}</h3>
      <p className="wm-desc">{mix.description}</p>

      {/* Responsive SoundCloud embed */}
      <div className="wm-embed-wrap">
        <iframe
          title={mix.title}
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={mix.embedSrc}
          className="wm-embed"
          loading="lazy"
        />
      </div>

      <style jsx>{`
        .wm-card {
          background: #151020;
          border: 1px solid #2a1f4a;
          border-radius: 6px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          transition: border-color 0.2s;
        }
        .wm-card:hover { border-color: #4a3f8f; }
        .wm-date {
          font-size: 0.62rem; letter-spacing: 0.14em;
          text-transform: uppercase; color: #d4af37;
        }
        /* Anton font + drip shadow on mix title */
        .wm-title {
          font-family: var(--font-anton, sans-serif);
          font-size: 0.95rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #b8a7d9;
          margin: 0;
          text-shadow: 1px 1px 0px #4a3f8f;
        }
        .wm-desc {
          font-size: 0.76rem; color: #6a5a8a; line-height: 1.5; margin: 0;
        }
        .wm-embed-wrap {
          margin-top: 0.4rem; border-radius: 4px; overflow: hidden; width: 100%;
        }
        .wm-embed { display: block; width: 100%; }
      `}</style>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

export default function WeeklyMixes() {
  const sorted = [...weeklyMixes].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section id="weekly-mixes" className="wm-section">
      {/* Bungee font on section header */}
      <h2 className="wm-heading">## Weekly Lab Drops ∞</h2>
      <p className="wm-sub">Fresh heat every week · Straight from the lab</p>

      {sorted.length === 0 ? (
        <p className="wm-empty">No drops yet — check back soon.</p>
      ) : (
        <div className="wm-grid">
          {sorted.map((mix) => <MixCard key={mix.id} mix={mix} />)}
        </div>
      )}

      <style jsx>{`
        .wm-section { padding: 5rem 1.5rem; max-width: 1100px; margin: 0 auto; }
        .wm-heading {
          font-family: var(--font-bungee, monospace);
          font-size: clamp(1.2rem, 2.8vw, 1.8rem);
          color: #d4af37;
          letter-spacing: 0.04em;
          margin-bottom: 0.3rem;
          text-shadow: 2px 2px 0px #4a3f8f;
        }
        .wm-sub {
          font-size: 0.7rem; color: #4a3f8f;
          letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2.5rem;
        }
        .wm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .wm-empty { color: #2a1f4a; font-size: 0.78rem; letter-spacing: 0.08em; }
      `}</style>
    </section>
  );
}
