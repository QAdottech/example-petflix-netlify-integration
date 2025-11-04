'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, TrendingUp, Video as VideoIcon, BarChart3 } from 'lucide-react'
import { Video } from '@/types/video'
import {
  getMostViewedVideos,
  getTotalViews,
  getAllViewStats,
} from '@/utils/videoUtils'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

interface VideoWithViews extends Video {
  viewCount: number
}

export default function StatsPage() {
  const [mostViewedVideos, setMostViewedVideos] = useState<VideoWithViews[]>(
    []
  )
  const [totalViews, setTotalViews] = useState(0)
  const [totalVideosWatched, setTotalVideosWatched] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const mostViewed = await getMostViewedVideos(10)
        const total = getTotalViews()
        const allStats = getAllViewStats()

        setMostViewedVideos(mostViewed)
        setTotalViews(total)
        setTotalVideosWatched(allStats.length)
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

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
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
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
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <BarChart3 className="h-8 w-8 mr-3 text-red-600" />
                Video View Statistics
              </h1>
              <p className="text-gray-600">
                Track your viewing habits and discover your most-watched
                videos
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Views Card */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium mb-1">
                      Total Views
                    </p>
                    <p className="text-4xl font-bold">{totalViews}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    <Eye className="h-8 w-8" />
                  </div>
                </div>
              </div>

              {/* Videos Watched Card */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">
                      Videos Watched
                    </p>
                    <p className="text-4xl font-bold">{totalVideosWatched}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    <VideoIcon className="h-8 w-8" />
                  </div>
                </div>
              </div>

              {/* Average Views Card */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">
                      Avg. Views per Video
                    </p>
                    <p className="text-4xl font-bold">
                      {totalVideosWatched > 0
                        ? (totalViews / totalVideosWatched).toFixed(1)
                        : '0'}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Most Viewed Videos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-red-600" />
                Most Watched Videos
              </h2>

              {mostViewedVideos.length === 0 ? (
                <div className="text-center py-12">
                  <VideoIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">
                    No viewing history yet
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Start watching videos to see your stats here!
                  </p>
                  <Link
                    href="/"
                    className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Browse Videos
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {mostViewedVideos.map((video, index) => (
                    <Link
                      key={video.id}
                      href={`/video/${video.id}`}
                      className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      {/* Rank Badge */}
                      <div className="flex-shrink-0 mr-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                            index === 0
                              ? 'bg-yellow-500'
                              : index === 1
                              ? 'bg-gray-400'
                              : index === 2
                              ? 'bg-orange-400'
                              : 'bg-gray-300'
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>

                      {/* Thumbnail */}
                      <div className="flex-shrink-0 mr-4">
                        <div className="relative w-32 aspect-video rounded overflow-hidden">
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            width={128}
                            height={72}
                            className="object-cover"
                          />
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                            {video.duration}
                          </div>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-1">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {video.channel}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{video.views} views</span>
                          <span className="mx-1">•</span>
                          <span>{video.uploadTime}</span>
                        </div>
                      </div>

                      {/* View Count Badge */}
                      <div className="flex-shrink-0 ml-4">
                        <div className="bg-blue-100 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          <span className="font-bold text-lg">
                            {video.viewCount}
                          </span>
                          <span className="ml-1 text-sm">
                            {video.viewCount === 1 ? 'view' : 'views'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

