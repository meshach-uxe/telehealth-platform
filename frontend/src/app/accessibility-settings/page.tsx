'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  SpeakerWaveIcon,
  LanguageIcon,
  UserGroupIcon,
  BookOpenIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import VoiceNavigationButton from '../../components/VoiceNavigationButton'
import VoiceCommandListener from '../../components/VoiceCommandListener'
import { useVoiceNavigationContext } from '../../components/VoiceNavigationProvider'

export default function AccessibilitySettings() {
  const { 
    isVoiceEnabled, 
    toggleVoiceNavigation, 
    speakText,
    isListening,
    startListening,
    stopListening
  } = useVoiceNavigationContext()

  // State for accessibility settings
  const [textSize, setTextSize] = useState('medium')
  const [contrast, setContrast] = useState('normal')
  const [readingSpeed, setReadingSpeed] = useState('normal')
  const [autoAnnounce, setAutoAnnounce] = useState(true)
  const [preferredLanguage, setPreferredLanguage] = useState('english')
  const [simplifiedContent, setSimplifiedContent] = useState(false)
  const [showSaveMessage, setShowSaveMessage] = useState(false)

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setTextSize(settings.textSize || 'medium')
      setContrast(settings.contrast || 'normal')
      setReadingSpeed(settings.readingSpeed || 'normal')
      setAutoAnnounce(settings.autoAnnounce !== undefined ? settings.autoAnnounce : true)
      setPreferredLanguage(settings.preferredLanguage || 'english')
      setSimplifiedContent(settings.simplifiedContent || false)
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      textSize,
      contrast,
      readingSpeed,
      autoAnnounce,
      preferredLanguage,
      simplifiedContent
    }
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings))
    setShowSaveMessage(true)
    speakText('Your accessibility settings have been saved')
    setTimeout(() => setShowSaveMessage(false), 3000)
  }

  // Reset settings to defaults
  const resetSettings = () => {
    setTextSize('medium')
    setContrast('normal')
    setReadingSpeed('normal')
    setAutoAnnounce(true)
    setPreferredLanguage('english')
    setSimplifiedContent(false)
    speakText('Settings have been reset to defaults')
  }

  // Define page-specific voice commands
  const pageCommands = {
    'increase text size': () => {
      if (textSize === 'small') setTextSize('medium')
      else if (textSize === 'medium') setTextSize('large')
      else if (textSize === 'large') setTextSize('x-large')
      speakText(`Text size set to ${textSize}`)
    },
    'decrease text size': () => {
      if (textSize === 'x-large') setTextSize('large')
      else if (textSize === 'large') setTextSize('medium')
      else if (textSize === 'medium') setTextSize('small')
      speakText(`Text size set to ${textSize}`)
    },
    'set high contrast': () => {
      setContrast('high')
      speakText('High contrast mode enabled')
    },
    'set normal contrast': () => {
      setContrast('normal')
      speakText('Normal contrast mode enabled')
    },
    'increase reading speed': () => {
      if (readingSpeed === 'slow') setReadingSpeed('normal')
      else if (readingSpeed === 'normal') setReadingSpeed('fast')
      speakText(`Reading speed set to ${readingSpeed}`)
    },
    'decrease reading speed': () => {
      if (readingSpeed === 'fast') setReadingSpeed('normal')
      else if (readingSpeed === 'normal') setReadingSpeed('slow')
      speakText(`Reading speed set to ${readingSpeed}`)
    },
    'toggle auto announce': () => {
      setAutoAnnounce(!autoAnnounce)
      speakText(`Auto announce ${!autoAnnounce ? 'enabled' : 'disabled'}`)
    },
    'toggle simplified content': () => {
      setSimplifiedContent(!simplifiedContent)
      speakText(`Simplified content ${!simplifiedContent ? 'enabled' : 'disabled'}`)
    },
    'save settings': () => {
      saveSettings()
    },
    'reset settings': () => {
      resetSettings()
    }
  }

  return (
    <div className={`min-h-screen ${contrast === 'high' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${contrast === 'high' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/" 
                className={`${contrast === 'high' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium`}
              >
                ← Back to Home
              </Link>
              <h1 className={`text-3xl font-bold mt-2 ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>
                Accessibility Settings
              </h1>
              <p className={contrast === 'high' ? 'text-gray-300 mt-1' : 'text-gray-600 mt-1'}>
                Customize your experience
              </p>
            </div>
            <div>
              <VoiceNavigationButton 
                size="md" 
                showLabel={true} 
                highContrast={contrast === 'high'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`${contrast === 'high' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm p-6 border`}>
          {/* Text Size */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 flex items-center ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>
              <AdjustmentsHorizontalIcon className="h-6 w-6 mr-2" />
              Text Size
            </h2>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setTextSize('small')} 
                className={`px-4 py-2 rounded-lg ${textSize === 'small' 
                  ? (contrast === 'high' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                  : (contrast === 'high' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800')}`}
              >
                Small
              </button>
              <button 
                onClick={() => setTextSize('medium')} 
                className={`px-4 py-2 rounded-lg ${textSize === 'medium' 
                  ? (contrast === 'high' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                  : (contrast === 'high' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800')}`}
              >
                Medium
              </button>
              <button 
                onClick={() => setTextSize('large')} 
                className={`px-4 py-2 rounded-lg ${textSize === 'large' 
                  ? (contrast === 'high' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                  : (contrast === 'high' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800')}`}
              >
                Large
              </button>
              <button 
                onClick={() => setTextSize('x-large')} 
                className={`px-4 py-2 rounded-lg ${textSize === 'x-large' 
                  ? (contrast === 'high' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                  : (contrast === 'high' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800')}`}
              >
                Extra Large
              </button>
            </div>
            <p className={`mt-2 text-sm ${contrast === 'high' ? 'text-gray-400' : 'text-gray-500'}`}>
              Sample text with current size: 
              <span className={`font-medium ${contrast === 'high' ? 'text-white' : 'text-gray-900'} ${textSize === 'small' ? 'text-sm' : textSize === 'medium' ? 'text-base' : textSize === 'large' ? 'text-lg' : 'text-xl'}`}>
                This is how your text will appear throughout the application.
              </span>
            </p>
          </div>

          {/* Contrast */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 flex items-center ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>
              <AdjustmentsHorizontalIcon className="h-6 w-6 mr-2" />
              Contrast
            </h2>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setContrast('normal')} 
                className={`px-4 py-2 rounded-lg ${contrast === 'normal' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-800 text-gray-300'}`}
              >
                Normal Contrast
              </button>
              <button 
                onClick={() => setContrast('high')} 
                className={`px-4 py-2 rounded-lg ${contrast === 'high' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800'}`}
              >
                High Contrast
              </button>
            </div>
          </div>

          {/* Voice Navigation */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 flex items-center ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>
              <SpeakerWaveIcon className="h-6 w-6 mr-2" />
              Voice Navigation
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>Enable Voice Navigation</p>
                  <p className={`text-sm ${contrast === 'high' ? 'text-gray-400' : 'text-gray-500'}`}>Allow navigation using voice commands</p>
                </div>
                <button 
                  onClick={toggleVoiceNavigation}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${isVoiceEnabled ? 'bg-blue-600' : contrast === 'high' ? 'bg-gray-700' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full ${isVoiceEnabled ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'} transition`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>Auto-Announce Pages</p>
                  <p className={`text-sm ${contrast === 'high' ? 'text-gray-400' : 'text-gray-500'}`}>Automatically announce page content when loaded</p>
                </div>
                <button 
                  onClick={() => setAutoAnnounce(!autoAnnounce)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${autoAnnounce ? 'bg-blue-600' : contrast === 'high' ? 'bg-gray-700' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full ${autoAnnounce ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'} transition`} />
                </button>
              </div>

              <div>
                <p className={`font-medium mb-2 ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>Reading Speed</p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setReadingSpeed('slow')} 
                    className={`px-4 py-2 rounded-lg ${readingSpeed === 'slow' 
                      ? (contrast === 'high' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                      : (contrast === 'high' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800')}`}
                  >
                    Slow
                  </button>
                  <button 
                    onClick={() => setReadingSpeed('normal')} 
                    className={`px-4 py-2 rounded-lg ${readingSpeed === 'normal' 
                      ? (contrast === 'high' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                      : (contrast === 'high' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800')}`}
                  >
                    Normal
                  </button>
                  <button 
                    onClick={() => setReadingSpeed('fast')} 
                    className={`px-4 py-2 rounded-lg ${readingSpeed === 'fast' 
                      ? (contrast === 'high' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                      : (contrast === 'high' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800')}`}
                  >
                    Fast
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 flex items-center ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>
              <LanguageIcon className="h-6 w-6 mr-2" />
              Language
            </h2>
            <div>
              <p className={`font-medium mb-2 ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>Preferred Language</p>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setPreferredLanguage('english')} 
                  className={`px-4 py-2 rounded-lg ${preferredLanguage === 'english' 
                    ? (contrast === 'high' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                    : (contrast === 'high' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800')}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setPreferredLanguage('spanish')} 
                  className={`px-4 py-2 rounded-lg ${preferredLanguage === 'spanish' 
                    ? (contrast === 'high' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                    : (contrast === 'high' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800')}`}
                >
                  Spanish
                </button>
                <button 
                  onClick={() => setPreferredLanguage('french')} 
                  className={`px-4 py-2 rounded-lg ${preferredLanguage === 'french' 
                    ? (contrast === 'high' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                    : (contrast === 'high' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800')}`}
                >
                  French
                </button>
              </div>
            </div>
          </div>

          {/* Content Simplification */}
          <div className="mb-8">
            <h2 className={`text-xl font-semibold mb-4 flex items-center ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>
              <UserGroupIcon className="h-6 w-6 mr-2" />
              Content Simplification
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>Simplified Content</p>
                <p className={`text-sm ${contrast === 'high' ? 'text-gray-400' : 'text-gray-500'}`}>Use simpler language and explanations</p>
              </div>
              <button 
                onClick={() => setSimplifiedContent(!simplifiedContent)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${simplifiedContent ? 'bg-blue-600' : contrast === 'high' ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full ${simplifiedContent ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'} transition`} />
              </button>
            </div>
          </div>

          {/* Save and Reset Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button 
              onClick={saveSettings}
              className={`px-6 py-2 rounded-lg flex items-center ${contrast === 'high' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {showSaveMessage ? (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
            <button 
              onClick={resetSettings}
              className={`px-6 py-2 rounded-lg flex items-center ${contrast === 'high' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Voice Commands Help */}
        <div className={`mt-8 ${contrast === 'high' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm p-6 border`}>
          <h2 className={`text-xl font-semibold mb-4 ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>
            Available Voice Commands
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className={`font-medium mb-2 ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>Text Size</h3>
              <ul className={`list-disc pl-5 ${contrast === 'high' ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>"Increase text size"</li>
                <li>"Decrease text size"</li>
              </ul>
            </div>
            <div>
              <h3 className={`font-medium mb-2 ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>Contrast</h3>
              <ul className={`list-disc pl-5 ${contrast === 'high' ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>"Set high contrast"</li>
                <li>"Set normal contrast"</li>
              </ul>
            </div>
            <div>
              <h3 className={`font-medium mb-2 ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>Reading Speed</h3>
              <ul className={`list-disc pl-5 ${contrast === 'high' ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>"Increase reading speed"</li>
                <li>"Decrease reading speed"</li>
              </ul>
            </div>
            <div>
              <h3 className={`font-medium mb-2 ${contrast === 'high' ? 'text-white' : 'text-gray-900'}`}>Other Commands</h3>
              <ul className={`list-disc pl-5 ${contrast === 'high' ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>"Toggle auto announce"</li>
                <li>"Toggle simplified content"</li>
                <li>"Save settings"</li>
                <li>"Reset settings"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Command Listener */}
      <VoiceCommandListener 
        pageTitle="Accessibility Settings"
        pageDescription="Customize your accessibility preferences including text size, contrast, voice navigation, and language settings."
        pageCommands={pageCommands}
        autoAnnounce={autoAnnounce}
      />
    </div>
  )
}