<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Hash, Share2, Users, Play, TrendingUp } from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'
import { useVideoStore } from '@/stores/video'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const videoStore = useVideoStore()

const topicId = computed(() => route.params.id as string)
const topic = computed(() => appStore.topics.find(t => t.id === topicId.value))
const topicVideos = computed(() => 
  topic.value ? videoStore.getVideosByTopic(topicId.value) : []
)

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
</script>

<template>
  <div class="min-h-full">
    <div v-if="!topic" class="h-full flex items-center justify-center">
      <div class="text-center">
        <Hash class="w-16 h-16 text-white/30 mx-auto mb-4" />
        <h2 class="text-xl font-bold mb-2">话题不存在</h2>
        <button 
          class="text-tiktik-primary hover:underline"
          @click="router.back()"
        >
          返回上一页
        </button>
      </div>
    </div>

    <template v-else>
      <div class="relative h-80 bg-gradient-to-br from-tiktik-primary/20 via-black to-tiktik-secondary/20">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
        
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <div class="max-w-4xl mx-auto">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-16 h-16 bg-gradient-to-br from-tiktik-primary to-tiktik-secondary rounded-xl flex items-center justify-center">
                <Hash class="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 class="text-4xl font-bold mb-1">#{{ topic.name }}</h1>
                <div class="flex items-center gap-4 text-white/60">
                  <span class="flex items-center gap-1">
                    <Play class="w-4 h-4" />
                    {{ formatNumber(topic.viewsCount) }} 播放
                  </span>
                  <span class="flex items-center gap-1">
                    <Users class="w-4 h-4" />
                    {{ formatNumber(topic.participantsCount) }} 人参与
                  </span>
                  <span 
                    v-if="topic.trend === 'up'" 
                    class="flex items-center gap-1 text-tiktik-primary"
                  >
                    <TrendingUp class="w-4 h-4" />
                    热门
                  </span>
                </div>
              </div>
            </div>

            <p class="text-white/80 mb-6 max-w-2xl">{{ topic.description }}</p>

            <div class="flex items-center gap-3">
              <button class="px-8 py-3 bg-tiktik-primary rounded-full font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2">
                <Play class="w-5 h-5" />
                参与挑战
              </button>
              <button class="px-6 py-3 bg-white/10 rounded-full font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
                <Share2 class="w-5 h-5" />
                分享
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-6 py-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold">热门视频</h2>
          <div class="flex items-center gap-2">
            <button class="px-4 py-2 bg-tiktik-primary rounded-full text-sm font-medium">
              最热
            </button>
            <button class="px-4 py-2 bg-white/10 rounded-full text-sm font-medium hover:bg-white/20 transition-colors">
              最新
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <button
            v-for="video in topicVideos"
            :key="video.id"
            class="group aspect-[9/16] rounded-xl overflow-hidden relative"
            @click="navigateToVideo(video.id)"
          >
            <img 
              :src="video.coverUrl" 
              :alt="video.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
              <div class="absolute bottom-2 left-2 right-2">
                <p class="text-sm font-medium truncate mb-1">{{ video.title }}</p>
                <div class="flex items-center justify-between text-xs text-white/70">
                  <span>@{{ video.author.nickname }}</span>
                  <span>❤️ {{ formatNumber(video.likesCount) }}</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        <div v-if="topicVideos.length === 0" class="text-center py-16">
          <Hash class="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h2 class="text-xl font-bold mb-2">暂无相关视频</h2>
          <p class="text-white/60 mb-4">快来发布第一个参与话题的视频吧~</p>
          <button class="px-8 py-3 bg-tiktik-primary rounded-full font-medium hover:bg-opacity-90 transition-colors">
            发布视频
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
