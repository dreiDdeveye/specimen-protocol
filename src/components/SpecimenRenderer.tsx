'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import type { EvolutionStage } from '@/types';

interface SpecimenRendererProps {
  stage: EvolutionStage;
  progress: number;
  isEvolving?: boolean;
}

interface FoodItem {
  id: number;
  left: number;
  top: number;
  targetTop: number;
  x: number;
  y: number;
  landed: boolean;
}

// Map stage number to GIF path
const stageConfig: Record<number, { gif: string }> = {
  1: { gif: '/1st.gif' },
  2: { gif: '/2nd.gif' },
  3: { gif: '/3rd.gif' },
  4: { gif: '/4th.gif' },
  5: { gif: '/5th.gif' },
};

export const SpecimenRenderer: React.FC<SpecimenRendererProps> = ({
  stage,
  progress,
  isEvolving = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0.8, y: 0.4 });
  const [facingLeft, setFacingLeft] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isEating, setIsEating] = useState(false);
  const [targetFood, setTargetFood] = useState<FoodItem | null>(null);

  const boundaryX = 300;
  const boundaryY = 100;

  // Animate falling food
  useEffect(() => {
    const interval = setInterval(() => {
      setFoodItems(prev => prev.map(food => {
        if (food.landed) return food;
        
        const newTop = food.top + 8;
        if (newTop >= food.targetTop) {
          return { ...food, top: food.targetTop, landed: true };
        }
        return { ...food, top: newTop };
      }));
    }, 20);
    
    return () => clearInterval(interval);
  }, []);

  // Movement - either roaming or chasing food
  useEffect(() => {
    const speed = 2;
    
    const interval = setInterval(() => {
      setPosition(prev => {
        if (targetFood && targetFood.landed) {
          const dx = targetFood.x - prev.x;
          const dy = targetFood.y - prev.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 25) {
            setIsEating(true);
            setTimeout(() => setIsEating(false), 300);
            setFoodItems(items => items.filter(f => f.id !== targetFood.id));
            setTargetFood(null);
            return prev;
          }
          
          const newX = prev.x + (dx / distance) * speed * 2;
          const newY = prev.y + (dy / distance) * speed * 2;
          setFacingLeft(dx < 0);
          
          return { x: newX, y: newY };
        }
        
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        
        let newVelX = velocity.x;
        let newVelY = velocity.y;
        
        if (newX > boundaryX || newX < -boundaryX) {
          newVelX = -velocity.x;
          newX = Math.max(-boundaryX, Math.min(boundaryX, newX));
          setFacingLeft(newVelX < 0);
        }
        if (newY > boundaryY || newY < -boundaryY) {
          newVelY = -velocity.y;
          newY = Math.max(-boundaryY, Math.min(boundaryY, newY));
        }
        
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
  }, [velocity, targetFood]);

  // Find nearest landed food
  useEffect(() => {
    if (foodItems.length > 0 && !targetFood) {
      const landedFood = foodItems.filter(f => f.landed);
      if (landedFood.length === 0) return;
      
      let closest: FoodItem | null = null;
      let closestDist = Infinity;
      
      landedFood.forEach(food => {
        const dx = food.x - position.x;
        const dy = food.y - position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closestDist) {
          closestDist = dist;
          closest = food;
        }
      });
      
      if (closest) {
        setTargetFood(closest);
      }
    }
  }, [foodItems, targetFood, position]);

  // Handle dropping food
  const handleFeed = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    const left = e.clientX - rect.left;
    const startTop = 0;
    const targetTop = rect.height - 80;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = left - centerX;
    const y = targetTop - centerY;
    
    const newFood: FoodItem = {
      id: Date.now(),
      left,
      top: startTop,
      targetTop,
      x,
      y,
      landed: false,
    };
    
    setFoodItems(prev => [...prev, newFood]);
  }, []);

  const config = stageConfig[stage.stage] || stageConfig[1];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] cursor-pointer select-none overflow-hidden"
      onClick={handleFeed}
    >
      {/* Food items */}
      {foodItems.map(food => (
        <div
          key={food.id}
          className="absolute z-20 pointer-events-none"
          style={{
            left: food.left,
            top: food.top,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <img 
            src="/feed.png" 
            alt="food" 
            className={`w-6 h-6 ${food.landed ? 'animate-bounce' : ''}`}
            style={{
              transform: food.landed ? 'none' : `rotate(${food.top * 2}deg)`,
            }}
          />
        </div>
      ))}

      {/* Evolution flash */}
      {isEvolving && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full animate-ping"
          style={{ width: 200, height: 200, animationDuration: '0.5s' }}
        />
      )}

      {/* Specimen GIF */}
      <div
        className="absolute z-10 left-1/2 top-1/2"
        style={{
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) ${isEating ? 'scale(1.15)' : 'scale(1)'}`,
          transition: isEating ? 'transform 0.15s ease-out' : 'transform 0.05s linear',
        }}
      >
        {isEating && (
          <div 
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: 'rgba(0, 255, 100, 0.3)', animationDuration: '0.3s' }}
          />
        )}
        
        <div style={{ transform: `scaleX(${facingLeft ? -1 : 1})` }}>
          <img
            key={config.gif}
            src={config.gif}
            alt={`Specimen - ${stage.name}`}
            className="w-[300px] h-[300px] object-contain"
            style={{ 
              mixBlendMode: 'multiply',
            }}
          />
        </div>
      </div>

      {/* Stage label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-pixel text-sm tracking-wider z-10 text-terminal-green">
        {stage.name}
      </div>
    </div>
  );
};

export default SpecimenRenderer;