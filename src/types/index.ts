export interface User {
  id: string
  phone: string
  nickname: string
  avatar: string
  bio: string
  followersCount: number
  followingCount: number
  likesCount: number
  worksCount: number
  isVerified: boolean
  createdAt: string
  location?: string
}

export interface Video {
  id: string
  userId: string
  author: User
  title: string
  description: string
  videoUrl: string
  coverUrl: string
  likesCount: number
  commentsCount: number
  sharesCount: number
  viewsCount: number
  isLiked: boolean
  isFavorited: boolean
  isFollowing: boolean
  topics: Topic[]
  location?: string
  createdAt: string
  duration: number
  category: string
}

export interface Comment {
  id: string
  videoId: string
  userId: string
  user: User
  content: string
  likesCount: number
  isLiked: boolean
  replies: Comment[]
  parentId?: string
  createdAt: string
}

export interface Topic {
  id: string
  name: string
  description: string
  videosCount: number
  viewsCount: number
  participantsCount: number
  coverUrl: string
  isHot: boolean
  heat: number
  trend: 'up' | 'down' | 'stable'
}

export interface Message {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system' | 'message'
  fromUserId?: string
  fromUser?: User
  sender?: User
  toUserId: string
  content: string
  videoId?: string
  video?: Video
  isRead: boolean
  createdAt: string
}

export interface Notification {
  id: string
  type: 'announcement' | 'version' | 'activity'
  title: string
  content: string
  imageUrl?: string
  linkUrl?: string
  isRead: boolean
  createdAt: string
  priority: 'high' | 'medium' | 'low'
}

export interface Category {
  id: string
  name: string
  icon: string
  emoji: string
  description: string
  videosCount: number
  videoCount: number
}

export interface LiveRoom {
  id: string
  title: string
  userId: string
  user: User
  anchor: User
  coverUrl: string
  viewersCount: number
  likesCount: number
  isLive: boolean
  category: string
  tags: string[]
  startedAt: string
}

export interface SearchResult {
  videos: Video[]
  users: User[]
  topics: Topic[]
}

export interface HotSearchItem {
  id: string
  keyword: string
  heat: number
  viewsCount: number
  trend: 'up' | 'down' | 'stable'
  isHot: boolean
  isNew: boolean
}

export interface PlayerSettings {
  muted: boolean
  volume: number
  playbackRate: number
  autoPlay: boolean
  loop: boolean
}

export interface AppState {
  currentVersion: string
  latestVersion: string
  hasUpdate: boolean
  showAnnouncement: boolean
  sidebarCollapsed: boolean
}
