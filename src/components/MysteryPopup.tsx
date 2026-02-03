'use client';

import React, { useState, useEffect } from 'react';
import { TypewriterText } from '@/hooks/useTypewriter';

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
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div 
        className={`relative max-w-lg w-full transform transition-all duration-300 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
      >
        {/* Paper background with dark overlay for readability */}
        <div 
          className="relative rounded-sm overflow-hidden"
          style={{
            backgroundImage: 'url(/paper-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Much darker overlay for text readability */}
          <div className="absolute inset-0 bg-black/70" />
          
          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 text-center">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors text-2xl"
              aria-label="Close"
            >
              ×
            </button>

            {/* Title */}
            <h2 className="font-pixel text-2xl md:text-3xl text-amber-400 mb-6 tracking-wider min-h-[2.5rem]" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              <TypewriterText 
                text="THE FINAL FORM" 
                speed={50} 
                delay={300}
                onComplete={() => setStep(1)}
                cursor={step === 0}
              />
            </h2>
            
            {/* Subtitle */}
            <p className="text-white text-base md:text-lg mb-8 min-h-[1.75rem]" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
              {step >= 1 && (
                <TypewriterText 
                  text="What happens when the specimen reaches its ultimate evolution?" 
                  speed={20} 
                  delay={0}
                  onComplete={() => setStep(2)}
                  cursor={step === 1}
                />
              )}
            </p>

            {/* Question Mark */}
            <div 
              className={`font-pixel text-7xl md:text-8xl text-red-500 mb-8 transition-opacity duration-500 ${step >= 2 ? 'opacity-100 animate-pulse' : 'opacity-0'}`}
              style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}
            >
              ?
            </div>

            {/* Mystery Questions */}
            <div className="space-y-4 mb-8 min-h-[7rem]">
              <p className="text-white text-lg md:text-xl font-semibold min-h-[2rem]" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
                {step >= 2 && (
                  <TypewriterText 
                    text="How many evolutions until the final form?" 
                    speed={25} 
                    delay={300}
                    onComplete={() => setStep(3)}
                    cursor={step === 2}
                  />
                )}
              </p>
              <p className="text-white/90 text-base md:text-lg min-h-[1.75rem]" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
                {step >= 3 && (
                  <TypewriterText 
                    text="What does the specimen become?" 
                    speed={25} 
                    delay={0}
                    onComplete={() => setStep(4)}
                    cursor={step === 3}
                  />
                )}
              </p>
              <p className="text-white/90 text-base md:text-lg min-h-[1.75rem]" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
                {step >= 4 && (
                  <TypewriterText 
                    text="Only the market knows..." 
                    speed={30} 
                    delay={0}
                    onComplete={() => setStep(5)}
                    cursor={step === 4}
                  />
                )}
              </p>
            </div>

            {/* Divider */}
            <div className={`w-32 h-px bg-amber-400/50 mx-auto mb-6 transition-opacity duration-500 ${step >= 5 ? 'opacity-100' : 'opacity-0'}`} />

            {/* Quote */}
            <div className={`mb-8 transition-opacity duration-500 ${step >= 5 ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-amber-100 text-sm md:text-base italic leading-relaxed max-w-md mx-auto min-h-[6rem]" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}>
                {step >= 5 && (
                  <TypewriterText 
                    text={`"The final transformation has never been documented. Some believe it to be myth. Others have dedicated their existence to witnessing it. The specimen waits... evolving... until the moment arrives."`}
                    speed={15} 
                    delay={200}
                    onComplete={() => setStep(6)}
                    cursor={step === 5}
                  />
                )}
              </p>
              <p className={`text-amber-300 text-sm mt-4 transition-opacity duration-300 ${step >= 6 ? 'opacity-100' : 'opacity-0'}`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}>
                — Classified Lab Report
              </p>
            </div>

            {/* Enter Button */}
            <button
              onClick={handleClose}
              className={`px-8 py-3 bg-amber-500/90 border-2 border-amber-400 text-black font-pixel text-sm tracking-wider hover:bg-amber-400 transition-all ${step >= 6 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              style={{ boxShadow: '0 0 15px rgba(251, 191, 36, 0.4)' }}
            >
              ENTER LABORATORY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MysteryPopup;