'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Types
interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  publicKey: string | null;
  connect: () => Promise<boolean>;
  disconnect: () => void;
}

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toString: () => string };
  isConnected?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: () => void) => void;
  off: (event: string, callback: () => void) => void;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
    phantom?: { solana?: PhantomProvider };
  }
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  // Get Phantom provider
  const getProvider = useCallback((): PhantomProvider | null => {
    if (typeof window === 'undefined') return null;
    
    const provider = window.phantom?.solana || window.solana;
    if (provider?.isPhantom) {
      return provider;
    }
    return null;
  }, []);

  // Connect wallet
  const connect = useCallback(async (): Promise<boolean> => {
    const provider = getProvider();
    
    if (!provider) {
      window.open('https://phantom.app/', '_blank');
      return false;
    }

    try {
      setConnecting(true);
      const response = await provider.connect();
      const address = response.publicKey.toString();
      
      setPublicKey(address);
      setConnected(true);
      
      return true;
    } catch (err) {
      console.error('Error connecting wallet:', err);
      return false;
    } finally {
      setConnecting(false);
    }
  }, [getProvider]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    const provider = getProvider();
    if (provider) {
      provider.disconnect();
    }
    setConnected(false);
    setPublicKey(null);
  }, [getProvider]);

  // Auto-connect if previously connected
  useEffect(() => {
    const provider = getProvider();
    if (provider?.isConnected && provider.publicKey) {
      const address = provider.publicKey.toString();
      setPublicKey(address);
      setConnected(true);
    }
  }, [getProvider]);

  // Listen for account changes
  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;

    const handleAccountChanged = () => {
      if (provider.publicKey) {
        const address = provider.publicKey.toString();
        setPublicKey(address);
      } else {
        disconnect();
      }
    };

    provider.on('accountChanged', handleAccountChanged);
    return () => {
      provider.off('accountChanged', handleAccountChanged);
    };
  }, [getProvider, disconnect]);

  return (
    <WalletContext.Provider
      value={{
        connected,
        connecting,
        publicKey,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};