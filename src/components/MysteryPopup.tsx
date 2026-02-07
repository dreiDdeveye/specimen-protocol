'use client';

import React, { useState, useEffect } from 'react';
import { TypewriterText } from '@/hooks/useTypewriter';

// Eye Icon Component
const EyeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

interface MysteryPopupProps {
  onClose: () => void;
}

export const MysteryPopup: React.FC<MysteryPopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={handleClose}
      />
      
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
      }} />
      
      {/* Popup - 2:3 aspect ratio */}
      <div 
        className={`relative transform transition-all duration-300 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
        style={{
          width: 'min(400px, 90vw)',
          height: 'min(600px, 85vh)',
        }}
      >
        {/* Paper background container */}
        <div 
          className="relative w-full h-full rounded-lg overflow-hidden"
          style={{
            backgroundImage: 'url(/paper-bg.png)',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/65" />
          
          {/* Red glow from center */}
          <div className="absolute inset-0 bg-gradient-radial from-red-500/10 via-transparent to-transparent pointer-events-none" />
          
          {/* Header bar */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 border-b border-red-500/20 bg-black/40">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-[10px] font-pixel tracking-wider">CLASSIFIED TRANSMISSION</span>
            </div>
            <button
              onClick={handleClose}
              className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center">

            {/* Big dramatic title */}
            <div className="mb-4">
              <h2 
                className="font-pixel text-3xl md:text-4xl text-white tracking-wide leading-tight"
                style={{ 
                  textShadow: '0 0 40px rgba(239, 68, 68, 0.5), 0 0 80px rgba(239, 68, 68, 0.3), 2px 2px 4px rgba(0,0,0,0.9)',
                }}
              >
                <TypewriterText 
                  text="THE EPSTEIN" 
                  speed={60} 
                  delay={300}
                  onComplete={() => setStep(1)}
                  cursor={step === 0}
                />
              </h2>
              <h2 
                className="font-pixel text-3xl md:text-4xl text-red-500 tracking-wide leading-tight"
                style={{ 
                  textShadow: '0 0 40px rgba(239, 68, 68, 0.6), 0 0 80px rgba(239, 68, 68, 0.4), 2px 2px 4px rgba(0,0,0,0.9)',
                }}
              >
                {step >= 1 && (
                  <TypewriterText 
                    text="FILES" 
                    speed={80} 
                    delay={0}
                    onComplete={() => setStep(2)}
                    cursor={step === 1}
                  />
                )}
              </h2>
            </div>

            {/* Glowing divider */}
            <div className={`w-32 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent mb-8 transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`} 
              style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}
            />

            {/* Tagline */}
            <div className={`mb-10 transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
              <p 
                className="text-white text-base font-medium tracking-wide"
                style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}
              >
                {step >= 2 && (
                  <TypewriterText 
                    text="The blockchain never forgets." 
                    speed={30} 
                    delay={200}
                    onComplete={() => setStep(3)}
                    cursor={step === 2}
                  />
                )}
              </p>
            </div>

            {/* Stats - Horizontal with separators */}
            <div className={`flex items-center justify-center gap-4 mb-12 transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-center" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
                <span className="font-pixel text-2xl text-red-400">8</span>
                <span className="text-white/60 text-[10px] ml-1">CHAPTERS</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="text-center" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
                <span className="font-pixel text-2xl text-white">1000+</span>
                <span className="text-white/60 text-[10px] ml-1">DOCS</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="text-center" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
                <span className="font-pixel text-2xl text-terminal-amber">200+</span>
                <span className="text-white/60 text-[10px] ml-1">NAMES</span>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleClose}
              className={`group relative px-10 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-pixel text-sm tracking-wider rounded-lg overflow-hidden transition-all hover:brightness-110 ${step >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <span className="relative flex items-center justify-center gap-2">
                <EyeIcon size={16} />
                <span>BEGIN INVESTIGATION</span>
              </span>
            </button>
          </div>
        </div>
        
        {/* Corner decorations */}
        <div className="absolute -top-1 -left-1 w-5 h-5 border-l-2 border-t-2 border-red-500/60" />
        <div className="absolute -top-1 -right-1 w-5 h-5 border-r-2 border-t-2 border-red-500/60" />
        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-l-2 border-b-2 border-red-500/60" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-r-2 border-b-2 border-red-500/60" />
      </div>
    </div>
  );
};

export default MysteryPopup;