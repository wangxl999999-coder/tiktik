<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Flame, TrendingUp, Hash, Users, Video, Sparkles } from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'
import { useVideoStore } from '@/stores/video'

const router = useRouter()
const appStore = useAppStore()
const videoStore = useVideoStore()

const activeTab = ref('hot')

const hotVideos = computed(() => videoStore.getHotVideos().slice(0, 10))
const hotTopics = computed(() => appStore.getHotTopics().slice(0, 6))
const recommendedAccounts = computed(() => appStore.getRecommendedAccounts().slice(0, 6))
const categories = computed(() => appStore.categories)

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

const navigateToVideo = (id: string) => {
  router.push(`/video/${id}`)
}

const navigateToTopic = (id: string) => {
  router.push(`/topic/${id}`)
}

const navigateToCategory = (id: string) => {
  router.push(`/category/${id}`)
}

const navigateToUser = (id: string) => {
  router.push(`/profile/${id}`)
}

const navigateToHot = () => {
  router.push('/hot')
}
</script>

<template>
  <div class="min-h-full py-6 px-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">发现更多精彩</h1>

      <div class="flex gap-2 mb-8 border-b border-white/10">
        <button
          class="px-6 py-3 font-medium border-b-2 transition-colors -mb-px text-tiktik-primary border-tiktik-primary"
        >
          推荐
        </button>
        <button
          class="px-6 py-3 font-medium border-b-2 transition-colors -mb-px text-white/60 border-transparent hover:text-white"
          @click="navigateToHot"
        >
          热门
        </button>
        <button
          class="px-6 py-3 font-medium border-b-2 transition-colors -mb-px text-white/60 border-transparent hover:text-white"
        >
          挑战
        </button>
      </div>

      <div class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Flame class="w-5 h-5 text-tiktik-primary" />
            热门视频
          </h2>
          <button 
            class="text-sm text-white/50 hover:text-tiktik-primary transition-colors"
            @click="navigateToHot"
          >
            查看全部 →
          </button>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <button
            v-for="video in hotVideos"
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
              <div class="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-black/50 rounded-full text-xs">
                <Sparkles class="w-3 h-3 text-tiktik-primary" />
                热门
              </div>
              <div class="absolute bottom-2 left-2 right-2">
                <p class="text-sm font-medium truncate">{{ video.title }}</p>
                <div class="flex items-center gap-2 text-xs text-white/70 mt-1">
                  <span>{{ formatNumber(video.viewsCount) }} 播放</span>
                  <span>·</span>
                  <span>{{ formatNumber(video.likesCount) }} 赞</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Hash class="w-5 h-5 text-yellow-400" />
            热门话题
          </h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="topic in hotTopics"
            :key="topic.id"
            class="p-5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
            @click="navigateToTopic(topic.id)"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-2">
                <Hash class="w-6 h-6 text-yellow-400" />
                <h3 class="text-lg font-bold group-hover:text-tiktik-primary transition-colors">{{ topic.name }}</h3>
              </div>
              <TrendingUp 
                v-if="topic.trend === 'up'" 
                class="w-5 h-5 text-tiktik-primary" 
              />
            </div>
            <p class="text-sm text-white/60 mb-3 line-clamp-2">{{ topic.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-white/50">{{ formatNumber(topic.viewsCount) }} 播放</span>
              <span class="text-sm text-tiktik-primary opacity-0 group-hover:opacity-100 transition-opacity">
                参与挑战 →
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Users class="w-5 h-5 text-tiktik-secondary" />
            推荐关注
          </h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="user in recommendedAccounts"
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
              <div class="font-medium truncate flex items-center gap-1">
                {{ user.nickname }}
                <span v-if="user.isVerified" class="text-tiktik-primary">✓</span>
              </div>
              <div class="text-sm text-white/60">{{ formatNumber(user.followersCount) }} 粉丝</div>
            </div>
            <button class="px-4 py-1.5 bg-tiktik-primary rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors">
              关注
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-bold flex items-center gap-2 mb-4">
          <Video class="w-5 h-5 text-purple-400" />
          分类浏览
        </h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            v-for="category in categories"
            :key="category.id"
            class="p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-center group"
            @click="navigateToCategory(category.id)"
          >
            <div class="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-tiktik-primary/20 to-tiktik-secondary/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              {{ category.emoji }}
            </div>
            <h3 class="font-medium group-hover:text-tiktik-primary transition-colors">{{ category.name }}</h3>
            <p class="text-xs text-white/50 mt-1">{{ formatNumber(category.videoCount) }} 视频</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
