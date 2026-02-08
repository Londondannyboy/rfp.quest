'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// UK position on globe (latitude 54, longitude -2)
const UK_POSITION = new THREE.Vector3(
  Math.cos((54 * Math.PI) / 180) * Math.cos((-2 * Math.PI) / 180) * 2.1,
  Math.sin((54 * Math.PI) / 180) * 2.1,
  Math.cos((54 * Math.PI) / 180) * Math.sin((-2 * Math.PI) / 180) * 2.1
);

function GlobeWireframe() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={meshRef}>
        {/* Main globe wireframe */}
        <Sphere args={[2, 32, 32]}>
          <meshBasicMaterial
            color="#14b8a6"
            wireframe
            transparent
            opacity={0.15}
          />
        </Sphere>

        {/* Inner glow sphere */}
        <Sphere args={[1.98, 32, 32]}>
          <meshBasicMaterial
            color="#0d9488"
            transparent
            opacity={0.05}
          />
        </Sphere>

        {/* UK Marker - glowing point */}
        <mesh position={UK_POSITION}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#14b8a6" />
        </mesh>

        {/* UK Marker glow ring */}
        <mesh position={UK_POSITION}>
          <ringGeometry args={[0.1, 0.15, 32]} />
          <meshBasicMaterial
            color="#14b8a6"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Latitude lines */}
        {[-60, -30, 0, 30, 60].map((lat) => (
          <mesh key={lat} rotation={[Math.PI / 2, 0, 0]} position={[0, Math.sin((lat * Math.PI) / 180) * 2, 0]}>
            <ringGeometry
              args={[
                Math.cos((lat * Math.PI) / 180) * 2 - 0.01,
                Math.cos((lat * Math.PI) / 180) * 2,
                64,
              ]}
            />
            <meshBasicMaterial color="#14b8a6" transparent opacity={0.2} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  // Generate random positions
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3 + Math.random() * 2;

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.02}
        color="#14b8a6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      <Stars
        radius={50}
        depth={50}
        count={500}
        factor={2}
        saturation={0}
        fade
        speed={0.5}
      />

      <GlobeWireframe />
      <FloatingParticles />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-32 h-32 rounded-full border-4 border-teal-500/30 border-t-teal-500 animate-spin" />
    </div>
  );
}

export function GlobeScene() {
  return (
    <div className="relative w-full h-64 bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl overflow-hidden">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>

      {/* Gradient overlay for text */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent" />

      {/* Label */}
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-xs text-teal-400 font-medium">
          UK Government Tenders
        </p>
        <p className="text-[10px] text-slate-400">
          Real-time procurement opportunities
        </p>
      </div>
    </div>
  );
}
