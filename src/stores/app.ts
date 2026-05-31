import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, Notification, HotSearchItem, Category, Topic, LiveRoom, User } from '@/types'
import { 
  mockMessages, 
  mockNotifications, 
  mockHotSearches, 
  mockCategories, 
  mockTopics, 
  mockLiveRooms,
  mockUsers,
  recommendedAccounts,
  followingList
} from '@/mock/data'

export const useAppStore = defineStore('app', () => {
  const messages = ref<Message[]>([...mockMessages])
  const notifications = ref<Notification[]>([...mockNotifications])
  const hotSearches = ref<HotSearchItem[]>([...mockHotSearches])
  const categories = ref<Category[]>([...mockCategories])
  const topics = ref<Topic[]>([...mockTopics])
  const liveRooms = ref<LiveRoom[]>([...mockLiveRooms])
  const sidebarCollapsed = ref(false)
  const showAnnouncement = ref(true)
  const currentVersion = ref('1.2.0')
  const latestVersion = ref('1.2.1')
  const searchHistory = ref<string[]>([])

  const unreadMessagesCount = computed(() => 
    messages.value.filter(m => !m.isRead).length
  )

  const unreadNotificationsCount = computed(() => 
    notifications.value.filter(n => !n.isRead).length
  )

  const hasUpdate = computed(() => currentVersion.value !== latestVersion.value)

  const totalUnread = computed(() => 
    unreadMessagesCount.value + unreadNotificationsCount.value
  )

  const markMessageAsRead = (messageId: string): void => {
    const message = messages.value.find(m => m.id === messageId)
    if (message) {
      message.isRead = true
    }
  }

  const markAllMessagesAsRead = (): void => {
    messages.value.forEach(m => m.isRead = true)
  }

  const markNotificationAsRead = (notificationId: string): void => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.isRead = true
    }
  }

  const markAllNotificationsAsRead = (): void => {
    notifications.value.forEach(n => n.isRead = true)
  }

  const toggleSidebar = (): void => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const closeAnnouncement = (): void => {
    showAnnouncement.value = false
  }

  const searchUsers = (keyword: string): User[] => {
    const lowerKeyword = keyword.toLowerCase()
    return mockUsers.filter(u => 
      u.nickname.toLowerCase().includes(lowerKeyword) ||
      u.bio.toLowerCase().includes(lowerKeyword)
    )
  }

  const searchTopics = (keyword: string): Topic[] => {
    const lowerKeyword = keyword.toLowerCase()
    return topics.value.filter(t => 
      t.name.toLowerCase().includes(lowerKeyword) ||
      t.description.toLowerCase().includes(lowerKeyword)
    )
  }

  const getHotTopics = (): Topic[] => {
    return topics.value.filter(t => t.isHot).sort((a, b) => b.heat - a.heat)
  }

  const getRecommendedAccounts = (): User[] => {
    return recommendedAccounts
  }

  const getFollowingList = (): User[] => {
    return followingList
  }

  const getTopicById = (id: string): Topic | undefined => {
    return topics.value.find(t => t.id === id)
  }

  const getCategoryById = (id: string): Category | undefined => {
    return categories.value.find(c => c.id === id)
  }

  const getLiveRooms = (): LiveRoom[] => {
    return liveRooms.value
  }

  const addHotSearch = (keyword: string): void => {
    const existing = hotSearches.value.find(h => h.keyword === keyword)
    if (existing) {
      existing.heat += 1000
      existing.viewsCount += 1000
    } else {
      hotSearches.value.unshift({
        id: `hot-${Date.now()}`,
        keyword,
        heat: 1000,
        viewsCount: 1000,
        trend: 'up',
        isHot: false,
        isNew: true
      })
    }
    hotSearches.value.sort((a, b) => b.heat - a.heat)
    
    if (!searchHistory.value.includes(keyword)) {
      searchHistory.value.unshift(keyword)
      if (searchHistory.value.length > 20) {
        searchHistory.value.pop()
      }
    }
  }

  const clearSearchHistory = (): void => {
    searchHistory.value = []
  }

  return {
    messages,
    notifications,
    hotSearches,
    categories,
    topics,
    liveRooms,
    sidebarCollapsed,
    showAnnouncement,
    currentVersion,
    latestVersion,
    searchHistory,
    unreadMessagesCount,
    unreadNotificationsCount,
    hasUpdate,
    totalUnread,
    markMessageAsRead,
    markAllMessagesAsRead,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    toggleSidebar,
    closeAnnouncement,
    searchUsers,
    searchTopics,
    getHotTopics,
    getRecommendedAccounts,
    getFollowingList,
    getTopicById,
    getCategoryById,
    getLiveRooms,
    addHotSearch,
    clearSearchHistory
  }
})
