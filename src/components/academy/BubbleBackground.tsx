"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// 환경맵을 코드로 직접 생성 (외부 HDR 로딩 없음 → 크래시 없음)
function ManualEnvMap() {
  const { scene } = useThree();

  useEffect(() => {
    const cubeRT = new THREE.WebGLCubeRenderTarget(128);
    const colors = [
      new THREE.Color("#1a1a2e"), // +x
      new THREE.Color("#0f0f1a"), // -x
      new THREE.Color("#2a1a0a"), // +y (위 — 따뜻한 앰버)
      new THREE.Color("#0a0a14"), // -y
      new THREE.Color("#0a1a2a"), // +z (앞 — 블루)
      new THREE.Color("#1a0a1a"), // -z (뒤 — 퍼플)
    ];

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;

    const textures = colors.map((color) => {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 90);
      gradient.addColorStop(0, `#${new THREE.Color(color).clone().multiplyScalar(2).getHexString()}`);
      gradient.addColorStop(1, `#${color.getHexString()}`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);

      const tex = new THREE.CanvasTexture(ctx.getImageData(0, 0, 128, 128) as unknown as HTMLCanvasElement);
      tex.needsUpdate = true;
      return tex;
    });

    const cubeTexture = new THREE.CubeTexture(textures.map((t) => t.image));
    cubeTexture.needsUpdate = true;
    scene.environment = cubeTexture;

    return () => {
      scene.environment = null;
      cubeRT.dispose();
    };
  }, [scene]);

  return null;
}

function Bubble({ position, scale, speed, distort, color }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  distort: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.002;
    meshRef.current.position.x += Math.cos(state.clock.elapsedTime * speed * 0.7) * 0.001;
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.1;
    meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.05;
  });

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.1}
          metalness={0.8}
          distort={distort}
          speed={speed * 0.5}
          envMapIntensity={1.5}
        />
      </mesh>
    </Float>
  );
}

function GlassBubble({ position, scale, speed }: {
  position: [number, number, number];
  scale: number;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.003;
    meshRef.current.position.x += Math.cos(state.clock.elapsedTime * speed * 0.5 + position[1]) * 0.002;
  });

  return (
    <Float speed={speed * 0.8} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0}
          metalness={0.1}
          transmission={0.95}
          thickness={0.5}
          ior={1.5}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const glassBubbles = useMemo(() =>
    Array.from({ length: 20 }, () => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 2,
      ] as [number, number, number],
      scale: Math.random() * 0.15 + 0.05,
      speed: Math.random() * 1.5 + 0.5,
    })),
  []);

  return (
    <>
      {/* 외부 HDR 대신 코드로 환경맵 생성 — 크래시 없음 */}
      <ManualEnvMap />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffd700" />
      <directionalLight position={[-3, -2, 4]} intensity={0.4} color="#3b82f6" />
      <pointLight position={[0, 2, 3]} intensity={0.6} color="#f59e0b" />

      {/* MeshDistortMaterial 물방울 */}
      <Bubble position={[-3, 0.5, -1]} scale={1.8} speed={1.2} distort={0.4} color="#f59e0b" />
      <Bubble position={[2.5, -0.5, -2]} scale={1.3} speed={0.8} distort={0.35} color="#3b82f6" />
      <Bubble position={[0, 1.5, -3]} scale={1.0} speed={1.5} distort={0.5} color="#a855f7" />
      <Bubble position={[-1.5, -1.5, -1.5]} scale={0.6} speed={1.8} distort={0.3} color="#22c55e" />
      <Bubble position={[3.5, 1, -2.5]} scale={0.5} speed={1.0} distort={0.25} color="#f97316" />

      {/* meshPhysicalMaterial 유리 투과 물방울 */}
      {glassBubbles.map((b, i) => (
        <GlassBubble key={i} position={b.position} scale={b.scale} speed={b.speed} />
      ))}
    </>
  );
}

export default function BubbleBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="absolute inset-0 bg-black" />;

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
        onError={() => { /* Canvas 에러 시 무시 — 검은 배경 유지 */ }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
