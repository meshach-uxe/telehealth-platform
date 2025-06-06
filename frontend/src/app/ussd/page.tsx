'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { DevicePhoneMobileIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface USSDSession {
  step: number
  data: Record<string, any>
  history: string[]
}

// Define API URL with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
console.log('Using API URL:', API_URL);

export default function USSDSimulator() {
  const [currentScreen, setCurrentScreen] = useState('main')
  const [input, setInput] = useState('')
  const [session, setSession] = useState<USSDSession>({
    step: 0,
    data: {},
    history: []
  })
  const [displayText, setDisplayText] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('+1234567890') // Default phone number
  const [ussdText, setUssdText] = useState('') // Current USSD text input sequence
  const [isConnected, setIsConnected] = useState(true) // Connection status
  const [isLoading, setIsLoading] = useState(false) // Loading state
  const [apiStatus, setApiStatus] = useState<string>('Checking...');

  // Check API connectivity on component mount
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await axios.get(`${API_URL}/health`);
        if (response.data && response.data.status === 'ok') {
          setApiStatus('Connected');
          setIsConnected(true);
        } else {
          setApiStatus('Error: Unexpected response');
          setIsConnected(false);
        }
      } catch (error) {
        console.error('API Health Check Error:', error);
        setApiStatus(`Error: ${error.message || 'Unknown error'}`);
        setIsConnected(false);
      }
    };
    
    checkApiConnection();
  }, []);

  // Generate a session ID on component mount
  useEffect(() => {
    setSessionId(`sim-${Date.now()}-${Math.floor(Math.random() * 1000)}`)
  }, [])

  // Screens for offline fallback
  const screens = {
    main: {
      title: 'TeleHealth USSD',
      content: `Welcome to TeleHealth Platform

1. Book Appointment
2. Health Tips
3. Emergency Contact
4. Check Appointments
5. Register New User

0. Exit`,
      options: ['1', '2', '3', '4', '5', '0']
    },
    book_appointment: {
      title: 'Book Appointment',
      content: `Book Appointment

Select Doctor Specialization:

1. General Medicine
2. Gynecology
3. Obstetrics
4. Pediatrics
5. Family Medicine

0. Back to Main Menu`,
      options: ['1', '2', '3', '4', '5', '0']
    },
    health_tips: {
      title: 'Health Tips',
      content: `Daily Health Tips

1. Maternal Health
2. Nutrition
3. Mental Wellness
4. Preventive Care
5. Emergency Signs

0. Back to Main Menu`,
      options: ['1', '2', '3', '4', '5', '0']
    },
    emergency: {
      title: 'Emergency Contact',
      content: `Emergency Contacts

24/7 Emergency Hotline:
+1-800-HEALTH

Local Emergency:
911

Women's Health Crisis:
+1-800-WOMEN

Press any key to continue
0. Back to Main Menu`,
      options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    },
    check_appointments: {
      title: 'My Appointments',
      content: `Your Appointments

Upcoming:
1. Dr. Smith - Jan 15, 2:00 PM
2. Dr. Johnson - Jan 20, 10:00 AM

No other appointments

Press 1 or 2 for details
0. Back to Main Menu`,
      options: ['1', '2', '0']
    },
    register: {
      title: 'Register',
      content: `New User Registration

To complete registration, please:
1. Visit our website
2. Call +1-800-HEALTH
3. Visit nearest clinic

Registration requires:
- Full Name
- Phone Number
- Location
- Emergency Contact

0. Back to Main Menu`,
      options: ['0', '1', '2', '3']
    },
    maternal_health: {
      title: 'Maternal Health',
      content: `Maternal Health Tips

• Take prenatal vitamins daily
• Attend all prenatal checkups
• Eat nutritious foods
• Stay hydrated
• Get adequate rest
• Avoid alcohol & smoking

For more info, call:
+1-800-HEALTH

0. Back to Health Tips`,
      options: ['0']
    },
    nutrition: {
      title: 'Nutrition Tips',
      content: `Nutrition Guidelines

• Eat 5 servings of fruits/vegetables daily
• Choose whole grains
• Include lean proteins
• Limit processed foods
• Drink 8 glasses of water
• Take iron supplements if needed

0. Back to Health Tips`,
      options: ['0']
    },
    appointment_details: {
      title: 'Appointment Details',
      content: `Dr. Smith - General Medicine

Date: January 15, 2024
Time: 2:00 PM - 2:30 PM
Type: Video Consultation
Status: Confirmed

To reschedule, call:
+1-800-HEALTH

0. Back to Appointments`,
      options: ['0']
    }
  }

  // Handle USSD input via API
  const handleUssdRequest = async (input: string) => {
    setIsLoading(true);
    
    try {
      // Construct new USSD text based on input
      let newUssdText = '';
      
      if (input === '#') {
        // Back navigation - remove last input
        const parts = ussdText.split('*');
        parts.pop();
        newUssdText = parts.join('*');
      } else if (ussdText === '') {
        // Initial input
        newUssdText = input;
      } else {
        // Add to existing input sequence
        newUssdText = `${ussdText}*${input}`;
      }
      
      setUssdText(newUssdText);
      
      // If session appears to be lost, reset it
      if (sessionId === '') {
        setSessionId(`sim-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
      }
      
      console.log('Making API request to:', `${API_URL}/ussd/session`);
      console.log('Request payload:', {
        sessionId,
        phoneNumber,
        text: newUssdText,
        serviceCode: '*123#'
      });
      
      // Call the USSD API
      const response = await axios.post(`${API_URL}/ussd/session`, {
        sessionId,
        phoneNumber,
        text: newUssdText,
        serviceCode: '*123#'
      });
      
      console.log('API response:', response.data);
      
      // Process response - handle different response formats
      let responseText = '';
      
      // Check if response is directly a string or in response property
      if (typeof response.data === 'string') {
        responseText = response.data;
      } else if (response.data && response.data.response) {
        responseText = response.data.response;
      } else if (response.data) {
        // Try to convert the response to a string if possible
        responseText = JSON.stringify(response.data);
      }
      
      console.log('Processed response text:', responseText);
      
      // Check if session ended (response starts with END)
      if (responseText && responseText.startsWith('END')) {
        setDisplayText(responseText.substring(4)); // Remove 'END ' prefix
        setTimeout(() => {
          setUssdText('');
          setDisplayText('');
        }, 5000);
      } else if (responseText && responseText.startsWith('CON')) {
        // Continuing session (response starts with CON)
        setDisplayText(responseText.substring(4)); // Remove 'CON ' prefix
      } else {
        // Handle response without prefix
        setDisplayText(responseText);
      }
      
      setIsConnected(true);
    } catch (error) {
      console.error('USSD API Error:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
      
      // Check if it might be a session issue
      if (error.response && (error.response.status === 400 || error.response.data?.message?.includes('session'))) {
        // Generate a new session ID and retry
        const newSessionId = `sim-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        setSessionId(newSessionId);
        setUssdText('');
        setDisplayText('Session reset. Please try again.');
        setTimeout(() => {
          setDisplayText('Welcome to TeleHealth Platform\n\n1. Book Appointment\n2. Health Tips\n3. Emergency Contact\n4. Check Appointments\n5. Register New User\n\n0. Exit');
        }, 2000);
      } else {
        setIsConnected(false);
        // Fallback to local handling
        handleLocalInput(input);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback function for local handling when API is unavailable
  const handleLocalInput = (value: string) => {
    const screen = screens[currentScreen as keyof typeof screens];
    
    if (!screen.options.includes(value)) {
      setDisplayText('Invalid option. Please try again.');
      setTimeout(() => setDisplayText(''), 2000);
      return;
    }

    // Handle navigation based on current screen and input
    switch (currentScreen) {
      case 'main':
        switch (value) {
          case '1':
            setCurrentScreen('book_appointment');
            break;
          case '2':
            setCurrentScreen('health_tips');
            break;
          case '3':
            setCurrentScreen('emergency');
            break;
          case '4':
            setCurrentScreen('check_appointments');
            break;
          case '5':
            setCurrentScreen('register');
            break;
          case '0':
            setDisplayText('Thank you for using TeleHealth USSD. Goodbye!');
            setTimeout(() => {
              setCurrentScreen('main');
              setDisplayText('');
            }, 3000);
            break;
        }
        break;

      case 'health_tips':
        switch (value) {
          case '1':
            setCurrentScreen('maternal_health');
            break;
          case '2':
            setCurrentScreen('nutrition');
            break;
          case '3':
          case '4':
          case '5':
            setDisplayText('Content coming soon. Call +1-800-HEALTH for more info.');
            setTimeout(() => setDisplayText(''), 3000);
            break;
          case '0':
            setCurrentScreen('main');
            break;
        }
        break;

      case 'check_appointments':
        switch (value) {
          case '1':
            setCurrentScreen('appointment_details');
            break;
          case '2':
            setDisplayText('Dr. Johnson - Gynecology\nJan 20, 10:00 AM\nVideo Call\nConfirmed');
            setTimeout(() => setDisplayText(''), 4000);
            break;
          case '0':
            setCurrentScreen('main');
            break;
        }
        break;

      case 'book_appointment':
        if (value === '0') {
          setCurrentScreen('main');
        } else {
          setDisplayText('Booking appointment...\nPlease call +1-800-HEALTH\nto complete booking.');
          setTimeout(() => {
            setCurrentScreen('main');
            setDisplayText('');
          }, 4000);
        }
        break;

      default:
        if (value === '0') {
          // Navigate back based on current screen
          if (currentScreen === 'maternal_health' || currentScreen === 'nutrition') {
            setCurrentScreen('health_tips');
          } else if (currentScreen === 'appointment_details') {
            setCurrentScreen('check_appointments');
          } else {
            setCurrentScreen('main');
          }
        }
        break;
    }

    setInput('');
  };

  // Main input handler that tries API first, falls back to local
  const handleInput = (value: string) => {
    if (isConnected) {
      handleUssdRequest(value);
    } else {
      handleLocalInput(value);
    }
    setInput('');
  };

  // Get current screen data for fallback display
  const currentScreenData = screens[currentScreen as keyof typeof screens] || screens.main;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-black rounded-t-lg p-4 flex justify-between items-center">
          <h2 className="text-white font-semibold">USSD Session</h2>
          <div className="flex space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
        </div>
        
        <div className="bg-green-800 p-6 min-h-[300px] flex flex-col justify-between">
          <div className="text-white whitespace-pre-line">
            {displayText || (currentScreen === 'main' ? screens.main.content : screens[currentScreen as keyof typeof screens].content)}
          </div>
          
          {isLoading && (
            <div className="text-white text-center mt-4">
              Processing...
            </div>
          )}
        </div>
        
        <div className="bg-gray-800 p-4 rounded-b-lg">
          <div className="text-center text-green-500 mb-2">
            {isConnected ? `Connected to USSD Service` : `Offline Mode - API Status: ${apiStatus}`}
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
              <button
                key={key}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md"
                onClick={() => handleInput(key)}
              >
                {key}
              </button>
            ))}
          </div>
          
          <div className="text-xs text-center text-gray-400">
            Session ID: {sessionId || 'None'}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Link href="/" className="text-blue-500 hover:text-blue-400 flex items-center">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}