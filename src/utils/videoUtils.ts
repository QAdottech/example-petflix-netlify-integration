import { Video } from '@/types/video'

export const getVideos = async (): Promise<Video[]> => {
  const data = await import('@/data/videos.json')
  return data.default.videos
}

export const getFeaturedVideos = async (): Promise<Video[]> => {
  const videos = await getVideos()
  return videos.filter((video) => video.featured)
}

export const searchVideos = async (query: string): Promise<Video[]> => {
  const videos = await getVideos()
  const lowercaseQuery = query.toLowerCase()

  return videos.filter(
    (video) =>
      video.title.toLowerCase().includes(lowercaseQuery) ||
      video.description.toLowerCase().includes(lowercaseQuery) ||
      video.channel.toLowerCase().includes(lowercaseQuery)
  )
}

export const filterVideosByCategory = async (
  category: string
): Promise<Video[]> => {
  const videos = await getVideos()

  if (category === 'all') {
    return videos
  }

  return videos.filter((video) => video.category === category)
}

export const getFavoritesFromStorage = (): string[] => {
  if (typeof window === 'undefined') return []

  try {
    const favorites = localStorage.getItem('petflix-favorites')
    return favorites ? JSON.parse(favorites) : []
  } catch {
    return []
  }
}

export const addToFavorites = (videoId: string): void => {
  if (typeof window === 'undefined') return

  try {
    const favorites = getFavoritesFromStorage()
    if (!favorites.includes(videoId)) {
      favorites.push(videoId)
      localStorage.setItem('petflix-favorites', JSON.stringify(favorites))
    }
  } catch {
    // Handle error silently
  }
}

export const removeFromFavorites = (videoId: string): void => {
  if (typeof window === 'undefined') return

  try {
    const favorites = getFavoritesFromStorage()
    const updatedFavorites = favorites.filter((id) => id !== videoId)
    localStorage.setItem('petflix-favorites', JSON.stringify(updatedFavorites))
  } catch {
    // Handle error silently
  }
}

export const isFavorite = (videoId: string): boolean => {
  const favorites = getFavoritesFromStorage()
  return favorites.includes(videoId)
}

// View tracking functions
export interface VideoViewStats {
  videoId: string
  viewCount: number
  lastViewed: string
}

export const getViewStatsFromStorage = (): Record<string, VideoViewStats> => {
  if (typeof window === 'undefined') return {}

  try {
    const stats = localStorage.getItem('petflix-view-stats')
    return stats ? JSON.parse(stats) : {}
  } catch {
    return {}
  }
}

export const trackVideoView = (videoId: string): void => {
  if (typeof window === 'undefined') return

  try {
    const stats = getViewStatsFromStorage()
    const currentStats = stats[videoId] || {
      videoId,
      viewCount: 0,
      lastViewed: new Date().toISOString(),
    }

    currentStats.viewCount += 1
    currentStats.lastViewed = new Date().toISOString()

    stats[videoId] = currentStats
    localStorage.setItem('petflix-view-stats', JSON.stringify(stats))
  } catch {
    // Handle error silently
  }
}

export const getVideoViewCount = (videoId: string): number => {
  const stats = getViewStatsFromStorage()
  return stats[videoId]?.viewCount || 0
}

export const getAllViewStats = (): VideoViewStats[] => {
  const stats = getViewStatsFromStorage()
  return Object.values(stats)
}

export const getTotalViews = (): number => {
  const stats = getAllViewStats()
  return stats.reduce((total, stat) => total + stat.viewCount, 0)
}

export const getMostViewedVideos = async (
  limit: number = 10
): Promise<Array<Video & { viewCount: number; lastViewed?: string }>> => {
  const videos = await getVideos()
  const stats = getViewStatsFromStorage()

  const videosWithStats = videos
    .map((video) => ({
      ...video,
      viewCount: stats[video.id]?.viewCount || 0,
      lastViewed: stats[video.id]?.lastViewed,
    }))
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit)

  return videosWithStats
}
