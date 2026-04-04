'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ── Neural Network Lines ──────────────────────────────────── */
function NeuralLines({ nodePositions }: { nodePositions: THREE.Vector3[] }) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const pts: number[] = [];
    nodePositions.forEach((p) => {
      pts.push(0, 0, 0, p.x, p.y, p.z);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, [nodePositions]);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.15 + Math.sin(clock.elapsedTime * 1.2) * 0.10;
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#7c3aed" transparent opacity={0.2} />
    </lineSegments>
  );
}

/* ── Orbiting Data Nodes ──────────────────────────────────── */
function DataNode({ radius, speed, offset, color, size }: {
  radius: number; speed: number; offset: number; color: string; size: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime * speed + offset;
    meshRef.current.position.x = Math.cos(t) * radius;
    meshRef.current.position.y = Math.sin(t * 0.7) * radius * 0.4;
    meshRef.current.position.z = Math.sin(t) * radius * 0.6;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
    </mesh>
  );
}

/* ── Hexagonal Ring ───────────────────────────────────────── */
function HexRing({ rotation, speed, color, opacity }: {
  rotation: [number, number, number]; speed: number; color: string; opacity: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = clock.elapsedTime * speed;
    groupRef.current.rotation.x = rotation[0] + clock.elapsedTime * speed * 0.3;
  });

  return (
    <group ref={groupRef} rotation={rotation}>
      <mesh>
        <torusGeometry args={[2.4, 0.012, 8, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

/* ── Mouse-tracking group ─────────────────────────────────── */
function MouseTracker({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [viewport]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += (mouse.current.x * 0.3 - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (mouse.current.y * 0.15 - groupRef.current.rotation.x) * 0.04;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.15;
  });

  return <group ref={groupRef}>{children}</group>;
}

/* ── Outer Wireframe Shell ────────────────────────────────── */
function WireShell() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.elapsedTime * 0.08;
    meshRef.current.rotation.x = clock.elapsedTime * 0.05;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.1, 1]} />
      <meshBasicMaterial color="#7c3aed" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

/* ── Core Brain Sphere ────────────────────────────────────── */
function BrainCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.elapsedTime * 0.15;
    const s = 1 + Math.sin(clock.elapsedTime * 1.5) * 0.04;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.0, 64, 64]} />
        <MeshDistortMaterial
          color="#4c1d95"
          roughness={0.1}
          metalness={0.9}
          distort={0.35}
          speed={2}
          emissive="#6d28d9"
          emissiveIntensity={0.4}
        />
      </mesh>
    </Float>
  );
}

/* ── Particle Cloud ───────────────────────────────────────── */
function ParticleCloud() {
  const pointsRef = useRef<THREE.Points>(null);

  const { posArray, colArray } = useMemo(() => {
    const count = 200;
    const posArray = new Float32Array(count * 3);
    const colArray = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#7c3aed'),
      new THREE.Color('#06b6d4'),
      new THREE.Color('#a78bfa'),
      new THREE.Color('#f59e0b'),
    ];
    for (let i = 0; i < count; i++) {
      const r = 2.5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      posArray[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      posArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      colArray[i * 3]     = c.r;
      colArray[i * 3 + 1] = c.g;
      colArray[i * 3 + 2] = c.b;
    }
    return { posArray, colArray };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    g.setAttribute('color',    new THREE.BufferAttribute(colArray, 3));
    return g;
  }, [posArray, colArray]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.04;
    pointsRef.current.rotation.x = clock.elapsedTime * 0.02;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

/* ── Main Robot Scene ─────────────────────────────────────── */
function RobotScene() {
  const nodePositions = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const r = 1.6 + (i % 3) * 0.15;
      return new THREE.Vector3(
        Math.cos(angle) * r,
        ((i % 3) - 1) * 0.35,
        Math.sin(angle) * r
      );
    }), []);

  return (
    <MouseTracker>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]}   intensity={1.2} color="#7c3aed" />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color="#06b6d4" />
      <pointLight position={[0, 0, 3]}   intensity={0.8} color="#a78bfa" />
      <pointLight position={[0, -3, -2]} intensity={0.4} color="#f59e0b" />

      <WireShell />

      <HexRing rotation={[0, 0, 0]}                      speed={0.25}  color="#7c3aed" opacity={0.6} />
      <HexRing rotation={[Math.PI / 3, 0, 0]}            speed={-0.18} color="#06b6d4" opacity={0.4} />
      <HexRing rotation={[Math.PI / 2, Math.PI / 4, 0]} speed={0.12}  color="#f59e0b" opacity={0.3} />

      <BrainCore />
      <NeuralLines nodePositions={nodePositions} />

      {nodePositions.map((p, i) => (
        <DataNode
          key={i}
          radius={Math.sqrt(p.x * p.x + p.z * p.z)}
          speed={0.3 + i * 0.05}
          offset={(i / 8) * Math.PI * 2}
          color={['#7c3aed', '#06b6d4', '#a78bfa', '#f59e0b'][i % 4]}
          size={0.06 + (i % 3) * 0.02}
        />
      ))}

      <ParticleCloud />
    </MouseTracker>
  );
}

/* ── Export ───────────────────────────────────────────────── */
export default function AIRobotScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <RobotScene />
    </Canvas>
  );
}
