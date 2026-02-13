'use client';

import React, { useState, useEffect } from 'react';

interface MysteryPopupProps {
  onClose: () => void;
}

export const MysteryPopup: React.FC<MysteryPopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedLines, setDisplayedLines] = useState<{text: string; color: string}[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const allLines = [
    { text: '⚠ CONNECTION DETECTED', color: 'text-red-500 font-bold text-lg' },
    { text: 'Unindexed visitor accessing archive node.', color: 'text-green-400/90' },
    { text: '', color: 'hidden' }, // spacer
    { text: 'Scan integrity...', color: 'text-green-500/60' },
    { text: 'Wallet status: UNKNOWN', color: 'text-yellow-400' },
    { text: 'Clearance: UNASSIGNED', color: 'text-red-400' },
  ];

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  useEffect(() => {
    if (isVisible && currentLineIndex === 0 && !isTyping) {
      setTimeout(() => setIsTyping(true), 500);
    }
  }, [isVisible, currentLineIndex, isTyping]);

  useEffect(() => {
    if (!isTyping || currentLineIndex >= allLines.length) return;

    const line = allLines[currentLineIndex];
    
    // Skip empty lines
    if (line.text === '') {
      setTimeout(() => {
        setDisplayedLines(prev => [...prev, { text: '', color: 'hidden' }]);
        setCurrentLineIndex(prev => prev + 1);
      }, 100);
      return;
    }
    
    if (currentText.length < line.text.length) {
      const timer = setTimeout(() => {
        setCurrentText(line.text.slice(0, currentText.length + 1));
      }, 25);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, { text: line.text, color: line.color }]);
        setCurrentText('');
        setCurrentLineIndex(prev => prev + 1);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isTyping, currentLineIndex, currentText]);

  useEffect(() => {
    if (currentLineIndex >= allLines.length && !showButtons) {
      setTimeout(() => setShowButtons(true), 400);
    }
  }, [currentLineIndex, showButtons]);

  const handleEnter = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleLeave = () => {
    setExiting(true);
    setTimeout(() => {
      window.close();
      setTimeout(() => {
        if (!window.closed) {
          window.location.href = 'about:blank';
        }
      }, 100);
    }, 1000);
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${
        isVisible && !exiting ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundColor: '#000' }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
        }} 
      />

      {/* Exit message overlay */}
      {exiting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
          <div className="text-center">
            <div className="text-red-500 font-mono text-2xl font-bold animate-pulse mb-2">
              CONNECTION TERMINATED
            </div>
            <div className="text-red-500/50 font-mono text-sm">
              Closing connection...
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      {!exiting && (
        <div 
          className={`relative w-full max-w-xl transform transition-all duration-500 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          {/* Glow effect behind card */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 via-transparent to-green-500/10 blur-xl rounded-3xl" />
          
          {/* Main card */}
          <div className="relative border border-white/10 bg-black/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Top accent line */}
            <div className="h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
            
            {/* Header */}
            <div className="px-8 pt-8 pb-4 text-center border-b border-white/5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full mb-4">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-xs font-mono uppercase tracking-wider">Secure Connection</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                THE <span className="text-red-500">EPSTEIN</span> FILES
              </h1>
              <p className="text-white/40 text-sm">
                Classified Archive • 1,247 Documents • 247 Names
              </p>
            </div>
            
            {/* Terminal section */}
            <div className="px-8 py-6">
              <div className="bg-black/60 border border-green-500/20 rounded-lg p-5 font-mono text-sm">
                {/* Terminal header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-500/10">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-green-500/50 text-xs ml-2">system_scan.exe</span>
                </div>
                
                {/* Terminal lines */}
                <div className="space-y-2 min-h-[140px]">
                  {displayedLines.map((line, i) => (
                    line.text ? (
                      <div key={i} className={line.color}>
                        {line.color.includes('text-green-500/60') && <span className="text-green-500/40 mr-2">→</span>}
                        {line.color.includes('text-yellow') && <span className="text-white/30 mr-2">  •</span>}
                        {line.color.includes('text-red-400') && <span className="text-white/30 mr-2">  •</span>}
                        {line.text}
                      </div>
                    ) : <div key={i} className="h-2" />
                  ))}
                  
                  {currentLineIndex < allLines.length && currentText && (
                    <div className={allLines[currentLineIndex].color}>
                      {currentText}
                      <span className="inline-block w-2 h-4 bg-green-500 ml-0.5 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action section */}
            {showButtons && (
              <div className="px-8 pb-8 pt-2">
                <div className="text-center mb-6">
                  <p className="text-white text-lg font-medium mb-1">Request access to archive?</p>
                  <p className="text-white/40 text-sm">Your session will be logged</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleEnter}
                    className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:brightness-110 transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Grant Access
                  </button>
                  <button
                    onClick={handleLeave}
                    className="w-full sm:w-auto px-10 py-4 border border-white/20 text-white/50 font-medium text-sm uppercase tracking-wider rounded-lg hover:border-red-500/50 hover:text-red-400 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Leave
                  </button>
                </div>
              </div>
            )}
            
            {/* Loading state before buttons */}
            {!showButtons && currentLineIndex >= allLines.length && (
              <div className="px-8 pb-8 pt-4 text-center">
                <div className="inline-flex items-center gap-2 text-white/40">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm">Preparing access request...</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Bottom text */}
          <div className="text-center mt-4">
            <p className="text-white/20 text-xs font-mono">
              The blockchain never forgets
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.15; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.25; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default MysteryPopup;