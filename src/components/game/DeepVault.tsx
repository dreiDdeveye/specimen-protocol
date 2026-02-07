'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

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

// Animated Locked Folder with Pulse Effect
const AnimatedLockedFolder: React.FC = () => {
  const color = '#dc2626'; // Red color
  const folderBackColor = darkenColor(color, 0.3);
  const [hover, setHover] = useState(false);
  
  return (
    <div 
      className="relative group pt-8 pb-4"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Pulse glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-2xl animate-pulse"
        style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', top: '20px' }}
      />
      
      {/* Folder Container with float animation */}
      <div 
        className={`relative transition-transform duration-500 ${hover ? '-translate-y-3' : ''}`}
        style={{ 
          transform: `scale(1.3)`,
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        <div
          className="relative w-[100px] h-[80px] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
          style={{ backgroundColor: folderBackColor }}
        >
          {/* Folder Tab */}
          <span
            className="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px] rounded-tl-[5px] rounded-tr-[5px]"
            style={{ backgroundColor: folderBackColor }}
          />

          {/* Papers inside - peeking out with animation */}
          <div 
            className="absolute z-10 bottom-[15%] left-1/2 w-[70%] h-[75%] rounded-[8px]"
            style={{ 
              backgroundColor: '#1a1a1a',
              transform: 'translateX(-50%)',
              animation: 'peek 2s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute z-10 bottom-[12%] left-1/2 w-[80%] h-[70%] rounded-[8px]"
            style={{ 
              backgroundColor: '#252525',
              transform: 'translateX(-50%)',
              animation: 'peek 2s ease-in-out infinite 0.1s',
            }}
          />
          <div 
            className="absolute z-10 bottom-[10%] left-1/2 w-[85%] h-[65%] rounded-[8px]"
            style={{ 
              backgroundColor: '#333333',
              transform: 'translateX(-50%)',
              animation: 'peek 2s ease-in-out infinite 0.2s',
            }}
          />

          {/* Folder Front */}
          <div
            className="absolute z-30 w-full h-full origin-bottom"
            style={{
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
            }}
          />
          
          {/* Lock Icon Overlay */}
          <div className="absolute z-40 inset-0 flex items-center justify-center">
            <div 
              className="relative"
              style={{ animation: 'shake 3s ease-in-out infinite' }}
            >
              <svg 
                className="w-10 h-10 drop-shadow-lg" 
                fill="rgba(0,0,0,0.5)" 
                stroke="rgba(0,0,0,0.7)" 
                viewBox="0 0 24 24"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="1.5" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" fill="none" />
              </svg>
              {/* Lock keyhole */}
              <div className="absolute top-[58%] left-1/2 -translate-x-1/2 w-1.5 h-2.5 bg-red-800 rounded-full" />
            </div>
          </div>

          {/* Animated glow border */}
          <div 
            className="absolute inset-0 rounded-[5px_10px_10px_10px] pointer-events-none"
            style={{
              boxShadow: '0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.4), 0 0 60px rgba(220, 38, 38, 0.2)',
              animation: 'glow 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Global keyframe styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: scale(1.3) translateY(0px); }
          50% { transform: scale(1.3) translateY(-10px); }
        }
        @keyframes peek {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50% { transform: translateX(-50%) translateY(-6px); }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-5deg); }
          40% { transform: rotate(5deg); }
          60% { transform: rotate(-3deg); }
          80% { transform: rotate(3deg); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// 100 Questions about Epstein case and general knowledge
const DEEP_VAULT_QUESTIONS = [
  { q: "What was the name of Epstein's private island?", a: ["little st james", "little saint james"], hint: "Little St. ___" },
  { q: "What was Epstein's private plane nicknamed?", a: ["lolita express"], hint: "Named after a famous novel" },
  { q: "In what year did Epstein die in prison?", a: ["2019"], hint: "Same year as the final arrests" },
  { q: "What prison was Epstein held in?", a: ["metropolitan correctional center", "mcc"], hint: "MCC in New York" },
  { q: "What was Ghislaine Maxwell's relationship to Epstein?", a: ["girlfriend", "associate", "partner"], hint: "Close personal relationship" },
  { q: "What state was Epstein's mansion located in?", a: ["new york", "florida", "new mexico"], hint: "Multiple properties" },
  { q: "What was the official cause of Epstein's death?", a: ["suicide", "hanging"], hint: "Ruled by medical examiner" },
  { q: "What year was Epstein first convicted?", a: ["2008"], hint: "Florida case" },
  { q: "How many months did Epstein serve in 2008?", a: ["13", "thirteen"], hint: "Just over a year" },
  { q: "What was Epstein's profession claim?", a: ["financier", "hedge fund manager", "money manager"], hint: "Wall Street related" },
  { q: "What university did Epstein have ties to?", a: ["harvard", "mit"], hint: "Ivy League and tech school" },
  { q: "Who was the prosecutor that gave Epstein a deal in 2008?", a: ["alexander acosta", "acosta"], hint: "Later became Labor Secretary" },
  { q: "What Caribbean island nation contains Little St. James?", a: ["us virgin islands", "virgin islands"], hint: "US territory" },
  { q: "What was the name of Epstein's New Mexico ranch?", a: ["zorro ranch"], hint: "Named after a masked hero" },
  { q: "In what year was Ghislaine Maxwell arrested?", a: ["2020"], hint: "One year after Epstein's death" },
  { q: "What British royal was associated with Epstein?", a: ["prince andrew", "andrew"], hint: "Queen Elizabeth's son" },
  { q: "What famous scientist visited Epstein's island?", a: ["stephen hawking", "hawking"], hint: "Theoretical physicist" },
  { q: "What tech billionaire had meetings with Epstein?", a: ["bill gates", "gates"], hint: "Microsoft founder" },
  { q: "How old was Epstein when he died?", a: ["66"], hint: "In his mid-sixties" },
  { q: "What month did Epstein die?", a: ["august"], hint: "Summer month" },
  { q: "What was the name of Epstein's black book?", a: ["black book", "little black book", "contact book"], hint: "Contains contacts" },
  { q: "How many names were reportedly in Epstein's contact book?", a: ["1000", "over 1000", "thousands"], hint: "Four digits" },
  { q: "What was Maxwell convicted of in 2021?", a: ["sex trafficking", "trafficking"], hint: "Federal charges" },
  { q: "What documentary series covered the Epstein case on Netflix?", a: ["filthy rich", "jeffrey epstein filthy rich"], hint: "Two words, describes wealth" },
  { q: "What NYC building did Epstein own?", a: ["herbert n straus house", "manhattan mansion"], hint: "Upper East Side mansion" },
  { q: "What Florida city had Epstein's other mansion?", a: ["palm beach"], hint: "Wealthy coastal city" },
  { q: "What year did the Miami Herald investigation publish?", a: ["2018"], hint: "Year before arrest" },
  { q: "Who wrote the Miami Herald investigation?", a: ["julie k brown", "julie brown"], hint: "Journalist, first name Julie" },
  { q: "What was the FBI operation called?", a: ["operation cross country"], hint: "Related to state lines" },
  { q: "What modeling agency was linked to recruitment?", a: ["mc2"], hint: "Mathematical term" },
  { q: "What year did Epstein buy Little St. James?", a: ["1998"], hint: "Late 1990s" },
  { q: "What was the temple-like structure on the island?", a: ["blue temple", "temple", "blue striped building"], hint: "Blue colored building" },
  { q: "How many years was Maxwell sentenced to?", a: ["20"], hint: "Two decades" },
  { q: "What was Epstein's birth year?", a: ["1953"], hint: "Early 1950s" },
  { q: "What Brooklyn neighborhood was Epstein from?", a: ["coney island", "sea gate"], hint: "Beach area" },
  { q: "What school did Epstein teach at before finance?", a: ["dalton school", "dalton"], hint: "Private NYC school" },
  { q: "What bank did Epstein work at?", a: ["bear stearns"], hint: "Now defunct investment bank" },
  { q: "Who hired Epstein at Dalton School?", a: ["donald barr", "barr"], hint: "Father of an Attorney General" },
  { q: "What was the Non-Prosecution Agreement year?", a: ["2007", "2008"], hint: "Around his first conviction" },
  { q: "What news network first aired Maxwell interview?", a: ["abc", "nbc"], hint: "Major broadcast network" },
  { q: "How many counts was Maxwell convicted on?", a: ["5", "five"], hint: "Less than 10" },
  { q: "What state did Maxwell hide in before arrest?", a: ["new hampshire"], hint: "New England state" },
  { q: "What was the name of Maxwell's estate?", a: ["tuckedaway"], hint: "Describes being hidden" },
  { q: "What ocean surrounds the Virgin Islands?", a: ["atlantic", "caribbean", "caribbean sea"], hint: "Between Americas" },
  { q: "What actress spoke against Epstein?", a: ["courtney love"], hint: "Rock musician/actress" },
  { q: "What year was Epstein's final arrest?", a: ["2019"], hint: "Same year he died" },
  { q: "What month was Epstein's final arrest?", a: ["july"], hint: "Summer month before August" },
  { q: "What airport was Epstein arrested at?", a: ["teterboro"], hint: "New Jersey private airport" },
  { q: "How much was Epstein's bail denied for?", a: ["0", "denied", "no bail"], hint: "Not granted" },
  { q: "What floor was Epstein's cell on?", a: ["9", "nine", "9th"], hint: "Single digit" },
  { q: "What President flew on Epstein's plane?", a: ["clinton", "bill clinton", "trump", "donald trump"], hint: "Multiple presidents" },
  { q: "What lawyer represented Epstein victims?", a: ["gloria allred", "david boies"], hint: "Famous attorneys" },
  { q: "What was the compensation fund total?", a: ["125 million", "121 million"], hint: "Over 100 million" },
  { q: "What island is near Little St. James?", a: ["great st james", "st thomas"], hint: "Larger neighboring island" },
  { q: "What was Maxwell's father's name?", a: ["robert maxwell", "robert"], hint: "Media mogul" },
  { q: "How did Robert Maxwell die?", a: ["drowning", "fell off yacht", "drowned"], hint: "At sea" },
  { q: "What yacht was Robert Maxwell on?", a: ["lady ghislaine"], hint: "Named after his daughter" },
  { q: "What country was Ghislaine Maxwell born in?", a: ["france"], hint: "European country" },
  { q: "What Ivy League school did Maxwell attend?", a: ["oxford"], hint: "British university" },
  { q: "What year were documents unsealed?", a: ["2024", "2023"], hint: "Recent years" },
  { q: "What charity did Epstein fund at Harvard?", a: ["program for evolutionary dynamics"], hint: "Science related" },
  { q: "What was Epstein's net worth estimate?", a: ["500 million", "577 million"], hint: "Hundreds of millions" },
  { q: "What type of aircraft was the Lolita Express?", a: ["boeing 727", "727"], hint: "Boeing model" },
  { q: "What designer was linked to Epstein?", a: ["les wexner", "wexner"], hint: "Victoria's Secret" },
  { q: "What brand did Wexner own?", a: ["victoria's secret", "victorias secret"], hint: "Lingerie brand" },
  { q: "What Ohio city is Wexner from?", a: ["columbus"], hint: "State capital" },
  { q: "What power of attorney did Wexner give Epstein?", a: ["full", "complete", "total"], hint: "Maximum authority" },
  { q: "What was Epstein's brother's name?", a: ["mark", "mark epstein"], hint: "Common male name" },
  { q: "What business does Mark Epstein run?", a: ["real estate"], hint: "Property related" },
  { q: "What cameras malfunctioned at MCC?", a: ["security cameras", "surveillance"], hint: "Recording devices" },
  { q: "What guards were charged?", a: ["tova noel", "michael thomas"], hint: "Two correctional officers" },
  { q: "What were the guards doing instead of checks?", a: ["sleeping", "browsing internet"], hint: "Not working" },
  { q: "What medical examiner reviewed the death?", a: ["barbara sampson"], hint: "NYC chief examiner" },
  { q: "What private pathologist disputed findings?", a: ["michael baden", "baden"], hint: "Famous forensic expert" },
  { q: "What injuries did Baden note?", a: ["broken hyoid", "hyoid bone"], hint: "Neck bone" },
  { q: "What is the hyoid bone?", a: ["neck bone", "throat bone"], hint: "In the throat area" },
  { q: "What network aired Surviving Jeffrey Epstein?", a: ["lifetime"], hint: "Women's network" },
  { q: "What podcast covered the case extensively?", a: ["broken", "epstein"], hint: "Multiple podcasts" },
  { q: "What author wrote about Epstein for Vanity Fair?", a: ["vicky ward"], hint: "Female journalist" },
  { q: "What year was the Vanity Fair article?", a: ["2003"], hint: "Early 2000s" },
  { q: "What was edited out of the Vanity Fair piece?", a: ["allegations", "abuse claims"], hint: "Accusations" },
  { q: "What phrase became popular after Epstein's death?", a: ["epstein didn't kill himself"], hint: "Conspiracy meme" },
  { q: "What subreddit tracked the case?", a: ["epstein", "epsteindidntkillhimself"], hint: "Reddit community" },
  { q: "What was the hashtag used?", a: ["epsteindidntkillhimself", "epstein"], hint: "Twitter trend" },
  { q: "What comedian joked about it on SNL?", a: ["various", "multiple"], hint: "Multiple comedians" },
  { q: "What UFC fighter wore the shirt?", a: ["colby covington"], hint: "Controversial fighter" },
  { q: "What former governor visited the island?", a: ["bill richardson"], hint: "New Mexico politician" },
  { q: "What senator requested investigation?", a: ["ben sasse"], hint: "Nebraska Republican" },
  { q: "What was the SDNY case number?", a: ["19 cr 490"], hint: "2019 criminal case" },
  { q: "What judge oversaw Maxwell's case?", a: ["alison nathan"], hint: "Female federal judge" },
  { q: "What was Maxwell's inmate number?", a: ["02879-509"], hint: "Federal prison ID" },
  { q: "What prison is Maxwell in?", a: ["fci tallahassee"], hint: "Florida facility" },
  { q: "What security level is the prison?", a: ["low"], hint: "Not maximum" },
  { q: "What year is Maxwell's earliest release?", a: ["2037"], hint: "2030s" },
  { q: "What civil cases remain pending?", a: ["multiple", "several", "many"], hint: "More than one" },
  { q: "What foundation did Epstein create?", a: ["jeffrey epstein vi foundation"], hint: "His name + VI" },
  { q: "What does VI stand for in the foundation?", a: ["virgin islands"], hint: "Island territory" },
  { q: "What science conference did Epstein fund?", a: ["edge"], hint: "Boundary/frontier" },
  { q: "What AI researcher met with Epstein?", a: ["marvin minsky"], hint: "AI pioneer, deceased" },
];

// Shuffle array helper
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Deep Vault Media Content
const VAULT_CONTENTS = [
  { type: 'image', title: 'Flight Log Page 1', filename: 'flight-log-1.jpg' },
  { type: 'image', title: 'Flight Log Page 2', filename: 'flight-log-2.jpg' },
  { type: 'image', title: 'Island Aerial View', filename: 'island-aerial.jpg' },
  { type: 'image', title: 'Guest List 1998', filename: 'guest-list-1998.jpg' },
  { type: 'image', title: 'Property Records', filename: 'property-records.jpg' },
  { type: 'video', title: 'Security Footage Clip 1', filename: 'security-1.mp4' },
  { type: 'image', title: 'Financial Transfers', filename: 'financial-transfers.jpg' },
  { type: 'image', title: 'Communication Records', filename: 'communications.jpg' },
  { type: 'video', title: 'Deposition Excerpt', filename: 'deposition.mp4' },
  { type: 'image', title: 'The Complete List', filename: 'complete-list.jpg' },
];

interface DeepVaultProps {
  isVisible: boolean;
}

export const DeepVault: React.FC<DeepVaultProps> = ({ isVisible }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChallengeActive, setIsChallengeActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lives, setLives] = useState(10);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [questions, setQuestions] = useState<typeof DEEP_VAULT_QUESTIONS>([]);
  const [selectedMedia, setSelectedMedia] = useState<typeof VAULT_CONTENTS[0] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize shuffled questions
  useEffect(() => {
    setQuestions(shuffleArray(DEEP_VAULT_QUESTIONS).slice(0, 100));
  }, []);

  // Handle cooldown timer
  useEffect(() => {
    if (!cooldownEnd) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, cooldownEnd - Date.now());
      setCooldownRemaining(remaining);
      
      if (remaining === 0) {
        setCooldownEnd(null);
        setLives(10);
        setCurrentQuestion(0);
        setQuestions(shuffleArray(DEEP_VAULT_QUESTIONS).slice(0, 100));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownEnd]);

  // Focus input when challenge starts
  useEffect(() => {
    if (isChallengeActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChallengeActive, currentQuestion]);

  const startChallenge = () => {
    if (cooldownEnd) return;
    setIsChallengeActive(true);
    setCurrentQuestion(0);
    setLives(10);
    setQuestions(shuffleArray(DEEP_VAULT_QUESTIONS).slice(0, 100));
  };

  const checkAnswer = () => {
    if (!userAnswer.trim() || feedback) return;

    const question = questions[currentQuestion];
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const isCorrect = question.a.some(ans => 
      normalizedAnswer === ans.toLowerCase() || 
      normalizedAnswer.includes(ans.toLowerCase())
    );

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        if (currentQuestion >= 99) {
          // Completed all 100 questions!
          setIsUnlocked(true);
          setIsChallengeActive(false);
        } else {
          setCurrentQuestion(prev => prev + 1);
          setUserAnswer('');
          setFeedback(null);
          setShowHint(false);
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      const newLives = lives - 1;
      setLives(newLives);
      
      setTimeout(() => {
        if (newLives <= 0) {
          // Out of lives - start 5 min cooldown
          setCooldownEnd(Date.now() + 5 * 60 * 1000);
          setIsChallengeActive(false);
        }
        setUserAnswer('');
        setFeedback(null);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  // SVG Icons
  const WarningIcon = () => (
    <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
    </svg>
  );
  
  const LockOpenIcon = () => (
    <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/>
      <path d="M7 11V7a5 5 0 0 1 9.9-1" strokeWidth="2"/>
    </svg>
  );
  
  const HeartIcon = ({ filled = true }: { filled?: boolean }) => (
    <svg className="w-4 h-4 inline" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2"/>
    </svg>
  );
  
  const DocumentIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2"/>
      <polyline points="14,2 14,8 20,8" strokeWidth="2"/>
    </svg>
  );
  
  const VideoIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" strokeWidth="2"/>
      <polygon points="10,8 16,12 10,16" fill="currentColor"/>
    </svg>
  );
  
  const ClockIcon = () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
      <polyline points="12,6 12,12 16,14" strokeWidth="2"/>
    </svg>
  );
  
  const LightbulbIcon = () => (
    <svg className="w-3 h-3 inline" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
    </svg>
  );
  
  const LockIcon = () => (
    <svg className="w-3 h-3 inline" fill="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );
  
  const CheckIcon = () => (
    <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline points="20,6 9,17 4,12" strokeWidth="3"/>
    </svg>
  );
  
  const XIcon = () => (
    <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" strokeWidth="3"/>
      <line x1="6" y1="6" x2="18" y2="18" strokeWidth="3"/>
    </svg>
  );

  return (
    <div className="mt-16 pt-10 border-t-2 border-red-900/50">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-red-600 text-xs font-pixel tracking-widest animate-pulse flex items-center justify-center gap-2">
          <WarningIcon /> MAXIMUM CLEARANCE REQUIRED <WarningIcon />
        </span>
        <h2 className="font-pixel text-3xl md:text-4xl text-white mt-2">
          THE <span className="text-red-600">DEEP VAULT</span>
        </h2>
        <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
          Contains the most sensitive evidence. Answer 100 questions to unlock.
          You have 10 lives. Fail and wait 5 minutes to retry.
        </p>
      </div>

      {/* Main Vault Display */}
      <div className="max-w-2xl mx-auto">
        {isUnlocked ? (
          /* Unlocked - Show Contents */
          <div className="bg-black/60 border-2 border-green-500/50 rounded-xl p-6">
            <div className="text-center mb-6">
              <span className="text-green-400 text-sm font-pixel flex items-center justify-center gap-2">
                <LockOpenIcon /> VAULT UNLOCKED
              </span>
              <p className="text-white/50 text-xs mt-1">Access granted to classified materials</p>
            </div>
            
            {/* Media Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {VAULT_CONTENTS.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMedia(item)}
                  className="aspect-square bg-black/80 border border-gray-700 rounded-lg p-2 hover:border-red-500/50 hover:bg-red-500/10 transition-all group"
                >
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 group-hover:text-red-400">
                    {item.type === 'video' ? <VideoIcon /> : <DocumentIcon />}
                    <span className="text-[10px] text-center mt-2 transition-colors">
                      {item.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Media Modal */}
            {selectedMedia && (
              <div 
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                onClick={() => setSelectedMedia(null)}
              >
                <div 
                  className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full p-6"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-pixel">{selectedMedia.title}</h3>
                    <button 
                      onClick={() => setSelectedMedia(null)}
                      className="text-gray-500 hover:text-white w-6 h-6"
                    >
                      <XIcon />
                    </button>
                  </div>
                  
                  {/* Placeholder content */}
                  <div className="aspect-video bg-black border border-gray-800 rounded-lg flex items-center justify-center">
                    {selectedMedia.type === 'video' ? (
                      <div className="text-center text-gray-500">
                        <VideoIcon />
                        <p className="text-sm mt-4">Video: {selectedMedia.filename}</p>
                        <p className="text-gray-600 text-xs mt-2">[Placeholder - Add actual video]</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <DocumentIcon />
                        <p className="text-sm mt-4">Image: {selectedMedia.filename}</p>
                        <p className="text-gray-600 text-xs mt-2">[Placeholder - Add actual image]</p>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="mt-4 w-full py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 text-sm hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : isChallengeActive ? (
          /* Active Challenge */
          <div className="bg-black/80 border-2 border-red-500/50 rounded-xl p-6">
            {/* Progress & Lives */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-red-400 text-xs font-pixel">QUESTION</span>
                <span className="text-white font-mono text-lg">{currentQuestion + 1}/100</span>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className={i < lives ? 'text-red-500' : 'text-gray-700'}>
                    <HeartIcon filled={i < lives} />
                  </span>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-800 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500"
                style={{ width: `${(currentQuestion / 100) * 100}%` }}
              />
            </div>

            {/* Question */}
            {questions[currentQuestion] && (
              <div className="mb-6">
                <p className="text-white text-lg mb-4">
                  {questions[currentQuestion].q}
                </p>
                
                {/* Answer Input */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!!feedback}
                    placeholder="Type your answer..."
                    className={`w-full px-4 py-3 bg-black border-2 rounded-lg text-white placeholder-gray-600 focus:outline-none transition-all ${
                      feedback === 'correct' 
                        ? 'border-green-500 bg-green-500/10' 
                        : feedback === 'wrong'
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-gray-700 focus:border-red-500'
                    }`}
                  />
                  
                  {feedback && (
                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      feedback === 'correct' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {feedback === 'correct' ? <CheckIcon /> : <XIcon />}
                    </div>
                  )}
                </div>

                {/* Hint */}
                {!feedback && (
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-amber-500/70 text-xs hover:text-amber-400 transition-colors flex items-center gap-1"
                    >
                      {showHint ? <><LockIcon /> Hide hint</> : <><LightbulbIcon /> Show hint</>}
                    </button>
                    
                    {showHint && (
                      <span className="text-amber-400/60 text-xs italic">
                        Hint: {questions[currentQuestion].hint}
                      </span>
                    )}
                  </div>
                )}

                {/* Feedback Message */}
                {feedback === 'wrong' && (
                  <p className="text-red-400 text-sm mt-3 flex items-center gap-1">
                    <XIcon /> Wrong! {lives - 1 > 0 ? `${lives - 1} lives remaining` : 'No lives left!'}
                  </p>
                )}
                {feedback === 'correct' && (
                  <p className="text-green-400 text-sm mt-3 flex items-center gap-1">
                    <CheckIcon /> Correct! {currentQuestion >= 99 ? 'VAULT UNLOCKED!' : 'Next question...'}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim() || !!feedback}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-pixel rounded-lg transition-all"
            >
              SUBMIT ANSWER
            </button>

            {/* Exit Button */}
            <button
              onClick={() => setIsChallengeActive(false)}
              className="w-full mt-3 py-2 bg-transparent border border-gray-700 text-gray-500 text-sm rounded-lg hover:border-red-500/50 hover:text-red-400 transition-all"
            >
              Exit Challenge
            </button>
          </div>
        ) : cooldownEnd ? (
          /* Cooldown State */
          <div className="bg-black/80 border-2 border-red-900/50 rounded-xl p-8 text-center">
            <div className="text-gray-500 mb-4 flex justify-center">
              <ClockIcon />
            </div>
            <h3 className="font-pixel text-xl text-red-500 mb-2">ACCESS DENIED</h3>
            <p className="text-gray-500 text-sm mb-6">
              You've exhausted all lives. Security lockout in effect.
            </p>
            
            <div className="inline-flex flex-col items-center gap-2 px-6 py-4 bg-red-900/20 border border-red-500/30 rounded-xl">
              <span className="text-red-400/60 text-xs font-pixel">RETRY IN</span>
              <span className="text-red-500 text-4xl font-mono font-bold">
                {formatTime(cooldownRemaining)}
              </span>
            </div>
            
            <p className="text-gray-600 text-xs mt-6">
              Questions will be reshuffled on retry.
            </p>
          </div>
        ) : (
          /* Locked State - Start Challenge */
          <div className="bg-black/80 border-2 border-red-500/30 rounded-xl p-8 text-center relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-transparent animate-pulse" />
            </div>
            
            {/* Animated Folder */}
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <AnimatedLockedFolder />
              </div>
              
              <h3 className="font-pixel text-xl text-red-500 mb-2">CLASSIFIED</h3>
              <p className="text-gray-500 text-sm mb-6">
                100 questions stand between you and the truth.<br/>
                10 lives. 5 minute lockout on failure.
              </p>
              
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Questions:</span>
                  <span className="text-white font-mono">100</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Lives:</span>
                  <span className="text-red-400 font-mono flex items-center gap-1">10 <HeartIcon /></span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Penalty:</span>
                  <span className="text-amber-400 font-mono">5:00 lockout</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Contents:</span>
                  <span className="text-green-400 font-mono">10 files</span>
                </div>
              </div>
              
              <button
                onClick={startChallenge}
                className="mt-8 mx-auto px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-pixel text-lg rounded-xl transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 flex items-center justify-center gap-2"
              >
                <LockOpenIcon /> BEGIN CHALLENGE
              </button>
              
              <p className="text-gray-700 text-xs mt-4">
                Are you ready to face the truth?
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeepVault;