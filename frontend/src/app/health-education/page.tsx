'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BookOpenIcon, 
  PlayIcon, 
  HeartIcon, 
  UserGroupIcon,
  SpeakerWaveIcon,
  LanguageIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import VoiceNavigationButton from '../../components/VoiceNavigationButton'
import VoiceCommandListener from '../../components/VoiceCommandListener'
import { useVoiceNavigationContext } from '../../components/VoiceNavigationProvider'

interface HealthContent {
  _id: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  mediaType: 'text' | 'video' | 'audio' | 'infographic'
  mediaUrl?: string
  language: string
  targetAudience: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  author: {
    name: string
    role: string
  }
  views: number
  likes: number
  isLiked?: boolean
  createdAt: string
}

const sampleContent: HealthContent[] = [
  {
    _id: '1',
    title: 'Prenatal Care Essentials',
    description: 'Complete guide to prenatal care for expectant mothers in rural areas',
    content: 'Prenatal care is crucial for both mother and baby health. Regular checkups help monitor...',
    category: 'Maternal Health',
    tags: ['pregnancy', 'prenatal', 'checkups', 'nutrition'],
    mediaType: 'video',
    mediaUrl: '/videos/prenatal-care.mp4',
    language: 'English',
    targetAudience: ['pregnant women', 'new mothers'],
    difficulty: 'beginner',
    author: {
      name: 'Dr. Sarah Johnson',
      role: 'Obstetrician'
    },
    views: 1250,
    likes: 89,
    isLiked: false,
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    _id: '2',
    title: 'Nutrition During Pregnancy',
    description: 'Essential nutrients and dietary guidelines for pregnant women',
    content: 'Proper nutrition during pregnancy supports healthy fetal development...',
    category: 'Nutrition',
    tags: ['nutrition', 'pregnancy', 'diet', 'vitamins'],
    mediaType: 'infographic',
    mediaUrl: '/images/pregnancy-nutrition.svg',
    language: 'English',
    targetAudience: ['pregnant women'],
    difficulty: 'beginner',
    author: {
      name: 'Dr. Maria Rodriguez',
      role: 'Nutritionist'
    },
    views: 890,
    likes: 67,
    isLiked: true,
    createdAt: '2024-01-08T14:30:00Z'
  },
  {
    _id: '3',
    title: 'Postpartum Mental Health',
    description: 'Understanding and managing postpartum depression and anxiety',
    content: 'Postpartum mental health is as important as physical recovery...',
    category: 'Mental Health',
    tags: ['postpartum', 'mental health', 'depression', 'support'],
    mediaType: 'audio',
    mediaUrl: '/audio/postpartum-mental-health.mp3',
    language: 'English',
    targetAudience: ['new mothers', 'families'],
    difficulty: 'intermediate',
    author: {
      name: 'Dr. Emily Chen',
      role: 'Psychiatrist'
    },
    views: 654,
    likes: 45,
    isLiked: false,
    createdAt: '2024-01-05T09:15:00Z'
  },
  {
    _id: '4',
    title: 'Breastfeeding Best Practices',
    description: 'Complete guide to successful breastfeeding for new mothers',
    content: 'Breastfeeding provides optimal nutrition for infants and offers many benefits...',
    category: 'Maternal Health',
    tags: ['breastfeeding', 'newborn', 'nutrition', 'bonding'],
    mediaType: 'video',
    mediaUrl: '/videos/breastfeeding-guide.mp4',
    language: 'English',
    targetAudience: ['new mothers', 'pregnant women'],
    difficulty: 'beginner',
    author: {
      name: 'Dr. Lisa Thompson',
      role: 'Pediatrician'
    },
    views: 1100,
    likes: 78,
    isLiked: false,
    createdAt: '2024-01-12T16:45:00Z'
  },
  {
    _id: '5',
    title: 'Family Planning Options',
    description: 'Comprehensive overview of contraceptive methods and family planning',
    content: 'Family planning allows couples to decide when and how many children to have...',
    category: 'Reproductive Health',
    tags: ['family planning', 'contraception', 'reproductive health'],
    mediaType: 'text',
    language: 'English',
    targetAudience: ['women', 'couples'],
    difficulty: 'intermediate',
    author: {
      name: 'Dr. Amanda Wilson',
      role: 'Gynecologist'
    },
    views: 567,
    likes: 34,
    isLiked: true,
    createdAt: '2024-01-03T11:20:00Z'
  },
  {
    _id: '6',
    title: 'Emergency Warning Signs',
    description: 'Critical symptoms that require immediate medical attention',
    content: 'Recognizing emergency warning signs can save lives. Know when to seek help...',
    category: 'Emergency Care',
    tags: ['emergency', 'warning signs', 'urgent care'],
    mediaType: 'infographic',
    mediaUrl: '/images/emergency-signs.svg',
    language: 'English',
    targetAudience: ['all women', 'families'],
    difficulty: 'beginner',
    author: {
      name: 'Dr. Robert Kim',
      role: 'Emergency Medicine'
    },
    views: 2100,
    likes: 156,
    isLiked: false,
    createdAt: '2024-01-15T08:00:00Z'
  }
]

const categories = ['All', 'Maternal Health', 'Nutrition', 'Mental Health', 'Reproductive Health', 'Emergency Care']
const difficulties = ['All', 'beginner', 'intermediate', 'advanced']
const mediaTypes = ['All', 'text', 'video', 'audio', 'infographic']

export default function HealthEducation() {
  const { isVoiceEnabled, speakText } = useVoiceNavigationContext()
  const [content, setContent] = useState<HealthContent[]>(sampleContent)
  const [filteredContent, setFilteredContent] = useState<HealthContent[]>(sampleContent)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedMediaType, setSelectedMediaType] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  // Define page-specific voice commands
  const pageCommands = {
    'search': () => {
      document.querySelector('input[placeholder="Search health topics..."]')?.focus()
      speakText('What would you like to search for?')
    },
    'show filters': () => {
      setShowFilters(true)
      speakText('Filters are now visible')
    },
    'hide filters': () => {
      setShowFilters(false)
      speakText('Filters are now hidden')
    },
    'filter by maternal health': () => {
      setSelectedCategory('Maternal Health')
      speakText('Filtering by Maternal Health')
    },
    'filter by nutrition': () => {
      setSelectedCategory('Nutrition')
      speakText('Filtering by Nutrition')
    },
    'filter by mental health': () => {
      setSelectedCategory('Mental Health')
      speakText('Filtering by Mental Health')
    },
    'filter by reproductive health': () => {
      setSelectedCategory('Reproductive Health')
      speakText('Filtering by Reproductive Health')
    },
    'filter by emergency care': () => {
      setSelectedCategory('Emergency Care')
      speakText('Filtering by Emergency Care')
    },
    'show all categories': () => {
      setSelectedCategory('All')
      speakText('Showing all categories')
    },
    'filter by audio': () => {
      setSelectedMediaType('audio')
      speakText('Filtering by audio content')
    },
    'filter by video': () => {
      setSelectedMediaType('video')
      speakText('Filtering by video content')
    },
    'filter by text': () => {
      setSelectedMediaType('text')
      speakText('Filtering by text content')
    },
    'show all media types': () => {
      setSelectedMediaType('All')
      speakText('Showing all media types')
    },
    'read content titles': () => {
      const titles = filteredContent.map(item => item.title).join(', ')
      speakText(`Available content: ${titles}`)
    }
  }

  useEffect(() => {
    let filtered = content

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Difficulty filter
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(item => item.difficulty === selectedDifficulty)
    }

    // Media type filter
    if (selectedMediaType !== 'All') {
      filtered = filtered.filter(item => item.mediaType === selectedMediaType)
    }

    setFilteredContent(filtered)

    // Announce filter results if voice is enabled
    if (isVoiceEnabled) {
      const count = filtered.length
      if (count === 0) {
        speakText('No content found with the current filters')
      } else if (count !== content.length) {
        speakText(`Found ${count} items matching your filters`)
      }
    }
  }, [content, searchTerm, selectedCategory, selectedDifficulty, selectedMediaType, isVoiceEnabled, speakText])

  const handleLike = (contentId: string) => {
    setContent(prev => prev.map(item => {
      if (item._id === contentId) {
        return {
          ...item,
          isLiked: !item.isLiked,
          likes: item.isLiked ? item.likes - 1 : item.likes + 1
        }
      }
      return item
    }))
  }

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'video':
        return <PlayIcon className="h-5 w-5" />
      case 'audio':
        return <SpeakerWaveIcon className="h-5 w-5" />
      case 'infographic':
        return <BookOpenIcon className="h-5 w-5" />
      default:
        return <BookOpenIcon className="h-5 w-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Function to read content aloud
  const readContentAloud = (item: HealthContent) => {
    if (!isVoiceEnabled) return
    
    const textToRead = `${item.title}. ${item.description}. This content is categorized as ${item.category} and is suitable for ${item.difficulty} level.`
    speakText(textToRead)
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
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Health Education</h1>
              <p className="text-gray-600 mt-1">Evidence-based health information for rural women</p>
            </div>
            <div className="flex items-center space-x-4">
              <VoiceNavigationButton 
                size="md" 
                showLabel={false} 
              />
              <div className="flex items-center text-sm text-gray-500">
                <LanguageIcon className="h-5 w-5 mr-1" />
                Available in multiple languages
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search health topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty === 'All' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                  <select
                    value={selectedMediaType}
                    onChange={(e) => setSelectedMediaType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    {mediaTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'All' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Media Preview */}
              {item.mediaUrl && (
                <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                  {getMediaIcon(item.mediaType)}
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    {item.mediaType.charAt(0).toUpperCase() + item.mediaType.slice(1)}
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                    {item.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                </div>

                {/* Author and Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div>
                    <p className="font-medium">{item.author.name}</p>
                    <p>{item.author.role}</p>
                  </div>
                  <div className="text-right">
                    <p>{item.views} views</p>
                    <p>{item.likes} likes</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleLike(item._id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-pink-600 transition-colors"
                  >
                    {item.isLiked ? (
                      <HeartIconSolid className="h-5 w-5 text-pink-600" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                    <span className="text-sm">{item.likes}</span>
                  </button>

                  <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Accessibility Features */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Accessibility Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <SpeakerWaveIcon className="h-6 w-6 text-pink-600" />
              <span className="text-sm text-gray-700">Audio narration available</span>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageIcon className="h-6 w-6 text-pink-600" />
              <span className="text-sm text-gray-700">Multiple languages</span>
            </div>
            <div className="flex items-center space-x-3">
              <UserGroupIcon className="h-6 w-6 text-pink-600" />
              <span className="text-sm text-gray-700">Simple language used</span>
            </div>
            <div className="flex items-center space-x-3">
              <BookOpenIcon className="h-6 w-6 text-pink-600" />
              <span className="text-sm text-gray-700">Visual aids included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Command Listener */}
      <VoiceCommandListener 
        pageTitle="Health Education Page"
        pageDescription="Browse health education resources. You can use voice commands to search, filter, and navigate content."
        pageCommands={pageCommands}
        autoAnnounce={true}
      />
    </div>
  )
}