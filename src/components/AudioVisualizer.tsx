import React, { useRef, useEffect } from 'react';
import { binauralEngine } from '../utils/binauralEngine';

export type VisualizerMode = 'waves' | 'bars' | 'particles' | 'ring';

interface AudioVisualizerProps {
  mode?: VisualizerMode;
  isActive?: boolean;
  className?: string;
  color?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  mode = 'waves',
  isActive = true,
  className = 'w-full h-24',
  color = '#6366f1',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(128);

    // Particle system for 'particles' mode
    const particleCount = 48;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      angle: (i / particleCount) * Math.PI * 2,
      baseRadius: 35 + Math.random() * 20,
      radius: 35,
      speed: 0.01 + Math.random() * 0.015,
      size: 2 + Math.random() * 3,
      alpha: 0.4 + Math.random() * 0.6,
    }));

    let phase = 0;

    const render = () => {
      if (!canvas || !ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Handle Retina displays
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        ctx.scale(dpr, dpr);
      }

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Fetch real Web Audio data
      if (isActive) {
        binauralEngine.getAudioFrequencyData(dataArray);
      } else {
        dataArray.fill(0);
      }

      // Check if sound is active or simulate subtle breathing wave
      let avgFreq = 0;
      for (let i = 0; i < dataArray.length; i++) {
        avgFreq += dataArray[i];
      }
      avgFreq /= dataArray.length;

      const isAudioPlaying = avgFreq > 5;
      phase += isAudioPlaying ? 0.06 : 0.02;

      // ==========================================
      // MODE 1: NEON CYBER WAVES (Default)
      // ==========================================
      if (mode === 'waves') {
        const points = 32;
        const sliceWidth = displayWidth / (points - 1);
        const centerY = displayHeight / 2;

        const gradient = ctx.createLinearGradient(0, 0, displayWidth, 0);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(0.5, '#ec4899');
        gradient.addColorStop(1, '#38bdf8');

        // Draw multiple layered waves
        [0.4, 0.7, 1.0].forEach((intensityMultiplier, layerIdx) => {
          ctx.beginPath();
          ctx.lineWidth = layerIdx === 2 ? 3 : 1.5;
          ctx.strokeStyle = layerIdx === 2 ? gradient : `rgba(99, 102, 241, ${0.25 * intensityMultiplier})`;

          for (let i = 0; i < points; i++) {
            const byteVal = dataArray[i * 2] || 0;
            const normalized = isAudioPlaying ? byteVal / 255 : Math.sin(phase + i * 0.3 + layerIdx) * 0.15 + 0.15;
            const amplitude = normalized * (displayHeight * 0.42) * intensityMultiplier;
            const waveY = centerY + Math.sin(phase * 1.5 + i * 0.35 + layerIdx * 1.2) * amplitude;

            const x = i * sliceWidth;
            if (i === 0) {
              ctx.moveTo(x, waveY);
            } else {
              const prevX = (i - 1) * sliceWidth;
              const cpX = (prevX + x) / 2;
              ctx.quadraticCurveTo(prevX, waveY, cpX, waveY);
            }
          }
          ctx.stroke();
        });

        // Fill glow under main wave
        ctx.lineTo(displayWidth, displayHeight);
        ctx.lineTo(0, displayHeight);
        ctx.closePath();
        const fillGrad = ctx.createLinearGradient(0, 0, 0, displayHeight);
        fillGrad.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
        fillGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = fillGrad;
        ctx.fill();
      }

      // ==========================================
      // MODE 2: EQUALIZER FREQUENCY BARS
      // ==========================================
      else if (mode === 'bars') {
        const barCount = 36;
        const totalGap = displayWidth * 0.2;
        const barWidth = (displayWidth - totalGap) / barCount;
        const gap = totalGap / (barCount - 1);

        for (let i = 0; i < barCount; i++) {
          const byteVal = dataArray[Math.floor((i / barCount) * 64)] || 0;
          const normalized = isAudioPlaying ? byteVal / 255 : (Math.sin(phase * 2 + i * 0.4) * 0.5 + 0.5) * 0.25;
          const barHeight = Math.max(4, normalized * (displayHeight * 0.85));

          const x = i * (barWidth + gap);
          const y = displayHeight - barHeight;

          const barGrad = ctx.createLinearGradient(0, y, 0, displayHeight);
          barGrad.addColorStop(0, '#ec4899');
          barGrad.addColorStop(0.5, '#8b5cf6');
          barGrad.addColorStop(1, '#3b82f6');

          ctx.fillStyle = barGrad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
          ctx.fill();

          // Peak dot
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, Math.max(2, y - 4), 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ==========================================
      // MODE 3: 3D QUANTUM PARTICLES
      // ==========================================
      else if (mode === 'particles') {
        const centerX = displayWidth / 2;
        const centerY = displayHeight / 2;

        particles.forEach((p, idx) => {
          p.angle += p.speed * (isAudioPlaying ? 2 : 1);
          const byteVal = dataArray[idx % 32] || 0;
          const boost = isAudioPlaying ? (byteVal / 255) * 35 : Math.sin(phase + idx) * 8;
          p.radius = p.baseRadius + boost;

          const px = centerX + Math.cos(p.angle) * p.radius * 1.6;
          const py = centerY + Math.sin(p.angle) * p.radius * 0.7;

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = idx % 2 === 0 ? '#38bdf8' : '#ec4899';
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#818cf8';
          ctx.fill();
          ctx.shadowBlur = 0;
        });
        ctx.globalAlpha = 1.0;
      }

      // ==========================================
      // MODE 4: HOLOGRAPHIC ZEN RING
      // ==========================================
      else if (mode === 'ring') {
        const centerX = displayWidth / 2;
        const centerY = displayHeight / 2;
        const baseR = Math.min(displayWidth, displayHeight) * 0.35;

        ctx.beginPath();
        const segments = 64;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          const byteVal = dataArray[i % 32] || 0;
          const offset = isAudioPlaying ? (byteVal / 255) * 18 : Math.sin(theta * 6 + phase * 2) * 5;
          const r = baseR + offset;
          const rx = centerX + Math.cos(theta) * r;
          const ry = centerY + Math.sin(theta) * r;

          if (i === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
        ctx.closePath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#38bdf8';
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mode, isActive, color]);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
