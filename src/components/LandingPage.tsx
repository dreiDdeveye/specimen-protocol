'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserIcon } from '@/icons';
import MysteryPopup from './MysteryPopup';
import { TypewriterText } from '@/hooks/useTypewriter';
import Folder from './Folder';
import Iceberg from './Iceberg';
import type { ChatMessage } from '@/types';


// Typewriter sound hook
const useTypingSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const playClick = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
      const time = ctx.currentTime;
      
      // Key strike (clack)
      const strikeOsc = ctx.createOscillator();
      strikeOsc.type = 'square';
      strikeOsc.frequency.setValueAtTime(150 + Math.random() * 50, time);
      strikeOsc.frequency.exponentialRampToValueAtTime(50, time + 0.02);
      
      const strikeGain = ctx.createGain();
      strikeGain.gain.setValueAtTime(0.2, time);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
      
      // Hammer hit (tink)
      const hammerOsc = ctx.createOscillator();
      hammerOsc.type = 'sine';
      hammerOsc.frequency.setValueAtTime(4000 + Math.random() * 800, time);
      hammerOsc.frequency.exponentialRampToValueAtTime(1500, time + 0.015);
      
      const hammerGain = ctx.createGain();
      hammerGain.gain.setValueAtTime(0.06, time);
      hammerGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
      
      // Noise burst
      const noiseLength = 0.03;
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * noiseLength, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      
      for (let i = 0; i < noiseData.length; i++) {
        const t = i / noiseData.length;
        const envelope = t < 0.1 ? t * 10 : Math.exp(-(t - 0.1) * 15);
        noiseData[i] = (Math.random() * 2 - 1) * envelope;
      }
      
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1200 + Math.random() * 400;
      noiseFilter.Q.value = 1.5;
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.25;
      
      // Master output
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.5;
      
      strikeOsc.connect(strikeGain);
      strikeGain.connect(masterGain);
      
      hammerOsc.connect(hammerGain);
      hammerGain.connect(masterGain);
      
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      
      masterGain.connect(ctx.destination);
      
      strikeOsc.start(time);
      strikeOsc.stop(time + 0.03);
      
      hammerOsc.start(time);
      hammerOsc.stop(time + 0.025);
      
      noiseSource.start(time);
      noiseSource.stop(time + noiseLength);
      
    } catch (e) {
      // Ignore audio errors
    }
  }, []);

  return playClick;
};

// Music Icon Components
const MusicOnIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const MusicOffIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
    <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" />
  </svg>
);

// File Icon Component
const FileIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

// Lock Icon Component
const LockIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// Eye Icon Component
const EyeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Shield Icon Component
const ShieldIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// Play Icon Component
const PlayIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

// Crosshair/Target Icon Component
const CrosshairIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="22" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="2" y2="12" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <line x1="12" y1="22" x2="12" y2="18" />
  </svg>
);

// Arrow Right Icon
const ArrowRightIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

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

// Floating Particle Component - Document styled
const FloatingParticle: React.FC<{ delay: number; size: number; x: number; duration: number }> = ({ delay, size, x, duration }) => (
  <div
    className="absolute"
    style={{
      left: `${x}%`,
      bottom: '-20px',
      width: `${size}px`,
      height: `${size * 1.3}px`,
      background: `linear-gradient(180deg, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0.1) 100%)`,
      animation: `floatUp ${duration}s ease-out infinite`,
      animationDelay: `${delay}s`,
      borderRadius: '2px',
    }}
  />
);

// Locked Paper Content for Folders
const LockedPaper: React.FC<{ chapterNum: number }> = ({ chapterNum }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-gray-100 rounded-lg">
    <LockIcon size={12} className="text-gray-400 mb-0.5" />
    <span className="text-[6px] text-gray-500 font-bold">CH.{chapterNum}</span>
  </div>
);

// Chapter folder data
const chapterFolders = [
  { num: 1, color: '#ef4444', subtitle: 'Flight Logs', opacity: 0.9 },
  { num: 2, color: '#f97316', subtitle: 'Black Book', opacity: 0.85 },
  { num: 3, color: '#eab308', subtitle: 'Court Docs', opacity: 0.8 },
  { num: 4, color: '#22c55e', subtitle: 'Testimonies', opacity: 0.75 },
  { num: 5, color: '#3b82f6', subtitle: 'Financials', opacity: 0.7 },
  { num: 6, color: '#8b5cf6', subtitle: 'Intel Files', opacity: 0.65 },
  { num: 7, color: '#6b7280', subtitle: '[REDACTED]', opacity: 0.55 },
  { num: 8, color: '#374151', subtitle: 'The Full Truth', opacity: 0.45 },
];

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
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {[...Array(Math.min(3, onlineCount))].map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500/30 to-terminal-amber/30 border border-red-500/50 flex items-center justify-center">
                <UserIcon size={10} className="text-red-400" />
              </div>
            ))}
          </div>
          <span className="text-red-400 text-xs font-pixel">{onlineCount}</span>
          <span className="text-white/40 text-xs">investigating</span>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${isConnected ? 'bg-red-500/10' : 'bg-terminal-red/10'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-red-500 animate-pulse' : 'bg-terminal-red'}`} />
          <span className={`text-[10px] ${isConnected ? 'text-red-400' : 'text-terminal-red'}`}>
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden space-y-2 min-h-[180px] max-h-[220px] relative">
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-terminal-surface/90 to-transparent z-10 pointer-events-none" />
        
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500/10 to-terminal-amber/10 flex items-center justify-center mb-3 border border-terminal-border/30">
              <FileIcon className="opacity-40 text-red-400" size={24} />
            </div>
            <p className="text-white/40 text-sm font-medium">No intel yet</p>
            <p className="text-white/25 text-xs mt-1">Be the first to share information</p>
          </div>
        ) : (
          <div className="space-y-1.5 pt-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex items-start gap-2 py-2 px-2.5 rounded-lg transition-all duration-500 ${
                  msg.id === newMessageId 
                    ? 'bg-red-500/10 border border-red-500/30' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 bg-gradient-to-br from-red-500/20 to-terminal-amber/10 border border-terminal-border/50 ${getUsernameColor(msg.username)}`}>
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
                        <span>sent a reaction</span>
                      </span>
                    ) : msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-4 mt-3">
        <div className="relative group">
          <div className="w-full bg-terminal-bg/80 border border-terminal-border/30 rounded-lg px-4 py-3 text-sm text-white/30 flex items-center justify-between group-hover:border-red-500/30 transition-colors">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Complete chapters to unlock chat...
            </span>
            <LockIcon size={16} className="text-white/20" />
          </div>
        </div>
        <Link 
          href="/observe"
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-pixel text-xs transition-all hover:brightness-110 rounded-lg shadow-lg shadow-red-500/20"
        >
          <CrosshairIcon size={16} />
          <span>BEGIN INVESTIGATION</span>
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
          <span className="absolute inset-0 text-red-500" style={{ transform: 'translate(-2px, 0)', clipPath: 'inset(0 0 50% 0)' }}>{text}</span>
          <span className="absolute inset-0 text-terminal-amber" style={{ transform: 'translate(2px, 0)', clipPath: 'inset(50% 0 0 0)' }}>{text}</span>
        </>
      )}
    </span>
  );
};

// CA Section Component
const CASection: React.FC<{ show: boolean }> = ({ show }) => {
  const [copied, setCopied] = useState(false);
  const CA_ADDRESS = 'GoctGHWWBViKRKKUoqQrVvrK3JQdvo1KTEQE1CSopump';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CA_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto px-6 mb-10 transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div 
        className="group relative bg-terminal-bg/80 backdrop-blur-md border border-red-500/30 rounded-xl p-4 cursor-pointer hover:border-red-500/60 hover:bg-red-500/5 transition-all"
        onClick={handleCopy}
      >
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="text-white/50 text-sm font-pixel">CA:</span>
          <code className="text-red-400 text-sm sm:text-lg font-mono tracking-wider group-hover:text-red-300 transition-colors break-all">
            {CA_ADDRESS}
          </code>
          <div className="flex items-center gap-2 transition-colors">
            {copied ? (
              <>
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-red-400 text-xs font-pixel">COPIED!</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-white/30 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-white/30 group-hover:text-red-400 text-xs hidden sm:inline transition-colors">CLICK TO COPY</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Music Toggle Button Component (Simple - Max Volume Only)
const MusicToggle: React.FC<{ 
  isPlaying: boolean; 
  onToggle: () => void;
}> = ({ isPlaying, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
        isPlaying 
          ? 'bg-red-500/20 border-red-500/50 text-red-400' 
          : 'bg-white/5 border-white/20 text-white/50 hover:border-red-500/30 hover:text-red-400'
      }`}
      title={isPlaying ? 'Pause Music' : 'Play Music'}
    >
      {isPlaying ? (
        <MusicOnIcon size={16} />
      ) : (
        <MusicOffIcon size={16} />
      )}
      <span className="text-xs hidden sm:inline">{isPlaying ? 'ON' : 'OFF'}</span>
    </button>
  );
};

export default function LandingPage() {
  const [glowIntensity, setGlowIntensity] = useState(1);
  const [showPopup, setShowPopup] = useState(true);
  const [typingStep, setTypingStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  
  // Background music state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startLandingTyping = !showPopup;

  // Initialize audio on mount (max volume)
  useEffect(() => {
    audioRef.current = new Audio('/bgmusic.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 1.0; // MAX VOLUME
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Autoplay music on first user interaction (click anywhere)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasUserInteracted && audioRef.current) {
        setHasUserInteracted(true);
        audioRef.current.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(err => {
          console.log('Audio autoplay failed:', err);
        });
        // Remove listeners after first interaction
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
      }
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [hasUserInteracted]);

  // Toggle music function
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(0.7 + Math.sin(Date.now() / 1000) * 0.3);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a]">
      {showPopup && <MysteryPopup onClose={() => setShowPopup(false)} />}

      {/* Animated Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)
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

      {/* Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[100px] opacity-30"
          style={{ 
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)',
            top: `${-200 + mousePos.y * 50}px`,
            left: `${-200 + mousePos.x * 50}px`,
          }} 
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[80px] opacity-20"
          style={{ 
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
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

      {/* Island Background for Hero */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-[0.06]"
          style={{
            backgroundImage: 'url(/island.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'blur(1px)',
          }}
        />
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl transition-all duration-500 ${startLandingTyping ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
        style={{ background: `rgba(10, 10, 10, ${Math.min(0.9, scrollY / 200)})` }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image 
                src="/logo.png" 
                alt="Epstein Files" 
                width={36} 
                height={36}
                className="pixelated transition-transform group-hover:scale-110"
                style={{ imageRendering: 'pixelated' }}
              />
              <div className="absolute inset-0 bg-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-pixel text-sm text-red-500 tracking-wider">
              {startLandingTyping && (
                <TypewriterText 
                  text="THE ISLAND" 
                  speed={50} 
                  delay={0}
                  onComplete={() => setTypingStep(1)}
                  cursor={typingStep === 0}
                />
              )}
            </span>
          </Link>
          <nav className={`flex items-center gap-4 transition-all duration-300 ${typingStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            {/* Music Toggle */}
            <MusicToggle 
              isPlaying={isMusicPlaying}
              onToggle={toggleMusic}
            />
            
            <a 
              href="https://x.com/i/communities/2019914054790525221" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/50 hover:text-red-400 transition-all text-xs"
              aria-label="Community"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="hidden sm:inline">Community</span>
            </a>
            <a 
              href="https://x.com/EpsteinFiles" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/50 hover:text-red-400 transition-all text-xs"
              aria-label="Main"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="hidden sm:inline">Main</span>
            </a>
            <Link 
              href="/observe" 
              className="text-white/50 hover:text-red-400 transition-colors text-sm"
            >
              Investigate
            </Link>
            <Link 
              href="/observe" 
              className="px-5 py-2.5 bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm rounded-lg font-medium flex items-center gap-2"
            >
              <PlayIcon size={12} />
              <span>Start</span>
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
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-terminal-amber/10 border border-red-500/30 rounded-full mb-8 transition-opacity duration-300 ${typingStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="relative">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                </div>
                <span className="text-red-400 text-xs uppercase tracking-wider font-medium">
                  {typingStep >= 1 && (
                    <TypewriterText 
                      text="Classified Documents" 
                      speed={40} 
                      delay={200}
                      onComplete={() => setTypingStep(2)}
                      cursor={typingStep === 1}
                    />
                  )}
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-pixel leading-[1.1] mb-8">
                <span className="text-red-500 block min-h-[1.15em] drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                  {typingStep >= 2 && (
                    <TypewriterText 
                      text="THE TRUTH" 
                      speed={80} 
                      delay={0}
                      onComplete={() => setTypingStep(3)}
                      cursor={typingStep === 2}
                    />
                  )}
                </span>
                <span className="text-terminal-amber block min-h-[1.15em] drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                  {typingStep >= 3 && (
                    <TypewriterText 
                      text="WILL BE" 
                      speed={80} 
                      delay={0}
                      onComplete={() => setTypingStep(4)}
                      cursor={typingStep === 3}
                    />
                  )}
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 block min-h-[1.15em]">
                  {typingStep >= 4 && (
                    <TypewriterText 
                      text="EXPOSED" 
                      speed={80} 
                      delay={0}
                      onComplete={() => setTypingStep(5)}
                      cursor={typingStep === 4}
                    />
                  )}
                </span>
              </h1>
              
              <p className="text-white/60 text-lg mb-10 max-w-xl leading-relaxed min-h-[5rem]">
                {typingStep >= 5 && (
                  <TypewriterText 
                    text="Declassified documents. Unsealed records. The names they tried to hide. Complete chapters to unlock classified files. The blockchain never forgets." 
                    speed={15} 
                    delay={0}
                    onComplete={() => setTypingStep(6)}
                    cursor={typingStep === 5}
                  />
                )}
              </p>

              <div className={`flex flex-wrap gap-4 transition-all duration-500 ${typingStep >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Link 
                  href="/observe"
                  className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold transition-all flex items-center gap-3 rounded-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  <CrosshairIcon size={20} />
                  <span>Begin Investigation</span>
                  <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#how-it-works"
                  className="px-8 py-4 border border-white/20 text-white/80 hover:border-red-500 hover:text-red-400 transition-all flex items-center gap-3 rounded-xl backdrop-blur-sm"
                >
                  <EyeIcon size={20} />
                  <span>Learn More</span>
                </a>
              </div>

              <div className={`grid grid-cols-3 gap-8 mt-14 pt-8 border-t border-white/10 transition-all duration-500 delay-200 ${typingStep >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="text-center lg:text-left">
                  <div className="font-pixel text-3xl text-red-500 mb-1">
                    <GlitchText text="1000+" />
                  </div>
                  <div className="text-white/40 text-sm">Documents</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-pixel text-3xl text-terminal-amber mb-1 flex items-center gap-2 justify-center lg:justify-start">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-amber opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-terminal-amber"></span>
                    </span>
                    LIVE
                  </div>
                  <div className="text-white/40 text-sm">Releases</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-pixel text-3xl text-white mb-1">8</div>
                  <div className="text-white/40 text-sm">Chapters</div>
                </div>
              </div>
            </div>

            {/* Right side - Live Chat Preview */}
            <div className={`relative flex items-center justify-center transition-all duration-700 delay-300 ${typingStep >= 6 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="absolute -top-10 -right-10 w-20 h-20 border border-red-500/20 rounded-full" />
              <div className="absolute -bottom-5 -left-5 w-10 h-10 border border-terminal-amber/20 rounded-full" />
              
              <div 
                className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
                style={{
                  background: `radial-gradient(circle, rgba(239, 68, 68, ${0.12 * glowIntensity}) 0%, transparent 70%)`,
                }}
              />
              
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 left-6 px-3 py-1 bg-red-500 text-white text-xs font-pixel rounded-full z-10 shadow-lg shadow-red-500/30 flex items-center gap-1.5">
                  <LockIcon size={10} />
                  CLASSIFIED
                </div>
                
                <div className="terminal-panel p-6 bg-gradient-to-br from-terminal-surface/95 to-terminal-bg/95 border-red-500/20 shadow-2xl shadow-red-500/10">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-red-500/10 rounded-lg">
                        <FileIcon className="text-red-400" size={16} />
                      </div>
                      <span className="text-red-400 text-xs font-pixel tracking-wide">INTEL FEED</span>
                    </div>
                  </div>
                  
                  <LiveChatPreview />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CA Banner - Below Hero */}
        <CASection show={typingStep >= 6} />

        {/* Documents Vault Section - CHAPTERS 1-8 */}
        <section className={`py-20 px-6 transition-all duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <LockIcon size={16} className="text-red-400 animate-pulse" />
                <span className="text-red-400 text-xs font-pixel tracking-widest">CLASSIFIED</span>
              </div>
              <h2 className="font-pixel text-3xl lg:text-4xl text-white mb-4">THE <span className="text-red-400">VAULT</span></h2>
              <p className="text-white/50 max-w-xl mx-auto text-lg mb-6">
                All documents are locked. Complete survival chapters to unlock classified files.
              </p>
              <Link 
                href="/observe"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-pixel text-sm rounded-lg hover:brightness-110 transition-all shadow-lg shadow-red-500/30"
              >
                <CrosshairIcon size={18} />
                <span>BEGIN MISSION</span>
              </Link>
            </div>

            {/* Folders Grid - CHAPTERS 1-8 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
              {chapterFolders.map((chapter) => (
                <div 
                  key={chapter.num} 
                  className="flex flex-col items-center gap-3"
                  style={{ opacity: chapter.opacity }}
                >
                  <div className="relative">
                    <Folder
                      color={chapter.color}
                      size={1.1}
                      items={[
                        <LockedPaper key="1" chapterNum={chapter.num} />,
                        <LockedPaper key="2" chapterNum={chapter.num} />,
                        <LockedPaper key="3" chapterNum={chapter.num} />,
                      ]}
                    />
                    {/* Lock overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black/50 rounded-full p-2 backdrop-blur-sm">
                        <LockIcon size={18} className="text-white/80" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-pixel text-sm text-white">CHAPTER {chapter.num}</h4>
                    <p className="text-white/40 text-xs mt-1">{chapter.subtitle}</p>
                    <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-[10px] text-red-400 font-pixel">
                      <LockIcon size={10} />
                      LOCKED
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-16 max-w-2xl mx-auto">
              <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                <span className="font-pixel">CHAPTERS COMPLETED</span>
                <span className="font-pixel text-red-400">0 / 8</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-full transition-all duration-1000 relative"
                  style={{ width: '0%' }}
                />
              </div>
              <p className="text-center text-white/30 text-xs mt-4 font-pixel">
                COMPLETE CHAPTERS TO UNLOCK DOCUMENTS
              </p>
              <div className="text-center mt-6">
                <Link 
                  href="/observe"
                  className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                >
                  <PlayIcon size={14} />
                  <span className="underline">Begin Chapter 1</span>
                  <ArrowRightIcon size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll indicator */}
        <div className={`flex flex-col items-center pb-10 transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-white/30 text-xs mb-2">Scroll to investigate</span>
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>

        {/* How it Works */}
        <section id="how-it-works" className={`border-t border-white/5 bg-gradient-to-b from-transparent to-terminal-surface/20 transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center mb-20">
              <span className="text-red-400 text-xs font-pixel tracking-widest mb-4 block">THE ARCHIVES</span>
              <h2 className="font-pixel text-3xl lg:text-4xl text-white mb-6">HOW IT <span className="text-red-400">WORKS</span></h2>
              <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
                Complete survival chapters to unlock classified documents. 
                The truth cannot be deleted, censored, or hidden.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group terminal-panel p-8 hover:border-red-500/50 transition-all duration-300 bg-gradient-to-br from-terminal-surface/80 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors" />
                <div className="p-3 bg-red-500/10 rounded-xl w-fit mb-6">
                  <CrosshairIcon className="text-red-400" size={28} />
                </div>
                <h3 className="font-pixel text-sm text-red-400 mb-4">SURVIVE THE CHAPTERS</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Complete survival chapters to unlock classified documents. Each chapter reveals more truth hidden in The Vault.
                </p>
              </div>
              <div className="group terminal-panel p-8 hover:border-terminal-amber/50 transition-all duration-300 bg-gradient-to-br from-terminal-surface/80 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-terminal-amber/5 rounded-full blur-3xl group-hover:bg-terminal-amber/10 transition-colors" />
                <div className="p-3 bg-terminal-amber/10 rounded-xl w-fit mb-6">
                  <ShieldIcon className="text-terminal-amber" size={28} />
                </div>
                <h3 className="font-pixel text-sm text-terminal-amber mb-4">UNLOCK DOCUMENTS</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Each chapter completed unlocks more folders. Flight logs, black book, court docs - all waiting to be revealed.
                </p>
              </div>
              <div className="group terminal-panel p-8 hover:border-white/50 transition-all duration-300 bg-gradient-to-br from-terminal-surface/80 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
                <div className="p-3 bg-white/10 rounded-xl w-fit mb-6">
                  <UserIcon className="text-white" size={28} />
                </div>
                <h3 className="font-pixel text-sm text-white mb-4">EXPOSE THE TRUTH</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Join investigators worldwide. Share findings, analyze documents, and piece together the full picture.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Genesis Section - Timeline */}
        <section className={`border-t border-white/5 transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <span className="text-terminal-amber text-xs font-pixel tracking-widest mb-4 block">THE TIMELINE</span>
              <h2 className="font-pixel text-3xl lg:text-4xl text-white mb-4">THE <span className="text-terminal-amber">COVER-UP</span></h2>
              <p className="text-white/50 max-w-xl mx-auto text-lg">
                They thought they could bury the truth. They were wrong.
              </p>
            </div>

            {/* Archives Image with Impact Effect */}
            <div className="max-w-2xl mx-auto mb-16 relative">
              <div className="relative group">
                {/* Impact rings - animate on load */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute w-full h-full rounded-full border-2 border-red-500/30 animate-ping" style={{ animationDuration: '2s' }} />
                  <div className="absolute w-4/5 h-4/5 rounded-full border-2 border-terminal-amber/30 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }} />
                  <div className="absolute w-3/5 h-3/5 rounded-full border-2 border-white/30 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.4s' }} />
                </div>

                {/* Main image with fall effect */}
                <div className="relative animate-[fallImpact_1.5s_ease-out_forwards] opacity-0">
                  <Image 
                    src="/626996363_1229067122740153_7826042290044063227_n.jpg"
                    alt="Archives Declassified"
                    width={600}
                    height={600}
                    className="w-full h-auto rounded-lg shadow-2xl shadow-red-500/20 border border-red-500/30"
                  />
                  
                  {/* Glitch overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 bg-red-500/10 mix-blend-multiply" style={{ clipPath: 'inset(0 0 50% 0)' }} />
                    <div className="absolute inset-0 bg-terminal-amber/10 mix-blend-multiply" style={{ clipPath: 'inset(50% 0 0 0)' }} />
                  </div>
                </div>

                {/* Text overlays */}
                <div className="absolute top-6 left-6 animate-[slideInLeft_1s_ease-out_0.5s_forwards] opacity-0">
                  <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-500/50">
                    <div className="font-pixel text-red-400 text-xs mb-1">DECLASSIFIED</div>
                    <div className="text-white/90 text-sm">THE ARCHIVES</div>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 animate-[slideInRight_1s_ease-out_0.7s_forwards] opacity-0">
                  <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-terminal-amber/50">
                    <div className="text-white/90 text-sm font-semibold">SEALED NO MORE</div>
                    <div className="text-terminal-amber text-xs font-pixel">1000+ DOCUMENTS</div>
                  </div>
                </div>

                {/* Corner stamps */}
                <div className="absolute top-6 right-6 transform rotate-12 animate-[stamp_0.5s_ease-out_1.2s_forwards] opacity-0">
                  <div className="border-4 border-red-500 text-red-500 font-pixel text-xs px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm">
                    CLASSIFIED
                  </div>
                </div>
              </div>

              {/* Crack effect at bottom */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-[expandWidth_0.8s_ease-out_1.5s_forwards] origin-center scale-x-0" />
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="terminal-panel p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-terminal-surface/80 to-terminal-bg/80">
                <div className="absolute left-8 md:left-12 top-24 bottom-24 w-px bg-gradient-to-b from-red-500 via-terminal-amber to-white" />

                <div className="relative z-10 space-y-8 pl-12 md:pl-16">
                  <div className="relative group">
                    <div className="absolute -left-12 md:-left-16 w-6 h-6 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center group-hover:scale-125 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                    <div className="font-pixel text-red-400 text-sm mb-2">2008 — THE FIRST DEAL</div>
                    <p className="text-white/70 text-base leading-relaxed">
                      "A sweetheart plea deal. <span className="text-red-400 font-semibold">13 months</span> work release for crimes that should have meant life.
                      <span className="text-white/40 italic"> The powerful protected their own.</span>"
                    </p>
                  </div>

                  <div className="relative group">
                    <div className="absolute -left-12 md:-left-16 w-6 h-6 rounded-full bg-terminal-amber/20 border-2 border-terminal-amber flex items-center justify-center group-hover:scale-125 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-terminal-amber" />
                    </div>
                    <div className="font-pixel text-terminal-amber text-sm mb-2">2019 — THE ARREST</div>
                    <p className="text-white/70 text-base leading-relaxed">
                      "Finally arrested again. But before trial...
                      <span className="text-white/40 italic"> found dead in his cell. 'Suicide' they said.</span>"
                    </p>
                  </div>

                  <div className="relative group">
                    <div className="absolute -left-12 md:-left-16 w-6 h-6 rounded-full bg-terminal-purple/20 border-2 border-terminal-purple flex items-center justify-center group-hover:scale-125 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-terminal-purple" />
                    </div>
                    <div className="font-pixel text-terminal-purple text-sm mb-2">2024 — THE UNSEALING</div>
                    <p className="text-white/70 text-base leading-relaxed">
                      "Court documents finally unsealed. Names emerge.
                      <span className="text-white/40 italic"> The world begins to see.</span>"
                    </p>
                  </div>

                  <div className="relative group">
                    <div className="absolute -left-12 md:-left-16 w-6 h-6 rounded-full bg-white/20 border-2 border-white flex items-center justify-center group-hover:scale-125 transition-transform animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div className="font-pixel text-white text-sm mb-2">NOW — THE RECKONING</div>
                    <p className="text-white/70 text-base leading-relaxed">
                      "Every name. Every flight. Every connection.
                      <span className="text-red-400 font-semibold"> On-chain forever.</span>
                      <span className="text-white/40 italic"> They can't delete the blockchain.</span>"
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="font-pixel text-2xl text-red-400 mb-1">1000+</div>
                      <div className="text-white/40 text-xs">Pages Leaked</div>
                    </div>
                    <div>
                      <div className="font-pixel text-2xl text-terminal-amber mb-1">200+</div>
                      <div className="text-white/40 text-xs">Names Exposed</div>
                    </div>
                    <div>
                      <div className="font-pixel text-2xl text-white mb-1">8</div>
                      <div className="text-white/40 text-xs">Chapters</div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-8 p-6 bg-terminal-bg/50 rounded-lg border border-red-500/20">
                  <div className="text-center">
                    <FileIcon size={32} className="mx-auto mb-4 text-red-400/60" />
                    <p className="text-white/60 text-sm italic leading-relaxed max-w-lg mx-auto">
                      "They satisfyed the man but they couldn't satisfy the truth. 
                      The files are out. The names are known. 
                      The blockchain remembers everything."
                    </p>
                    <div className="mt-4 text-red-400/60 text-xs font-pixel">
                      — THE ISLAND MANIFESTO
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Iceberg Infographic Section */}
        <div className={`transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <Iceberg />
        </div>

        {/* CTA */}
        <section className={`border-t border-white/5 bg-gradient-to-b from-transparent to-red-500/5 transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <h2 className="font-pixel text-3xl lg:text-4xl text-white mb-6">
              READY TO <span className="text-red-400">INVESTIGATE</span>?
            </h2>
            <p className="text-white/50 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              Complete survival chapters and unlock classified documents. 
              The truth awaits those who survive.
            </p>
            <Link 
              href="/observe"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-red-500 text-white font-pixel text-sm transition-all hover:brightness-110 rounded-xl shadow-2xl shadow-red-500/30"
            >
              <CrosshairIcon size={20} />
              <span>BEGIN INVESTIGATION</span>
              <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 border-t border-white/5 bg-[#0a0a0a] transition-opacity duration-500 ${typingStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileIcon className="text-red-400" size={20} />
              <span className="font-pixel text-xs text-white/30">THE ISLAND</span>
            </div>
            <div className="text-white/30 text-sm">
              The Truth. Unsealed. Forever.
            </div>
            <div className="flex items-center gap-4">
              <a href="https://x.com/EpsteinFiles" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-red-400 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }

        @keyframes fallImpact {
          0% { 
            transform: translateY(-200px) scale(0.5); 
            opacity: 0; 
          }
          60% { 
            transform: translateY(0) scale(1.05); 
            opacity: 1; 
          }
          80% { 
            transform: translateY(-10px) scale(0.98); 
          }
          100% { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
          }
        }

        @keyframes slideInLeft {
          0% {
            transform: translateX(-50px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          0% {
            transform: translateX(50px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes stamp {
          0% {
            transform: rotate(12deg) scale(0);
            opacity: 0;
          }
          50% {
            transform: rotate(8deg) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: rotate(12deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes expandWidth {
          0% {
            transform: translateX(-50%) scaleX(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) scaleX(1);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}