import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";

function CoffeeCup() {
  const cupRef = useRef<THREE.Group>(null);
  const beansRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (cupRef.current) {
      cupRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
    }
    if (beansRef.current) {
      beansRef.current.rotation.y = time * 0.5;
    }
  });

  return (
    <group>
      {/* Main Coffee Cup */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={cupRef}>
          {/* Cup Body */}
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[1, 0.8, 1.5, 32]} />
            <meshStandardMaterial color="#8B4513" roughness={0.3} metalness={0.1} />
          </mesh>
          
          {/* Cup Handle */}
          <mesh position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.4, 0.1, 16, 32, Math.PI]} />
            <meshStandardMaterial color="#8B4513" roughness={0.3} metalness={0.1} />
          </mesh>
          
          {/* Coffee Liquid */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.95, 0.85, 0.2, 32]} />
            <meshStandardMaterial color="#3E2723" roughness={0.2} metalness={0.3} />
          </mesh>
          
          {/* Foam/Cream */}
          <mesh position={[0, 0.75, 0]}>
            <sphereGeometry args={[0.9, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#F5DEB3" roughness={0.4} />
          </mesh>
        </group>
      </Float>

      {/* Floating Coffee Beans */}
      <group ref={beansRef}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={[-2, 1, 0]} castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#6F4E37" roughness={0.6} />
          </mesh>
        </Float>
        
        <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.8}>
          <mesh position={[2, -0.5, 0.5]} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#6F4E37" roughness={0.6} />
          </mesh>
        </Float>
        
        <Float speed={2.2} rotationIntensity={0.5} floatIntensity={1.2}>
          <mesh position={[-1.5, -1, 1]} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#6F4E37" roughness={0.6} />
          </mesh>
        </Float>
        
        <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.9}>
          <mesh position={[1.8, 1.2, -0.5]} castShadow>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#6F4E37" roughness={0.6} />
          </mesh>
        </Float>
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#FFE4B5" />
    </group>
  );
}

export default function CoffeeCup3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <CoffeeCup />
      </Canvas>
    </div>
  );
}
