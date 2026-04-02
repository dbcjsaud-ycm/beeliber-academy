"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// 작은 빌리버 테마 물방울 (페이지 배경용 — 가벼움)
function MiniBubble({ position, scale, speed, color }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y += Math.sin(t * speed) * 0.001;
    meshRef.current.position.x += Math.cos(t * speed * 0.6) * 0.0005;
    meshRef.current.rotation.z = t * speed * 0.03;
  });

  return (
    <Float speed={speed * 0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.15}
          metalness={0.7}
          distort={0.2}
          speed={speed * 0.3}
          transparent
          opacity={0.25}
        />
      </mesh>
    </Float>
  );
}

function GlassDot({ position, scale, speed }: {
  position: [number, number, number];
  scale: number;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y += Math.sin(t * speed + position[0]) * 0.002;
    meshRef.current.position.x += Math.cos(t * speed * 0.4 + position[1]) * 0.001;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#ffffff" roughness={0} metalness={0.3} transparent opacity={0.06} />
    </mesh>
  );
}

function Scene() {
  const dots = useMemo(() =>
    Array.from({ length: 12 }, () => ({
      position: [(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 4 - 4] as [number, number, number],
      scale: Math.random() * 0.08 + 0.03,
      speed: Math.random() * 1 + 0.3,
    })),
  []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[4, 4, 4]} intensity={0.4} color="#ffd700" />
      <directionalLight position={[-3, -2, 3]} intensity={0.2} color="#3b82f6" />

      {/* 빌리버 테마 물방울 — 작고 은은하게 */}
      <MiniBubble position={[-5, 2, -4]} scale={0.8} speed={0.5} color="#f59e0b" />
      <MiniBubble position={[5, -1, -5]} scale={0.6} speed={0.4} color="#3b82f6" />
      <MiniBubble position={[0, 3, -6]} scale={0.5} speed={0.6} color="#a855f7" />

      {/* 유리 파티클 */}
      {dots.map((d, i) => <GlassDot key={i} position={d.position} scale={d.scale} speed={d.speed} />)}
    </>
  );
}

export default function AcademyBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
