<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, TrendingUp, Clock, X, Hash, Users, Video } from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'
import { useVideoStore } from '@/stores/video'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const videoStore = useVideoStore()

const searchQuery = ref('')
const activeTab = ref('all')
const showHistory = ref(true)

const hotSearches = computed(() => appStore.hotSearches.slice(0, 15))
const searchHistory = computed(() => appStore.searchHistory)

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return { videos: [], users: [], topics: [] }
  return videoStore.searchVideos(searchQuery.value.trim())
})

const tabs = [
  { id: 'all', name: '综合' },
  { id: 'video', name: '视频' },
  { id: 'user', name: '用户' },
  { id: 'topic', name: '话题' }
]

const doSearch = () => {
  if (!searchQuery.value.trim()) return
  appStore.addHotSearch(searchQuery.value.trim())
  showHistory.value = false
}

const clearHistory = () => {
  appStore.clearSearchHistory()
}

const handleSearchItemClick = (keyword: string) => {
  searchQuery.value = keyword
  doSearch()
}

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const navigateToVideo = (id: string) => {
  router.push(`/video/${id}`)
}

const navigateToUser = (id: string) => {
  router.push(`/profile/${id}`)
}

const navigateToTopic = (id: string) => {
  router.push(`/topic/${id}`)
}

onMounted(() => {
  const query = route.query.q as string
  if (query) {
    searchQuery.value = decodeURIComponent(query)
    doSearch()
  }
})
</script>

<template>
  <div class="min-h-full py-6 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <div class="relative max-w-2xl mx-auto">
          <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索视频、用户、话题..."
            class="w-full pl-14 pr-24 py-4 bg-white/10 border border-white/10 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-tiktik-primary transition-colors text-lg"
            @keyup.enter="doSearch"
          />
          <button 
            v-if="searchQuery"
            class="absolute right-14 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            @click="searchQuery = ''; showHistory = true"
          >
            <X class="w-5 h-5" />
          </button>
          <button 
            class="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-tiktik-primary rounded-full font-medium hover:bg-opacity-90 transition-colors"
            @click="doSearch"
          >
            搜索
          </button>
        </div>
      </div>

      <template v-if="!searchQuery.trim() || showHistory">
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold flex items-center gap-2">
              <TrendingUp class="w-5 h-5 text-tiktik-primary" />
              热搜榜
            </h2>
            <button class="text-sm text-white/50 hover:text-white transition-colors">
              换一批
            </button>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <button
              v-for="(item, index) in hotSearches"
              :key="item.id"
              class="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left group"
              @click="handleSearchItemClick(item.keyword)"
            >
              <span 
                class="w-6 h-6 rounded flex items-center justify-center text-sm font-bold flex-shrink-0"
                :class="{
                  'bg-tiktik-primary text-white': index < 3,
                  'bg-white/10 text-white/70': index >= 3
                }"
              >
                {{ index + 1 }}
              </span>
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate group-hover:text-tiktik-primary transition-colors">{{ item.keyword }}</div>
                <div class="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                  <TrendingUp 
                    v-if="item.trend === 'up'" 
                    class="w-3 h-3 text-tiktik-primary" 
                  />
                  <span>{{ formatNumber(item.viewsCount) }}</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div v-if="searchHistory.length > 0">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold flex items-center gap-2">
              <Clock class="w-5 h-5 text-white/50" />
              搜索历史
            </h2>
            <button 
              class="text-sm text-white/50 hover:text-tiktik-danger transition-colors"
              @click="clearHistory"
            >
              清空
            </button>
          </div>
          
          <div class="flex flex-wrap gap-2">
            <button
              v-for="keyword in searchHistory"
              :key="keyword"
              class="px-4 py-2 bg-white/5 rounded-full text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
              @click="handleSearchItemClick(keyword as string)"
            >
              <Clock class="w-3.5 h-3.5 text-white/50" />
              {{ keyword as string }}
            </button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="mb-6">
          <p class="text-white/60">
            搜索 "<span class="text-tiktik-primary font-medium">{{ searchQuery }}</span>" 共找到 
            <span class="text-tiktik-primary font-medium">{{ searchResults.videos.length + searchResults.users.length + searchResults.topics.length }}</span> 
            条结果
          </p>
        </div>

        <div class="flex gap-2 mb-6 border-b border-white/10">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="px-6 py-3 font-medium border-b-2 transition-colors -mb-px"
            :class="activeTab === tab.id 
              ? 'text-tiktik-primary border-tiktik-primary' 
              : 'text-white/60 border-transparent hover:text-white'"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>

        <div v-if="activeTab === 'all' || activeTab === 'video'" class="mb-8">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
            <Video class="w-5 h-5 text-tiktik-primary" />
            视频 ({{ searchResults.videos.length }})
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <button
              v-for="video in searchResults.videos"
              :key="video.id"
              class="group aspect-[9/16] rounded-xl overflow-hidden relative hover:ring-2 hover:ring-tiktik-primary transition-all"
              @click="navigateToVideo(video.id)"
            >
              <img 
                :src="video.coverUrl" 
                :alt="video.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div class="absolute bottom-2 left-2 right-2">
                  <p class="text-sm font-medium truncate">{{ video.title }}</p>
                  <p class="text-xs text-white/70">@{{ video.author.nickname }}</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'all' || activeTab === 'user'" class="mb-8">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
            <Users class="w-5 h-5 text-tiktik-secondary" />
            用户 ({{ searchResults.users.length }})
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="user in searchResults.users"
              :key="user.id"
              class="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              @click="navigateToUser(user.id)"
            >
              <img 
                :src="user.avatar" 
                :alt="user.nickname"
                class="w-14 h-14 rounded-full object-cover"
              />
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate">{{ user.nickname }}</div>
                <div class="text-sm text-white/60">{{ formatNumber(user.followersCount) }} 粉丝</div>
              </div>
              <button class="px-4 py-1.5 bg-tiktik-primary rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors">
                关注
              </button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'all' || activeTab === 'topic'" class="mb-8">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
            <Hash class="w-5 h-5 text-yellow-400" />
            话题 ({{ searchResults.topics.length }})
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="topic in searchResults.topics"
              :key="topic.id"
              class="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              @click="navigateToTopic(topic.id)"
            >
              <div class="flex items-center gap-2 mb-2">
                <Hash class="w-5 h-5 text-yellow-400" />
                <span class="font-medium">{{ topic.name }}</span>
              </div>
              <p class="text-sm text-white/60 mb-3 line-clamp-2">{{ topic.description }}</p>
              <p class="text-xs text-white/50">{{ formatNumber(topic.viewsCount) }} 播放</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
