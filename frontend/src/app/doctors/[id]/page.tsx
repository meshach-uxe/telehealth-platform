'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  UserIcon, 
  CalendarDaysIcon, 
  MapPinIcon, 
  AcademicCapIcon,
  LanguageIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon
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
  education: string[]
  certifications: string[]
  profileImage?: string
  reviews: {
    patientName: string
    rating: number
    comment: string
    date: string
  }[]
}

const sampleDoctors: Record<string, Doctor> = {
  '1': {
    _id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Obstetrics & Gynecology',
    bio: 'Specialized in maternal health with 15+ years of experience serving rural communities. Dr. Johnson focuses on prenatal care, high-risk pregnancies, and women\'s reproductive health. She has developed several outreach programs to improve maternal health outcomes in underserved areas.',
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
    languages: ['English', 'Spanish'],
    education: [
      'MD, Johns Hopkins University School of Medicine',
      'Residency in Obstetrics and Gynecology, Mayo Clinic'
    ],
    certifications: [
      'Board Certified in Obstetrics and Gynecology',
      'Maternal-Fetal Medicine Fellowship',
      'Advanced Life Support in Obstetrics (ALSO)'
    ],
    reviews: [
      {
        patientName: 'Maria G.',
        rating: 5,
        comment: 'Dr. Johnson was incredibly supportive throughout my high-risk pregnancy. She took the time to explain everything and was always available when I had concerns.',
        date: '2023-12-15'
      },
      {
        patientName: 'Jennifer T.',
        rating: 5,
        comment: 'Excellent doctor who truly cares about her patients. She helped me navigate a difficult diagnosis with compassion and expertise.',
        date: '2023-11-22'
      },
      {
        patientName: 'Rebecca L.',
        rating: 4,
        comment: 'Very knowledgeable and professional. The wait times can be long sometimes, but the quality of care is worth it.',
        date: '2023-10-05'
      }
    ]
  },
  '2': {
    _id: '2',
    name: 'Dr. Maria Rodriguez',
    specialization: 'Family Medicine',
    bio: 'Dedicated to providing comprehensive healthcare for women and families in underserved areas. Dr. Rodriguez has a special interest in preventive care, chronic disease management, and health education for rural communities.',
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
    languages: ['English', 'Spanish', 'Portuguese'],
    education: [
      'MD, University of California, San Francisco',
      'Residency in Family Medicine, UCLA Medical Center'
    ],
    certifications: [
      'Board Certified in Family Medicine',
      'Certificate in Women\'s Health',
      'Rural Health Clinician Certification'
    ],
    reviews: [
      {
        patientName: 'Sofia R.',
        rating: 5,
        comment: 'Dr. Rodriguez is amazing! She takes time to listen and explains everything clearly. She\'s been our family doctor for years.',
        date: '2023-12-10'
      },
      {
        patientName: 'Laura M.',
        rating: 5,
        comment: 'I appreciate how Dr. Rodriguez considers cultural factors in her care. She speaks my language and understands my concerns.',
        date: '2023-11-15'
      },
      {
        patientName: 'Carmen D.',
        rating: 4,
        comment: 'Very thorough and caring doctor. She follows up after appointments and genuinely cares about her patients.',
        date: '2023-09-28'
      }
    ]
  },
  '3': {
    _id: '3',
    name: 'Dr. Emily Chen',
    specialization: 'Mental Health',
    bio: 'Specializing in women\'s mental health, postpartum depression, and anxiety disorders. Dr. Chen combines evidence-based approaches with cultural sensitivity to provide comprehensive mental healthcare for women in rural communities.',
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
    languages: ['English', 'Mandarin'],
    education: [
      'MD, Harvard Medical School',
      'Psychiatry Residency, Massachusetts General Hospital',
      'Fellowship in Women\'s Mental Health'
    ],
    certifications: [
      'Board Certified in Psychiatry',
      'Certified in Perinatal Mental Health',
      'Cognitive Behavioral Therapy Certification'
    ],
    reviews: [
      {
        patientName: 'Jessica W.',
        rating: 5,
        comment: 'Dr. Chen helped me through severe postpartum depression. Her telehealth sessions were convenient and effective. I\'m so grateful for her care.',
        date: '2023-12-05'
      },
      {
        patientName: 'Michelle K.',
        rating: 4,
        comment: 'Very knowledgeable and compassionate. Dr. Chen provides practical strategies for managing anxiety that have really helped me.',
        date: '2023-10-18'
      },
      {
        patientName: 'Aisha T.',
        rating: 5,
        comment: 'Dr. Chen is an excellent listener and creates a safe space for discussing difficult topics. Her cultural sensitivity is much appreciated.',
        date: '2023-09-12'
      }
    ]
  }
}

export default function DoctorProfile({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:4000/api/users/${params.id}`)
        setDoctor(response.data)
      } catch (error) {
        console.error('Error fetching doctor:', error)
        setError('Failed to load doctor information')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [params.id])

  const handleBookAppointment = () => {
    router.push('/appointments/book')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error || 'Doctor not found'}</p>
        <Link href="/" className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-pink-600 hover:text-pink-700 font-medium">
            ← Back to Doctors
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{doctor.name}</h1>
          <p className="text-pink-600 font-medium">{doctor.specialization}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  {doctor.profileImage ? (
                    <img 
                      src={doctor.profileImage} 
                      alt={doctor.name} 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-12 w-12 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.floor(doctor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">{doctor.rating} ({doctor.reviews.length} reviews)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-5 w-5 text-gray-500" />
                      <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AcademicCapIcon className="h-5 w-5 text-gray-500" />
                      <span>{doctor.experience} years experience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LanguageIcon className="h-5 w-5 text-gray-500" />
                      <span>{doctor.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                      <span>${doctor.consultationFee} per consultation</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-600">{doctor.bio}</p>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
                <ul className="space-y-2">
                  {doctor.education.map((edu, index) => (
                    <li key={index} className="flex items-start">
                      <AcademicCapIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <span className="text-gray-600">{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h2>
                <ul className="space-y-2">
                  {doctor.certifications.map((cert, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-5 w-5 bg-pink-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-pink-600 text-xs">✓</span>
                      </div>
                      <span className="text-gray-600">{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Reviews</h2>
              
              <div className="space-y-6">
                {doctor.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{review.patientName}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking and Availability */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Book an Appointment</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CalendarDaysIcon className="h-6 w-6 text-pink-600" />
                  <div>
                    <div className="font-medium">Next Available</div>
                    <div className="text-sm text-gray-600">
                      {doctor.availableSlots[0]?.date ? (
                        new Date(doctor.availableSlots[0].date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })
                      ) : 'No available slots'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-6 w-6 text-pink-600" />
                  <div>
                    <div className="font-medium">Consultation Duration</div>
                    <div className="text-sm text-gray-600">30 minutes</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-pink-600" />
                  <div>
                    <div className="font-medium">Consultation Options</div>
                    <div className="text-sm text-gray-600">Video, Phone, Text Chat</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookAppointment}
                className="w-full mt-6 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium"
              >
                Book Appointment
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
              
              <div className="space-y-4">
                {doctor.availableSlots.map((slot, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="font-medium mb-2">
                      {new Date(slot.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {slot.times.map((time) => (
                        <div key={time} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}