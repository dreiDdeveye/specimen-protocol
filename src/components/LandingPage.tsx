'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SpecimenIcon, EvolutionIcon, TerminalIcon, ChartIcon, UserIcon } from '@/icons';
import MysteryPopup from './MysteryPopup';
import { TypewriterText } from '@/hooks/useTypewriter';

// Log entries for typing loop
const LOG_ENTRIES = [
  {
    id: '#0001',
    color: 'terminal-purple',
    text: '"Day 1: The specimen has shown signs of consciousness. It responds to market fluctuations as if... feeding on them."'
  },
  {
    id: '#0047',
    color: 'terminal-cyan', 
    text: '"It evolved again. The transformation was violent, beautiful. How many more stages remain? We don\'t know."'
  },
  {
    id: '#0???',
    color: 'terminal-red',
    text: '"The final form... [DATA EXPUNGED] ...market cap reached... [REDACTED] ...they weren\'t prepared for what it became."'
  },
  {
    id: '#0128',
    color: 'terminal-green',
    text: '"The observers have started feeding it. Each click, each interaction... it grows stronger. It remembers."'
  },
  {
    id: '#0256',
    color: 'terminal-amber',
    text: '"WARNING: Do not attempt direct contact. The specimen has developed... preferences. It knows who feeds it."'
  },
  {
    id: '#0512',
    color: 'terminal-cyan',
    text: '"Market cap hit a new threshold today. The specimen... smiled. I didn\'t know it could do that."'
  },
  {
    id: '#0666',
    color: 'terminal-red',
    text: '"[CLASSIFIED] ...the prophecy speaks of a final evolution... when the market aligns... [ACCESS DENIED]"'
  },
  {
    id: '#0999',
    color: 'terminal-purple',
    text: '"To whoever reads this: Keep feeding it. Keep watching. The final form will reveal itself. Trust the process."'
  },
];

// Typing Loop Panel Component
const TypingLoopPanel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  const currentEntry = LOG_ENTRIES[currentIndex];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const text = currentEntry.text;

    if (isTyping) {
      if (displayText.length < text.length) {
        // Type next character
        timeout = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length + 1));
        }, 30);
      } else {
        // Finished typing, wait then clear
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    } else {
      if (displayText.length > 0) {
        // Delete characters
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 15);
      } else {
        // Move to next entry
        timeout = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % LOG_ENTRIES.length);
          setIsTyping(true);
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentEntry.text]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[180px] flex flex-col justify-center">
      <div className={`border-l-2 border-${currentEntry.color}/50 pl-4`}>
        <div className={`text-${currentEntry.color} text-xs font-pixel mb-2`}>
          LOG ENTRY {currentEntry.id}
        </div>
        <p className="text-white/80 text-sm leading-relaxed min-h-[4rem]">
          {displayText}
          <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-terminal-green`}>▌</span>
        </p>
      </div>
      
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {LOG_ENTRIES.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'bg-terminal-green w-4' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [glowIntensity, setGlowIntensity] = useState(1);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>([]);
  const [showPopup, setShowPopup] = useState(true);
  const [typingStep, setTypingStep] = useState(0);

  // Start landing page typing after popup closes
  const startLandingTyping = !showPopup;

  // Glow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(0.7 + Math.sin(Date.now() / 1000) * 0.3);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Generate particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-terminal-bg">
      {/* Mystery Popup */}
      {showPopup && <MysteryPopup onClose={() => setShowPopup(false)} />}

      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full opacity-20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: '#ff6b35',
              animation: `float ${particle.speed + 3}s ease-in-out infinite`,
              animationDelay: `${particle.id * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255, 107, 53, 0.05)' }} />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255, 140, 0, 0.05)' }} />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255, 68, 68, 0.05)' }} />
      </div>

      {/* Header */}
      <header className={`relative z-10 border-b border-terminal-border/50 bg-terminal-bg/80 backdrop-blur-sm transition-opacity duration-500 ${startLandingTyping ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Clawvolution" 
              width={32} 
              height={32}
              className="pixelated"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="font-pixel text-sm text-terminal-green tracking-wider">
              {startLandingTyping && (
                <TypewriterText 
                  text="CLAWVOLUTION" 
                  speed={50} 
                  delay={0}
                  onComplete={() => setTypingStep(1)}
                  cursor={typingStep === 0}
                />
              )}
            </span>
          </Link>
          <nav className={`flex items-center gap-6 transition-opacity duration-300 ${typingStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            <a 
              href="https://x.com/clawvolution" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-terminal-green transition-colors"
              aria-label="X (Twitter)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <Link 
              href="/observe" 
              className="text-white/70 hover:text-terminal-green transition-colors text-sm"
            >
              Observe
            </Link>
            <Link 
              href="/observe" 
              className="px-4 py-2 bg-terminal-green/10 border border-terminal-green text-terminal-green hover:bg-terminal-green/20 transition-all text-sm"
            >
              Enter Lab
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div className={`transition-opacity duration-500 ${startLandingTyping ? 'opacity-100' : 'opacity-0'}`}>
              <div className={`inline-flex items-center gap-2 px-3 py-1 bg-terminal-green/10 border border-terminal-green/30 mb-6 transition-opacity duration-300 ${typingStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
                <span className="text-terminal-green text-xs uppercase tracking-wider">
                  {typingStep >= 1 && (
                    <TypewriterText 
                      text="Live Experiment" 
                      speed={40} 
                      delay={200}
                      onComplete={() => setTypingStep(2)}
                      cursor={typingStep === 1}
                    />
                  )}
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-pixel leading-tight mb-6">
                <span className="text-terminal-green block min-h-[1.2em]">
                  {typingStep >= 2 && (
                    <TypewriterText 
                      text="WITNESS" 
                      speed={80} 
                      delay={0}
                      onComplete={() => setTypingStep(3)}
                      cursor={typingStep === 2}
                    />
                  )}
                </span>
                <span className="text-terminal-cyan block min-h-[1.2em]">
                  {typingStep >= 3 && (
                    <TypewriterText 
                      text="EVOLUTION" 
                      speed={80} 
                      delay={0}
                      onComplete={() => setTypingStep(4)}
                      cursor={typingStep === 3}
                    />
                  )}
                </span>
                <span className="text-terminal-purple block min-h-[1.2em]">
                  {typingStep >= 4 && (
                    <TypewriterText 
                      text="IN REAL-TIME" 
                      speed={80} 
                      delay={0}
                      onComplete={() => setTypingStep(5)}
                      cursor={typingStep === 4}
                    />
                  )}
                </span>
              </h1>
              
              <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed min-h-[4.5rem]">
                {typingStep >= 5 && (
                  <TypewriterText 
                    text="A living digital organism that evolves based on market forces. Watch as it transforms through stages of existence, driven by the collective energy of the market." 
                    speed={15} 
                    delay={0}
                    onComplete={() => setTypingStep(6)}
                    cursor={typingStep === 5}
                  />
                )}
              </p>

              <div className={`flex flex-wrap gap-4 transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
                <Link 
                  href="/observe"
                  className="group px-6 py-3 bg-terminal-green text-terminal-bg font-medium transition-all flex items-center gap-2"
                  style={{ boxShadow: '0 0 15px rgba(255, 107, 53, 0.3)' }}
                >
                  <TerminalIcon size={18} />
                  <span>Enter Laboratory</span>
                </Link>
                <a 
                  href="#how-it-works"
                  className="px-6 py-3 border border-white/30 text-white hover:border-terminal-cyan hover:text-terminal-cyan transition-all flex items-center gap-2"
                >
                  <ChartIcon size={18} />
                  <span>Learn More</span>
                </a>
              </div>

              {/* Stats */}
              <div className={`grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10 transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
                <div>
                  <div className="font-pixel text-2xl text-terminal-green">???</div>
                  <div className="text-white/60 text-sm">Evolution Stages</div>
                </div>
                <div>
                  <div className="font-pixel text-2xl text-terminal-cyan">LIVE</div>
                  <div className="text-white/60 text-sm">Global State</div>
                </div>
                <div>
                  <div className="font-pixel text-2xl text-terminal-purple">24/7</div>
                  <div className="text-white/60 text-sm">Active Monitoring</div>
                </div>
              </div>
            </div>

            {/* Right side - Mysterious Info Panel with Typing Loop */}
            <div className={`relative flex items-center justify-center transition-opacity duration-700 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
              {/* Glow effect */}
              <div 
                className="absolute w-[400px] h-[400px] rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(circle, rgba(168, 85, 247, ${0.2 * glowIntensity}) 0%, transparent 70%)`,
                }}
              />
              
              {/* Info Container */}
              <div className="relative terminal-panel p-6 w-full max-w-md bg-terminal-surface/90">
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-terminal-amber rounded-full animate-pulse" />
                  <span className="text-white/50 text-xs font-pixel">CLASSIFIED DATA</span>
                </div>
                
                {/* Typing Loop Content */}
                <div className="pt-8">
                  <TypingLoopPanel />
                </div>

                {/* Bottom stats */}
                <div className="border-t border-white/10 pt-4 mt-6 flex items-center justify-between text-xs">
                  <span className="text-white/40">CLEARANCE LEVEL: <span className="text-terminal-green">OBSERVER</span></span>
                  <span className="text-terminal-amber font-pixel animate-pulse">● LIVE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className={`border-t border-white/10 bg-terminal-surface/30 transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
              <h2 className="font-pixel text-2xl text-terminal-cyan mb-4">HOW IT WORKS</h2>
              <p className="text-white/70 max-w-2xl mx-auto text-base leading-relaxed">
                The specimen responds to market activity, evolving through distinct stages 
                as thresholds are reached.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="terminal-panel p-6 hover:border-terminal-green/50 transition-colors bg-terminal-surface/80">
                <ChartIcon className="text-terminal-green mb-4" size={32} />
                <h3 className="font-pixel text-sm text-terminal-green mb-3">MARKET DRIVEN</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  The specimen's evolution is tied to real market cap data, creating a living representation of market sentiment.
                </p>
              </div>
              <div className="terminal-panel p-6 hover:border-terminal-cyan/50 transition-colors bg-terminal-surface/80">
                <EvolutionIcon className="text-terminal-cyan mb-4" size={32} />
                <h3 className="font-pixel text-sm text-terminal-cyan mb-3">MULTIPLE STAGES</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  How many forms exist? Witness the transformation as market milestones trigger evolutionary leaps.
                </p>
              </div>
              <div className="terminal-panel p-6 hover:border-terminal-purple/50 transition-colors bg-terminal-surface/80">
                <UserIcon className="text-terminal-purple mb-4" size={32} />
                <h3 className="font-pixel text-sm text-terminal-purple mb-3">COMMUNITY</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Join other observers in the laboratory. Chat, watch, and be part of this experimental journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Mystery Section */}
        <section className={`border-t border-white/10 transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="font-pixel text-2xl text-terminal-purple mb-4">THE FINAL FORM</h2>
              <p className="text-white/70 max-w-xl mx-auto text-base">
                What happens when the specimen reaches its ultimate evolution?
              </p>
            </div>

            {/* Mystery Container */}
            <div className="max-w-3xl mx-auto">
              <div className="terminal-panel p-8 md:p-12 text-center relative overflow-hidden bg-terminal-surface/80">
                {/* Animated background glow */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `radial-gradient(circle at center, rgba(168, 85, 247, ${0.3 * glowIntensity}) 0%, transparent 60%)`,
                  }}
                />
                
                {/* Glitch lines */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-1/4 left-0 right-0 h-px bg-terminal-purple/20" />
                  <div className="absolute top-2/4 left-0 right-0 h-px bg-terminal-cyan/20" />
                  <div className="absolute top-3/4 left-0 right-0 h-px bg-terminal-purple/20" />
                </div>

                {/* Question marks */}
                <div className="relative z-10">
                  <div className="font-pixel text-6xl md:text-8xl text-terminal-purple mb-6 animate-pulse">
                    ?
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-white/80 text-lg">
                      How many evolutions until the final form?
                    </p>
                    <p className="text-white/60 text-base">
                      What does the specimen become?
                    </p>
                    <p className="text-white/60 text-base">
                      Only the market knows...
                    </p>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10">
                    <p className="text-white/60 text-base italic max-w-lg mx-auto leading-relaxed">
                      "The final transformation has never been documented. 
                      Some believe it to be myth. Others have dedicated their existence 
                      to witnessing it. The specimen waits... evolving... 
                      until the moment arrives."
                    </p>
                    <div className="mt-4 text-white/40 text-sm">
                      — Classified Lab Report
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teaser text */}
            <div className="mt-12 text-center">
              <p className="text-white/60 text-base">
                Feed the specimen. Watch it grow. Discover what lies beyond.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`border-t border-white/10 bg-terminal-surface/30 transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <h2 className="font-pixel text-2xl text-white mb-6">
              READY TO <span className="text-terminal-green">OBSERVE</span>?
            </h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto text-base leading-relaxed">
              Enter the laboratory and witness the evolution firsthand. 
              Join the community of observers tracking this experimental lifeform.
            </p>
            <Link 
              href="/observe"
              className="inline-flex items-center gap-2 px-8 py-4 bg-terminal-green text-terminal-bg font-pixel text-sm transition-all hover:brightness-110"
              style={{ boxShadow: '0 0 20px rgba(255, 107, 53, 0.4)' }}
            >
              <TerminalIcon size={18} />
              ENTER LABORATORY
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 border-t border-white/10 bg-terminal-bg transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SpecimenIcon className="text-terminal-green" size={20} />
              <span className="font-pixel text-xs text-white/50">CLAWVOLUTION</span>
            </div>
            <div className="text-white/40 text-sm">
              Observe. Evolve. Transcend.
            </div>
          </div>
        </div>
      </footer>

      {/* Float animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}