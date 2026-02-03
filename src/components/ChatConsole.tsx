'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TerminalIcon, SendIcon, SystemIcon, UserIcon } from '@/icons';
import { formatTimestamp, cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';

interface ChatConsoleProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<{ success: boolean; error?: string }>;
  isConnected: boolean;
  username: string | null;
  cooldownSeconds: number;
  maxLength: number;
  chatEnabled: boolean;
}

interface SystemMessage {
  id: string;
  message: string;
  timestamp: Date;
}

// Reaction GIFs - expanded collection
const REACTION_GIFS = [
  // Hype & Celebration
  { id: 'rocket', label: '🚀', url: 'https://media.giphy.com/media/mi6DsSSNKDbUY/giphy.gif', alt: 'To the moon!' },
  { id: 'money', label: '💰', url: 'https://media.giphy.com/media/67ThRZlYBvibtdF9JH/giphy.gif', alt: 'Money rain' },
  { id: 'pump', label: '📈', url: 'https://media.giphy.com/media/n0xHORz5gp904/giphy.gif', alt: 'Pump it!' },
  { id: 'dance', label: '💃', url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', alt: 'Dance' },
  { id: 'fire', label: '🔥', url: 'https://media.giphy.com/media/j6uK36y32LxQs/giphy.gif', alt: 'Fire' },
  { id: 'clap', label: '👏', url: 'https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif', alt: 'Clapping' },
  { id: 'crab', label: '🦀', url: 'https://media.giphy.com/media/2dK0W3oUksQk0Xz8OK/giphy.gif', alt: 'Crab rave' },
  { id: 'lfg', label: '🏎️', url: 'https://media.giphy.com/media/3oriNZoNvn73MZaFYk/giphy.gif', alt: 'LFG!' },
  
  // Reactions
  { id: 'wow', label: '😮', url: 'https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif', alt: 'Wow' },
  { id: 'mindblown', label: '🤯', url: 'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif', alt: 'Mind blown' },
  { id: 'yes', label: '✅', url: 'https://media.giphy.com/media/3oriO5t2QB4IPKgxHi/giphy.gif', alt: 'Yes!' },
  { id: 'no', label: '❌', url: 'https://media.giphy.com/media/JYZ397GsFrFtu/giphy.gif', alt: 'No!' },
  { id: 'think', label: '🤔', url: 'https://media.giphy.com/media/a5viI92PAF89q/giphy.gif', alt: 'Thinking' },
  { id: 'laugh', label: '😂', url: 'https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif', alt: 'Laughing' },
  { id: 'cry', label: '😢', url: 'https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif', alt: 'Crying' },
  { id: 'angry', label: '😠', url: 'https://media.giphy.com/media/l1J9u3TZfpmeDLkD6/giphy.gif', alt: 'Angry' },
  
  // Actions
  { id: 'hodl', label: '💎', url: 'https://media.giphy.com/media/d0DdMCREQChi3jGymW/giphy.gif', alt: 'Diamond hands' },
  { id: 'buy', label: '🛒', url: 'https://media.giphy.com/media/67ThRZlYBvibtdF9JH/giphy.gif', alt: 'Buy buy buy' },
  { id: 'wait', label: '⏳', url: 'https://media.giphy.com/media/tXL4FHPSnVJ0A/giphy.gif', alt: 'Waiting' },
  { id: 'sleep', label: '😴', url: 'https://media.giphy.com/media/xT8qBvOmIEWXxVPdxS/giphy.gif', alt: 'Sleeping' },
  
  // Animals & Fun
  { id: 'cat', label: '🐱', url: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif', alt: 'Cat typing' },
  { id: 'dog', label: '🐕', url: 'https://media.giphy.com/media/mCRJDo24UvJMA/giphy.gif', alt: 'Dog' },
  { id: 'frog', label: '🐸', url: 'https://media.giphy.com/media/kFgzrTt798d2w/giphy.gif', alt: 'Pepe' },
  { id: 'ape', label: '🦍', url: 'https://media.giphy.com/media/9wLKh6ms5t9qE/giphy.gif', alt: 'Ape together strong' },
];

// Generate consistent color from username
const getUserColor = (username: string): string => {
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

// Get avatar initials
const getInitials = (username: string): string => {
  return username.slice(0, 2).toUpperCase();
};

// Check if message is a GIF
const isGifMessage = (message: string): string | null => {
  const gif = REACTION_GIFS.find(g => message === `[GIF:${g.id}]`);
  return gif ? gif.url : null;
};

// Get GIF alt text
const getGifAlt = (message: string): string => {
  const gif = REACTION_GIFS.find(g => message === `[GIF:${g.id}]`);
  return gif ? gif.alt : 'GIF';
};

export const ChatConsole: React.FC<ChatConsoleProps> = ({
  messages = [],
  onSendMessage,
  isConnected,
  username,
  cooldownSeconds,
  maxLength,
  chatEnabled,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gifPickerRef = useRef<HTMLDivElement>(null);

  // Count unique users from recent messages
  const onlineCount = useMemo(() => {
    const safeMessages = messages || [];
    const recentUsers = new Set(
      safeMessages
        .filter(m => {
          const msgTime = new Date(m.created_at).getTime();
          const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
          return msgTime > fiveMinutesAgo;
        })
        .map(m => m.username)
    );
    return Math.max(1, recentUsers.size);
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, systemMessages, scrollToBottom]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(c => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Clear error after 3 seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  // Close GIF picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gifPickerRef.current && !gifPickerRef.current.contains(event.target as Node)) {
        setShowGifPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !chatEnabled || cooldown > 0 || isSending) return;
    
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (trimmed.length > maxLength) {
      setError(`Message too long (max ${maxLength} characters)`);
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const result = await onSendMessage(trimmed);
      if (result.success) {
        setInputValue('');
        setCooldown(cooldownSeconds);
      } else {
        setError(result.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendGif = async (gifId: string) => {
    if (!username || !chatEnabled || cooldown > 0 || isSending) return;

    setIsSending(true);
    setError(null);
    setShowGifPicker(false);

    try {
      const result = await onSendMessage(`[GIF:${gifId}]`);
      if (result.success) {
        setCooldown(cooldownSeconds);
      } else {
        setError(result.error || 'Failed to send GIF');
      }
    } catch (err) {
      setError('Failed to send GIF');
    } finally {
      setIsSending(false);
    }
  };

  // Safely handle messages
  const safeMessages = messages || [];
  const safeSystemMessages = systemMessages || [];

  // Combine and sort all messages
  const allMessages = [
    ...safeMessages.map(m => ({ type: 'chat' as const, data: m, time: new Date(m.created_at) })),
    ...safeSystemMessages.map(m => ({ type: 'system' as const, data: m, time: m.timestamp })),
  ].sort((a, b) => a.time.getTime() - b.time.getTime());

  return (
    <div className="terminal-panel flex flex-col h-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-terminal-green/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-terminal-border relative">
        <TerminalIcon className="text-terminal-green" size={16} />
        <span className="font-pixel text-xs text-terminal-green tracking-wider">
          OBSERVER FEED
        </span>
        <div className="ml-auto flex items-center gap-4">
          {/* Online Count */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-terminal-bg/50 rounded border border-terminal-border/50">
            <div className="flex -space-x-1">
              {[...Array(Math.min(3, onlineCount))].map((_, i) => (
                <div 
                  key={i}
                  className="w-4 h-4 rounded-full bg-terminal-green/20 border border-terminal-green/50 flex items-center justify-center"
                >
                  <UserIcon size={8} className="text-terminal-green" />
                </div>
              ))}
            </div>
            <span className="text-terminal-green text-xs font-pixel">{onlineCount}</span>
            <span className="text-terminal-muted text-xs">online</span>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className={cn('status-dot', isConnected ? 'online' : 'offline')} />
              {isConnected && (
                <div className="absolute inset-0 status-dot online animate-ping opacity-50" />
              )}
            </div>
            <span className="text-terminal-muted text-xs">
              {isConnected ? 'CONNECTED' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0"
      >
        {allMessages.length === 0 ? (
          <div className="text-terminal-muted text-sm text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-terminal-border/20 flex items-center justify-center">
              <SystemIcon className="opacity-50" size={32} />
            </div>
            <p className="font-pixel text-xs">NO MESSAGES YET</p>
            <p className="text-xs mt-1">Be the first observer to speak.</p>
          </div>
        ) : (
          allMessages.map((item, index) => {
            if (item.type === 'system') {
              return (
                <div
                  key={`sys-${item.data.id}`}
                  className="flex items-center gap-2 py-2 px-3 bg-terminal-amber/5 border border-terminal-amber/20 rounded"
                >
                  <SystemIcon className="text-terminal-amber flex-shrink-0" size={14} />
                  <span className="text-terminal-amber text-sm flex-1">
                    {item.data.message}
                  </span>
                  <span className="text-terminal-muted text-xs">
                    {formatTimestamp(item.data.timestamp)}
                  </span>
                </div>
              );
            }

            const msg = item.data as ChatMessage;
            const isOwnMessage = msg.username === username;
            const userColor = getUserColor(msg.username);
            const gifUrl = isGifMessage(msg.message);

            return (
              <div
                key={`msg-${msg.id}`}
                className={cn(
                  "group flex items-start gap-3 py-2 px-3 rounded transition-colors",
                  isOwnMessage ? "bg-terminal-cyan/5" : "hover:bg-terminal-bg/50"
                )}
              >
                {/* Avatar */}
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border",
                    isOwnMessage 
                      ? "bg-terminal-cyan/20 border-terminal-cyan/50 text-terminal-cyan" 
                      : "bg-terminal-green/10 border-terminal-border text-terminal-green"
                  )}
                >
                  {getInitials(msg.username)}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Username and timestamp */}
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn("font-medium text-sm", userColor)}>
                      {msg.username}
                    </span>
                    {isOwnMessage && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-terminal-cyan/20 text-terminal-cyan rounded">
                        YOU
                      </span>
                    )}
                    <span className="text-terminal-dim text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatTimestamp(msg.created_at)}
                    </span>
                  </div>
                  
                  {/* Message or GIF */}
                  {gifUrl ? (
                    <div className="mt-1">
                      <img 
                        src={gifUrl} 
                        alt={getGifAlt(msg.message)}
                        className="max-w-[200px] max-h-[150px] rounded border border-terminal-border"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <p className="text-terminal-text text-sm break-words leading-relaxed">
                      {msg.message}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="px-3 py-2 bg-terminal-red/10 border-t border-terminal-red/30 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-terminal-red animate-pulse" />
          <span className="text-terminal-red text-xs">{error}</span>
        </div>
      )}

      {/* GIF Picker */}
      {showGifPicker && (
        <div 
          ref={gifPickerRef}
          className="absolute bottom-20 left-3 right-3 bg-terminal-surface border border-terminal-border rounded-lg p-3 shadow-lg z-50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-xs text-terminal-green">SEND A REACTION</span>
            <button 
              onClick={() => setShowGifPicker(false)}
              className="text-terminal-muted hover:text-terminal-text text-lg leading-none px-2"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[250px] overflow-y-auto">
            {REACTION_GIFS.map(gif => (
              <button
                key={gif.id}
                onClick={() => handleSendGif(gif.id)}
                disabled={isSending || cooldown > 0}
                className="relative group aspect-square rounded border border-terminal-border overflow-hidden hover:border-terminal-green transition-colors disabled:opacity-50"
                title={gif.alt}
              >
                <img 
                  src={gif.url} 
                  alt={gif.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-terminal-bg/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xl">{gif.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-terminal-border bg-terminal-bg/30">
        {!chatEnabled ? (
          <div className="text-center text-terminal-muted text-sm py-3 bg-terminal-bg/50 rounded border border-terminal-border/50">
            <span className="font-pixel text-xs">CHAT DISABLED</span>
          </div>
        ) : !username ? (
          <div className="text-center text-terminal-muted text-sm py-3 bg-terminal-bg/50 rounded border border-terminal-border/50">
            <span className="font-pixel text-xs">SET OBSERVER NAME TO CHAT</span>
          </div>
        ) : (
          <div className="flex gap-2">
            {/* GIF Button */}
            <button
              type="button"
              onClick={() => setShowGifPicker(!showGifPicker)}
              disabled={isSending || cooldown > 0}
              className={cn(
                "px-3 py-2 rounded border transition-all text-lg",
                showGifPicker 
                  ? "bg-terminal-green/20 border-terminal-green text-terminal-green"
                  : "bg-terminal-bg border-terminal-border text-terminal-muted hover:border-terminal-green hover:text-terminal-green",
                (isSending || cooldown > 0) && "opacity-50 cursor-not-allowed"
              )}
              title="Send GIF"
            >
              🎬
            </button>

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={cooldown > 0 ? `Wait ${cooldown}s...` : 'Type your message...'}
                disabled={isSending || cooldown > 0}
                maxLength={maxLength}
                className="w-full pr-16 bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm focus:border-terminal-green focus:outline-none transition-colors"
              />
              <span className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-colors",
                inputValue.length > maxLength * 0.8 ? "text-terminal-amber" : "text-terminal-muted"
              )}>
                {inputValue.length}/{maxLength}
              </span>
            </div>
            <button
              type="submit"
              disabled={isSending || cooldown > 0 || !inputValue.trim()}
              className={cn(
                "px-4 py-2 flex items-center gap-2 rounded font-pixel text-xs transition-all",
                isSending || cooldown > 0 || !inputValue.trim()
                  ? "bg-terminal-border text-terminal-dim cursor-not-allowed"
                  : "bg-terminal-green text-terminal-bg hover:shadow-glow-green"
              )}
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-terminal-bg border-t-transparent rounded-full animate-spin" />
              ) : (
                <SendIcon size={14} />
              )}
              <span className="hidden sm:inline">SEND</span>
            </button>
          </div>
        )}
        
        {/* Cooldown indicator */}
        {cooldown > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-terminal-border rounded overflow-hidden">
              <div 
                className="h-full bg-terminal-cyan transition-all duration-1000"
                style={{ width: `${(cooldown / cooldownSeconds) * 100}%` }}
              />
            </div>
            <span className="text-terminal-cyan text-xs font-pixel">{cooldown}s</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatConsole;