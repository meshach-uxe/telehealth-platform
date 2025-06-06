'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  CalendarIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  BellIcon,
  UserIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import VoiceNavigationButton from '../../components/VoiceNavigationButton'
import VoiceCommandListener from '../../components/VoiceCommandListener'
import { useVoiceNavigationContext } from '../../components/VoiceNavigationProvider'

interface Appointment {
  id: string
  patientName: string
  patientAge: number
  date: string
  time: string
  reason: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

interface Notification {
  id: string
  title: string
  message: string
  date: string
  isRead: boolean
}

interface Patient {
  id: string
  name: string
  age: number
  lastVisit: string
  condition: string
}

export default function DoctorDashboard() {
  const { speakText } = useVoiceNavigationContext()
  const [activeTab, setActiveTab] = useState('overview')
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Patient Assigned',
      message: 'A new patient, Maria Garcia, has been assigned to you',
      date: '2024-01-15T08:00:00Z',
      isRead: false
    },
    {
      id: '2',
      title: 'Test Results Available',
      message: 'Blood test results for patient Priya Sharma are now available',
      date: '2024-01-14T14:30:00Z',
      isRead: true
    },
    {
      id: '3',
      title: 'Schedule Change',
      message: 'Your clinic hours have been updated for next week',
      date: '2024-01-13T11:15:00Z',
      isRead: false
    }
  ])

  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Maria Garcia',
      patientAge: 32,
      date: '2024-01-20',
      time: '10:00 AM',
      reason: 'Prenatal checkup',
      status: 'upcoming'
    },
    {
      id: '2',
      patientName: 'Priya Sharma',
      patientAge: 28,
      date: '2024-01-20',
      time: '11:30 AM',
      reason: 'Follow-up consultation',
      status: 'upcoming'
    },
    {
      id: '3',
      patientName: 'Fatima Okonkwo',
      patientAge: 35,
      date: '2024-01-20',
      time: '2:15 PM',
      reason: 'Postnatal checkup',
      status: 'upcoming'
    },
    {
      id: '4',
      patientName: 'Aisha Mohammed',
      patientAge: 24,
      date: '2024-01-19',
      time: '9:00 AM',
      reason: 'Pregnancy confirmation',
      status: 'completed'
    }
  ]

  const patients: Patient[] = [
    {
      id: '1',
      name: 'Maria Garcia',
      age: 32,
      lastVisit: '2024-01-05',
      condition: 'Pregnancy - 2nd trimester'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      age: 28,
      lastVisit: '2024-01-10',
      condition: 'Postpartum care'
    },
    {
      id: '3',
      name: 'Fatima Okonkwo',
      age: 35,
      lastVisit: '2023-12-28',
      condition: 'Postnatal recovery'
    },
    {
      id: '4',
      name: 'Aisha Mohammed',
      age: 24,
      lastVisit: '2024-01-19',
      condition: 'Pregnancy confirmation'
    },
    {
      id: '5',
      name: 'Grace Adebayo',
      age: 30,
      lastVisit: '2023-12-15',
      condition: 'Pregnancy - 3rd trimester'
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
    'show patients': () => {
      setActiveTab('patients')
      speakText('Showing patients tab')
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
      const todaysAppointments = appointments.filter(a => a.date === '2024-01-20')
      if (todaysAppointments.length > 0) {
        const appointmentText = todaysAppointments
          .map(a => `Appointment with ${a.patientName}, age ${a.patientAge}, at ${a.time} for ${a.reason}`)
          .join('. Next appointment: ')
        speakText(`You have ${todaysAppointments.length} appointments today. ${appointmentText}`)
      } else {
        speakText('You have no appointments today')
      }
    },
    'read patient list': () => {
      if (patients.length > 0) {
        const patientText = patients
          .slice(0, 5)
          .map(p => `${p.name}, age ${p.age}, condition: ${p.condition}`)
          .join('. Next patient: ')
        speakText(`Your patients: ${patientText}`)
      } else {
        speakText('You have no patients assigned')
      }
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
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                ← Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Doctor Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, Dr. Sarah Johnson</p>
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
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-blue-600" />
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
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'appointments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'patients' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Patients
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'messages' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'notifications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
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
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                    <h3 className="text-2xl font-bold text-gray-900">{appointments.filter(a => a.date === '2024-01-20').length}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <UsersIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <h3 className="text-2xl font-bold text-gray-900">{patients.length}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <ChartBarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Consultations This Week</p>
                    <h3 className="text-2xl font-bold text-gray-900">12</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
                <Link href="/appointments" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {appointments.filter(apt => apt.date === '2024-01-20').map((appointment) => (
                  <div key={appointment.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <UserIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-500">{appointment.reason}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <p className="text-sm text-gray-500">{appointment.time}</p>
                      </div>
                      <div className="mt-1">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {appointments.filter(apt => apt.date === '2024-01-20').length === 0 && (
                  <p className="text-center text-gray-500 py-4">No appointments today</p>
                )}
              </div>
            </div>

            {/* Recent Patients */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
                <button 
                  onClick={() => setActiveTab('patients')} 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Visit
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Condition
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patients.slice(0, 3).map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{patient.age}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{patient.lastVisit}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{patient.condition}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">View Records</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">All Appointments</h2>
              <div className="flex space-x-2">
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                  <option>All dates</option>
                  <option>Today</option>
                  <option>Tomorrow</option>
                  <option>This week</option>
                  <option>Next week</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Add Appointment
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
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
                        <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{appointment.patientAge}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.date}</div>
                        <div className="text-sm text-gray-500">{appointment.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{appointment.reason}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">View</button>
                          {appointment.status === 'upcoming' && (
                            <button className="text-red-600 hover:text-red-900">Cancel</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">All Patients</h2>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Search patients..." 
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Add Patient
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Visit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Condition
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{patient.age}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{patient.lastVisit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{patient.condition}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">View Records</button>
                          <button className="text-blue-600 hover:text-blue-900">Schedule</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                New Message
              </button>
            </div>
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600 mb-4">Start a conversation with your patients</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Send Message
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
        pageTitle="Doctor Dashboard"
        pageDescription="Your medical practice dashboard. You can use voice commands to navigate between tabs, read notifications, appointments, and patient information."
        pageCommands={pageCommands}
        autoAnnounce={true}
      />
    </div>
  )
}