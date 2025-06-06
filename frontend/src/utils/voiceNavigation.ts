'use client';

/**
 * Voice Navigation Utility
 * 
 * This utility provides voice navigation features for the telehealth platform,
 * including text-to-speech, speech recognition, and voice command handling.
 */

// Types for voice navigation
export interface VoiceCommand {
  command: string;
  action: () => void;
  aliases?: string[];
}

export interface VoiceNavigationOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
};

/**
 * Speaks the provided text using the Web Speech API
 */
export const speak = (text: string, options: VoiceNavigationOptions = {}) => {
  if (!('speechSynthesis' in window)) {
    console.error('Text-to-speech not supported in this browser');
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set options
  utterance.lang = options.lang || 'en-US';
  utterance.rate = options.rate || 1;
  utterance.pitch = options.pitch || 1;
  utterance.volume = options.volume || 1;

  window.speechSynthesis.speak(utterance);
  return true;
};

/**
 * Announces a page or section for accessibility
 */
export const announcePageContent = (pageTitle: string, pageDescription?: string) => {
  const announcement = pageDescription 
    ? `${pageTitle}. ${pageDescription}` 
    : pageTitle;
  
  speak(announcement);
};

/**
 * Starts listening for voice commands
 */
export const startVoiceRecognition = (
  commands: VoiceCommand[],
  onListening?: () => void,
  onResult?: (transcript: string) => void,
  onError?: (error: any) => void
) => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.error('Speech recognition not supported in this browser');
    if (onError) onError('Speech recognition not supported');
    return null;
  }

  // Use the appropriate speech recognition API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    if (onListening) onListening();
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    
    if (onResult) onResult(transcript);
    
    // Check if the transcript matches any commands
    for (const cmd of commands) {
      if (
        transcript === cmd.command.toLowerCase() ||
        (cmd.aliases && cmd.aliases.some(alias => transcript === alias.toLowerCase()))
      ) {
        cmd.action();
        return;
      }
    }
    
    // If no command matched, announce that the command wasn't recognized
    speak("I didn't recognize that command. Please try again.");
  };

  recognition.onerror = (event) => {
    if (onError) onError(event.error);
  };

  recognition.start();
  return recognition;
};

/**
 * Stops the voice recognition
 */
export const stopVoiceRecognition = (recognition: any) => {
  if (recognition) {
    recognition.stop();
  }
};

/**
 * Creates common voice commands for navigation
 */
export const createCommonNavigationCommands = (router: any): VoiceCommand[] => {
  return [
    {
      command: 'go home',
      aliases: ['home page', 'main page'],
      action: () => {
        speak('Navigating to home page');
        router.push('/');
      }
    },
    {
      command: 'go to dashboard',
      aliases: ['open dashboard', 'show dashboard'],
      action: () => {
        speak('Navigating to dashboard');
        router.push('/dashboard/patient');
      }
    },
    {
      command: 'go to health education',
      aliases: ['open health education', 'show health resources'],
      action: () => {
        speak('Navigating to health education');
        router.push('/health-education');
      }
    },
    {
      command: 'go to appointments',
      aliases: ['open appointments', 'show appointments'],
      action: () => {
        speak('Navigating to appointments');
        router.push('/appointments');
      }
    },
    {
      command: 'go to doctors',
      aliases: ['find doctors', 'show doctors'],
      action: () => {
        speak('Navigating to doctors');
        router.push('/doctors');
      }
    },
    {
      command: 'go back',
      aliases: ['previous page', 'back'],
      action: () => {
        speak('Going back');
        router.back();
      }
    },
    {
      command: 'help',
      aliases: ['voice commands', 'what can I say'],
      action: () => {
        speak('Available commands include: go home, go to dashboard, go to health education, go to appointments, go to doctors, go back, and help.');
      }
    }
  ];
};

/**
 * Creates voice commands for specific page actions
 */
export const createPageSpecificCommands = (actions: Record<string, () => void>): VoiceCommand[] => {
  return Object.entries(actions).map(([command, action]) => ({
    command,
    action: () => {
      speak(`Executing: ${command}`);
      action();
    }
  }));
};

/**
 * Hook to check if speech synthesis and recognition are supported
 */
export const checkVoiceSupport = () => {
  // Check if code is running in browser environment
  const isBrowser = typeof window !== 'undefined';
  
  const speechSynthesisSupported = isBrowser && 'speechSynthesis' in window;
  const speechRecognitionSupported = isBrowser && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  
  return {
    speechSynthesisSupported,
    speechRecognitionSupported,
    voiceNavigationSupported: speechSynthesisSupported && speechRecognitionSupported
  };
};