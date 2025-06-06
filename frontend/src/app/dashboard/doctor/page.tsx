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
  BanknotesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface User {
  _id: string
  name: string
  email: string
  role: string
  phone: string
  location: string
  specialization?: string
  bio?: string
  consultationFee?: number
}

interface Appointment {
  _id: string
  patient: {
    _id: string
    name: string
    phone: string
  }
  date: string
  startTime: string
  endTime: string
  status: string
  consultationType: string
  reason: string
  paymentStatus?: string
}

interface Stats {
  totalAppointments: number
  todayAppointments: number
  completedAppointments: number
  totalEarnings: number
}

export default function DoctorDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<Stats>({
    totalAppointments: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    totalEarnings: 0
  })
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
    if (parsedUser.role !== 'doctor') {
      router.push('/dashboard/patient')
      return
    }

    setUser(parsedUser)

    // Fetch doctor data and appointments
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
          `http://localhost:4000/api/appointments/doctor`,
          config
        )
        setAppointments(appointmentsRes.data)

        // Calculate stats
        const allAppointments = appointmentsRes.data
        const today = new Date().toISOString().split('T')[0]
        const todayAppointments = allAppointments.filter((apt: Appointment) => 
          apt.date.split('T')[0] === today
        )
        const completedAppointments = allAppointments.filter((apt: Appointment) => 
          apt.status === 'completed'
        )
        const totalEarnings = completedAppointments.reduce((sum: number, apt: Appointment) => 
          sum + (userRes.data.consultationFee || 0), 0
        )

        setStats({
          totalAppointments: allAppointments.length,
          todayAppointments: todayAppointments.length,
          completedAppointments: completedAppointments.length,
          totalEarnings
        })

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

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Authentication required')
        return
      }

      const config = {
        headers: {
          'x-auth-token': token
        }
      }

      await axios.put(
        `http://localhost:4000/api/appointments/${appointmentId}`,
        { status },
        config
      )

      // Refresh appointments
      const appointmentsRes = await axios.get(
        `http://localhost:4000/api/appointments/doctor`,
        config
      )
      setAppointments(appointmentsRes.data)
    } catch (error) {
      setError('Failed to update appointment status')
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
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Doctor Profile Summary */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <div className="flex items-center">
            <div className="bg-pink-100 rounded-full p-3">
              <UserCircleIcon className="h-8 w-8 text-pink-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500">{user?.specialization}</p>
              <p className="text-gray-500">{user?.email} • {user?.phone}</p>
              <p className="text-gray-500">{user?.location}</p>
            </div>
            <div className="ml-auto">
              <div className="text-right">
                <p className="text-sm text-gray-500">Consultation Fee</p>
                <p className="text-lg font-semibold text-green-600">${user?.consultationFee || 0}</p>
              </div>
              <button 
                onClick={() => router.push('/dashboard/doctor/profile')}
                className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Appointments</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Today's Appointments</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.todayAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completedAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="bg-pink-100 rounded-full p-3">
                <BanknotesIcon className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.totalEarnings}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Appointments */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
              <button 
                onClick={() => router.push('/dashboard/doctor/appointments')}
                className="text-sm text-pink-600 hover:text-pink-800"
              >
                View All
              </button>
            </div>
            
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No appointments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 5).map((appointment) => (
                  <div key={appointment._id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{appointment.patient.name}</h3>
                        <p className="text-sm text-gray-500">{appointment.patient.phone}</p>
                        <p className="text-sm text-gray-600 mt-1">{appointment.reason}</p>
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
                      <div className="flex space-x-2">
                        {appointment.status === 'scheduled' && (
                          <>
                            <button 
                              onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                              className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
                            >
                              Complete
                            </button>
                            <button 
                              onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                              className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => router.push(`/dashboard/doctor/appointments/${appointment._id}`)}
                          className="text-xs text-pink-600 hover:text-pink-800"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => router.push('/dashboard/doctor/appointments')}
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <CalendarIcon className="h-8 w-8 text-pink-600 mb-2" />
                <span className="text-sm font-medium">Manage Appointments</span>
              </button>
              <button 
                onClick={() => router.push('/dashboard/doctor/availability')}
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <ClockIcon className="h-8 w-8 text-pink-600 mb-2" />
                <span className="text-sm font-medium">Set Availability</span>
              </button>
              <button 
                onClick={() => router.push('/dashboard/doctor/health-content')}
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <BookOpenIcon className="h-8 w-8 text-pink-600 mb-2" />
                <span className="text-sm font-medium">Create Content</span>
              </button>
              <button 
                onClick={() => router.push('/dashboard/doctor/profile')}
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <UserCircleIcon className="h-8 w-8 text-pink-600 mb-2" />
                <span className="text-sm font-medium">My Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h2>
          {appointments.filter(apt => apt.date.split('T')[0] === new Date().toISOString().split('T')[0]).length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments
                .filter(apt => apt.date.split('T')[0] === new Date().toISOString().split('T')[0])
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-pink-100 rounded-full p-2 mr-3">
                        {getConsultationIcon(appointment.consultationType)}
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patient.name}</p>
                        <p className="text-sm text-gray-500">{appointment.startTime} - {appointment.endTime}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}