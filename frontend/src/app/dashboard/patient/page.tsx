'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { 
  CalendarIcon, 
  ClockIcon, 
  UserCircleIcon,
  VideoCameraIcon,
  PhoneIcon,
  BookOpenIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline'

interface User {
  _id: string
  name: string
  email: string
  role: string
  phone: string
  location: string
}

interface Appointment {
  _id: string
  doctor: {
    _id: string
    name: string
    specialization: string
  }
  date: string
  startTime: string
  endTime: string
  status: string
  consultationType: string
  reason: string
}

interface HealthContent {
  _id: string
  title: string
  description: string
  category: string
  mediaType: string
  mediaUrl?: string
  views: number
  createdAt: string
}

export default function PatientDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [healthContent, setHealthContent] = useState<HealthContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (!token || !storedUser) {
      router.push('/auth/login')
      return
    }

    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.role !== 'patient') {
      router.push('/dashboard/doctor')
      return
    }

    setUser(parsedUser)

    // Fetch user data, appointments, and health content
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': token
          }
        }

        // Fetch user profile
        const userRes = await axios.get(`http://localhost:4000/api/users/me`, config)
        setUser(userRes.data)

        // Fetch appointments
        const appointmentsRes = await axios.get(
          `http://localhost:4000/api/appointments/patient`,
          config
        )
        setAppointments(appointmentsRes.data)

        // Fetch health content
        const healthContentRes = await axios.get(
          `http://localhost:4000/api/health-content?limit=3`,
          config
        )
        setHealthContent(healthContentRes.data)

        setLoading(false)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data')
        setLoading(false)
        
        // If token is invalid, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/auth/login')
        }
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getConsultationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <VideoCameraIcon className="h-5 w-5" />
      case 'phone':
        return <PhoneIcon className="h-5 w-5" />
      default:
        return <UserCircleIcon className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* User Profile Summary */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <div className="flex items-center">
            <div className="bg-pink-100 rounded-full p-3">
              <UserCircleIcon className="h-8 w-8 text-pink-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500">{user?.email} • {user?.phone}</p>
              <p className="text-gray-500">{user?.location}</p>
            </div>
            <div className="ml-auto">
              <button 
                onClick={() => router.push('/dashboard/patient/profile')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Upcoming Appointments */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
              <button 
                onClick={() => router.push('/dashboard/patient/appointments')}
                className="text-sm text-pink-600 hover:text-pink-800"
              >
                View All
              </button>
            </div>
            
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No upcoming appointments</p>
                <button 
                  onClick={() => router.push('/dashboard/patient/book-appointment')}
                  className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                  Book an Appointment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment._id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{appointment.doctor.name}</h3>
                        <p className="text-sm text-gray-500">{appointment.doctor.specialization}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{formatDate(appointment.date)}</span>
                      <span className="mx-2">•</span>
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{appointment.startTime} - {appointment.endTime}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        {getConsultationIcon(appointment.consultationType)}
                        <span className="ml-1 capitalize">{appointment.consultationType} Consultation</span>
                      </div>
                      <button 
                        onClick={() => router.push(`/dashboard/patient/appointments/${appointment._id}`)}
                        className="text-sm text-pink-600 hover:text-pink-800"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => router.push('/dashboard/patient/book-appointment')}
                  className="w-full mt-4 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                  Book New Appointment
                </button>
              </div>
            )}
          </div>

          {/* Health Education */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Health Education</h2>
              <button 
                onClick={() => router.push('/dashboard/patient/health-content')}
                className="text-sm text-pink-600 hover:text-pink-800"
              >
                View All
              </button>
            </div>
            
            {healthContent.length === 0 ? (
              <div className="text-center py-8">
                <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No health content available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {healthContent.map((content) => (
                  <div key={content._id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <h3 className="font-medium">{content.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{content.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {content.category}
                      </span>
                      <button 
                        onClick={() => router.push(`/dashboard/patient/health-content/${content._id}`)}
                        className="text-sm text-pink-600 hover:text-pink-800"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => router.push('/dashboard/patient/book-appointment')}
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
            >
              <CalendarIcon className="h-8 w-8 text-pink-600 mb-2" />
              <span className="text-sm font-medium">Book Appointment</span>
            </button>
            <button 
              onClick={() => router.push('/dashboard/patient/health-content')}
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
            >
              <BookOpenIcon className="h-8 w-8 text-pink-600 mb-2" />
              <span className="text-sm font-medium">Health Education</span>
            </button>
            <button 
              onClick={() => router.push('/dashboard/patient/notifications')}
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
            >
              <BellAlertIcon className="h-8 w-8 text-pink-600 mb-2" />
              <span className="text-sm font-medium">Notifications</span>
            </button>
            <button 
              onClick={() => router.push('/dashboard/patient/profile')}
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
            >
              <UserCircleIcon className="h-8 w-8 text-pink-600 mb-2" />
              <span className="text-sm font-medium">My Profile</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}