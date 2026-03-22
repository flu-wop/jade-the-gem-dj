"use client";

import weeklyMixes, { type WeeklyMix } from "@/data/weeklyMixes";

// ─── Single mix card ──────────────────────────────────────────────────────────

function MixCard({ mix }: { mix: WeeklyMix }) {
  // Format date: "2025-03-15" → "Mar 15 · 2025"
  const formatted = new Date(mix.date + "T00:00:00").toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <div className="mix-card">
      <div className="mix-meta">
        <span className="mix-date">{formatted}</span>
      </div>
      <h3 className="mix-title">{mix.title}</h3>
      <p className="mix-desc">{mix.description}</p>

      {/* SoundCloud embed — responsive height */}
      <div className="mix-embed-wrap">
        <iframe
          className="mix-embed"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={mix.embedSrc}
          title={mix.title}
        />
      </div>

      <style jsx>{`
        .mix-card {
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 4px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          transition: border-color 0.2s;
        }
        .mix-card:hover {
          border-color: #2a2a2a;
        }
        .mix-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mix-date {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #00ff88;
        }
        .mix-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #e0e0e0;
          margin: 0;
          letter-spacing: 0.03em;
        }
        .mix-desc {
          font-size: 0.78rem;
          color: #555;
          line-height: 1.55;
          margin: 0;
        }
        .mix-embed-wrap {
          margin-top: 0.5rem;
          border-radius: 2px;
          overflow: hidden;
          width: 100%;
        }
        .mix-embed {
          width: 100%;
          height: 166px; /* SoundCloud standard single-track height */
          display: block;
        }
      `}</style>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function WeeklyMixes() {
  return (
    <section id="weekly-mixes" className="mixes-section">
      <h2 className="section-heading">## Weekly Lab Drops ∞</h2>
      <p className="mixes-sub">Fresh heat every week · Straight from the lab</p>

      {weeklyMixes.length === 0 ? (
        <p className="mixes-empty">No drops yet. Check back soon.</p>
      ) : (
        <div className="mixes-grid">
          {/* Most recent first */}
          {[...weeklyMixes]
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((mix) => (
              <MixCard key={mix.id} mix={mix} />
            ))}
        </div>
      )}

      <style jsx>{`
        .mixes-section {
          padding: 5rem 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-heading {
          font-family: var(--font-mono, monospace);
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          color: #00ff88;
          letter-spacing: 0.05em;
          margin-bottom: 0.4rem;
        }
        .mixes-sub {
          font-size: 0.72rem;
          color: #444;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 2.5rem;
        }
        .mixes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .mixes-empty {
          color: #333;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
      `}</style>
    </section>
  );
}
