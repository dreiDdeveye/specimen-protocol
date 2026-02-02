import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0a0a0f',
          surface: '#12121a',
          border: '#1e1e2e',
          highlight: '#2a2a3e',
          green: '#00ff41',
          cyan: '#00d4ff',
          amber: '#ffb000',
          red: '#ff3366',
          purple: '#a855f7',
          dim: '#3a3a4a',
          text: '#e0e0e0',
          muted: '#6a6a7a',
        },
      },
      fontFamily: {
        pixel: ['var(--font-pixel)', 'monospace'],
        mono: ['var(--font-mono)', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'type': 'type 2s steps(20) infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.95' },
        },
        glow: {
          '0%': { filter: 'brightness(1) drop-shadow(0 0 2px currentColor)' },
          '100%': { filter: 'brightness(1.2) drop-shadow(0 0 8px currentColor)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        type: {
          '0%': { width: '0' },
          '50%': { width: '100%' },
          '100%': { width: '100%' },
        },
      },
      boxShadow: {
        'terminal': '0 0 20px rgba(0, 255, 65, 0.1), inset 0 0 60px rgba(0, 0, 0, 0.3)',
        'terminal-border': 'inset 0 0 0 1px rgba(0, 255, 65, 0.2)',
        'glow-green': '0 0 20px rgba(0, 255, 65, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-amber': '0 0 20px rgba(255, 176, 0, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
