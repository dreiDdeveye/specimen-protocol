'use client';

import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 30, delay: number = 0, startTyping: boolean = true) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!startTyping) {
      setDisplayedText('');
      setIsComplete(false);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);

    const startTimeout = setTimeout(() => {
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay, startTyping]);

  return { displayedText, isComplete };
};

// Component version for easier use
interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  startTyping?: boolean;
  onComplete?: () => void;
  className?: string;
  cursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 30,
  delay = 0,
  startTyping = true,
  onComplete,
  className = '',
  cursor = true,
}) => {
  const { displayedText, isComplete } = useTypewriter(text, speed, delay, startTyping);

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && !isComplete && <span className="animate-pulse">▌</span>}
    </span>
  );
};

export default TypewriterText;