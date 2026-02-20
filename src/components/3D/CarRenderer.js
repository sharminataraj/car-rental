import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float, useTexture, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// Car component with detailed materials
const Car = ({ color = "#e63946" }) => {
  const carRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (carRef.current) {
      carRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={carRef}>
      {/* Car Body - Main chassis */}
      <mesh 
        position={[0, 0.5, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[4, 1.2, 2]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.1}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>

      {/* Car Cabin */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2.5, 0.8, 1.8]} />
        <meshStandardMaterial 
          color="#1d3557"
          metalness={0.1}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 1.5, 0.9]}>
        <boxGeometry args={[2.5, 0.8, 0.1]} />
        <meshPhysicalMaterial 
          color="#a8dadc"
          metalness={0}
          roughness={0.1}
          transmission={0.9}
          transparent={true}
          opacity={0.7}
          envMapIntensity={1}
        />
      </mesh>

      {/* Windows */}
      <mesh position={[1.25, 1.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.8, 1.8]} />
        <meshPhysicalMaterial 
          color="#a8dadc"
          metalness={0}
          roughness={0.1}
          transmission={0.9}
          transparent={true}
          opacity={0.7}
          envMapIntensity={1}
        />
      </mesh>
      <mesh position={[-1.25, 1.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.8, 1.8]} />
        <meshPhysicalMaterial 
          color="#a8dadc"
          metalness={0}
          roughness={0.1}
          transmission={0.9}
          transparent={true}
          opacity={0.7}
          envMapIntensity={1}
        />
      </mesh>

      {/* Wheels */}
      {[
        [1.3, -0.5, 1.1],
        [-1.3, -0.5, 1.1],
        [1.3, -0.5, -1.1],
        [-1.3, -0.5, -1.1]
      ].map((pos, i) => (
        <group key={i} position={pos}>
          {/* Wheel Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial 
              color="#4a4e69"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          {/* Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 0.35, 32]} />
            <meshStandardMaterial 
              color="#2b2d42"
              metalness={0.2}
              roughness={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      <mesh position={[0, 0.5, 1.1]}>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshStandardMaterial 
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={2}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0.8, 0.5, 1.1]}>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshStandardMaterial 
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={2}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-0.8, 0.5, 1.1]}>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshStandardMaterial 
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={2}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Taillights */}
      <mesh position={[0, 0.5, -1.1]}>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshStandardMaterial 
          color="#e63946"
          emissive="#e63946"
          emissiveIntensity={2}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0.8, 0.5, -1.1]}>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshStandardMaterial 
          color="#e63946"
          emissive="#e63946"
          emissiveIntensity={2}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-0.8, 0.5, -1.1]}>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshStandardMaterial 
          color="#e63946"
          emissive="#e63946"
          emissiveIntensity={2}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// Main 3D Scene Component
const CarScene = ({ carImage, color = "#e63946" }) => {
  return (
    <Canvas camera={{ position: [8, 4, 8], fov: 45 }} shadows>
      <PerspectiveCamera makeDefault position={[8, 4, 8]} fov={45} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4cc9f0" />
      
      {/* Environment for reflections */}
      <Environment preset="city" />
      
      {/* Car */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Car color={color} />
      </Float>
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1d3557" roughness={0.8} />
      </mesh>
      
      {/* Contact Shadows */}
      <ContactShadows 
        position={[0, -1, 0]} 
        opacity={0.5} 
        scale={20} 
        blur={2} 
        far={4} 
      />
    </Canvas>
  );
};

// Container component with reference image
const CarRenderer = ({ carData }) => {
  const { brand, model, image, year, color = "#e63946" } = carData;

  return (
    <div className="car-renderer-container">
      <div className="renderer-wrapper">
        {/* 3D Scene */}
        <div className="scene-container">
          <CarScene carImage={image} color={color} />
        </div>
        
        {/* Reference Image */}
        <div className="reference-image-container">
          <h3>Reference Image</h3>
          <img 
            src={image} 
            alt={`${brand} ${model}`} 
            className="reference-image"
          />
        </div>
        
        {/* Car Information */}
        <div className="car-info">
          <h2>{brand} {model} ({year})</h2>
          <p>High-quality 3D rendering with realistic materials and lighting</p>
        </div>
      </div>
      
      <style jsx>{`
        .car-renderer-container {
          width: 100%;
          min-height: 600px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .renderer-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .scene-container {
          width: 100%;
          height: 400px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .reference-image-container {
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .reference-image-container h3 {
          margin-top: 0;
          margin-bottom: 10px;
          color: #495057;
          font-size: 1.2rem;
        }
        
        .reference-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 4px;
          display: block;
        }
        
        .car-info {
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        
        .car-info h2 {
          margin: 0 0 10px 0;
          color: #212529;
          font-size: 1.5rem;
        }
        
        .car-info p {
          margin: 0;
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        @media (min-width: 768px) {
          .renderer-wrapper {
            flex-direction: row;
          }
          
          .scene-container {
            flex: 1;
          }
          
          .reference-image-container {
            width: 300px;
          }
          
          .car-info {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default CarRenderer;