'use client';

import React, { useEffect, useState } from 'react';
import type { EvolutionStage } from '@/types';

interface SpecimenRendererProps {
  stage: EvolutionStage;
  progress: number;
  isEvolving?: boolean;
}

// Map stage number to image path and glow color
const stageConfig: Record<number, { image: string; glowColor: string }> = {
  1: { image: '/1st.png', glowColor: '#00ff41' },
  2: { image: '/2nd.png', glowColor: '#00d4ff' },
  3: { image: '/3rd.png', glowColor: '#ffb000' },
  4: { image: '/4th.png', glowColor: '#ff3366' },
  5: { image: '/5th.png', glowColor: '#a855f7' },
};

export const SpecimenRenderer: React.FC<SpecimenRendererProps> = ({
  stage,
  progress,
  isEvolving = false,
}) => {
  const [glowIntensity, setGlowIntensity] = useState(1);
  const [breathOffset, setBreathOffset] = useState(0);

  // Glow pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(0.7 + Math.sin(Date.now() / 500) * 0.3);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathOffset(Math.sin(Date.now() / 1000) * 5);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Get config for current stage (default to stage 1)
  const config = stageConfig[stage.stage] || stageConfig[1];

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Glow effect background */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${config.glowColor}40 0%, transparent 70%)`,
          transform: `scale(${glowIntensity})`,
          transition: 'transform 0.1s ease-out',
        }}
      />

      {/* Evolution flash effect */}
      {isEvolving && (
        <div
          className="absolute inset-0 bg-white rounded-full animate-ping"
          style={{ animationDuration: '0.5s' }}
        />
      )}

      {/* Main specimen image */}
      <div
        className="relative z-10"
        style={{
          transform: `translateY(${breathOffset}px)`,
          transition: 'transform 0.1s ease-out',
          filter: `drop-shadow(0 0 ${20 * glowIntensity}px ${config.glowColor}) drop-shadow(0 0 ${40 * glowIntensity}px ${config.glowColor}50)`,
        }}
      >
        <img
          src={config.image}
          alt={`Specimen - ${stage.name}`}
          width={200}
          height={200}
          style={{
            imageRendering: 'pixelated',
          }}
        />
      </div>

      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: config.glowColor,
              boxShadow: `0 0 6px ${config.glowColor}`,
              left: `${50 + Math.sin(Date.now() / 1000 + i * 0.8) * 40}%`,
              top: `${50 + Math.cos(Date.now() / 1200 + i * 0.6) * 40}%`,
              opacity: 0.4 + Math.sin(Date.now() / 800 + i * 0.5) * 0.4,
              transform: `scale(${0.5 + Math.sin(Date.now() / 600 + i * 0.7) * 0.5})`,
            }}
          />
        ))}
      </div>

      {/* Stage label */}
      <div
        className="mt-6 font-pixel text-sm tracking-wider z-10"
        style={{ 
          color: config.glowColor, 
          textShadow: `0 0 10px ${config.glowColor}, 0 0 20px ${config.glowColor}50` 
        }}
      >
        {stage.name}
      </div>
    </div>
  );
};

export default SpecimenRenderer;