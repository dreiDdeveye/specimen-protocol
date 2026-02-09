'use client';

import React, { useState } from 'react';

interface VaultFolder {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  documents: {
    title: string;
    pdfUrl: string;
  }[];
}

// 8 Chapter folders - ALL locked until Chapter 8 is complete
const VAULT_FOLDERS: VaultFolder[] = [
  {
    id: 'chapter-1',
    title: 'CHAPTER 1',
    subtitle: 'The Island',
    color: '#ef4444', // red
    documents: [
      { title: 'Gala Invitation', pdfUrl: '/documents/gala-invitation.pdf' },
      { title: 'Missing Persons Report', pdfUrl: '/documents/missing-persons.pdf' },
      { title: 'Guest Registry', pdfUrl: '/documents/guest-registry.pdf' },
    ],
  },
  {
    id: 'chapter-2',
    title: 'CHAPTER 2',
    subtitle: 'The Escape',
    color: '#f97316', // orange
    documents: [
      { title: 'Island Map', pdfUrl: '/documents/island-map.pdf' },
      { title: 'Security Protocols', pdfUrl: '/documents/security-protocols.pdf' },
      { title: 'Staff Records', pdfUrl: '/documents/staff-records.pdf' },
    ],
  },
  {
    id: 'chapter-3',
    title: 'CHAPTER 3',
    subtitle: 'The Investigation',
    color: '#eab308', // yellow
    documents: [
      { title: 'Boat Registrations', pdfUrl: '/documents/boat-registrations.pdf' },
      { title: 'Coast Guard Frequencies', pdfUrl: '/documents/coast-frequencies.pdf' },
      { title: 'Surveillance Log', pdfUrl: '/documents/surveillance-log.pdf' },
    ],
  },
  {
    id: 'chapter-4',
    title: 'CHAPTER 4',
    subtitle: 'The Testimony',
    color: '#22c55e', // green
    documents: [
      { title: 'Victim List', pdfUrl: '/documents/victim-list.pdf' },
      { title: 'Witness Statements', pdfUrl: '/documents/witness-statements.pdf' },
      { title: 'Witness Protection Files', pdfUrl: '/documents/witness-protection.pdf' },
      { title: 'Pilot Depositions', pdfUrl: '/documents/pilot-depositions.pdf' },
    ],
  },
  {
    id: 'chapter-5',
    title: 'CHAPTER 5',
    subtitle: 'The Trial',
    color: '#3b82f6', // blue
    documents: [
      { title: 'Court Transcripts', pdfUrl: '/documents/court-transcripts.pdf' },
      { title: 'Court Filing', pdfUrl: '/documents/court-filing-1.pdf' },
      { title: 'Testimony Index', pdfUrl: '/documents/testimony-index.pdf' },
      { title: 'Manifests', pdfUrl: '/documents/manifests.pdf' },
    ],
  },
  {
    id: 'chapter-6',
    title: 'CHAPTER 6',
    subtitle: 'The Aftermath',
    color: '#8b5cf6', // purple
    documents: [
      { title: 'Ashford Financial Records', pdfUrl: '/documents/ashford-financial.pdf' },
      { title: 'Whistleblower Documents', pdfUrl: '/documents/whistleblower-docs.pdf' },
      { title: 'Board Meeting Minutes', pdfUrl: '/documents/board-minutes.pdf' },
      { title: 'Shell Company Network', pdfUrl: '/documents/shell-companies.pdf' },
    ],
  },
  {
    id: 'chapter-7',
    title: 'CHAPTER 7',
    subtitle: 'The Gathering',
    color: '#ec4899', // pink
    documents: [
      { title: 'The Board Identities', pdfUrl: '/documents/board-identities.pdf' },
      { title: 'Gathering Location Intel', pdfUrl: '/documents/gathering-location.pdf' },
      { title: 'Raid Operation Plans', pdfUrl: '/documents/raid-plans.pdf' },
      { title: 'Arrest Warrants', pdfUrl: '/documents/arrest-warrants.pdf' },
    ],
  },
  {
    id: 'chapter-8',
    title: 'CHAPTER 8',
    subtitle: 'The Files',
    color: '#ffffff', // white - the truth
    documents: [
      { title: 'THE CLIENT LIST (247 Names)', pdfUrl: '/documents/client-list-full.pdf' },
      { title: 'Flight Logs Complete', pdfUrl: '/documents/flight-logs-complete.pdf' },
      { title: 'The Black Book', pdfUrl: '/documents/black-book-complete.pdf' },
      { title: 'Financial Records ($890M)', pdfUrl: '/documents/financial-records-full.pdf' },
      { title: 'Photo Evidence Index', pdfUrl: '/documents/photo-evidence.pdf' },
      { title: 'Video Evidence Index', pdfUrl: '/documents/video-evidence.pdf' },
      { title: 'The Crown - Victoria Ashworth', pdfUrl: '/documents/crown-file.pdf' },
      { title: 'FINAL EXPOSURE REPORT', pdfUrl: '/documents/final-exposure.pdf' },
    ],
  },
];

// Helper to darken colors
const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

// Animated Folder Component
const AnimatedFolder: React.FC<{
  color: string;
  isLocked: boolean;
  isOpen: boolean;
  onToggle: () => void;
  documents: { title: string; pdfUrl: string }[];
}> = ({ color, isLocked, isOpen, onToggle, documents }) => {
  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
    Array.from({ length: 3 }, () => ({ x: 0, y: 0 }))
  );

  const folderBackColor = isLocked ? '#374151' : darkenColor(color, 0.08);
  const folderFrontColor = isLocked ? '#4b5563' : color;
  const paper1 = darkenColor('#ffffff', 0.1);
  const paper2 = darkenColor('#ffffff', 0.05);
  const paper3 = '#ffffff';

  const handleClick = () => {
    if (!isLocked) {
      onToggle();
      if (isOpen) {
        setPaperOffsets(Array.from({ length: 3 }, () => ({ x: 0, y: 0 })));
      }
    }
  };

  const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!isOpen || isLocked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (index: number) => {
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  const getOpenTransform = (index: number) => {
    if (index === 0) return 'translate(-120%, -70%) rotate(-15deg)';
    if (index === 1) return 'translate(10%, -70%) rotate(15deg)';
    if (index === 2) return 'translate(-50%, -100%) rotate(5deg)';
    return '';
  };

  const papers = documents.slice(0, 3);
  while (papers.length < 3) {
    papers.push({ title: '', pdfUrl: '' });
  }

  return (
    <div
      className={`group relative transition-all duration-200 ease-in ${
        isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${!isOpen && !isLocked ? 'hover:-translate-y-2' : ''}`}
      style={{ transform: isOpen ? 'translateY(-8px)' : undefined }}
      onClick={handleClick}
    >
      <div
        className="relative w-[100px] h-[80px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
        style={{ backgroundColor: folderBackColor }}
      >
        {/* Folder Tab */}
        <span
          className="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px] rounded-tl-[5px] rounded-tr-[5px]"
          style={{ backgroundColor: folderBackColor }}
        />

        {/* Lock Icon */}
        {isLocked && (
          <div className="absolute inset-0 z-40 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" />
            </svg>
          </div>
        )}

        {/* Papers */}
        {!isLocked && papers.map((doc, i) => {
          let sizeClasses = '';
          if (i === 0) sizeClasses = 'w-[70%] h-[80%]';
          if (i === 1) sizeClasses = 'w-[80%] h-[70%]';
          if (i === 2) sizeClasses = 'w-[90%] h-[60%]';

          if (isOpen) {
            if (i === 0) sizeClasses = 'w-[70%] h-[80%]';
            if (i === 1) sizeClasses = 'w-[80%] h-[80%]';
            if (i === 2) sizeClasses = 'w-[90%] h-[80%]';
          }

          const transformStyle = isOpen
            ? `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)`
            : undefined;

          return (
            <div
              key={i}
              onMouseMove={e => handlePaperMouseMove(e, i)}
              onMouseLeave={() => handlePaperMouseLeave(i)}
              className={`absolute z-20 bottom-[10%] left-1/2 transition-all duration-300 ease-in-out ${
                !isOpen 
                  ? 'transform -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0' 
                  : 'hover:scale-110'
              } ${sizeClasses}`}
              style={{
                ...(!isOpen ? {} : { transform: transformStyle }),
                backgroundColor: i === 0 ? paper1 : i === 1 ? paper2 : paper3,
                borderRadius: '10px'
              }}
            >
              {/* Document preview lines */}
              {isOpen && doc.title && (
                <div className="p-2 h-full flex flex-col gap-1">
                  <div className="w-full h-1 bg-gray-300 rounded" />
                  <div className="w-3/4 h-1 bg-gray-300 rounded" />
                  <div className="w-1/2 h-1 bg-gray-300 rounded" />
                </div>
              )}
            </div>
          );
        })}

        {/* Folder Front (two flaps) */}
        <div
          className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${
            !isOpen && !isLocked ? 'group-hover:[transform:skew(15deg)_scaleY(0.6)]' : ''
          }`}
          style={{
            backgroundColor: folderFrontColor,
            borderRadius: '5px 10px 10px 10px',
            ...(isOpen && { transform: 'skew(15deg) scaleY(0.6)' })
          }}
        />
        <div
          className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${
            !isOpen && !isLocked ? 'group-hover:[transform:skew(-15deg)_scaleY(0.6)]' : ''
          }`}
          style={{
            backgroundColor: folderFrontColor,
            borderRadius: '5px 10px 10px 10px',
            ...(isOpen && { transform: 'skew(-15deg) scaleY(0.6)' })
          }}
        />
      </div>
    </div>
  );
};

// Folder Card with Label
const FolderCard: React.FC<{
  folder: VaultFolder;
  isLocked: boolean;
  onOpenModal: () => void;
}> = ({ folder, isLocked, onOpenModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (isOpen) {
      // Closing - open modal to show documents
      onOpenModal();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <AnimatedFolder
        color={folder.color}
        isLocked={isLocked}
        isOpen={isOpen}
        onToggle={handleToggle}
        documents={folder.documents}
      />
      
      {/* Title */}
      <h3 
        className="font-pixel text-xs tracking-wide transition-all text-center"
        style={{ color: isLocked ? '#6b7280' : folder.color }}
      >
        {folder.title}
      </h3>
      
      {/* Subtitle */}
      <p className="text-gray-500 text-[10px] -mt-2">
        {folder.subtitle}
      </p>
      
      {/* Status Badge */}
      <div className={`px-2 py-1 rounded text-[10px] font-pixel ${
        isLocked 
          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
          : 'bg-green-500/20 text-green-400 border border-green-500/30'
      }`}>
        {isLocked ? '🔒 CLASSIFIED' : '✓ DECLASSIFIED'}
      </div>
    </div>
  );
};

// Document Modal
const DocumentModal: React.FC<{
  folder: VaultFolder | null;
  onClose: () => void;
}> = ({ folder, onClose }) => {
  if (!folder) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="w-12 h-10 border-2 rounded-lg relative"
            style={{
              backgroundColor: `${folder.color}20`,
              borderColor: `${folder.color}50`,
            }}
          >
            <div 
              className="absolute -top-1.5 left-1.5 w-5 h-2 rounded-t-sm"
              style={{ backgroundColor: folder.color }}
            />
          </div>
          <div>
            <h3 className="font-pixel" style={{ color: folder.color }}>{folder.title}</h3>
            <p className="text-gray-500 text-xs">{folder.subtitle}</p>
          </div>
        </div>
        
        {/* Documents List */}
        <div className="space-y-3">
          <p className="text-gray-400 text-xs font-pixel mb-3">📁 DECLASSIFIED DOCUMENTS</p>
          {folder.documents.map((doc, i) => (
            <a
              key={i}
              href={doc.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-black/50 border border-gray-700 rounded-lg hover:border-red-500/50 hover:bg-red-500/10 transition-all group"
            >
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" />
                <polyline points="14,2 14,8 20,8" strokeWidth="2" />
              </svg>
              <span className="text-white/80 text-sm group-hover:text-red-400 transition-colors flex-1">
                {doc.title}
              </span>
              <span className="text-gray-500 text-xs">PDF</span>
            </a>
          ))}
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 text-sm hover:bg-gray-700 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Main Vault Component
interface VaultProps {
  completedChapters: number; // Must be 8 to unlock ALL files
  isVisible: boolean;
}

export const Vault: React.FC<VaultProps> = ({ completedChapters, isVisible }) => {
  const [selectedFolder, setSelectedFolder] = useState<VaultFolder | null>(null);
  
  if (!isVisible) return null;
  
  // DEBUG: Log the value received
  console.log('[Vault] completedChapters received:', completedChapters);
  
  // Ensure completedChapters is a valid number
  const safeCompletedChapters = typeof completedChapters === 'number' ? completedChapters : 0;
  
  // ALL folders are locked until Chapter 8 is complete
  // This matches the story: YOU expose THE FILES at the end of Chapter 8
  const allUnlocked = safeCompletedChapters >= 8;
  
  const totalFolders = VAULT_FOLDERS.length;
  const unlockedCount = allUnlocked ? totalFolders : 0;
  
  // Calculate chapter progress for the progress bar
  const chapterProgress = Math.min(safeCompletedChapters, 8);
  
  return (
    <div className="mt-10 pt-10 border-t border-red-500/20">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-red-500 text-xs font-pixel tracking-widest">
          {allUnlocked ? '📂 DECLASSIFIED' : '🔒 CLASSIFIED'}
        </span>
        <h2 className="font-pixel text-3xl md:text-4xl text-white mt-2">
          THE <span className="text-red-500">VAULT</span>
        </h2>
        
        {allUnlocked ? (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg max-w-lg mx-auto">
            <p className="text-green-400 text-sm font-pixel">
              ✓ ALL FILES EXPOSED TO THE PUBLIC
            </p>
            <p className="text-gray-400 text-xs mt-2">
              247 names. 30 years of evidence. The truth is now known.
            </p>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg max-w-lg mx-auto">
            <p className="text-red-400 text-sm font-pixel">
              ⚠ FILES SEALED BY GOVERNMENT ORDER
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Complete all 8 chapters to expose the truth. The files will be released when the survivor makes their choice.
            </p>
          </div>
        )}
      </div>
      
      {/* Folders Grid - 4 columns on desktop for 8 folders */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mb-10 px-4">
        {VAULT_FOLDERS.map((folder) => {
          // ALL folders locked until chapter 8 complete
          const isLocked = !allUnlocked;
          return (
            <FolderCard
              key={folder.id}
              folder={folder}
              isLocked={isLocked}
              onOpenModal={() => setSelectedFolder(folder)}
            />
          );
        })}
      </div>
      
      {/* Progress Section */}
      <div className="max-w-md mx-auto px-4">
        {/* Chapter Progress */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs font-pixel tracking-wider">
            CHAPTERS COMPLETED
          </span>
          <span className="text-red-400 text-xs font-pixel">
            {chapterProgress} / 8
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${(chapterProgress / 8) * 100}%` }}
          />
        </div>
        
        {/* Vault Status */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs font-pixel tracking-wider">
            VAULT STATUS
          </span>
          <span className={`text-xs font-pixel ${allUnlocked ? 'text-green-400' : 'text-red-400'}`}>
            {allUnlocked ? 'EXPOSED' : 'SEALED'}
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              allUnlocked 
                ? 'bg-gradient-to-r from-green-600 to-green-400 w-full' 
                : 'bg-gray-600 w-0'
            }`}
          />
        </div>
        
        {/* Status Message */}
        <p className="text-center text-gray-600 text-xs mt-4">
          {allUnlocked 
            ? '🎉 THE TRUTH IS OUT. NO ONE IS UNTOUCHABLE.'
            : chapterProgress === 0
            ? 'BEGIN YOUR JOURNEY TO UNCOVER THE TRUTH'
            : chapterProgress < 8
            ? `CHAPTER ${chapterProgress + 1} AWAITS. THE FILES REMAIN SEALED.`
            : 'COMPLETE CHAPTER 8 TO EXPOSE EVERYTHING'
          }
        </p>
        
        {/* Teaser for locked state */}
        {!allUnlocked && (
          <div className="mt-6 p-3 bg-black/50 border border-gray-800 rounded-lg">
            <p className="text-gray-500 text-[10px] font-pixel text-center">
              "The government wants to seal these files for 75 years. Complete Chapter 8 to release everything to the public."
            </p>
          </div>
        )}
      </div>
      
      {/* Document Modal */}
      <DocumentModal
        folder={selectedFolder}
        onClose={() => setSelectedFolder(null)}
      />
    </div>
  );
};

export default Vault;