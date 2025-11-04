'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Heart, Play, Clock, Eye, Calendar, Download, Share2 } from 'lucide-react'
import { Video } from '@/types/video'
import {
  getVideos,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
} from '@/utils/videoUtils'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function VideoPage() {
  const params = useParams()
  const videoId = params.id as string
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [favorited, setFavorited] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const videos = await getVideos()
        const foundVideo = videos.find((v) => v.id === videoId)
        setVideo(foundVideo || null)
        if (foundVideo) {
          setFavorited(isFavorite(foundVideo.id))
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

  const handleDownload = () => {
    if (!video) return

    // Generate download URL - in a real app, this would be an actual video file URL
    const downloadUrl =
      video.downloadUrl || `https://example.com/videos/${video.id}.mp4`

    // Create a temporary link and trigger download
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${video.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyLink = async () => {
    if (!video) return

    // Get the current page URL
    const currentUrl = window.location.href

    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(currentUrl)
      
      // Show feedback
      setCopied(true)
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = currentUrl
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 2000)
      } catch (err) {
        console.error('Fallback: Failed to copy', err)
      }
      document.body.removeChild(textArea)
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
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      copied
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    title="Copy link to video"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Download video"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
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

            {/* Category Badge */}
            <div className="mt-4">
              <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {video.category.charAt(0).toUpperCase() +
                  video.category.slice(1)}
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
