<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  Home, 
  Users, 
  Compass, 
  Radio, 
  MessageCircle, 
  User, 
  Search, 
  Bell, 
  Settings,
  LogOut,
  ChevronDown,
  Upload
} from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()

const searchQuery = ref('')
const showUserMenu = ref(false)

const navItems = [
  { path: '/home', name: '首页', icon: Home },
  { path: '/following', name: '关注', icon: Users },
  { path: '/discover', name: '发现', icon: Compass },
  { path: '/live', name: '直播', icon: Radio },
  { path: '/messages', name: '消息', icon: MessageCircle },
  { path: '/profile', name: '我', icon: User }
]

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    appStore.addHotSearch(searchQuery.value.trim())
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSearch()
  }
}

const navigateTo = (path: string) => {
  router.push(path)
  showUserMenu.value = false
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
  showUserMenu.value = false
}

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md border-b border-white/10 z-50">
    <div class="h-full px-6 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <div 
          class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          @click="router.push('/home')"
        >
          <div class="w-10 h-10 bg-gradient-to-r from-tiktik-primary to-tiktik-secondary rounded-xl flex items-center justify-center font-bold text-xl">
            T
          </div>
          <span class="text-2xl font-bold bg-gradient-to-r from-tiktik-primary to-tiktik-secondary bg-clip-text text-transparent">
            TikTik
          </span>
        </div>

        <nav class="hidden lg:flex items-center gap-1">
          <button
            v-for="item in navItems.slice(0, 5)"
            :key="item.path"
            class="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200"
            :class="route.path === item.path ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'"
            @click="navigateTo(item.path)"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="font-medium">{{ item.name }}</span>
            <span 
              v-if="item.path === '/messages' && appStore.unreadMessagesCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-tiktik-primary rounded-full text-xs flex items-center justify-center"
            >
              {{ formatNumber(appStore.unreadMessagesCount) }}
            </span>
          </button>
        </nav>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative hidden md:block">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索视频、用户、话题..."
            class="w-80 px-5 py-2.5 pl-12 bg-white/10 border border-white/10 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-tiktik-primary transition-colors"
            @keydown="handleKeydown"
          />
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <button 
            v-if="searchQuery"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            @click="searchQuery = ''"
          >
            ×
          </button>
        </div>

        <button class="hidden md:flex items-center gap-2 px-4 py-2 bg-tiktik-primary rounded-full font-medium hover:bg-opacity-90 transition-all">
          <Upload class="w-5 h-5" />
          <span>发布</span>
        </button>

        <button 
          class="relative p-2 rounded-full hover:bg-white/10 transition-colors"
          @click="router.push('/messages')"
        >
          <Bell class="w-6 h-6" />
          <span 
            v-if="appStore.totalUnread > 0"
            class="absolute top-0 right-0 w-5 h-5 bg-tiktik-primary rounded-full text-xs flex items-center justify-center"
          >
            {{ appStore.totalUnread > 99 ? '99+' : appStore.totalUnread }}
          </span>
        </button>

        <div v-if="userStore.isLoggedIn" class="relative">
          <button 
            class="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
            @click="showUserMenu = !showUserMenu"
          >
            <img 
              :src="userStore.currentUser?.avatar" 
              :alt="userStore.currentUser?.nickname"
              class="w-9 h-9 rounded-full object-cover border-2 border-transparent hover:border-tiktik-primary transition-colors"
            />
            <ChevronDown class="w-4 h-4" :class="{ 'rotate-180': showUserMenu }" />
          </button>

          <div 
            v-if="showUserMenu"
            class="absolute right-0 top-full mt-2 w-56 bg-tiktik-gray border border-white/10 rounded-xl py-2 shadow-2xl"
          >
            <div class="px-4 py-3 border-b border-white/10">
              <div class="font-medium">{{ userStore.currentUser?.nickname }}</div>
              <div class="text-sm text-white/60 mt-0.5">{{ userStore.currentUser?.phone }}</div>
            </div>
            
            <button 
              class="w-full px-4 py-2.5 text-left hover:bg-white/5 transition-colors flex items-center gap-3"
              @click="navigateTo('/profile')"
            >
              <User class="w-5 h-5" />
              <span>个人中心</span>
            </button>
            
            <button 
              class="w-full px-4 py-2.5 text-left hover:bg-white/5 transition-colors flex items-center gap-3"
              @click="navigateTo('/settings')"
            >
              <Settings class="w-5 h-5" />
              <span>账号设置</span>
            </button>

            <div class="border-t border-white/10 my-2"></div>
            
            <button 
              class="w-full px-4 py-2.5 text-left hover:bg-white/5 transition-colors flex items-center gap-3 text-tiktik-danger"
              @click="handleLogout"
            >
              <LogOut class="w-5 h-5" />
              <span>退出登录</span>
            </button>
          </div>
        </div>

        <div v-else class="flex items-center gap-3">
          <button 
            class="px-5 py-2 text-white/80 hover:text-white transition-colors font-medium"
            @click="router.push('/login')"
          >
            登录
          </button>
          <button 
            class="px-5 py-2 bg-tiktik-primary rounded-full font-medium hover:bg-opacity-90 transition-all"
            @click="router.push('/register')"
          >
            注册
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
