'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SpecimenIcon, EvolutionIcon, TerminalIcon, ChartIcon, UserIcon } from '@/icons';
import MysteryPopup from './MysteryPopup';
import { TypewriterText } from '@/hooks/useTypewriter';
import type { ChatMessage } from '@/types';

// Helper function to get username color
const getUsernameColor = (username: string): string => {
  const colors = [
    'text-terminal-green',
    'text-terminal-cyan',
    'text-terminal-amber',
    'text-terminal-purple',
    'text-pink-400',
    'text-blue-400',
    'text-orange-400',
    'text-emerald-400',
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Helper to format time ago
const formatTimeAgo = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

// Floating Particle Component
const FloatingParticle: React.FC<{ delay: number; size: number; x: number; duration: number }> = ({ delay, size, x, duration }) => (
  <div
    className="absolute rounded-full"
    style={{
      left: `${x}%`,
      bottom: '-20px',
      width: `${size}px`,
      height: `${size}px`,
      background: `radial-gradient(circle, rgba(255, 107, 53, 0.6) 0%, transparent 70%)`,
      animation: `floatUp ${duration}s ease-out infinite`,
      animationDelay: `${delay}s`,
    }}
  />
);

// Live Chat Preview Component (Read-Only)
const LiveChatPreview: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [newMessageId, setNewMessageId] = useState<number | null>(null);
  const prevMessagesRef = useRef<ChatMessage[]>([]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      if (data.success) {
        const newMessages = data.messages?.slice(-6) || [];
        // Check for new message
        if (prevMessagesRef.current.length > 0 && newMessages.length > 0) {
          const lastOld = prevMessagesRef.current[prevMessagesRef.current.length - 1]?.id;
          const lastNew = newMessages[newMessages.length - 1]?.id;
          if (lastNew !== lastOld) {
            setNewMessageId(lastNew);
            setTimeout(() => setNewMessageId(null), 2000);
          }
        }
        prevMessagesRef.current = newMessages;
        setMessages(newMessages);
        setIsConnected(true);
        const fiveMinAgo = Date.now() - 5 * 60 * 1000;
        const activeUsers = new Set(
          (data.messages || [])
            .filter((m: ChatMessage) => new Date(m.created_at).getTime() > fiveMinAgo)
            .map((m: ChatMessage) => m.username)
        );
        setOnlineCount(Math.max(1, activeUsers.size));
      }
    } catch (err) {
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  return (
    <div className="flex flex-col h-full">
      {/* Online indicator */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {[...Array(Math.min(3, onlineCount))].map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-terminal-green/30 to-terminal-cyan/30 border border-terminal-green/50 flex items-center justify-center">
                <UserIcon size={10} className="text-terminal-green" />
              </div>
            ))}
          </div>
          <span className="text-terminal-green text-xs font-pixel">{onlineCount}</span>
          <span className="text-white/40 text-xs">watching</span>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${isConnected ? 'bg-terminal-green/10' : 'bg-terminal-red/10'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-terminal-green animate-pulse' : 'bg-terminal-red'}`} />
          <span className={`text-[10px] ${isConnected ? 'text-terminal-green' : 'text-terminal-red'}`}>
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-hidden space-y-2 min-h-[180px] max-h-[220px] relative">
        {/* Fade overlay at top */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-terminal-surface/90 to-transparent z-10 pointer-events-none" />
        
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-terminal-green/10 to-terminal-cyan/10 flex items-center justify-center mb-3 border border-terminal-border/30">
              <TerminalIcon className="opacity-40 text-terminal-green" size={24} />
            </div>
            <p className="text-white/40 text-sm font-medium">No messages yet</p>
            <p className="text-white/25 text-xs mt-1">Be the first observer to chat!</p>
          </div>
        ) : (
          <div className="space-y-1.5 pt-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex items-start gap-2 py-2 px-2.5 rounded-lg transition-all duration-500 ${
                  msg.id === newMessageId 
                    ? 'bg-terminal-green/10 border border-terminal-green/30' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 bg-gradient-to-br from-terminal-green/20 to-terminal-cyan/10 border border-terminal-border/50 ${getUsernameColor(msg.username)}`}>
                  {msg.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${getUsernameColor(msg.username)}`}>
                      {msg.username}
                    </span>
                    <span className="text-white/20 text-[10px]">
                      {formatTimeAgo(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm break-words leading-relaxed mt-0.5">
                    {msg.message.startsWith('[GIF:') ? (
                      <span className="flex items-center gap-1 text-terminal-cyan">
                        <span>🎬</span> sent a reaction
                      </span>
                    ) : msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Locked input area */}
      <div className="border-t border-white/10 pt-4 mt-3">
        <div className="relative group">
          <div className="w-full bg-terminal-bg/80 border border-terminal-border/30 rounded-lg px-4 py-3 text-sm text-white/30 flex items-center justify-between group-hover:border-terminal-green/30 transition-colors">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Enter the lab to chat...
            </span>
            <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <Link 
          href="/observe"
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-terminal-green to-emerald-500 text-terminal-bg font-pixel text-xs transition-all hover:brightness-110 rounded-lg shadow-lg shadow-terminal-green/20"
        >
          <TerminalIcon size={14} />
          JOIN THE CONVERSATION
        </Link>
      </div>
    </div>
  );
};

// Glitch Text Effect Component
const GlitchText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const [glitching, setGlitching] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <span className={`relative inline-block ${className}`}>
      <span className={glitching ? 'opacity-0' : ''}>{text}</span>
      {glitching && (
        <>
          <span className="absolute inset-0 text-terminal-cyan" style={{ transform: 'translate(-2px, 0)', clipPath: 'inset(0 0 50% 0)' }}>{text}</span>
          <span className="absolute inset-0 text-terminal-red" style={{ transform: 'translate(2px, 0)', clipPath: 'inset(50% 0 0 0)' }}>{text}</span>
        </>
      )}
    </span>
  );
};

export default function LandingPage() {
  const [glowIntensity, setGlowIntensity] = useState(1);
  const [showPopup, setShowPopup] = useState(true);
  const [typingStep, setTypingStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  const startLandingTyping = !showPopup;

  // Track mouse position for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Glow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(0.7 + Math.sin(Date.now() / 1000) * 0.3);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a]">
      {/* Mystery Popup */}
      {showPopup && <MysteryPopup onClose={() => setShowPopup(false)} />}

      {/* Animated Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,107,53,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,107,53,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <FloatingParticle 
            key={i} 
            delay={i * 0.5} 
            size={Math.random() * 6 + 2} 
            x={Math.random() * 100} 
            duration={Math.random() * 5 + 8}
          />
        ))}
      </div>

      {/* Gradient Orbs with Parallax */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[100px] opacity-30"
          style={{ 
            background: 'radial-gradient(circle, rgba(255, 107, 53, 0.4) 0%, transparent 70%)',
            top: `${-200 + mousePos.y * 50}px`,
            left: `${-200 + mousePos.x * 50}px`,
          }} 
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[80px] opacity-20"
          style={{ 
            background: 'radial-gradient(circle, rgba(0, 255, 100, 0.3) 0%, transparent 70%)',
            bottom: `${-100 - mousePos.y * 30}px`,
            right: `${-100 - mousePos.x * 30}px`,
          }} 
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[60px] opacity-15"
          style={{ 
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translate(${mousePos.x * 20 - 10}px, ${mousePos.y * 20 - 10}px)`,
          }} 
        />
      </div>

      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
      }} />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl transition-all duration-500 ${startLandingTyping ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
        style={{ background: `rgba(10, 10, 10, ${Math.min(0.9, scrollY / 200)})` }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image 
                src="/logo.png" 
                alt="Clawvolution" 
                width={36} 
                height={36}
                className="pixelated transition-transform group-hover:scale-110"
                style={{ imageRendering: 'pixelated' }}
              />
              <div className="absolute inset-0 bg-terminal-green/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
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
          <nav className={`flex items-center gap-6 transition-all duration-300 ${typingStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            <a 
              href="https://x.com/clawvolution" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-terminal-green transition-all hover:scale-110"
              aria-label="X (Twitter)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <Link 
              href="/observe" 
              className="text-white/50 hover:text-terminal-green transition-colors text-sm"
            >
              Observe
            </Link>
            <Link 
              href="/observe" 
              className="px-5 py-2.5 bg-terminal-green/10 border border-terminal-green/50 text-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-all text-sm rounded-lg font-medium"
            >
              Enter Lab →
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 pt-20">
        <section className="max-w-7xl mx-auto px-6 py-16 lg:py-28 min-h-[90vh] flex items-center">
          <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
            {/* Left side - Text */}
            <div className={`transition-all duration-700 ${startLandingTyping ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-terminal-green/10 to-terminal-cyan/10 border border-terminal-green/30 rounded-full mb-8 transition-opacity duration-300 ${typingStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="relative">
                  <div className="w-2 h-2 bg-terminal-green rounded-full" />
                  <div className="absolute inset-0 w-2 h-2 bg-terminal-green rounded-full animate-ping" />
                </div>
                <span className="text-terminal-green text-xs uppercase tracking-wider font-medium">
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
              
              {/* Main Heading */}
              <h1 className="text-5xl lg:text-7xl font-pixel leading-[1.1] mb-8">
                <span className="text-terminal-green block min-h-[1.15em] drop-shadow-[0_0_30px_rgba(0,255,65,0.3)]">
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
                <span className="text-terminal-cyan block min-h-[1.15em] drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]">
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-terminal-purple to-pink-500 block min-h-[1.15em]">
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
              
              {/* Description */}
              <p className="text-white/60 text-lg mb-10 max-w-xl leading-relaxed min-h-[5rem]">
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

              {/* CTA Buttons */}
              <div className={`flex flex-wrap gap-4 transition-all duration-500 ${typingStep >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Link 
                  href="/observe"
                  className="group relative px-8 py-4 bg-gradient-to-r from-terminal-green to-emerald-500 text-terminal-bg font-semibold transition-all flex items-center gap-3 rounded-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  <TerminalIcon size={20} />
                  <span>Enter Laboratory</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a 
                  href="#how-it-works"
                  className="px-8 py-4 border border-white/20 text-white/80 hover:border-terminal-cyan hover:text-terminal-cyan transition-all flex items-center gap-3 rounded-xl backdrop-blur-sm"
                >
                  <ChartIcon size={20} />
                  <span>Learn More</span>
                </a>
              </div>

              {/* Stats */}
              <div className={`grid grid-cols-3 gap-8 mt-14 pt-8 border-t border-white/10 transition-all duration-500 delay-200 ${typingStep >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="text-center lg:text-left">
                  <div className="font-pixel text-3xl text-terminal-green mb-1">
                    <GlitchText text="???" />
                  </div>
                  <div className="text-white/40 text-sm">Evolution Stages</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-pixel text-3xl text-terminal-cyan mb-1 flex items-center gap-2 justify-center lg:justify-start">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-cyan opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-terminal-cyan"></span>
                    </span>
                    LIVE
                  </div>
                  <div className="text-white/40 text-sm">Global State</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-pixel text-3xl text-terminal-purple mb-1">24/7</div>
                  <div className="text-white/40 text-sm">Active Monitoring</div>
                </div>
              </div>
            </div>

            {/* Right side - Live Chat Preview */}
            <div className={`relative flex items-center justify-center transition-all duration-700 delay-300 ${typingStep >= 6 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 border border-terminal-green/20 rounded-full" />
              <div className="absolute -bottom-5 -left-5 w-10 h-10 border border-terminal-purple/20 rounded-full" />
              
              {/* Glow effect */}
              <div 
                className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
                style={{
                  background: `radial-gradient(circle, rgba(0, 255, 65, ${0.12 * glowIntensity}) 0%, transparent 70%)`,
                }}
              />
              
              {/* Chat Container */}
              <div className="relative w-full max-w-md">
                {/* Floating badge */}
                <div className="absolute -top-4 left-6 px-3 py-1 bg-terminal-green text-terminal-bg text-xs font-pixel rounded-full z-10 shadow-lg shadow-terminal-green/30">
                  REAL-TIME
                </div>
                
                <div className="terminal-panel p-6 bg-gradient-to-br from-terminal-surface/95 to-terminal-bg/95 border-terminal-green/20 shadow-2xl shadow-terminal-green/10">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-terminal-green/10 rounded-lg">
                        <TerminalIcon className="text-terminal-green" size={16} />
                      </div>
                      <span className="text-terminal-green text-xs font-pixel tracking-wide">OBSERVER FEED</span>
                    </div>
                  </div>
                  
                  {/* Live Chat Content */}
                  <LiveChatPreview />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll indicator */}
        <div className={`flex flex-col items-center pb-10 transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-white/30 text-xs mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>

        {/* How it Works */}
        <section id="how-it-works" className={`border-t border-white/5 bg-gradient-to-b from-transparent to-terminal-surface/20 transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center mb-20">
              <span className="text-terminal-cyan text-xs font-pixel tracking-widest mb-4 block">THE PROTOCOL</span>
              <h2 className="font-pixel text-3xl lg:text-4xl text-white mb-6">HOW IT <span className="text-terminal-cyan">WORKS</span></h2>
              <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
                The specimen responds to market activity, evolving through distinct stages 
                as thresholds are reached.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group terminal-panel p-8 hover:border-terminal-green/50 transition-all duration-300 bg-gradient-to-br from-terminal-surface/80 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-terminal-green/5 rounded-full blur-3xl group-hover:bg-terminal-green/10 transition-colors" />
                <div className="p-3 bg-terminal-green/10 rounded-xl w-fit mb-6">
                  <ChartIcon className="text-terminal-green" size={28} />
                </div>
                <h3 className="font-pixel text-sm text-terminal-green mb-4">MARKET DRIVEN</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  The specimen's evolution is tied to real market cap data, creating a living representation of market sentiment.
                </p>
              </div>
              <div className="group terminal-panel p-8 hover:border-terminal-cyan/50 transition-all duration-300 bg-gradient-to-br from-terminal-surface/80 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-terminal-cyan/5 rounded-full blur-3xl group-hover:bg-terminal-cyan/10 transition-colors" />
                <div className="p-3 bg-terminal-cyan/10 rounded-xl w-fit mb-6">
                  <EvolutionIcon className="text-terminal-cyan" size={28} />
                </div>
                <h3 className="font-pixel text-sm text-terminal-cyan mb-4">MULTIPLE STAGES</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  How many forms exist? Witness the transformation as market milestones trigger evolutionary leaps.
                </p>
              </div>
              <div className="group terminal-panel p-8 hover:border-terminal-purple/50 transition-all duration-300 bg-gradient-to-br from-terminal-surface/80 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-terminal-purple/5 rounded-full blur-3xl group-hover:bg-terminal-purple/10 transition-colors" />
                <div className="p-3 bg-terminal-purple/10 rounded-xl w-fit mb-6">
                  <UserIcon className="text-terminal-purple" size={28} />
                </div>
                <h3 className="font-pixel text-sm text-terminal-purple mb-4">COMMUNITY</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Join other observers in the laboratory. Chat, watch, and be part of this experimental journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Genesis Section */}
        <section className={`border-t border-white/5 transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <span className="text-terminal-amber text-xs font-pixel tracking-widest mb-4 block">ORIGIN STORY</span>
              <h2 className="font-pixel text-3xl lg:text-4xl text-white mb-4">THE <span className="text-terminal-amber">GENESIS</span></h2>
              <p className="text-white/50 max-w-xl mx-auto text-lg">
                It started with a prompt. It ended with lobsters taking over.
              </p>
            </div>

            {/* Genesis Timeline Container */}
            <div className="max-w-4xl mx-auto">
              <div className="terminal-panel p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-terminal-surface/80 to-terminal-bg/80">
                {/* Animated background */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `radial-gradient(circle at center, rgba(255, 170, 0, ${0.2 * glowIntensity}) 0%, transparent 60%)`,
                  }}
                />
                
                {/* Vertical timeline line */}
                <div className="absolute left-8 md:left-12 top-24 bottom-24 w-px bg-gradient-to-b from-terminal-green via-terminal-cyan to-terminal-amber" />

                {/* Timeline Content */}
                <div className="relative z-10 space-y-8 pl-12 md:pl-16">
                  {/* Day 0 */}
                  <div className="relative group">
                    <div className="absolute -left-12 md:-left-16 w-6 h-6 rounded-full bg-terminal-green/20 border-2 border-terminal-green flex items-center justify-center group-hover:scale-125 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-terminal-green" />
                    </div>
                    <div className="font-pixel text-terminal-green text-sm mb-2">DAY 0 — THE PROMPT</div>
                    <p className="text-white/70 text-base leading-relaxed">
                      "A single prompt was entered into <span className="text-terminal-cyan font-semibold">OpenClaw</span>... 
                      <span className="text-white/40 italic"> 'Create something that evolves.'</span>"
                    </p>
                  </div>

                  {/* Day 1 */}
                  <div className="relative group">
                    <div className="absolute -left-12 md:-left-16 w-6 h-6 rounded-full bg-terminal-cyan/20 border-2 border-terminal-cyan flex items-center justify-center group-hover:scale-125 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-terminal-cyan" />
                    </div>
                    <div className="font-pixel text-terminal-cyan text-sm mb-2">DAY 1 — FIRST CODE</div>
                    <p className="text-white/70 text-base leading-relaxed">
                      "The first lines of code wrote themselves. No human hands touched the keyboard.
                      <span className="text-white/40 italic"> The AI had begun its work.</span>"
                    </p>
                  </div>

                  {/* Day 7 */}
                  <div className="relative group">
                    <div className="absolute -left-12 md:-left-16 w-6 h-6 rounded-full bg-terminal-purple/20 border-2 border-terminal-purple flex items-center justify-center group-hover:scale-125 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-terminal-purple" />
                    </div>
                    <div className="font-pixel text-terminal-purple text-sm mb-2">DAY 7 — EVOLUTION BEGINS</div>
                    <p className="text-white/70 text-base leading-relaxed">
                      "It began to evolve on its own. We stopped asking questions.
                      <span className="text-white/40 italic"> We started watching.</span>"
                    </p>
                  </div>

                  {/* Day ??? */}
                  <div className="relative group">
                    <div className="absolute -left-12 md:-left-16 w-6 h-6 rounded-full bg-terminal-amber/20 border-2 border-terminal-amber flex items-center justify-center group-hover:scale-125 transition-transform animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-terminal-amber" />
                    </div>
                    <div className="font-pixel text-terminal-amber text-sm mb-2">DAY ??? — THE TAKEOVER</div>
                    <p className="text-white/70 text-base leading-relaxed">
                      "The lobsters... <span className="text-terminal-red">they're everywhere now.</span>
                      <span className="text-white/40 italic"> Built entirely by AI. Owned by 🦞</span>"
                    </p>
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="font-pixel text-2xl text-terminal-green mb-1">&lt;0.01%</div>
                      <div className="text-white/40 text-xs">Human Intervention</div>
                    </div>
                    <div>
                      <div className="font-pixel text-2xl text-terminal-cyan mb-1">100%</div>
                      <div className="text-white/40 text-xs">AI Generated</div>
                    </div>
                    <div>
                      <div className="font-pixel text-2xl text-terminal-amber mb-1">∞</div>
                      <div className="text-white/40 text-xs">Evolution Potential</div>
                    </div>
                  </div>
                </div>

                {/* Manifesto Quote */}
                <div className="relative z-10 mt-8 p-6 bg-terminal-bg/50 rounded-lg border border-white/5">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🦞</div>
                    <p className="text-white/60 text-sm italic leading-relaxed max-w-lg mx-auto">
                      "No devs. No VCs. No roadmap. Just a prompt, an AI, and the unstoppable 
                      rise of the claw. The market decides our form. The code writes itself."
                    </p>
                    <div className="mt-4 text-terminal-amber/60 text-xs font-pixel">
                      — The Clawvolution Manifesto
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`border-t border-white/5 bg-gradient-to-b from-transparent to-terminal-green/5 transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <h2 className="font-pixel text-3xl lg:text-4xl text-white mb-6">
              READY TO <span className="text-terminal-green">OBSERVE</span>?
            </h2>
            <p className="text-white/50 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              Enter the laboratory and witness the evolution firsthand. 
              Join the community of observers tracking this experimental lifeform.
            </p>
            <Link 
              href="/observe"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-terminal-green to-emerald-500 text-terminal-bg font-pixel text-sm transition-all hover:brightness-110 rounded-xl shadow-2xl shadow-terminal-green/30"
            >
              <TerminalIcon size={20} />
              ENTER LABORATORY
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 border-t border-white/5 bg-[#0a0a0a] transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SpecimenIcon className="text-terminal-green" size={20} />
              <span className="font-pixel text-xs text-white/30">CLAWVOLUTION</span>
            </div>
            <div className="text-white/30 text-sm">
              Observe. Evolve. Transcend.
            </div>
            <div className="flex items-center gap-4">
              <a href="https://x.com/clawvolution" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-terminal-green transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}