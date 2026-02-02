'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UserIcon, AlertIcon, CheckIcon, CloseIcon } from '@/icons';
import { isValidUsername } from '@/lib/utils';

interface UsernameModalProps {
  isOpen: boolean;
  onSubmit: (username: string) => Promise<{ success: boolean; error?: string }>;
  onClose?: () => void;
  canClose?: boolean;
}

export const UsernameModal: React.FC<UsernameModalProps> = ({
  isOpen,
  onSubmit,
  onClose,
  canClose = false,
}) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmed = username.trim();
    const validation = isValidUsername(trimmed);
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid username');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onSubmit(trimmed);
      if (!result.success) {
        setError(result.error || 'Failed to register username');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserIcon className="text-terminal-green" size={20} />
            <h2 className="font-pixel text-sm text-terminal-green tracking-wider">
              OBSERVER REGISTRATION
            </h2>
          </div>
          {canClose && onClose && (
            <button
              onClick={onClose}
              className="text-terminal-muted hover:text-terminal-text p-1"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mb-6 p-3 bg-terminal-bg border border-terminal-border">
          <p className="text-terminal-muted text-sm mb-2">
            Choose your observer identity. This name will be visible to all other observers.
          </p>
          <ul className="text-terminal-dim text-xs space-y-1">
            <li>- 2-20 characters</li>
            <li>- Letters, numbers, underscores, and hyphens only</li>
            <li>- Cannot be changed once set</li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-terminal-muted text-xs mb-2 uppercase tracking-wider">
              Observer Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              placeholder="Enter username..."
              disabled={isSubmitting}
              maxLength={20}
              className="w-full"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center gap-2 text-terminal-red text-sm">
              <AlertIcon size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !username.trim()}
            className="w-full primary flex items-center justify-center gap-2 py-3"
          >
            {isSubmitting ? (
              <>
                <span className="animate-pulse">REGISTERING...</span>
              </>
            ) : (
              <>
                <CheckIcon size={14} />
                <span>CONFIRM IDENTITY</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-4 text-center text-terminal-dim text-xs">
          Your identity is stored locally and tied to this browser.
        </div>
      </div>
    </div>
  );
};

export default UsernameModal;
