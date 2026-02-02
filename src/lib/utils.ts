// Browser fingerprint generation - STABLE version
export async function generateFingerprint(): Promise<string> {
  // Check if we already have a stored fingerprint
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('specimen_fingerprint');
    if (stored) {
      return stored;
    }
  }

  // Generate a stable fingerprint based on browser characteristics
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width.toString(),
    screen.height.toString(),
    screen.colorDepth.toString(),
    new Date().getTimezoneOffset().toString(),
    navigator.hardwareConcurrency?.toString() || 'unknown',
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory?.toString() || 'unknown',
  ];

  // Create canvas fingerprint
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('fingerprint', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('fingerprint', 4, 17);
      components.push(canvas.toDataURL());
    }
  } catch (e) {
    components.push('canvas-error');
  }

  const str = components.join('|||');

  // Create a stable hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const fingerprint = 'fp_' + Math.abs(hash).toString(36) + '_' + str.length.toString(36);

  // Store for future use
  if (typeof window !== 'undefined') {
    localStorage.setItem('specimen_fingerprint', fingerprint);
  }

  return fingerprint;
}

// Local storage helpers
const OBSERVER_KEY = 'specimen_observer';

export interface StoredObserver {
  id: string;
  username: string;
  fingerprint: string;
}

export function getStoredObserver(): StoredObserver | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(OBSERVER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setStoredObserver(observer: StoredObserver): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(OBSERVER_KEY, JSON.stringify(observer));
}

export function clearStoredObserver(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(OBSERVER_KEY);
  localStorage.removeItem('specimen_fingerprint');
}

// Format helpers
export function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

export function formatTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

// Validation helpers
export function isValidUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: 'Username is required' };
  }

  const trimmed = username.trim();

  if (trimmed.length < 2) {
    return { valid: false, error: 'Username must be at least 2 characters' };
  }

  if (trimmed.length > 20) {
    return { valid: false, error: 'Username must be 20 characters or less' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return { valid: false, error: 'Username can only contain letters, numbers, _ and -' };
  }

  // Reserved names
  const reserved = ['admin', 'system', 'mod', 'moderator', 'specimen', 'protocol'];
  if (reserved.includes(trimmed.toLowerCase())) {
    return { valid: false, error: 'This username is reserved' };
  }

  return { valid: true };
}

// Class name helper
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}