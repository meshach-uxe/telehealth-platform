'use client';

/**
 * VoiceNavigationProvider Component
 * 
 * This component provides voice navigation context to the entire application.
 * It manages the global voice navigation state and provides methods for
 * enabling/disabling voice navigation and accessing voice features.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import useVoiceNavigation from '../hooks/useVoiceNavigation';
import { VoiceNavigationOptions } from '../utils/voiceNavigation';

interface VoiceNavigationContextType {
  isVoiceEnabled: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
  voiceNavigationSupported: boolean;
  toggleVoiceNavigation: () => void;
  startListening: () => void;
  announcePage: () => void;
  speakText: (text: string) => void;
}

interface VoiceNavigationProviderProps {
  children: ReactNode;
  options?: VoiceNavigationOptions;
}

// Create the context with a default value
const VoiceNavigationContext = createContext<VoiceNavigationContextType | undefined>(undefined);

// Provider component
export const VoiceNavigationProvider: React.FC<VoiceNavigationProviderProps> = ({ 
  children,
  options = {}
}) => {
  // Use the voice navigation hook with global settings
  const voiceNavigation = useVoiceNavigation({
    options,
    // Don't auto-announce at the global level
    autoAnnounce: false
  });

  return (
    <VoiceNavigationContext.Provider value={voiceNavigation}>
      {children}
    </VoiceNavigationContext.Provider>
  );
};

// Custom hook to use the voice navigation context
export const useVoiceNavigationContext = (): VoiceNavigationContextType => {
  const context = useContext(VoiceNavigationContext);
  
  if (context === undefined) {
    throw new Error('useVoiceNavigationContext must be used within a VoiceNavigationProvider');
  }
  
  return context;
};

export default VoiceNavigationProvider;