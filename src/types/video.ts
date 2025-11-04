export interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  channel: string
  views: string
  uploadTime: string
  duration: string
  category: string
  featured: boolean
  downloadUrl?: string
}

export interface VideoData {
  videos: Video[]
}

export const categories = [
  'all',
  'dogs',
  'cats',
  'birds',
  'hamsters',
  'rabbits',
] as const

export type Category = (typeof categories)[number]
