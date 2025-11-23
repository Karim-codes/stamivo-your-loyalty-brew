import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function CuteCoffeeCup() {
  const groupRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Gentle breathing animation
    if (groupRef.current) {
      groupRef.current.scale.y = 1 + Math.sin(time * 1.5) * 0.05;
      groupRef.current.scale.x = 1 + Math.sin(time * 1.5) * 0.02;
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    }
    
    // Blinking eyes
    const blinkTime = time % 4;
    if (leftEyeRef.current && rightEyeRef.current) {
      const scale = blinkTime > 3.8 ? 0.1 : 1;
      leftEyeRef.current.scale.y = scale;
      rightEyeRef.current.scale.y = scale;
    }
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <group ref={groupRef}>
          {/* Coffee Cup Body - Rich Brown */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.2, 1, 1.8, 32]} />
            <meshStandardMaterial 
              color="#6F4E37" 
              roughness={0.4} 
              metalness={0.05}
            />
          </mesh>
          
          {/* Cup Handle */}
          <mesh position={[1.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.45, 0.12, 16, 32, Math.PI * 0.8]} />
            <meshStandardMaterial 
              color="#6F4E37" 
              roughness={0.4} 
              metalness={0.05}
            />
          </mesh>
          
          {/* Coffee Liquid - Darker Brown */}
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[1.15, 1.05, 0.15, 32]} />
            <meshStandardMaterial 
              color="#3E2723" 
              roughness={0.3} 
              metalness={0.2}
            />
          </mesh>
          
          {/* Foam/Cream Top - Cream Beige */}
          <mesh position={[0, 0.85, 0]}>
            <sphereGeometry args={[1.1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
            <meshStandardMaterial 
              color="#F7EEDB" 
              roughness={0.5}
            />
          </mesh>
          
          {/* Face Elements */}
          {/* Left Eye */}
          <mesh ref={leftEyeRef} position={[-0.35, 0.2, 1.05]} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#2F2F2F" />
          </mesh>
          
          {/* Right Eye */}
          <mesh ref={rightEyeRef} position={[0.35, 0.2, 1.05]} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#2F2F2F" />
          </mesh>
          
          {/* Smile - using a curved line */}
          <mesh position={[0, -0.1, 1.05]}>
            <torusGeometry args={[0.35, 0.05, 8, 32, Math.PI]} />
            <meshStandardMaterial color="#2F2F2F" />
          </mesh>
          
          {/* Rosy Cheeks */}
          <mesh position={[-0.65, -0.05, 0.95]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#E5A36F" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.65, -0.05, 0.95]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#E5A36F" transparent opacity={0.6} />
          </mesh>
        </group>
      </Float>

      {/* Floating Coffee Beans */}
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh position={[-2.5, 1, 0]} castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#6F4E37" roughness={0.6} />
        </mesh>
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1}>
        <mesh position={[2.3, -0.8, 0.5]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#6F4E37" roughness={0.6} />
        </mesh>
      </Float>
      
      <Float speed={2.2} rotationIntensity={0.7} floatIntensity={1.5}>
        <mesh position={[-1.8, -1.2, 1]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#6F4E37" roughness={0.6} />
        </mesh>
      </Float>
      
      <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.9}>
        <mesh position={[2.5, 1.5, -0.5]} castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#6F4E37" roughness={0.6} />
        </mesh>
      </Float>

      {/* Floating Stamp Icons */}
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh position={[-2, -0.5, 1.5]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial color="#E5A36F" roughness={0.4} />
        </mesh>
      </Float>
      
      <Float speed={1.7} rotationIntensity={0.4} floatIntensity={1.1}>
        <mesh position={[1.8, 0.5, 1.2]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.35, 0.35, 0.1]} />
          <meshStandardMaterial color="#E5A36F" roughness={0.4} />
        </mesh>
      </Float>

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#FFE4B5" />
      <pointLight position={[5, -5, -5]} intensity={0.3} color="#E5A36F" />
      
      <Environment preset="sunset" />
    </group>
  );
}

export default function CoffeeMascot3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 7]} />
        <CuteCoffeeCup />
      </Canvas>
    </div>
  );
}
