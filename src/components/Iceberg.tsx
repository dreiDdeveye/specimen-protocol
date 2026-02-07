'use client';

import React from 'react';

// Icon Components
const EyeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const FileIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const ShieldIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LockIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

interface IcebergProps {
  visible?: boolean;
}

export const Iceberg: React.FC<IcebergProps> = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <section className="border-t border-white/5">
      <div className="w-full">
        <div className="text-center py-16 px-6">
          <span className="text-red-400 text-xs font-pixel tracking-widest mb-4 block">THE DEPTH OF CORRUPTION</span>
          <h2 className="font-pixel text-3xl lg:text-4xl text-white mb-4">THE <span className="text-red-400">ICEBERG</span></h2>
          <p className="text-white/50 max-w-xl mx-auto text-lg">
            What you see is only the surface. The truth runs much deeper.
          </p>
        </div>

        {/* Iceberg Image Container */}
        <div className="relative w-full">
          {/* Background Image - Full Width */}
          <img 
            src="/iceberg.png" 
            alt="The Iceberg of Truth" 
            className="w-full h-auto object-contain"
            style={{ minHeight: '800px', objectFit: 'cover', objectPosition: 'center' }}
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col">
            
            {/* ABOVE WATER - Top Section (0-35%) */}
            <div className="h-[35%] relative px-4 md:px-8 lg:px-16 pt-8">
              {/* Surface Label */}
              <div className="absolute top-4 left-4 md:left-8 flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-cyan-400 text-[10px] md:text-xs font-pixel">SURFACE LEVEL — PUBLIC KNOWLEDGE</span>
              </div>

              <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-4 md:gap-8 mt-12 md:mt-16">
                {/* Left Column */}
                <div className="space-y-3 md:space-y-4">
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 md:p-4 border border-cyan-400/30 hover:border-cyan-400/60 transition-all hover:bg-black/50">
                    <h4 className="text-cyan-300 font-pixel text-xs md:text-sm mb-1 md:mb-2 flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 bg-cyan-400/20 rounded-full flex items-center justify-center text-[10px] md:text-xs">1</span>
                      BILLIONAIRE FINANCIER
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">Managed money for the ultra-wealthy. Private islands. Manhattan mansion.</p>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 md:p-4 border border-cyan-400/30 hover:border-cyan-400/60 transition-all hover:bg-black/50">
                    <h4 className="text-cyan-300 font-pixel text-xs md:text-sm mb-1 md:mb-2 flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 bg-cyan-400/20 rounded-full flex items-center justify-center text-[10px] md:text-xs">2</span>
                      2008 CONVICTION
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">Pleaded guilty. Served 13 months work release. Registered offender.</p>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-3 md:space-y-4">
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 md:p-4 border border-cyan-400/30 hover:border-cyan-400/60 transition-all hover:bg-black/50">
                    <h4 className="text-cyan-300 font-pixel text-xs md:text-sm mb-1 md:mb-2 flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 bg-cyan-400/20 rounded-full flex items-center justify-center text-[10px] md:text-xs">3</span>
                      2019 ARREST
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">Arrested on federal charges. Denied bail. Found dead. "Suicide."</p>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 md:p-4 border border-cyan-400/30 hover:border-cyan-400/60 transition-all hover:bg-black/50">
                    <h4 className="text-cyan-300 font-pixel text-xs md:text-sm mb-1 md:mb-2 flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 bg-cyan-400/20 rounded-full flex items-center justify-center text-[10px] md:text-xs">4</span>
                      MAXWELL TRIAL
                    </h4>
                    <p className="text-white/70 text-xs md:text-sm">Convicted on 5 of 6 counts. 20 years. Some names revealed.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WATER LINE - Divider (35-40%) */}
            <div className="h-[5%] relative flex items-center justify-center">
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              <div className="bg-cyan-500/80 backdrop-blur-sm px-4 py-1 rounded-full z-10">
                <span className="text-white text-xs font-pixel">🌊 WATER LINE 🌊</span>
              </div>
            </div>

            {/* BELOW WATER - Bottom Section (40-100%) */}
            <div className="h-[60%] relative px-4 md:px-8 lg:px-16 pt-4">
              {/* Deep water label */}
              <div className="absolute top-2 left-4 md:left-8 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 text-[10px] md:text-xs font-pixel">BELOW THE SURFACE — HIDDEN TRUTHS</span>
              </div>

              <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 mt-10 md:mt-12">
                
                {/* Level 1 - Flight Logs */}
                <div className="grid md:grid-cols-2 gap-4 items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/30 rounded-full flex items-center justify-center border border-blue-400/50 flex-shrink-0">
                      <EyeIcon size={16} className="text-blue-300" />
                    </div>
                    <div className="bg-blue-900/50 backdrop-blur-md rounded-xl p-3 md:p-4 border border-blue-500/30 hover:border-blue-400/60 transition-all flex-1">
                      <h4 className="text-blue-300 font-pixel text-xs md:text-sm mb-1">LEVEL 1: THE FLIGHT LOGS</h4>
                      <p className="text-white/60 text-xs md:text-sm">"Lolita Express" — 73 trips to the island. Politicians, celebrities, royalty on manifests.</p>
                    </div>
                  </div>
                  <div className="bg-blue-900/50 backdrop-blur-md rounded-xl p-3 md:p-4 border border-blue-500/30 hover:border-blue-400/60 transition-all md:mt-6">
                    <p className="text-white/60 text-xs md:text-sm">Flight records meticulously documented. Passenger names that would shock the world.</p>
                  </div>
                </div>

                {/* Level 2 - Black Book */}
                <div className="grid md:grid-cols-2 gap-4 items-start">
                  <div className="md:order-2 flex items-start gap-3 md:flex-row-reverse">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-500/30 rounded-full flex items-center justify-center border border-indigo-400/50 flex-shrink-0">
                      <FileIcon size={16} className="text-indigo-300" />
                    </div>
                    <div className="bg-indigo-900/50 backdrop-blur-md rounded-xl p-3 md:p-4 border border-indigo-500/30 hover:border-indigo-400/60 transition-all flex-1">
                      <h4 className="text-indigo-300 font-pixel text-xs md:text-sm mb-1">LEVEL 2: THE BLACK BOOK</h4>
                      <p className="text-white/60 text-xs md:text-sm">1,000+ names, phone numbers, addresses of the world's most powerful people.</p>
                    </div>
                  </div>
                  <div className="md:order-1 bg-indigo-900/50 backdrop-blur-md rounded-xl p-3 md:p-4 border border-indigo-500/30 hover:border-indigo-400/60 transition-all md:mt-6">
                    <p className="text-white/60 text-xs md:text-sm">Special symbols. Circled names. Asterisks marking certain individuals. A code.</p>
                  </div>
                </div>

                {/* Level 3 - Intelligence */}
                <div className="grid md:grid-cols-2 gap-4 items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-500/30 rounded-full flex items-center justify-center border border-purple-400/50 flex-shrink-0">
                      <ShieldIcon size={16} className="text-purple-300" />
                    </div>
                    <div className="bg-purple-900/60 backdrop-blur-md rounded-xl p-3 md:p-4 border border-purple-500/30 hover:border-purple-400/60 transition-all flex-1">
                      <h4 className="text-purple-300 font-pixel text-xs md:text-sm mb-1">LEVEL 3: INTELLIGENCE TIES</h4>
                      <p className="text-white/60 text-xs md:text-sm">"Leave it alone. He belongs to intelligence." Hidden cameras. Surveillance equipment.</p>
                    </div>
                  </div>
                  <div className="bg-purple-900/60 backdrop-blur-md rounded-xl p-3 md:p-4 border border-purple-500/30 hover:border-purple-400/60 transition-all md:mt-6">
                    <p className="text-white/60 text-xs md:text-sm">Compromising material collected. Blackmail operations. State-level protection.</p>
                  </div>
                </div>

                {/* Level 4 - Still Sealed */}
                <div className="grid md:grid-cols-2 gap-4 items-start">
                  <div className="md:order-2 flex items-start gap-3 md:flex-row-reverse">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-red-500/30 rounded-full flex items-center justify-center border border-red-400/50 animate-pulse flex-shrink-0">
                      <LockIcon size={16} className="text-red-300" />
                    </div>
                    <div className="bg-red-900/60 backdrop-blur-md rounded-xl p-3 md:p-4 border border-red-500/40 hover:border-red-400/60 transition-all flex-1">
                      <h4 className="text-red-400 font-pixel text-xs md:text-sm mb-1">LEVEL 4: STILL SEALED 🔒</h4>
                      <p className="text-white/60 text-xs md:text-sm">Thousands of documents remain sealed. Names redacted. Evidence "lost."</p>
                    </div>
                  </div>
                  <div className="md:order-1 bg-red-900/60 backdrop-blur-md rounded-xl p-3 md:p-4 border border-red-500/40 hover:border-red-400/60 transition-all md:mt-6">
                    <p className="text-white/60 text-xs md:text-sm">Security footage "malfunctioned." Guards "fell asleep." Convenient failures.</p>
                  </div>
                </div>

                {/* Level 5 - The Abyss */}
                <div className="max-w-2xl mx-auto">
                  <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 md:p-6 border border-slate-600/30 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-slate-500 text-lg">?</span>
                      <h4 className="text-slate-400 font-pixel text-xs md:text-sm">LEVEL 5: THE UNKNOWN</h4>
                      <span className="text-slate-500 text-lg">?</span>
                    </div>
                    <p className="text-slate-400/80 text-xs md:text-sm italic">"Things we will never know. Names that will never surface. A network still operating in the shadows..."</p>
                    <div className="mt-3 flex justify-center gap-3">
                      <span className="text-xl opacity-60">👁️</span>
                      <span className="text-xl opacity-40">👁️</span>
                      <span className="text-xl opacity-20">👁️</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Depth Indicator - Right Side */}
              <div className="hidden lg:block absolute right-8 top-16 bottom-8">
                <div className="h-full w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-red-500/30 relative">
                  <div className="absolute -left-12 top-0 text-blue-400/70 text-[10px] font-mono whitespace-nowrap">— 100m</div>
                  <div className="absolute -left-12 top-1/4 text-indigo-400/70 text-[10px] font-mono whitespace-nowrap">— 500m</div>
                  <div className="absolute -left-12 top-1/2 text-purple-400/70 text-[10px] font-mono whitespace-nowrap">— 1000m</div>
                  <div className="absolute -left-12 top-3/4 text-red-400/70 text-[10px] font-mono whitespace-nowrap">— 2000m</div>
                  <div className="absolute -left-12 bottom-0 text-slate-500/70 text-[10px] font-mono whitespace-nowrap">— ???</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Iceberg;