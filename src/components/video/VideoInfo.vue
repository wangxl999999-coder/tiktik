<script setup lang="ts">
import { useRouter } from 'vue-router'
import { MapPin, Hash, UserPlus, Check } from 'lucide-vue-next'
import type { Video } from '@/types'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  video: Video
}>()

const router = useRouter()
const userStore = useUserStore()

const navigateToUser = (userId: string) => {
  router.push(`/profile/${userId}`)
}

const navigateToTopic = (topicId: string) => {
  router.push(`/topic/${topicId}`)
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN')
}
</script>

<template>
  <div class="absolute left-4 right-24 bottom-24 z-10">
    <div class="flex items-center gap-3 mb-3">
      <button 
        class="flex items-center gap-2 hover:opacity-80 transition-opacity"
        @click="navigateToUser(video.userId)"
      >
        <span class="font-bold text-lg">@{{ video.author.nickname }}</span>
        <span v-if="video.author.isVerified" class="text-tiktik-primary text-sm">✓</span>
      </button>
      
      <button
        v-if="!video.isFollowing"
        class="px-4 py-1 border border-tiktik-primary text-tiktik-primary rounded-full text-sm font-medium hover:bg-tiktik-primary hover:text-white transition-colors"
        @click="userStore.toggleFollow(video.userId)"
      >
        关注
      </button>
      <button
        v-else
        class="px-4 py-1 bg-white/20 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-white/30 transition-colors"
      >
        <Check class="w-4 h-4" />
        已关注
      </button>
    </div>

    <p class="text-white/90 mb-2 leading-relaxed break-words">
      {{ video.description }}
    </p>

    <div class="flex flex-wrap gap-2 mb-2">
      <button
        v-for="topic in video.topics"
        :key="topic.id"
        class="inline-flex items-center gap-1 text-tiktik-secondary hover:underline transition-colors"
        @click="navigateToTopic(topic.id)"
      >
        <Hash class="w-4 h-4" />
        <span>{{ topic.name }}</span>
      </button>
    </div>

    <div class="flex items-center gap-4 text-sm text-white/60">
      <span>{{ formatTime(video.createdAt) }}</span>
      <span v-if="video.location" class="flex items-center gap-1">
        <MapPin class="w-4 h-4" />
        {{ video.location }}
      </span>
    </div>
  </div>
</template>
