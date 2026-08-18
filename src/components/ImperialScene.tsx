import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Floating gold dust particles
function GoldParticles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const reducedMotion = useReducedMotion();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current || reducedMotion) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.02;
    ref.current.rotation.x = Math.sin(t * 0.01) * 0.1;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#C89B3C"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

// Mountain silhouettes using procedural geometry
function MountainLayer({ z, color, opacity, scale }: {
  z: number; color: string; opacity: number; scale: number;
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    // Procedural mountain outline
    s.moveTo(-12 * scale, -3);
    s.lineTo(-8 * scale, 2 * scale);
    s.lineTo(-6 * scale, 0.5 * scale);
    s.lineTo(-4 * scale, 3.5 * scale);
    s.lineTo(-2 * scale, 1 * scale);
    s.lineTo(0, 4 * scale);
    s.lineTo(2 * scale, 1.5 * scale);
    s.lineTo(4 * scale, 4.5 * scale);
    s.lineTo(6 * scale, 2 * scale);
    s.lineTo(8.5 * scale, 5 * scale);
    s.lineTo(11 * scale, 1.5 * scale);
    s.lineTo(12 * scale, -3);
    s.closePath();
    return s;
  }, [scale]);

  const geometry = useMemo(() => new THREE.ShapeGeometry(shape), [shape]);
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
    }),
    [color, opacity]
  );

  return <mesh geometry={geometry} material={material} position={[0, -4, z]} />;
}

// Atmospheric mist plane
function MistPlane() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current || reducedMotion) return;
    ref.current.material instanceof THREE.MeshBasicMaterial
      ? null
      : null;
    const t = clock.getElapsedTime();
    ref.current.position.x = Math.sin(t * 0.1) * 0.5;
    if (ref.current.material instanceof THREE.MeshBasicMaterial) {
      ref.current.material.opacity = 0.04 + Math.sin(t * 0.3) * 0.02;
    }
  });

  return (
    <mesh ref={ref} position={[0, -2, 1]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 8, 1, 1]} />
      <meshBasicMaterial color="#DCC38E" transparent opacity={0.05} />
    </mesh>
  );
}

// Subtle palace silhouette
function PalaceSilhouette() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    // Simplified palace/pagoda outline
    s.moveTo(-3, 0);
    s.lineTo(-3, 1.5);
    s.lineTo(-3.5, 1.5);
    s.lineTo(-2, 3.5);
    s.lineTo(-2.5, 3.5);
    s.lineTo(-1, 5);
    s.lineTo(-1.5, 5);
    s.lineTo(0, 6.5);
    s.lineTo(1.5, 5);
    s.lineTo(1, 5);
    s.lineTo(2.5, 3.5);
    s.lineTo(2, 3.5);
    s.lineTo(3.5, 1.5);
    s.lineTo(3, 1.5);
    s.lineTo(3, 0);
    s.closePath();
    return s;
  }, []);

  const geometry = useMemo(() => new THREE.ShapeGeometry(shape), [shape]);
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: new THREE.Color('#1D1208'),
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    }),
    []
  );

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, -3.5, -4]}
      scale={[0.6, 0.6, 1]}
    />
  );
}

// Lantern glows
function Lantern({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.PointLight>(null);
  const reducedMotion = useReducedMotion();

  useFrame(({ clock }) => {
    if (!ref.current || reducedMotion) return;
    const t = clock.getElapsedTime();
    ref.current.intensity = 0.3 + Math.sin(t * 1.5 + position[0]) * 0.15;
  });

  return (
    <pointLight ref={ref} position={position} color="#C89B3C" intensity={0.3} distance={5} />
  );
}

// Main camera rig
function CameraRig() {
  const { camera } = useThree();
  const reducedMotion = useReducedMotion();

  useFrame(({ clock, mouse }) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime();
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.y * 0.3 - camera.position.y + 0.5) * 0.02;
    camera.position.z = 8 + Math.sin(t * 0.1) * 0.2;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

interface ImperialSceneProps {
  isMobile: boolean;
}

export default function ImperialScene({ isMobile }: ImperialSceneProps) {
  const particleCount = isMobile ? 300 : 800;

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'low-power' }}
      dpr={isMobile ? 1 : [1, 1.5]}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      {/* Ambient light */}
      <ambientLight color="#1A1208" intensity={0.8} />

      {/* Gold key light */}
      <directionalLight
        position={[5, 8, 3]}
        color="#C89B3C"
        intensity={0.4}
      />

      {/* Red ambient fill */}
      <hemisphereLight
        color="#7A1717"
        groundColor="#090806"
        intensity={0.2}
      />

      {/* Lanterns */}
      {!isMobile && (
        <>
          <Lantern position={[-4, 2, 2]} />
          <Lantern position={[4, 2, 2]} />
          <Lantern position={[0, 4, 1]} />
        </>
      )}

      {/* Particles */}
      <GoldParticles count={particleCount} />

      {/* Mountains - layered parallax */}
      <MountainLayer z={-8} color="#0A0806" opacity={1} scale={1.4} />
      <MountainLayer z={-6} color="#0D0A07" opacity={0.9} scale={1.1} />
      <MountainLayer z={-4} color="#12100C" opacity={0.8} scale={0.9} />
      <MountainLayer z={-2} color="#1A1510" opacity={0.6} scale={0.7} />

      {/* Palace */}
      {!isMobile && <PalaceSilhouette />}

      {/* Mist */}
      <MistPlane />

      {/* Camera rig */}
      {!isMobile && <CameraRig />}
    </Canvas>
  );
}
