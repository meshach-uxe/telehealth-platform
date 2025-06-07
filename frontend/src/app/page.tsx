'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  HeartIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  SpeakerWaveIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'
import VoiceNavigationButton from '../components/VoiceNavigationButton'
import VoiceCommandListener from '../components/VoiceCommandListener'
import { useVoiceNavigationContext } from '../components/VoiceNavigationProvider'

export default function Home() {
  const { isVoiceEnabled } = useVoiceNavigationContext()

  // Define page-specific voice commands
  const pageCommands = {
    'register as patient': () => {
      window.location.href = '/auth/register?role=patient'
    },
    'register as doctor': () => {
      window.location.href = '/auth/register?role=doctor'
    },
    'login': () => {
      window.location.href = '/auth/login'
    },
    'show features': () => {
      document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })
    },
    'show ussd': () => {
      document.getElementById('ussd-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const features = [
    {
      icon: PhoneIcon,
      title: 'Video Consultations',
      description: 'Connect with qualified doctors through secure video calls'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'SMS Integration',
      description: 'Receive appointment reminders and health tips via SMS'
    },
    {
      icon: BookOpenIcon,
      title: 'Health Education',
      description: 'Access educational content on maternal and reproductive health'
    },
    {
      icon: SpeakerWaveIcon,
      title: 'Voice Navigation',
      description: 'Navigate the platform using voice commands for accessibility'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'USSD Support',
      description: 'Access basic features through USSD codes on any phone'
    },
    {
      icon: HeartIcon,
      title: 'Specialized Care',
      description: 'Healthcare services designed specifically for rural women'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <HeartIcon className="h-8 w-8 text-pink-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">TeleHealth</h1>
            </div>
            <div className="flex items-center space-x-4">
              <VoiceNavigationButton 
                size="md" 
                showLabel={false} 
              />
              <Link
                href="/auth/login"
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="border border-pink-600 text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-50 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Healthcare for Rural Women
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Accessible, affordable, and culturally sensitive healthcare services 
            designed specifically for women in rural communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?role=patient"
              className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started as Patient
            </Link>
            <Link
              href="/auth/register?role=doctor"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-colors"
            >
              Join as Doctor
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Designed for Accessibility
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform breaks down barriers to healthcare access with innovative 
              features designed for rural communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <IconComponent className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* USSD Demo Section */}
      <section id="ussd-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Access via USSD
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No smartphone? No problem. Access basic features using USSD codes on any mobile phone.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="text-center">
              <DevicePhoneMobileIcon className="h-16 w-16 text-pink-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-4">Try USSD Demo</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
                <div>*123*1# - Book Appointment</div>
                <div>*123*2# - Health Tips</div>
                <div>*123*3# - Emergency Contact</div>
                <div>*123*4# - Check Appointments</div>
              </div>
              <Link 
                href="/ussd"
                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors inline-block text-center"
              >
                Simulate USSD
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <HeartIcon className="h-8 w-8 text-pink-600 mr-3" />
                <h5 className="text-xl font-bold">TeleHealth</h5>
              </div>
              <p className="text-gray-400">
                Bridging the healthcare gap for rural women through accessible technology.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Quick Links</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/services" className="hover:text-white">Services</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Emergency Contact</h6>
              <p className="text-gray-400 mb-2">24/7 Emergency Hotline:</p>
              <p className="text-pink-400 font-semibold text-lg">+1-800-HEALTH</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TeleHealth Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Voice Command Listener */}
      <VoiceCommandListener 
        pageTitle="Telehealth Platform Home Page"
        pageDescription="Welcome to the Telehealth Platform for Rural Women. Use voice commands to navigate."
        pageCommands={pageCommands}
        autoAnnounce={true}
      />
    </div>
  )
}
