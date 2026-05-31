import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { mockUsers } from '@/mock/data'

const STORAGE_KEY = 'tiktik_user'
const TOKEN_KEY = 'tiktik_token'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoggedIn = computed(() => !!currentUser.value && !!token.value)
  const followingUsers = ref<User[]>([])
  const favoriteVideos = ref<string[]>([])

  const loadFromStorage = () => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (storedUser && storedToken) {
      currentUser.value = JSON.parse(storedUser)
      token.value = storedToken
    }
  }

  const login = async (phone: string, password: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const user = mockUsers.find(u => u.phone === phone)
    
    if (!user) {
      return { success: false, message: '手机号未注册' }
    }
    
    if (password !== '123456') {
      return { success: false, message: '密码错误' }
    }
    
    currentUser.value = user
    token.value = 'mock_token_' + Date.now()
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    localStorage.setItem(TOKEN_KEY, token.value)
    
    followingUsers.value = mockUsers.filter(u => ['2', '3', '5', '7'].includes(u.id))
    
    return { success: true, message: '登录成功' }
  }

  const register = async (phone: string, password: string, nickname: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (mockUsers.some(u => u.phone === phone)) {
      return { success: false, message: '手机号已被注册' }
    }
    
    const newUser: User = {
      id: String(mockUsers.length + 1),
      phone,
      nickname,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      bio: '这个人很懒，什么都没写~',
      followersCount: 0,
      followingCount: 0,
      likesCount: 0,
      worksCount: 0,
      isVerified: false,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    mockUsers.push(newUser)
    currentUser.value = newUser
    token.value = 'mock_token_' + Date.now()
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    localStorage.setItem(TOKEN_KEY, token.value)
    
    return { success: true, message: '注册成功' }
  }

  const logout = () => {
    currentUser.value = null
    token.value = null
    followingUsers.value = []
    favoriteVideos.value = []
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...data }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser.value))
      
      const index = mockUsers.findIndex(u => u.id === currentUser.value!.id)
      if (index !== -1) {
        mockUsers[index] = currentUser.value
      }
      
      return { success: true, message: '更新成功' }
    }
    
    return { success: false, message: '未登录' }
  }

  const deleteAccount = async (): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    logout()
    return { success: true, message: '账号已注销' }
  }

  const toggleFollow = async (userId: string): Promise<boolean> => {
    if (!currentUser.value) return false
    
    const index = followingUsers.value.findIndex(u => u.id === userId)
    const user = mockUsers.find(u => u.id === userId)
    
    if (index === -1 && user) {
      followingUsers.value.push(user)
      if (currentUser.value) {
        currentUser.value.followingCount++
      }
      return true
    } else {
      followingUsers.value.splice(index, 1)
      if (currentUser.value) {
        currentUser.value.followingCount--
      }
      return false
    }
  }

  const isFollowing = (userId: string): boolean => {
    return followingUsers.value.some(u => u.id === userId)
  }

  const toggleFavorite = (videoId: string): boolean => {
    const index = favoriteVideos.value.indexOf(videoId)
    if (index === -1) {
      favoriteVideos.value.push(videoId)
      return true
    } else {
      favoriteVideos.value.splice(index, 1)
      return false
    }
  }

  const isFavorited = (videoId: string): boolean => {
    return favoriteVideos.value.includes(videoId)
  }

  const getUserById = (userId: string): User | undefined => {
    return mockUsers.find(u => u.id === userId)
  }

  loadFromStorage()

  return {
    currentUser,
    token,
    isLoggedIn,
    followingUsers,
    favoriteVideos,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    toggleFollow,
    isFollowing,
    toggleFavorite,
    isFavorited,
    getUserById,
    loadFromStorage
  }
})
