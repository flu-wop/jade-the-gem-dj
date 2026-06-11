'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── Textures (canvas-generated; client-only via dynamic ssr:false) ──
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
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    spike(s / 2, 1.4);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// approx gaussian
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

// Milky Way band direction (diagonal, like the reference photo)
const BAND = THREE.MathUtils.degToRad(118);
const DIR: [number, number] = [Math.cos(BAND), Math.sin(BAND)];
const PERP: [number, number] = [-DIR[1], DIR[0]];

const COOL = ['#ffffff', '#dfe6ff', '#c4d2ff', '#eaf0ff'];
const WARM = ['#ffe9c6', '#ffd9a0', '#fff2da'];

function pickColor(warmChance: number): THREE.Color {
  const set = Math.random() < warmChance ? WARM : COOL;
  return new THREE.Color(set[Math.floor(Math.random() * set.length)]);
}

interface FieldOpts {
  count: number;
  spreadX: number;
  spreadY: number;
  band: boolean;
  sigma: number;
  warmChance: number;
  bluen: number;
}

function buildField({ count, spreadX, spreadY, band, sigma, warmChance, bluen }: FieldOpts) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    let x: number, y: number;
    if (band) {
      const u = (Math.random() * 2 - 1) * spreadX;
      const v = gauss() * sigma;
      x = DIR[0] * u + PERP[0] * v;
      y = DIR[1] * u + PERP[1] * v;
    } else {
      x = (Math.random() * 2 - 1) * spreadX;
      y = (Math.random() * 2 - 1) * spreadY;
    }
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = -6 + (Math.random() - 0.5) * 4;

    const col = pickColor(warmChance);
    if (bluen > 0) col.lerp(new THREE.Color('#7d8cff'), bluen * Math.random());
    colors[i3] = col.r;
    colors[i3 + 1] = col.g;
    colors[i3 + 2] = col.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
}

function Starfield() {
  const dot = useMemo(softDot, []);
  const flare = useMemo(starFlare, []);

  const fine = useMemo(() => buildField({ count: 2600, spreadX: 30, spreadY: 22, band: false, sigma: 0, warmChance: 0.12, bluen: 0 }), []);
  const mid = useMemo(() => buildField({ count: 1400, spreadX: 30, spreadY: 22, band: false, sigma: 0, warmChance: 0.18, bluen: 0 }), []);
  const bandStars = useMemo(() => buildField({ count: 2200, spreadX: 28, spreadY: 22, band: true, sigma: 3.4, warmChance: 0.06, bluen: 0.35 }), []);

  const bright = useMemo(() => {
    const n = 34;
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() * 2 - 1) * 28;
      positions[i3 + 1] = (Math.random() * 2 - 1) * 20;
      positions[i3 + 2] = -5 + (Math.random() - 0.5) * 3;
      const col = pickColor(0.5);
      colors[i3] = col.r; colors[i3 + 1] = col.g; colors[i3 + 2] = col.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  const haze = useMemo(() => {
    const n = 5;
    const positions = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const i3 = i * 3;
      const u = (Math.random() * 2 - 1) * 18;
      const v = gauss() * 2;
      positions[i3] = DIR[0] * u + PERP[0] * v;
      positions[i3 + 1] = DIR[1] * u + PERP[1] * v;
      positions[i3 + 2] = -8;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const group = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.004;
  });

  return (
    <group ref={group}>
      <points geometry={haze}>
        <pointsMaterial map={dot} color="#5566bb" size={9} sizeAttenuation transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points geometry={bandStars}>
        <pointsMaterial map={dot} size={0.05} sizeAttenuation vertexColors transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points geometry={fine}>
        <pointsMaterial map={dot} size={0.03} sizeAttenuation vertexColors transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points geometry={mid}>
        <pointsMaterial map={dot} size={0.06} sizeAttenuation vertexColors transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points geometry={bright}>
        <pointsMaterial map={flare} size={0.9} sizeAttenuation vertexColors transparent opacity={1} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

function CameraDrift() {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    camera.position.x = Math.sin(clock.elapsedTime * 0.05) * 0.25;
    camera.position.y = Math.cos(clock.elapsedTime * 0.04) * 0.18;
  });
  return null;
}

export default function HeroCanvas() {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      camera={{ position: [0, 0, 9], fov: 58 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#070a14']} />
      <Starfield />
      <CameraDrift />
    </Canvas>
  );
}
