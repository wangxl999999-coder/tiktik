import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Video, Comment, PlayerSettings, SearchResult, User, Topic } from '@/types'
import { mockVideos, generateComments, mockTopics, mockCategories, mockLiveRooms, mockUsers } from '@/mock/data'

export const useVideoStore = defineStore('video', () => {
  const videos = ref<Video[]>([...mockVideos])
  const currentVideoIndex = ref(0)
  const comments = ref<Map<string, Comment[]>>(new Map())
  const likedVideos = ref<Set<string>>(new Set())
  const playerSettings = ref<PlayerSettings>({
    muted: false,
    volume: 0.7,
    playbackRate: 1,
    autoPlay: true,
    loop: false
  })

  const currentVideo = computed(() => videos.value[currentVideoIndex.value])

  const getVideoComments = (videoId: string): Comment[] => {
    if (!comments.value.has(videoId)) {
      comments.value.set(videoId, generateComments(videoId))
    }
    return comments.value.get(videoId) || []
  }

  const toggleLike = (videoId: string): boolean => {
    const video = videos.value.find(v => v.id === videoId)
    if (!video) return false

    if (likedVideos.value.has(videoId)) {
      likedVideos.value.delete(videoId)
      video.isLiked = false
      video.likesCount--
      return false
    } else {
      likedVideos.value.add(videoId)
      video.isLiked = true
      video.likesCount++
      return true
    }
  }

  const toggleCommentLike = (videoId: string, commentId: string): boolean => {
    const videoComments = getVideoComments(videoId)
    const findAndToggle = (comments: Comment[]): boolean => {
      for (const comment of comments) {
        if (comment.id === commentId) {
          if (comment.isLiked) {
            comment.isLiked = false
            comment.likesCount--
            return false
          } else {
            comment.isLiked = true
            comment.likesCount++
            return true
          }
        }
        if (comment.replies.length > 0) {
          const result = findAndToggle(comment.replies)
          if (result !== null) return result
        }
      }
      return false
    }
    return findAndToggle(videoComments)
  }

  const addComment = (videoId: string, content: string, parentId?: string): Comment | null => {
    const video = videos.value.find(v => v.id === videoId)
    if (!video) return null

    const videoComments = getVideoComments(videoId)
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      videoId,
      userId: '1',
      user: {
        id: '1',
        phone: '13800138000',
        nickname: '当前用户',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
        bio: '',
        followersCount: 0,
        followingCount: 0,
        likesCount: 0,
        worksCount: 0,
        isVerified: false,
        createdAt: ''
      },
      content,
      likesCount: 0,
      isLiked: false,
      replies: [],
      parentId,
      createdAt: new Date().toISOString()
    }

    if (parentId) {
      const parentComment = videoComments.find(c => c.id === parentId)
      if (parentComment) {
        parentComment.replies.push(newComment)
      }
    } else {
      videoComments.unshift(newComment)
    }

    video.commentsCount++
    return newComment
  }

  const shareVideo = (videoId: string): void => {
    const video = videos.value.find(v => v.id === videoId)
    if (video) {
      video.sharesCount++
    }
  }

  const nextVideo = (): void => {
    if (currentVideoIndex.value < videos.value.length - 1) {
      currentVideoIndex.value++
    }
  }

  const prevVideo = (): void => {
    if (currentVideoIndex.value > 0) {
      currentVideoIndex.value--
    }
  }

  const goToVideo = (index: number): void => {
    if (index >= 0 && index < videos.value.length) {
      currentVideoIndex.value = index
    }
  }

  const getVideosByCategory = (category: string): Video[] => {
    return videos.value.filter(v => v.category === category)
  }

  const getVideosByTopic = (topicId: string): Video[] => {
    return videos.value.filter(v => v.topics.some(t => t.id === topicId))
  }

  const getVideosByUser = (userId: string): Video[] => {
    return videos.value.filter(v => v.userId === userId)
  }

  const getFollowingVideos = (followingIds: string[]): Video[] => {
    return videos.value.filter(v => followingIds.includes(v.userId))
  }

  const getHotVideos = (): Video[] => {
    return [...videos.value].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 10)
  }

  const getRecommendedVideos = (userId?: string): Video[] => {
    const shuffled = [...videos.value].sort(() => Math.random() - 0.5)
    return shuffled
  }

  const updatePlayerSettings = (settings: Partial<PlayerSettings>): void => {
    playerSettings.value = { ...playerSettings.value, ...settings }
  }

  const searchVideos = (keyword: string): SearchResult => {
    const lowerKeyword = keyword.toLowerCase()
    
    const videosResult = videos.value.filter(v => 
      v.title.toLowerCase().includes(lowerKeyword) ||
      v.description.toLowerCase().includes(lowerKeyword) ||
      v.author.nickname.toLowerCase().includes(lowerKeyword) ||
      v.topics.some(t => t.name.toLowerCase().includes(lowerKeyword))
    )
    
    const usersResult = mockUsers.filter(u =>
      u.nickname.toLowerCase().includes(lowerKeyword) ||
      u.bio.toLowerCase().includes(lowerKeyword)
    )
    
    const topicsResult = mockTopics.filter(t =>
      t.name.toLowerCase().includes(lowerKeyword) ||
      t.description.toLowerCase().includes(lowerKeyword)
    )
    
    return {
      videos: videosResult,
      users: usersResult,
      topics: topicsResult
    }
  }

  return {
    videos,
    currentVideoIndex,
    currentVideo,
    comments,
    likedVideos,
    playerSettings,
    getVideoComments,
    toggleLike,
    toggleCommentLike,
    addComment,
    shareVideo,
    nextVideo,
    prevVideo,
    goToVideo,
    getVideosByCategory,
    getVideosByTopic,
    getVideosByUser,
    getFollowingVideos,
    getHotVideos,
    getRecommendedVideos,
    updatePlayerSettings,
    searchVideos
  }
})
