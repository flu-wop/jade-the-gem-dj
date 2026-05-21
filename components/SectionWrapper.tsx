// 2. SECTION WRAPPER
// Consistent section spacing and optional glow accent.
// Usage: wrap any section content.
// ════════════════════════════════════════════════════════════
interface SectionWrapperProps {
  id?: string;
  eyebrow?: string;
  title: string;
  titleAccent?: string; // rendered in gold
  subtitle?: string;
  children: React.ReactNode;
  glow?: "plum" | "jade" | "none";
}

export function SectionWrapper({
  id,
  eyebrow,
  title,
  titleAccent,
  subtitle,
  children,
  glow = "plum",
}: SectionWrapperProps) {
  const glowClass = {
    plum: "bg-gem-glow",
    jade: "bg-jade-glow",
    none: "",
  }[glow];

  return (
    <section id={id} className="relative bg-obsidian py-24 px-6 overflow-hidden">
      {glow !== "none" && (
        <div className={`absolute inset-0 ${glowClass} pointer-events-none opacity-50`} />
      )}
      {/* Divider line */}
      <div className="relative max-w-5xl mx-auto">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-plum/50 to-transparent mx-auto mb-12" />

        <div className="text-center mb-14">
          {eyebrow && (
            <p className="section-eyebrow font-sub text-xs tracking-[0.4em] uppercase text-jade-light mb-3">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] leading-none text-cream">
            {title}
            {titleAccent && (
              <span className="text-holo ml-3">{titleAccent}</span>
            )}
          </h2>
          {subtitle && (
            <p className="font-body text-sm text-mist/50 mt-4 max-w-md mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}

