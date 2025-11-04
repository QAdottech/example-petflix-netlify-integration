'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Heart, Play, Clock, Eye, Calendar } from 'lucide-react'
import { Video } from '@/types/video'
import {
  getVideos,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  trackVideoView,
  getVideoViewCount,
} from '@/utils/videoUtils'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function VideoPage() {
  const params = useParams()
  const videoId = params.id as string
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [favorited, setFavorited] = useState(false)
  const [localViewCount, setLocalViewCount] = useState(0)

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const videos = await getVideos()
        const foundVideo = videos.find((v) => v.id === videoId)
        setVideo(foundVideo || null)
        if (foundVideo) {
          setFavorited(isFavorite(foundVideo.id))
          // Track the view
          trackVideoView(foundVideo.id)
          // Get the updated view count
          setLocalViewCount(getVideoViewCount(foundVideo.id))
        }
      } catch (error) {
        console.error('Error loading video:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVideo()
  }, [videoId])

  const handleToggleFavorite = () => {
    if (!video) return

    if (favorited) {
      removeFromFavorites(video.id)
      setFavorited(false)
    } else {
      addToFavorites(video.id)
      setFavorited(true)
    }
  }

  const handleSearch = (query: string) => {
    window.location.href = `/search?q=${encodeURIComponent(query)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
              <div className="aspect-video bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🐕</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Video Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The video you&apos;re looking for doesn&apos;t exist.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>

            {/* Video Player Area */}
            <div className="relative mb-6">
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <button className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-colors">
                    <Play className="h-8 w-8" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {video.title}
                  </h1>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {video.views} views
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {video.uploadTime}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {video.duration}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    favorited
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      favorited ? 'fill-current' : ''
                    }`}
                  />
                  {favorited ? 'Favorited' : 'Add to Favorites'}
                </button>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-600 font-semibold">
                      {video.channel.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {video.channel}
                    </h3>
                    <p className="text-sm text-gray-600">Pet Video Channel</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>

            {/* Category Badge and Local Views */}
            <div className="mt-4 flex items-center justify-between">
              <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {video.category.charAt(0).toUpperCase() +
                  video.category.slice(1)}
              </span>
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span>
                  You&apos;ve watched this video{' '}
                  <strong>{localViewCount}</strong>{' '}
                  {localViewCount === 1 ? 'time' : 'times'}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
