'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  CalendarIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  BellIcon,
  ArrowTrendingUpIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import VoiceNavigationButton from '../../components/VoiceNavigationButton'
import VoiceCommandListener from '../../components/VoiceCommandListener'
import { useVoiceNavigationContext } from '../../components/VoiceNavigationProvider'

interface Appointment {
  id: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

interface Notification {
  id: string
  title: string
  message: string
  date: string
  isRead: boolean
}

interface HealthMetric {
  name: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  date: string
}

export default function PatientDashboard() {
  const { speakText } = useVoiceNavigationContext()
  const [activeTab, setActiveTab] = useState('overview')
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Appointment Reminder',
      message: 'You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM',
      date: '2024-01-15T08:00:00Z',
      isRead: false
    },
    {
      id: '2',
      title: 'Prescription Refill',
      message: 'Your prescription for Prenatal Vitamins has been refilled and is ready for pickup',
      date: '2024-01-14T14:30:00Z',
      isRead: true
    },
    {
      id: '3',
      title: 'Test Results Available',
      message: 'Your recent blood test results are now available. Please check your health records.',
      date: '2024-01-13T11:15:00Z',
      isRead: false
    }
  ])

  const appointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Obstetrician',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'upcoming'
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      specialty: 'General Practitioner',
      date: '2024-01-15',
      time: '2:30 PM',
      status: 'completed'
    },
    {
      id: '3',
      doctorName: 'Dr. Lisa Thompson',
      specialty: 'Pediatrician',
      date: '2024-01-25',
      time: '11:15 AM',
      status: 'upcoming'
    }
  ]

  const healthMetrics: HealthMetric[] = [
    {
      name: 'Blood Pressure',
      value: 120,
      unit: 'mmHg',
      trend: 'stable',
      date: '2024-01-14'
    },
    {
      name: 'Weight',
      value: 65,
      unit: 'kg',
      trend: 'up',
      date: '2024-01-14'
    },
    {
      name: 'Blood Glucose',
      value: 95,
      unit: 'mg/dL',
      trend: 'down',
      date: '2024-01-14'
    },
    {
      name: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      trend: 'stable',
      date: '2024-01-14'
    }
  ]

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    )
  }

  // Define page-specific voice commands
  const pageCommands = {
    'show overview': () => {
      setActiveTab('overview')
      speakText('Showing overview tab')
    },
    'show appointments': () => {
      setActiveTab('appointments')
      speakText('Showing appointments tab')
    },
    'show health records': () => {
      setActiveTab('records')
      speakText('Showing health records tab')
    },
    'show messages': () => {
      setActiveTab('messages')
      speakText('Showing messages tab')
    },
    'show notifications': () => {
      setActiveTab('notifications')
      speakText('Showing notifications tab')
    },
    'read notifications': () => {
      const unreadNotifications = notifications.filter(n => !n.isRead)
      if (unreadNotifications.length > 0) {
        const notificationText = unreadNotifications
          .map(n => `${n.title}: ${n.message}`)
          .join('. Next notification: ')
        speakText(`You have ${unreadNotifications.length} unread notifications. ${notificationText}`)
      } else {
        speakText('You have no unread notifications')
      }
    },
    'read appointments': () => {
      const upcomingAppointments = appointments.filter(a => a.status === 'upcoming')
      if (upcomingAppointments.length > 0) {
        const appointmentText = upcomingAppointments
          .map(a => `Appointment with ${a.doctorName}, ${a.specialty}, on ${a.date} at ${a.time}`)
          .join('. Next appointment: ')
        speakText(`You have ${upcomingAppointments.length} upcoming appointments. ${appointmentText}`)
      } else {
        speakText('You have no upcoming appointments')
      }
    },
    'read health metrics': () => {
      const metricsText = healthMetrics
        .map(m => `${m.name}: ${m.value} ${m.unit}, trend is ${m.trend}`)
        .join('. ')
      speakText(`Your health metrics: ${metricsText}`)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="h-5 w-5 text-red-500 transform rotate-0" />
      case 'down':
        return <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 transform rotate-180" />
      default:
        return <ArrowTrendingUpIcon className="h-5 w-5 text-gray-500 transform rotate-90" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-pink-600 hover:text-pink-700 font-medium">
                ← Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Patient Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, Maria</p>
            </div>
            <div className="flex items-center space-x-4">
              <VoiceNavigationButton 
                size="md" 
                showLabel={true} 
              />
              <div className="relative">
                <BellIcon className="h-6 w-6 text-gray-500" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'appointments' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'records' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Health Records
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'messages' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'notifications' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Notifications
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Health Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {healthMetrics.map((metric) => (
                  <div key={metric.name} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.value} <span className="text-sm font-normal text-gray-500">{metric.unit}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Last updated: {metric.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
                <Link href="/appointments" className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {appointments.filter(apt => apt.status === 'upcoming').map((appointment) => (
                  <div key={appointment.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mr-4">
                      <CalendarIcon className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{appointment.doctorName}</h3>
                      <p className="text-sm text-gray-500">{appointment.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                      <div className="flex items-center justify-end">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <p className="text-sm text-gray-500">{appointment.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {appointments.filter(apt => apt.status === 'upcoming').length === 0 && (
                  <p className="text-center text-gray-500 py-4">No upcoming appointments</p>
                )}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
                <button 
                  onClick={() => setActiveTab('notifications')} 
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {notifications.slice(0, 2).map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50'}`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">All Appointments</h2>
              <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium">
                Schedule New Appointment
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialty
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{appointment.doctorName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{appointment.specialty}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.date}</div>
                        <div className="text-sm text-gray-500">{appointment.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {appointment.status === 'upcoming' && (
                          <div className="space-x-2">
                            <button className="text-pink-600 hover:text-pink-900">Reschedule</button>
                            <button className="text-red-600 hover:text-red-900">Cancel</button>
                          </div>
                        )}
                        {appointment.status === 'completed' && (
                          <button className="text-blue-600 hover:text-blue-900">View Summary</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Health Records</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-pink-600 mr-2" />
                  <h3 className="text-md font-medium text-gray-900">Medical History</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">View your complete medical history including diagnoses, treatments, and medications.</p>
                <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium">
                  View Medical History
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-pink-600 mr-2" />
                  <h3 className="text-md font-medium text-gray-900">Test Results</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Access your laboratory test results, imaging reports, and other diagnostic information.</p>
                <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium">
                  View Test Results
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-pink-600 mr-2" />
                  <h3 className="text-md font-medium text-gray-900">Prescriptions</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Manage your current and past prescriptions, including refill requests.</p>
                <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium">
                  View Prescriptions
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-pink-600 mr-2" />
                  <h3 className="text-md font-medium text-gray-900">Immunizations</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Track your immunization history and upcoming vaccination schedules.</p>
                <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium">
                  View Immunizations
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium">
                New Message
              </button>
            </div>
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600 mb-4">Start a conversation with your healthcare provider</p>
              <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium">
                Contact Doctor
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Notifications</h2>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50'}`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-600">You're all caught up!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Voice Command Listener */}
      <VoiceCommandListener 
        pageTitle="Patient Dashboard"
        pageDescription="Your personal health dashboard. You can use voice commands to navigate between tabs, read notifications, appointments, and health metrics."
        pageCommands={pageCommands}
        autoAnnounce={true}
      />
    </div>
  )
}