'use client';

import React, { useEffect, useState } from 'react';
import type { EvolutionStage } from '@/types';

interface SpecimenRendererProps {
  stage: EvolutionStage;
  progress: number;
  isEvolving?: boolean;
}

// Map stage number to image path
const stageConfig: Record<number, { image: string }> = {
  1: { image: '/1st.png' },
  2: { image: '/2nd.png' },
  3: { image: '/3rd.png' },
  4: { image: '/4th.png' },
  5: { image: '/5th.png' },
};

export const SpecimenRenderer: React.FC<SpecimenRendererProps> = ({
  stage,
  progress,
  isEvolving = false,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0.8, y: 0.4 });
  const [facingLeft, setFacingLeft] = useState(false);

  // Roaming animation
  useEffect(() => {
    const boundaryX = 250;
    const boundaryY = 80;
    
    const interval = setInterval(() => {
      setPosition(prev => {
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        
        let newVelX = velocity.x;
        let newVelY = velocity.y;
        
        // Bounce off boundaries
        if (newX > boundaryX || newX < -boundaryX) {
          newVelX = -velocity.x;
          newX = Math.max(-boundaryX, Math.min(boundaryX, newX));
          setFacingLeft(newVelX < 0);
        }
        if (newY > boundaryY || newY < -boundaryY) {
          newVelY = -velocity.y;
          newY = Math.max(-boundaryY, Math.min(boundaryY, newY));
        }
        
        // Random direction change occasionally
        if (Math.random() < 0.005) {
          newVelX = (Math.random() - 0.5) * 1.6;
          newVelY = (Math.random() - 0.5) * 0.8;
          setFacingLeft(newVelX < 0);
        }
        
        setVelocity({ x: newVelX, y: newVelY });
        return { x: newX, y: newY };
      });
    }, 30);
    
    return () => clearInterval(interval);
  }, [velocity]);

  // Get config for current stage (default to stage 1)
  const config = stageConfig[stage.stage] || stageConfig[1];

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
      {/* Evolution flash effect */}
      {isEvolving && (
        <div
          className="absolute inset-0 bg-white rounded-full animate-ping"
          style={{ animationDuration: '0.5s' }}
        />
      )}

      {/* Main specimen container - roams around */}
      <div
        className="relative z-10"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: 'transform 0.05s linear',
        }}
      >
        {/* Image with flip effect */}
        <div
          style={{
            transform: `scaleX(${facingLeft ? -1 : 1})`,
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
      </div>

      {/* Stage label - stays at bottom center */}
      <div
        className="absolute bottom-4 font-pixel text-sm tracking-wider z-10 text-terminal-green"
      >
        {stage.name}
      </div>
    </div>
  );
};

export default SpecimenRenderer;