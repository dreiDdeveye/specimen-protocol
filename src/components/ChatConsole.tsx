'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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

export const ChatConsole: React.FC<ChatConsoleProps> = ({
  messages,
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom - ONLY inside the chat container
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

  // Combine and sort all messages
  const allMessages = [
    ...messages.map(m => ({ type: 'chat' as const, data: m, time: new Date(m.created_at) })),
    ...systemMessages.map(m => ({ type: 'system' as const, data: m, time: m.timestamp })),
  ].sort((a, b) => a.time.getTime() - b.time.getTime());

  return (
    <div className="terminal-panel flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-terminal-border">
        <TerminalIcon className="text-terminal-green" size={16} />
        <span className="font-pixel text-xs text-terminal-green tracking-wider">
          OBSERVER FEED
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div className={cn('status-dot', isConnected ? 'online' : 'offline')} />
          <span className="text-terminal-muted text-xs">
            {isConnected ? 'CONNECTED' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0"
      >
        {allMessages.length === 0 ? (
          <div className="text-terminal-muted text-sm text-center py-8">
            <SystemIcon className="mx-auto mb-2 opacity-50" size={24} />
            No messages yet. Be the first observer to speak.
          </div>
        ) : (
          allMessages.map((item, index) => {
            if (item.type === 'system') {
              return (
                <div
                  key={`sys-${item.data.id}`}
                  className="chat-message flex items-start gap-2 py-1"
                >
                  <SystemIcon className="text-terminal-amber mt-0.5 flex-shrink-0" size={12} />
                  <div className="flex-1 min-w-0">
                    <span className="text-terminal-muted text-xs">
                      [{formatTimestamp(item.data.timestamp)}]
                    </span>
                    <span className="text-terminal-amber ml-2 text-sm">
                      {item.data.message}
                    </span>
                  </div>
                </div>
              );
            }

            const msg = item.data as ChatMessage;
            const isOwnMessage = msg.username === username;

            return (
              <div
                key={`msg-${msg.id}`}
                className="chat-message flex items-start gap-2 py-1"
              >
                <UserIcon
                  className={cn(
                    'mt-0.5 flex-shrink-0',
                    isOwnMessage ? 'text-terminal-cyan' : 'text-terminal-dim'
                  )}
                  size={12}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-terminal-muted text-xs">
                    [{formatTimestamp(msg.created_at)}]
                  </span>
                  <span
                    className={cn(
                      'ml-2 font-medium',
                      isOwnMessage ? 'text-terminal-cyan' : 'text-terminal-green'
                    )}
                  >
                    {msg.username}:
                  </span>
                  <span className="ml-2 text-terminal-text text-sm break-words">
                    {msg.message}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="px-3 py-2 bg-terminal-red/10 border-t border-terminal-red/30">
          <span className="text-terminal-red text-xs">{error}</span>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-terminal-border">
        {!chatEnabled ? (
          <div className="text-center text-terminal-muted text-sm py-2">
            Chat is currently disabled
          </div>
        ) : !username ? (
          <div className="text-center text-terminal-muted text-sm py-2">
            Set your observer name to participate
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={cooldown > 0 ? `Wait ${cooldown}s...` : 'Enter message...'}
                disabled={isSending || cooldown > 0}
                maxLength={maxLength}
                className="w-full pr-16"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-terminal-muted text-xs">
                {inputValue.length}/{maxLength}
              </span>
            </div>
            <button
              type="submit"
              disabled={isSending || cooldown > 0 || !inputValue.trim()}
              className="px-4 flex items-center gap-2"
            >
              <SendIcon size={14} />
              <span className="hidden sm:inline">SEND</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatConsole;