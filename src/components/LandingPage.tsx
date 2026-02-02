'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SpecimenIcon, EvolutionIcon, TerminalIcon, ChartIcon, UserIcon } from '@/icons';

export default function LandingPage() {
  const [glowIntensity, setGlowIntensity] = useState(1);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>([]);

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-terminal-green opacity-20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.speed + 3}s ease-in-out infinite`,
              animationDelay: `${particle.id * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-terminal-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-terminal-cyan/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-terminal-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-terminal-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SpecimenIcon className="text-terminal-green" size={28} />
            <span className="font-pixel text-sm text-terminal-green tracking-wider">CLAWVOLUTION</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link 
              href="/observe" 
              className="text-terminal-muted hover:text-terminal-green transition-colors text-sm"
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
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-terminal-green/10 border border-terminal-green/30 mb-6">
                <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
                <span className="text-terminal-green text-xs uppercase tracking-wider">Live Experiment</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-pixel text-terminal-text leading-tight mb-6">
                <span className="text-terminal-green glow-green">WITNESS</span>
                <br />
                <span className="text-terminal-cyan">EVOLUTION</span>
                <br />
                <span className="text-terminal-purple">IN REAL-TIME</span>
              </h1>
              
              <p className="text-terminal-muted text-lg mb-8 max-w-lg">
                A living digital organism that evolves based on market forces. 
                Watch as it transforms through five stages of existence, 
                driven by the collective energy of the market.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/observe"
                  className="group px-6 py-3 bg-terminal-green text-terminal-bg font-medium hover:shadow-glow-green transition-all flex items-center gap-2"
                >
                  <TerminalIcon size={18} />
                  <span>Enter Laboratory</span>
                </Link>
                <a 
                  href="#how-it-works"
                  className="px-6 py-3 border border-terminal-border text-terminal-text hover:border-terminal-cyan hover:text-terminal-cyan transition-all flex items-center gap-2"
                >
                  <ChartIcon size={18} />
                  <span>Learn More</span>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-terminal-border/50">
                <div>
                  <div className="font-pixel text-2xl text-terminal-green">5</div>
                  <div className="text-terminal-muted text-sm">Evolution Stages</div>
                </div>
                <div>
                  <div className="font-pixel text-2xl text-terminal-cyan">LIVE</div>
                  <div className="text-terminal-muted text-sm">Global State</div>
                </div>
                <div>
                  <div className="font-pixel text-2xl text-terminal-purple">24/7</div>
                  <div className="text-terminal-muted text-sm">Active Monitoring</div>
                </div>
              </div>
            </div>

            {/* Right side - Mascot Image */}
            <div className="relative flex items-center justify-center">
              {/* Glow effect behind mascot */}
              <div 
                className="absolute w-[400px] h-[400px] rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(circle, rgba(0, 255, 65, ${0.2 * glowIntensity}) 0%, transparent 70%)`,
                }}
              />
              
              {/* Mascot Container */}
              <div className="relative terminal-panel p-8 w-full max-w-md">
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
                  <span className="text-terminal-muted text-xs">CLAWVOLUTION-001</span>
                </div>
                
                {/* Mascot Image */}
                <div className="py-8 flex items-center justify-center">
                  <div 
                    className="relative"
                    style={{ 
                      filter: `drop-shadow(0 0 ${20 * glowIntensity}px rgba(0, 255, 65, 0.5))`,
                      animation: 'float 4s ease-in-out infinite',
                    }}
                  >
                    <Image
                      src="/mascot.png"
                      alt="Clawvolution Specimen"
                      width={280}
                      height={280}
                      className="pixelated"
                      style={{
                        imageRendering: 'pixelated',
                      }}
                      priority
                    />
                  </div>
                </div>

                {/* Status bar */}
                <div className="border-t border-terminal-border pt-4 mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-terminal-muted">EVOLUTION PROGRESS</span>
                    <span className="text-terminal-green">STAGE 1 - EMBRYO</span>
                  </div>
                  <div className="mt-2 h-2 bg-terminal-bg border border-terminal-border">
                    <div 
                      className="h-full bg-gradient-to-r from-terminal-green to-terminal-cyan transition-all"
                      style={{ width: '15%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="border-t border-terminal-border/50">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
              <h2 className="font-pixel text-2xl text-terminal-cyan mb-4">HOW IT WORKS</h2>
              <p className="text-terminal-muted max-w-2xl mx-auto">
                The specimen responds to market activity, evolving through distinct stages 
                as thresholds are reached.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: ChartIcon,
                  title: 'MARKET DRIVEN',
                  description: 'The specimen\'s evolution is tied to real market cap data, creating a living representation of market sentiment.',
                  color: 'terminal-green',
                },
                {
                  icon: EvolutionIcon,
                  title: 'FIVE STAGES',
                  description: 'From EMBRYO to MATURE, witness the transformation as market milestones trigger evolutionary leaps.',
                  color: 'terminal-cyan',
                },
                {
                  icon: UserIcon,
                  title: 'COMMUNITY',
                  description: 'Join other observers in the laboratory. Chat, watch, and be part of this experimental journey.',
                  color: 'terminal-purple',
                },
              ].map((item, i) => (
                <div key={i} className="terminal-panel p-6 hover:border-terminal-highlight transition-colors">
                  <item.icon className={`text-${item.color} mb-4`} size={32} />
                  <h3 className={`font-pixel text-sm text-${item.color} mb-3`}>{item.title}</h3>
                  <p className="text-terminal-muted text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Evolution Stages */}
        <section className="border-t border-terminal-border/50">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
              <h2 className="font-pixel text-2xl text-terminal-purple mb-4">EVOLUTION STAGES</h2>
              <p className="text-terminal-muted max-w-2xl mx-auto">
                Each stage represents a milestone in the specimen's journey.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { stage: 1, name: 'EMBRYO', cap: '$0', color: 'terminal-green' },
                { stage: 2, name: 'LARVA', cap: '$10K', color: 'terminal-cyan' },
                { stage: 3, name: 'PUPA', cap: '$100K', color: 'terminal-amber' },
                { stage: 4, name: 'JUVENILE', cap: '$500K', color: 'terminal-red' },
                { stage: 5, name: 'MATURE', cap: '$1M', color: 'terminal-purple' },
              ].map((stage) => (
                <div key={stage.stage} className="terminal-panel p-4 text-center">
                  <div className={`font-pixel text-3xl text-${stage.color} mb-2`}>{stage.stage}</div>
                  <div className={`font-pixel text-xs text-${stage.color} mb-1`}>{stage.name}</div>
                  <div className="text-terminal-muted text-xs">{stage.cap}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-terminal-border/50">
          <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <h2 className="font-pixel text-2xl text-terminal-text mb-6">
              READY TO <span className="text-terminal-green">OBSERVE</span>?
            </h2>
            <p className="text-terminal-muted mb-8 max-w-lg mx-auto">
              Enter the laboratory and witness the evolution firsthand. 
              Join the community of observers tracking this experimental lifeform.
            </p>
            <Link 
              href="/observe"
              className="inline-flex items-center gap-2 px-8 py-4 bg-terminal-green text-terminal-bg font-pixel text-sm hover:shadow-glow-green transition-all"
            >
              <TerminalIcon size={18} />
              ENTER LABORATORY
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-terminal-border/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SpecimenIcon className="text-terminal-green" size={20} />
              <span className="font-pixel text-xs text-terminal-muted">CLAWVOLUTION</span>
            </div>
            <div className="text-terminal-dim text-xs">
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