// components/AmbientBackdrop.tsx
// A single faint, fixed star + nebula layer behind the WHOLE site, so every
// section sits in the same "space" as the hero. Pure CSS (no WebGL) for
// performance. Deterministic (seeded) so server + client markup match.

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function starLayer(seed: number, count: number, size: number): string {
  const rand = mulberry32(seed);
  let circles = '';
  for (let i = 0; i < count; i++) {
    const x = (rand() * 100).toFixed(2);
    const y = (rand() * 100).toFixed(2);
    const r = (rand() * 1.1 + 0.2).toFixed(2);
    const o = (rand() * 0.5 + 0.15).toFixed(2);
    circles += `<circle cx='${x}%' cy='${y}%' r='${r}' fill='white' opacity='${o}'/>`;
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${circles}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const STARS_FAR = starLayer(12345, 90, 700);
const STARS_NEAR = starLayer(67890, 45, 920);

export default function AmbientBackdrop() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none" style={{ backgroundColor: '#09090f' }}>
      {/* faint brand-color nebula glows */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 40% at 16% 12%, rgba(74,63,143,0.20), transparent 60%),' +
            'radial-gradient(46% 40% at 86% 74%, rgba(42,122,111,0.15), transparent 60%),' +
            'radial-gradient(42% 36% at 58% 98%, rgba(212,175,55,0.06), transparent 60%)',
        }}
      />
      {/* two star layers (different scales) to avoid an obvious tile pattern */}
      <div className="absolute inset-0" style={{ backgroundImage: STARS_FAR, backgroundSize: '700px 700px', opacity: 0.5 }} />
      <div className="absolute inset-0" style={{ backgroundImage: STARS_NEAR, backgroundSize: '920px 920px', opacity: 0.4 }} />
    </div>
  );
}
