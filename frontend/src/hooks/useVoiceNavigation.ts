'use client';

/**
 * useVoiceNavigation Hook
 * 
 * A custom React hook that provides voice navigation functionality
 * for components throughout the application.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  VoiceCommand,
  VoiceNavigationOptions,
  speak,
  announcePageContent,
  startVoiceRecognition,
  stopVoiceRecognition,
  createCommonNavigationCommands,
  createPageSpecificCommands,
  checkVoiceSupport
} from '../utils/voiceNavigation';

interface UseVoiceNavigationProps {
  pageTitle?: string;
  pageDescription?: string;
  pageCommands?: Record<string, () => void>;
  options?: VoiceNavigationOptions;
  autoAnnounce?: boolean;
}

const useVoiceNavigation = ({
  pageTitle,
  pageDescription,
  pageCommands = {},
  options = {},
  autoAnnounce = false
}: UseVoiceNavigationProps = {}) => {
  const router = useRouter();
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  
  // Check if voice features are supported
  const { voiceNavigationSupported } = checkVoiceSupport();

  // Combine common navigation commands with page-specific commands
  const getCommands = useCallback(() => {
    const commonCommands = createCommonNavigationCommands(router);
    const specificCommands = createPageSpecificCommands(pageCommands);
    
    return [...commonCommands, ...specificCommands];
  }, [router, pageCommands]);

  // Toggle voice navigation on/off
  const toggleVoiceNavigation = useCallback(() => {
    if (!voiceNavigationSupported) {
      setError('Voice navigation is not supported in this browser');
      return;
    }

    const newState = !isVoiceEnabled;
    setIsVoiceEnabled(newState);
    
    if (newState) {
      // Announce that voice navigation is enabled
      speak('Voice navigation enabled', options);
      
      // If page title is provided and autoAnnounce is true, announce the page
      if (pageTitle && autoAnnounce) {
        announcePageContent(pageTitle, pageDescription);
      }
    } else {
      // Stop any ongoing speech and recognition
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        stopVoiceRecognition(recognitionRef.current);
        recognitionRef.current = null;
      }
      setIsListening(false);
      speak('Voice navigation disabled', options);
    }
  }, [isVoiceEnabled, voiceNavigationSupported, pageTitle, pageDescription, options, autoAnnounce]);

  // Start listening for voice commands
  const startListening = useCallback(() => {
    if (!isVoiceEnabled || !voiceNavigationSupported) return;
    
    setIsListening(true);
    speak('Listening for commands', options);
    
    const commands = getCommands();
    
    recognitionRef.current = startVoiceRecognition(
      commands,
      () => setIsListening(true),
      (text) => setTranscript(text),
      (err) => {
        setError(err);
        setIsListening(false);
      }
    );
    
    // Auto-stop listening after 10 seconds if no command is detected
    setTimeout(() => {
      if (isListening && recognitionRef.current) {
        stopVoiceRecognition(recognitionRef.current);
        setIsListening(false);
      }
    }, 10000);
  }, [isVoiceEnabled, voiceNavigationSupported, getCommands, options, isListening]);

  // Announce the current page
  const announcePage = useCallback(() => {
    if (!isVoiceEnabled || !pageTitle) return;
    announcePageContent(pageTitle, pageDescription);
  }, [isVoiceEnabled, pageTitle, pageDescription]);

  // Speak text
  const speakText = useCallback((text: string) => {
    if (!isVoiceEnabled) return;
    speak(text, options);
  }, [isVoiceEnabled, options]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        stopVoiceRecognition(recognitionRef.current);
      }
    };
  }, []);

  // Auto-announce page on mount if enabled
  useEffect(() => {
    if (isVoiceEnabled && autoAnnounce && pageTitle) {
      announcePageContent(pageTitle, pageDescription);
    }
  }, [isVoiceEnabled, autoAnnounce, pageTitle, pageDescription]);

  return {
    isVoiceEnabled,
    isListening,
    transcript,
    error,
    voiceNavigationSupported,
    toggleVoiceNavigation,
    startListening,
    announcePage,
    speakText
  };
};

export default useVoiceNavigation;