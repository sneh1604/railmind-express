// src/components/game/PuzzleScene.jsx

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Quantum Knowledge Crystal with reality-bending effects
const QuantumCrystal = ({ answerState }) => {
  const meshRef = useRef();
  const orbsRef = useRef([]);
  const [pulseIntensity, setPulseIntensity] = useState(1);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Multi-dimensional rotation
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.z += delta * 0.2;
      
      // Quantum breathing effect
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      meshRef.current.scale.setScalar(breathe);
    }

    // Animate knowledge orbs
    orbsRef.current.forEach((orb, i) => {
      if (orb) {
        const angle = state.clock.elapsedTime + i * (Math.PI * 2 / 8);
        orb.position.x = Math.cos(angle) * (3 + Math.sin(state.clock.elapsedTime * 0.5));
        orb.position.y = Math.sin(angle * 1.5) * 2;
        orb.position.z = Math.sin(angle) * (3 + Math.sin(state.clock.elapsedTime * 0.5));
        orb.rotation.x += delta * 2;
        orb.rotation.y += delta * 1.5;
      }
    });
  });

  const crystalColor = answerState === 'correct' 
    ? '#00ff88' // Quantum Green
    : answerState === 'incorrect' 
    ? '#ff0066' // Reality Red
    : '#4A90E2'; // Neural Blue

  const emissiveIntensity = answerState === 'correct' ? 3 : answerState === 'incorrect' ? 2 : 1;

  return (
    <group>
      {/* Main Crystal */}
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[2, 2]} />
        <meshStandardMaterial 
          color={crystalColor}
          emissive={crystalColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.1}
          metalness={0.9}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* Knowledge Orbs */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh 
          key={i} 
          ref={el => orbsRef.current[i] = el}
          position={[0, 0, 0]}
        >
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial 
            color={crystalColor}
            emissive={crystalColor}
            emissiveIntensity={1}
            transparent={true}
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Energy Rings */}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={`ring-${i}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3 + i, 3.2 + i, 32]} />
          <meshBasicMaterial 
            color={crystalColor}
            transparent={true}
            opacity={0.3 - i * 0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// Floating Knowledge Fragments
const KnowledgeFragments = ({ answerState }) => {
  const fragmentsRef = useRef([]);

  useFrame((state, delta) => {
    fragmentsRef.current.forEach((fragment, i) => {
      if (fragment) {
        fragment.position.y += Math.sin(state.clock.elapsedTime + i) * 0.01;
        fragment.rotation.x += delta * 0.5;
        fragment.rotation.z += delta * 0.3;
      }
    });
  });

  return (
    <group>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh 
          key={i}
          ref={el => fragmentsRef.current[i] = el}
          position={[
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 15
          ]}
        >
          <tetrahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial 
            color="#ffffff"
            emissive="#4A90E2"
            emissiveIntensity={0.5}
            transparent={true}
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

// Neural Network Connections
const NeuralNetwork = () => {
  const networkRef = useRef();

  useFrame((state) => {
    if (networkRef.current) {
      networkRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={networkRef}>
      {/* Neural nodes and connections would be more complex in a real implementation */}
      <Sphere args={[0.1]} position={[2, 2, 0]}>
        <meshBasicMaterial color="#00ffff" />
      </Sphere>
      <Sphere args={[0.1]} position={[-2, 1, 1]}>
        <meshBasicMaterial color="#00ffff" />
      </Sphere>
      <Sphere args={[0.1]} position={[0, -2, -1]}>
        <meshBasicMaterial color="#00ffff" />
      </Sphere>
    </group>
  );
};

// Reality Distortion Effects
const RealityDistortion = ({ answerState }) => {
  const distortionRef = useRef();

  useFrame((state, delta) => {
    if (distortionRef.current) {
      distortionRef.current.rotation.x += delta * 0.1;
      distortionRef.current.rotation.y += delta * 0.15;
      
      // Reality ripple effect
      const ripple = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 1;
      distortionRef.current.scale.setScalar(ripple);
    }
  });

  return (
    <mesh ref={distortionRef} position={[0, 0, -5]}>
      <torusGeometry args={[8, 0.5, 8, 32]} />
      <meshBasicMaterial 
        color="#4A90E2"
        transparent={true}
        opacity={0.1}
        wireframe={true}
      />
    </mesh>
  );
};

/**
 * Revolutionary Quantum Puzzle Scene with reality-bending 3D effects
 * @param {object} props - The component props.
 * @param {'idle' | 'correct' | 'incorrect'} props.answerState - The state of the last answer.
 */
const PuzzleScene = ({ answerState = 'idle' }) => {
  const [sceneIntensity, setSceneIntensity] = useState(1);

  useEffect(() => {
    if (answerState === 'correct') {
      setSceneIntensity(2);
      setTimeout(() => setSceneIntensity(1), 2000);
    } else if (answerState === 'incorrect') {
      setSceneIntensity(0.5);
      setTimeout(() => setSceneIntensity(1), 2000);
    }
  }, [answerState]);

  return (
    <div className="quantum-puzzle-scene">
      {/* Holographic UI Overlay */}
      <div className="quantum-overlay">
        <div className="quantum-status">
          <div className={`status-indicator ${answerState}`}>
            <div className="status-core"></div>
            <div className="status-rings">
              <div className="ring"></div>
              <div className="ring"></div>
              <div className="ring"></div>
            </div>
          </div>
          <span className="status-text">
            {answerState === 'correct' ? 'NEURAL SYNC ACHIEVED' : 
             answerState === 'incorrect' ? 'RECALIBRATING MATRIX' : 
             'QUANTUM FIELD ACTIVE'}
          </span>
        </div>
      </div>

      <Canvas 
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'radial-gradient(circle, #000015, #000000)' }}
      >
        {/* Dynamic Lighting */}
        <ambientLight intensity={0.3 * sceneIntensity} />
        <pointLight 
          position={[10, 10, 10]} 
          intensity={2 * sceneIntensity} 
          color={answerState === 'correct' ? '#00ff88' : answerState === 'incorrect' ? '#ff0066' : '#4A90E2'}
        />
        <spotLight 
          position={[0, 20, 0]} 
          angle={0.3} 
          penumbra={1} 
          intensity={1.5 * sceneIntensity}
          color="#ffffff"
        />
        
        {/* Main Quantum Crystal */}
        <QuantumCrystal answerState={answerState} />
        
        {/* Knowledge Fragments */}
        <KnowledgeFragments answerState={answerState} />
        
        {/* Neural Network */}
        <NeuralNetwork />
        
        {/* Reality Distortion */}
        <RealityDistortion answerState={answerState} />
        
        {/* Enhanced Starfield */}
        <Stars 
          radius={150} 
          depth={80} 
          count={8000} 
          factor={6} 
          saturation={0.5} 
          fade 
          speed={2}
        />
        
        {/* Interactive Controls */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* Particle Systems */}
      <div className="quantum-particles">
        {Array.from({ length: 20 }, (_, i) => (
          <div 
            key={i} 
            className={`quantum-particle particle-${(i % 5) + 1}`}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Energy Field Effects */}
      <div className="energy-field">
        <div className="field-wave wave-1"></div>
        <div className="field-wave wave-2"></div>
        <div className="field-wave wave-3"></div>
      </div>
    </div>
  );
};

export default PuzzleScene;