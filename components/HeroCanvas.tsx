'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const GEM_COLORS = [
  '#4a3f8f', // plum
  '#2a7a6f', // jade
  '#d4af37', // gold
  '#3aa898', // jade-light
  '#6355b8', // plum-light
  '#c4b8e0', // mist
];

interface GemProps {
  position: [number, number, number];
  rotSpeed: [number, number, number];
  scale: number;
  color: string;
}

function Gem({ position, rotSpeed, scale, color }: GemProps) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.x += rotSpeed[0] * delta;
    ref.current.rotation.y += rotSpeed[1] * delta;
    ref.current.rotation.z += rotSpeed[2] * delta;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        roughness={0.05}
        metalness={0.85}
        transparent
        opacity={0.72}
      />
    </mesh>
  );
}

function GemField() {
  const gems = useMemo(
    () =>
      Array.from({ length: 24 }, () => ({
        position: [
          (Math.random() - 0.5) * 24,
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 8 - 2,
        ] as [number, number, number],
        rotSpeed: [
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.4,
        ] as [number, number, number],
        scale: 0.08 + Math.random() * 0.18,
        color: GEM_COLORS[Math.floor(Math.random() * GEM_COLORS.length)],
      })),
    []
  );

  return (
    <>
      {gems.map((g, i) => (
        <Gem key={i} {...g} />
      ))}
    </>
  );
}

// ── Spiral galaxy: bright core behind the logo, arms swirling around it ──
// Tweakable knobs are the consts at the top of the useMemo.
function Galaxy() {
  const ref = useRef<THREE.Points>(null!);

  const { geometry, material } = useMemo(() => {
    const COUNT = 12000;
    const RADIUS = 9;          // how far the arms reach
    const BRANCHES = 5;        // number of spiral arms
    const SPIN = 1.1;          // how tightly the arms wind
    const RANDOMNESS = 0.4;    // scatter off the arms
    const RAND_POWER = 3;      // higher = tighter to the arm centerline
    const CORE = new THREE.Color('#f3d9a0');   // warm gold core (behind logo)
    const EDGE = new THREE.Color('#4a3f8f');   // plum arms

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 1.5) * RADIUS; // cluster toward center
      const branchAngle = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
      const spinAngle = r * SPIN;

      const rand = () =>
        Math.pow(Math.random(), RAND_POWER) *
        (Math.random() < 0.5 ? 1 : -1) *
        RANDOMNESS *
        r;

      positions[i3]     = Math.cos(branchAngle + spinAngle) * r + rand();
      positions[i3 + 1] = Math.sin(branchAngle + spinAngle) * r + rand();
      positions[i3 + 2] = rand() * 0.6; // thin disk depth (mostly face-on)

      const c = CORE.clone().lerp(EDGE, r / RADIUS);
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.045,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
    });

    return { geometry, material };
  }, []);

  // Slow swirl around the logo
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.04;
  });

  // Slight tilt for a touch of 3D depth; sits behind the gems at z = -2
  return (
    <points
      ref={ref}
      geometry={geometry}
      material={material}
      position={[0, 0, -2]}
      rotation={[0.35, 0, 0]}
    />
  );
}

function CameraDrift() {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    camera.position.x = Math.sin(clock.elapsedTime * 0.12) * 0.6;
    camera.position.y = Math.cos(clock.elapsedTime * 0.08) * 0.4;
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
      <color attach="background" args={['#0e0b14']} />
      <ambientLight intensity={0.25} color="#2a1f3d" />
      <pointLight position={[8, 8, 6]}   color="#4a3f8f" intensity={3}   />
      <pointLight position={[-8, -6, 4]} color="#2a7a6f" intensity={2.5} />
      <pointLight position={[0, 2, 8]}   color="#d4af37" intensity={1}   />
      <Galaxy />
      <Stars radius={120} depth={60} count={1500} factor={3.5} saturation={0.6} fade speed={0.8} />
      <GemField />
      <CameraDrift />
    </Canvas>
  );
}
