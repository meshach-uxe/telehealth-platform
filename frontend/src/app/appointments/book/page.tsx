'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon, 
  VideoCameraIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface Doctor {
  _id: string
  name: string
  specialization: string
  bio: string
  consultationFee: number
  availableSlots: {
    date: string
    times: string[]
  }[]
  location: string
  rating: number
  experience: number
  languages: string[]
}

interface TimeSlot {
  time: string
  available: boolean
}

const sampleDoctors: Doctor[] = [
  {
    _id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Obstetrics & Gynecology',
    bio: 'Specialized in maternal health with 15+ years of experience serving rural communities.',
    consultationFee: 75,
    availableSlots: [
      {
        date: '2024-01-20',
        times: ['09:00', '10:00', '11:00', '14:00', '15:00']
      },
      {
        date: '2024-01-21',
        times: ['09:00', '10:30', '13:00', '14:30', '16:00']
      }
    ],
    location: 'Rural Health Center, County A',
    rating: 4.8,
    experience: 15,
    languages: ['English', 'Spanish']
  },
  {
    _id: '2',
    name: 'Dr. Maria Rodriguez',
    specialization: 'Family Medicine',
    bio: 'Dedicated to providing comprehensive healthcare for women and families in underserved areas.',
    consultationFee: 60,
    availableSlots: [
      {
        date: '2024-01-20',
        times: ['08:00', '09:30', '11:00', '13:30', '15:00']
      },
      {
        date: '2024-01-22',
        times: ['10:00', '11:30', '14:00', '15:30']
      }
    ],
    location: 'Community Health Clinic, County B',
    rating: 4.9,
    experience: 12,
    languages: ['English', 'Spanish', 'Portuguese']
  },
  {
    _id: '3',
    name: 'Dr. Emily Chen',
    specialization: 'Mental Health',
    bio: 'Specializing in women\'s mental health, postpartum depression, and anxiety disorders.',
    consultationFee: 80,
    availableSlots: [
      {
        date: '2024-01-21',
        times: ['09:00', '10:00', '13:00', '14:00', '16:00']
      },
      {
        date: '2024-01-23',
        times: ['09:30', '11:00', '14:30', '16:00']
      }
    ],
    location: 'Telehealth Only',
    rating: 4.7,
    experience: 10,
    languages: ['English', 'Mandarin']
  }
]

const consultationTypes = [
  {
    id: 'video',
    name: 'Video Call',
    description: 'Face-to-face consultation via video',
    icon: VideoCameraIcon,
    available: true
  },
  {
    id: 'phone',
    name: 'Phone Call',
    description: 'Voice consultation via phone',
    icon: PhoneIcon,
    available: true
  },
  {
    id: 'chat',
    name: 'Text Chat',
    description: 'Text-based consultation',
    icon: ChatBubbleLeftRightIcon,
    available: true
  },
  {
    id: 'in-person',
    name: 'In-Person',
    description: 'Visit clinic in person',
    icon: MapPinIcon,
    available: false // Limited availability
  }
]

export default function BookAppointment() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedType, setSelectedType] = useState('video')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [])

  const getAvailableSlots = (date: string): TimeSlot[] => {
    if (!selectedDoctor) return []
    
    const daySlots = selectedDoctor.availableSlots.find(slot => slot.date === date)
    if (!daySlots) return []

    return daySlots.times.map(time => ({
      time,
      available: true // In real app, check against existing appointments
    }))
  }

  const getNextAvailableDates = (): string[] => {
    const dates: string[] = []
    const today = new Date()
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    
    return dates
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('http://localhost:4000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          doctor: selectedDoctor._id,
          date: selectedDate,
          time: selectedTime,
          reason: reason
        })
      })

      if (response.ok) {
        const appointment = await response.json()
        alert('Appointment booked successfully!')
        router.push('/dashboard/patient')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to book appointment')
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('Failed to book appointment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= step 
              ? 'bg-pink-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > step ? (
              <CheckCircleIcon className="h-5 w-5" />
            ) : (
              step
            )}
          </div>
          {step < 4 && (
            <div className={`w-16 h-1 mx-2 ${
              currentStep > step ? 'bg-pink-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderDoctorSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center">Choose Your Doctor</h2>
      <div className="grid gap-6">
        {sampleDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              selectedDoctor?._id === doctor._id
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedDoctor(doctor)}
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-gray-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-pink-600 font-medium">{doctor.specialization}</p>
                <p className="text-gray-600 mt-2">{doctor.bio}</p>
                
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {doctor.location}
                  </span>
                  <span className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                    ${doctor.consultationFee}
                  </span>
                  <span>{doctor.experience} years exp.</span>
                  <span>★ {doctor.rating}</span>
                </div>
                
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Languages: </span>
                  <span className="text-sm text-gray-700">{doctor.languages.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderConsultationType = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center">Consultation Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {consultationTypes.map((type) => {
          const Icon = type.icon
          return (
            <div
              key={type.id}
              className={`border rounded-lg p-6 cursor-pointer transition-all ${
                !type.available
                  ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  : selectedType === type.id
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => type.available && setSelectedType(type.id)}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-8 w-8 ${
                  selectedType === type.id ? 'text-pink-600' : 'text-gray-500'
                }`} />
                <div>
                  <h3 className="font-semibold text-gray-900">{type.name}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                  {!type.available && (
                    <p className="text-xs text-red-600 mt-1">Limited availability</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center">Select Date & Time</h2>
      
      {/* Date Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Date</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {getNextAvailableDates().map((date) => {
            const hasSlots = selectedDoctor?.availableSlots.some(slot => slot.date === date)
            return (
              <button
                key={date}
                onClick={() => hasSlots && setSelectedDate(date)}
                disabled={!hasSlots}
                className={`p-3 text-sm rounded-lg border transition-all ${
                  !hasSlots
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : selectedDate === date
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs">
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Time</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {getAvailableSlots(selectedDate).map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={`p-3 text-sm rounded-lg border transition-all ${
                  !slot.available
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : selectedTime === slot.time
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderReasonAndConfirm = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center">Appointment Details</h2>
      
      {/* Appointment Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Appointment Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Doctor:</span>
            <span className="font-medium">{selectedDoctor?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Specialization:</span>
            <span>{selectedDoctor?.specialization}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span>{formatDate(selectedDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span>{selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="capitalize">{selectedType.replace('-', ' ')}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span className="text-gray-600">Fee:</span>
            <span>${selectedDoctor?.consultationFee}</span>
          </div>
        </div>
      </div>

      {/* Reason for Visit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason for Visit *
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="Please describe your symptoms or reason for consultation..."
          required
        />
      </div>
    </div>
  )

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/dashboard/patient" className="text-pink-600 hover:text-pink-700 font-medium">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Book Appointment</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepIndicator()}

        <div className="bg-white rounded-lg shadow-sm p-8">
          {currentStep === 1 && renderDoctorSelection()}
          {currentStep === 2 && renderConsultationType()}
          {currentStep === 3 && renderDateTimeSelection()}
          {currentStep === 4 && renderReasonAndConfirm()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => {
                  if (currentStep === 1 && !selectedDoctor) {
                    alert('Please select a doctor')
                    return
                  }
                  if (currentStep === 3 && (!selectedDate || !selectedTime)) {
                    alert('Please select date and time')
                    return
                  }
                  setCurrentStep(currentStep + 1)
                }}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleBookAppointment}
                disabled={loading || !reason.trim()}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}