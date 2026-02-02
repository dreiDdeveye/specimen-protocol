import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Pixel-style terminal icon
export const TerminalIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <rect x="1" y="2" width="14" height="12" fill="none" stroke="currentColor" strokeWidth="1" />
    <rect x="2" y="3" width="12" height="2" fill="currentColor" opacity="0.3" />
    <path d="M3 7 L6 9 L3 11" fill="none" stroke="currentColor" strokeWidth="1" />
    <rect x="7" y="10" width="5" height="1" fill="currentColor" />
  </svg>
);

// Pixel-style send icon
export const SendIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <path d="M2 2 L14 8 L2 14 L4 8 Z" />
  </svg>
);

// Pixel-style DNA/specimen icon
export const SpecimenIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <rect x="4" y="1" width="2" height="2" />
    <rect x="10" y="1" width="2" height="2" />
    <rect x="5" y="3" width="6" height="2" />
    <rect x="4" y="5" width="2" height="2" />
    <rect x="10" y="5" width="2" height="2" />
    <rect x="5" y="7" width="6" height="2" />
    <rect x="4" y="9" width="2" height="2" />
    <rect x="10" y="9" width="2" height="2" />
    <rect x="5" y="11" width="6" height="2" />
    <rect x="4" y="13" width="2" height="2" />
    <rect x="10" y="13" width="2" height="2" />
  </svg>
);

// Pixel-style chart/progress icon
export const ChartIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <rect x="2" y="12" width="2" height="2" />
    <rect x="5" y="10" width="2" height="4" />
    <rect x="8" y="7" width="2" height="7" />
    <rect x="11" y="4" width="2" height="10" />
    <path d="M2 14 L14 14" stroke="currentColor" strokeWidth="1" />
    <path d="M2 2 L2 14" stroke="currentColor" strokeWidth="1" />
  </svg>
);

// Pixel-style user icon
export const UserIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <rect x="6" y="2" width="4" height="4" />
    <rect x="5" y="6" width="6" height="2" />
    <rect x="4" y="8" width="8" height="2" />
    <rect x="3" y="10" width="4" height="4" />
    <rect x="9" y="10" width="4" height="4" />
  </svg>
);

// Pixel-style warning/alert icon
export const AlertIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <path d="M8 1 L15 14 L1 14 Z" fill="none" stroke="currentColor" strokeWidth="1" />
    <rect x="7" y="5" width="2" height="5" />
    <rect x="7" y="11" width="2" height="2" />
  </svg>
);

// Pixel-style settings/gear icon
export const SettingsIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <rect x="7" y="1" width="2" height="2" />
    <rect x="7" y="13" width="2" height="2" />
    <rect x="1" y="7" width="2" height="2" />
    <rect x="13" y="7" width="2" height="2" />
    <rect x="3" y="3" width="2" height="2" />
    <rect x="11" y="3" width="2" height="2" />
    <rect x="3" y="11" width="2" height="2" />
    <rect x="11" y="11" width="2" height="2" />
    <rect x="5" y="5" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

// Pixel-style power/toggle icon
export const PowerIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <rect x="7" y="1" width="2" height="6" />
    <path d="M4 4 L4 8 L4 12 L8 14 L12 12 L12 8 L12 4" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

// Pixel-style evolution/upgrade icon
export const EvolutionIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <rect x="7" y="1" width="2" height="2" />
    <rect x="5" y="3" width="2" height="2" />
    <rect x="9" y="3" width="2" height="2" />
    <rect x="3" y="5" width="2" height="2" />
    <rect x="11" y="5" width="2" height="2" />
    <rect x="7" y="7" width="2" height="2" />
    <rect x="7" y="10" width="2" height="2" />
    <rect x="7" y="13" width="2" height="2" />
  </svg>
);

// Pixel-style clock icon
export const ClockIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <rect x="3" y="1" width="10" height="1" />
    <rect x="2" y="2" width="1" height="2" />
    <rect x="13" y="2" width="1" height="2" />
    <rect x="1" y="4" width="1" height="8" />
    <rect x="14" y="4" width="1" height="8" />
    <rect x="2" y="12" width="1" height="2" />
    <rect x="13" y="12" width="1" height="2" />
    <rect x="3" y="14" width="10" height="1" />
    <rect x="7" y="4" width="2" height="4" />
    <rect x="9" y="6" width="3" height="2" />
  </svg>
);

// Pixel-style mute icon
export const MuteIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <rect x="2" y="5" width="3" height="6" />
    <path d="M5 5 L10 2 L10 14 L5 11" fill="currentColor" />
    <path d="M12 5 L15 8 L12 11" fill="none" stroke="currentColor" strokeWidth="1" />
    <path d="M1 1 L15 15" stroke="currentColor" strokeWidth="1" />
  </svg>
);

// Pixel-style trash/delete icon
export const TrashIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <rect x="3" y="2" width="10" height="2" />
    <rect x="6" y="1" width="4" height="1" />
    <rect x="4" y="4" width="8" height="10" fill="none" stroke="currentColor" strokeWidth="1" />
    <rect x="6" y="6" width="1" height="6" />
    <rect x="9" y="6" width="1" height="6" />
  </svg>
);

// Pixel-style refresh icon
export const RefreshIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <path d="M3 8 A5 5 0 1 1 8 13" fill="none" stroke="currentColor" strokeWidth="1" />
    <rect x="1" y="6" width="2" height="2" />
    <rect x="3" y="8" width="2" height="2" />
    <rect x="1" y="10" width="2" height="2" />
  </svg>
);

// Pixel-style system/broadcast icon
export const SystemIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <rect x="4" y="2" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1" />
    <rect x="6" y="4" width="4" height="4" />
    <rect x="7" y="10" width="2" height="2" />
    <rect x="4" y="12" width="8" height="2" />
  </svg>
);

// Pixel-style check icon
export const CheckIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <rect x="3" y="8" width="2" height="2" />
    <rect x="5" y="10" width="2" height="2" />
    <rect x="7" y="8" width="2" height="2" />
    <rect x="9" y="6" width="2" height="2" />
    <rect x="11" y="4" width="2" height="2" />
  </svg>
);

// Pixel-style X/close icon
export const CloseIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <rect x="3" y="3" width="2" height="2" />
    <rect x="5" y="5" width="2" height="2" />
    <rect x="7" y="7" width="2" height="2" />
    <rect x="9" y="9" width="2" height="2" />
    <rect x="11" y="11" width="2" height="2" />
    <rect x="11" y="3" width="2" height="2" />
    <rect x="9" y="5" width="2" height="2" />
    <rect x="5" y="9" width="2" height="2" />
    <rect x="3" y="11" width="2" height="2" />
  </svg>
);

// Pixel-style coin/money icon
export const CoinIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    <rect x="5" y="1" width="6" height="1" />
    <rect x="3" y="2" width="2" height="1" />
    <rect x="11" y="2" width="2" height="1" />
    <rect x="2" y="3" width="1" height="10" />
    <rect x="13" y="3" width="1" height="10" />
    <rect x="3" y="13" width="2" height="1" />
    <rect x="11" y="13" width="2" height="1" />
    <rect x="5" y="14" width="6" height="1" />
    <rect x="7" y="4" width="2" height="1" />
    <rect x="6" y="5" width="4" height="1" />
    <rect x="7" y="6" width="2" height="3" />
    <rect x="6" y="9" width="4" height="1" />
    <rect x="7" y="10" width="2" height="1" />
  </svg>
);
