// src/components/game/PuzzleScene.jsx

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

// This is the rotating crystal component
const MindCrystal = ({ answerState }) => {
  const meshRef = useRef();

  // Rotate the crystal on every frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  // Determine color based on the answer state
  const crystalColor = answerState === 'correct' 
    ? '#4dff91' // Bright Green
    : answerState === 'incorrect' 
    ? '#ff4757' // Bright Red
    : '#4A90E2';  // Default Blue

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 1]} />
      <meshStandardMaterial 
        color={crystalColor}
        emissive={crystalColor} // Makes the crystal glow
        emissiveIntensity={answerState ? 2 : 0.5}
        roughness={0.1}
        metalness={0.8}
        wireframe={answerState === 'incorrect'} // Show wireframe on incorrect answer
      />
    </mesh>
  );
};

/**
 * A 3D scene for displaying the puzzle environment.
 * @param {object} props - The component props.
 * @param {'idle' | 'correct' | 'incorrect'} props.answerState - The state of the last answer.
 */
const PuzzleScene = ({ answerState = 'idle' }) => {
  return (
    <div className="puzzle-scene-container">
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight position={[-10, -10, 5]} intensity={1} />
        
        {/* The Crystal */}
        <MindCrystal answerState={answerState} />

        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Controls */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default PuzzleScene;