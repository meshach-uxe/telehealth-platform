'use client';

/**
 * VoiceCommandListener Component
 * 
 * This component listens for voice commands on a specific page
 * and provides visual feedback when listening.
 */

import React, { useEffect } from 'react';
import { MicrophoneIcon } from '@heroicons/react/24/outline';
import { useVoiceNavigationContext } from './VoiceNavigationProvider';

interface VoiceCommandListenerProps {
  pageTitle?: string;
  pageDescription?: string;
  pageCommands?: Record<string, () => void>;
  autoAnnounce?: boolean;
  className?: string;
}

const VoiceCommandListener: React.FC<VoiceCommandListenerProps> = ({
  pageTitle,
  pageDescription,
  pageCommands = {},
  autoAnnounce = true,
  className = ''
}) => {
  const { 
    isVoiceEnabled, 
    isListening, 
    startListening,
    transcript,
    voiceNavigationSupported 
  } = useVoiceNavigationContext();

  // Announce the page when it loads if voice is enabled
  useEffect(() => {
    if (isVoiceEnabled && autoAnnounce && pageTitle) {
      const announcement = pageDescription 
        ? `${pageTitle}. ${pageDescription}` 
        : pageTitle;
      
      // Use a timeout to ensure the announcement happens after page transition
      const timer = setTimeout(() => {
        if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(announcement);
          window.speechSynthesis.speak(utterance);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isVoiceEnabled, autoAnnounce, pageTitle, pageDescription]);

  // If voice navigation is not supported or not enabled, don't render
  if (!voiceNavigationSupported || !isVoiceEnabled) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <button
        onClick={startListening}
        disabled={isListening}
        className={`flex items-center justify-center rounded-full p-4 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-600'} text-white shadow-lg`}
        aria-label="Listen for voice commands"
        title="Listen for voice commands"
      >
        <MicrophoneIcon className="h-6 w-6" />
      </button>
      
      {isListening && (
        <div className="absolute bottom-16 right-0 bg-white p-3 rounded-lg shadow-lg min-w-[200px]">
          <p className="text-sm font-medium">Listening...</p>
          {transcript && (
            <p className="text-xs text-gray-600 mt-1">I heard: "{transcript}"</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceCommandListener;