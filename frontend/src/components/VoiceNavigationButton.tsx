'use client';

/**
 * VoiceNavigationButton Component
 * 
 * A reusable button component for toggling voice navigation
 * throughout the application.
 */

import React from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import { useVoiceNavigationContext } from './VoiceNavigationProvider';

interface VoiceNavigationButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  disabledLabel?: string;
}

const VoiceNavigationButton: React.FC<VoiceNavigationButtonProps> = ({
  className = '',
  size = 'md',
  showLabel = false,
  label = 'Enable Voice Navigation',
  disabledLabel = 'Disable Voice Navigation'
}) => {
  const { 
    isVoiceEnabled, 
    toggleVoiceNavigation, 
    voiceNavigationSupported 
  } = useVoiceNavigationContext();

  // Determine icon size based on the size prop
  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }[size];

  // Determine button size based on the size prop
  const buttonSize = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  }[size];

  // If voice navigation is not supported, don't render the button
  if (!voiceNavigationSupported) {
    return null;
  }

  return (
    <button
      onClick={toggleVoiceNavigation}
      className={`flex items-center gap-2 rounded-full ${buttonSize} ${isVoiceEnabled ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition-colors ${className}`}
      aria-label={isVoiceEnabled ? disabledLabel : label}
      title={isVoiceEnabled ? disabledLabel : label}
    >
      {isVoiceEnabled ? (
        <SpeakerWaveIcon className={iconSize} />
      ) : (
        <SpeakerXMarkIcon className={iconSize} />
      )}
      {showLabel && (
        <span className={`${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
          {isVoiceEnabled ? disabledLabel : label}
        </span>
      )}
    </button>
  );
};

export default VoiceNavigationButton;