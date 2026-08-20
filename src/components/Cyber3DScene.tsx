import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { binauralEngine } from '../utils/binauralEngine';

interface Cyber3DSceneProps {
  enabled: boolean;
  theme?: string;
}

export const Cyber3DScene: React.FC<Cyber3DSceneProps> = ({ enabled, theme = 'dark' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Quantum Holographic Torus Knot
    const knotGeo = new THREE.TorusKnotGeometry(6, 1.8, 120, 24);
    const knotMat = new THREE.MeshStandardMaterial({
      color: theme === 'forest' ? 0x10b981 : 0x6366f1,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      emissive: theme === 'cyber' ? 0xec4899 : 0x4f46e5,
      emissiveIntensity: 0.4,
    });
    const torusKnot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(torusKnot);

    // 2. Outer Wireframe Sphere Grid
    const sphereGeo = new THREE.IcosahedronGeometry(13, 2);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // 3. Cyber Starfield Particle System
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = (Math.random() - 0.5) * 80;
      positions[i + 2] = (Math.random() - 0.5) * 80;

      // Color variation
      colors[i] = 0.4 + Math.random() * 0.6;     // R
      colors[i + 1] = 0.4 + Math.random() * 0.6; // G
      colors[i + 2] = 0.9 + Math.random() * 0.1; // B
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xec4899, 2, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x38bdf8, 2, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.0005;
      mouseY = (e.clientY - windowHalfY) * 0.0005;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Audio byte data array for sound reactivity
    const audioData = new Uint8Array(64);
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Audio reactive pulsing
      binauralEngine.getAudioFrequencyData(audioData);
      let avg = 0;
      for (let i = 0; i < audioData.length; i++) avg += audioData[i];
      avg /= audioData.length;

      const audioScale = 1 + (avg / 255) * 0.35;

      torusKnot.rotation.x += 0.006;
      torusKnot.rotation.y += 0.009;
      torusKnot.scale.set(audioScale, audioScale, audioScale);

      sphere.rotation.x -= 0.003;
      sphere.rotation.y -= 0.004;

      particles.rotation.y += 0.001;

      camera.position.x += (targetX * 30 - camera.position.x) * 0.05;
      camera.position.y += (-targetY * 30 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [enabled, theme]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen transition-opacity duration-700"
    />
  );
};
