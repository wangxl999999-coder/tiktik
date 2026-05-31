<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Flame, TrendingUp, Trophy, Hash, Video } from 'lucide-vue-next'
import { useVideoStore } from '@/stores/video'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const videoStore = useVideoStore()
const appStore = useAppStore()

const activeTab = ref('videos')

const hotVideos = computed(() => videoStore.getHotVideos())
const hotTopics = computed(() => appStore.getHotTopics())

const tabs = [
  { id: 'videos', name: '热门视频', icon: Video },
  { id: 'topics', name: '热门话题', icon: Hash }
]

const formatNumber = (num: number): string => {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿'
  }
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
</script>

<template>
  <div class="min-h-full py-6 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center gap-3 mb-8">
        <div class="relative">
          <Flame class="w-8 h-8 text-tiktik-primary" />
          <Trophy class="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
        </div>
        <h1 class="text-3xl font-bold">热门榜单</h1>
      </div>

      <div class="flex gap-2 mb-8 border-b border-white/10">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors -mb-px"
          :class="activeTab === tab.id 
            ? 'text-tiktik-primary border-tiktik-primary' 
            : 'text-white/60 border-transparent hover:text-white'"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="w-5 h-5" />
          <span>{{ tab.name }}</span>
        </button>
      </div>

      <div v-if="activeTab === 'videos'">
        <div class="grid grid-cols-1 gap-4">
          <div
            v-for="(video, index) in hotVideos"
            :key="video.id"
            class="flex gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group"
            @click="navigateToVideo(video.id)"
          >
            <div class="relative">
              <div 
                class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-2xl"
                :class="{
                  'bg-gradient-to-br from-yellow-400 to-yellow-600': index === 0,
                  'bg-gradient-to-br from-gray-300 to-gray-500': index === 1,
                  'bg-gradient-to-br from-amber-600 to-amber-800': index === 2,
                  'bg-white/10': index > 2
                }"
              >
                {{ index + 1 }}
              </div>
              <TrendingUp 
                v-if="index < 3" 
                class="absolute -bottom-1 -right-1 w-5 h-5 text-tiktik-primary" 
              />
            </div>

            <img 
              :src="video.coverUrl" 
              :alt="video.title"
              class="w-24 h-40 rounded-xl object-cover flex-shrink-0"
            />

            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-lg mb-1 truncate group-hover:text-tiktik-primary transition-colors">
                {{ video.title }}
              </h3>
              <p class="text-sm text-white/60 mb-3 line-clamp-2">{{ video.description }}</p>
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <img 
                    :src="video.author.avatar" 
                    :alt="video.author.nickname"
                    class="w-6 h-6 rounded-full"
                  />
                  <span class="text-sm">@{{ video.author.nickname }}</span>
                </div>
                <span class="text-sm text-white/50">❤️ {{ formatNumber(video.likesCount) }}</span>
                <span class="text-sm text-white/50">👁️ {{ formatNumber(video.viewsCount) }}</span>
                <span class="text-sm text-white/50">💬 {{ formatNumber(video.commentsCount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'topics'">
        <div class="space-y-4">
          <div
            v-for="(topic, index) in hotTopics"
            :key="topic.id"
            class="flex items-center gap-4 p-5 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group"
            @click="navigateToTopic(topic.id)"
          >
            <div 
              class="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
              :class="{
                'bg-gradient-to-br from-yellow-400 to-yellow-600': index === 0,
                'bg-gradient-to-br from-gray-300 to-gray-500': index === 1,
                'bg-gradient-to-br from-amber-600 to-amber-800': index === 2,
                'bg-white/10': index > 2
              }"
            >
              {{ index + 1 }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <Hash class="w-5 h-5 text-yellow-400" />
                <h3 class="font-bold text-lg group-hover:text-tiktik-primary transition-colors">{{ topic.name }}</h3>
                <TrendingUp 
                  v-if="topic.trend === 'up'" 
                  class="w-4 h-4 text-tiktik-primary" 
                />
              </div>
              <p class="text-sm text-white/60 mb-2">{{ topic.description }}</p>
              <div class="flex items-center gap-4 text-sm text-white/50">
                <span>👁️ {{ formatNumber(topic.viewsCount) }} 播放</span>
                <span>👥 {{ formatNumber(topic.participantsCount) }} 人参与</span>
              </div>
            </div>

            <div class="text-tiktik-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              查看详情 →
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
