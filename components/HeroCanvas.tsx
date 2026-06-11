'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── depth volume the camera drifts through ──
const NEAR = 8;     // recycle stars just before they reach the camera (z=9)
const DEPTH = 46;   // far plane = NEAR - DEPTH = -38
const FORWARD = 1.4; // units/sec drift through the field (set to 0 for a still sky)

// ── canvas-generated textures (client-only via dynamic ssr:false) ──
function softDot(): THREE.Texture {
  const s = 64;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.7)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.12)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function starFlare(): THREE.Texture {
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.08, 'rgba(255,247,228,0.85)');
  g.addColorStop(0.3, 'rgba(255,224,160,0.18)');
  g.addColorStop(1, 'rgba(255,224,160,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  ctx.globalCompositeOperation = 'lighter';
  ctx.translate(s / 2, s / 2);
  const spike = (len: number, w: number) => {
    const lg = ctx.createLinearGradient(0, 0, len, 0);
    lg.addColorStop(0, 'rgba(255,250,235,0.9)');
    lg.addColorStop(1, 'rgba(255,250,235,0)');
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.moveTo(0, -w);
    ctx.lineTo(len, 0);
    ctx.lineTo(0, w);
    ctx.closePath();
    ctx.fill();
  };
  for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); spike(s / 2, 1.4); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function softCloud(hex: string): THREE.Texture {
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  const col = new THREE.Color(hex);
  const r = Math.round(col.r * 255), gg = Math.round(col.g * 255), b = Math.round(col.b * 255);
  g.addColorStop(0, `rgba(${r},${gg},${b},0.5)`);
  g.addColorStop(0.5, `rgba(${r},${gg},${b},0.12)`);
  g.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

// Milky Way band axis (diagonal, like the reference)
const BAND = THREE.MathUtils.degToRad(118);
const DIR: [number, number] = [Math.cos(BAND), Math.sin(BAND)];
const PERP: [number, number] = [-DIR[1], DIR[0]];

const COOL = ['#ffffff', '#dfe6ff', '#c4d2ff', '#eaf0ff'];
const WARM = ['#ffe9c6', '#ffd9a0', '#fff2da'];
const pickColor = (warmChance: number) => {
  const set = Math.random() < warmChance ? WARM : COOL;
  return new THREE.Color(set[Math.floor(Math.random() * set.length)]);
};

function buildVolume(count: number, bandFrac: number, sigma: number, warmChance: number, bluen: number, rangeXY: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    let x: number, y: number;
    if (Math.random() < bandFrac) {
      const u = (Math.random() * 2 - 1) * rangeXY;
      const v = gauss() * sigma;
      x = DIR[0] * u + PERP[0] * v;
      y = DIR[1] * u + PERP[1] * v;
    } else {
      x = (Math.random() * 2 - 1) * rangeXY;
      y = (Math.random() * 2 - 1) * rangeXY * 0.8;
    }
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = NEAR - Math.random() * DEPTH;
    const col = pickColor(warmChance);
    if (bluen > 0) col.lerp(new THREE.Color('#7d8cff'), bluen * Math.random());
    colors[i3] = col.r; colors[i3 + 1] = col.g; colors[i3 + 2] = col.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
}

function recycle(points: THREE.Points, speed: number, delta: number) {
  const attr = points.geometry.attributes.position as THREE.BufferAttribute;
  const a = attr.array as Float32Array;
  for (let i = 2; i < a.length; i += 3) {
    a[i] += speed * delta;
    if (a[i] > NEAR) a[i] -= DEPTH;
  }
  attr.needsUpdate = true;
}

function StarLayer({ geo, tex, size, opacity, speed }: { geo: THREE.BufferGeometry; tex: THREE.Texture; size: number; opacity: number; speed: number; }) {
  const ref = useRef<THREE.Points>(null!);
  useFrame((_, delta) => { if (ref.current) recycle(ref.current, speed, delta); });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial map={tex} size={size} sizeAttenuation vertexColors transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Nebula({ tex }: { tex: THREE.Texture }) {
  const ref = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const n = 6;
    const positions = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const i3 = i * 3;
      const u = (Math.random() * 2 - 1) * 22;
      const v = gauss() * 4;
      positions[i3] = DIR[0] * u + PERP[0] * v;
      positions[i3 + 1] = DIR[1] * u + PERP[1] * v;
      positions[i3 + 2] = NEAR - Math.random() * DEPTH;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  useFrame((_, delta) => { if (ref.current) recycle(ref.current, FORWARD * 0.6, delta); });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial map={tex} color="#4a3f8f" size={16} sizeAttenuation transparent opacity={0.07} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Scene() {
  const dot = useMemo(softDot, []);
  const flare = useMemo(starFlare, []);
  const cloud = useMemo(() => softCloud('#5566bb'), []);

  const dust = useMemo(() => buildVolume(3200, 0.7, 3.2, 0.05, 0.4, 34), []);   // Milky Way dust lane
  const field = useMemo(() => buildVolume(3600, 0.15, 6, 0.16, 0, 36), []);     // general depth field
  const bright = useMemo(() => buildVolume(40, 0.3, 5, 0.5, 0, 32), []);        // flared accents

  // parallax: gentle camera sway so depth reads as you drift
  const { camera } = useThree();
  useFrame(({ clock }) => {
    camera.position.x = Math.sin(clock.elapsedTime * 0.06) * 0.6;
    camera.position.y = Math.cos(clock.elapsedTime * 0.05) * 0.4;
    camera.lookAt(0, 0, -10);
  });

  return (
    <>
      <Nebula tex={cloud} />
      <StarLayer geo={dust} tex={dot} size={0.07} opacity={0.85} speed={FORWARD} />
      <StarLayer geo={field} tex={dot} size={0.05} opacity={0.9} speed={FORWARD} />
      <StarLayer geo={bright} tex={flare} size={1.1} opacity={1} speed={FORWARD} />
    </>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      camera={{ position: [0, 0, 9], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#070a14']} />
      <Scene />
    </Canvas>
  );
}
