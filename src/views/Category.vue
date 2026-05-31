<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Video, Flame } from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'
import { useVideoStore } from '@/stores/video'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const videoStore = useVideoStore()

const categoryId = computed(() => route.params.id as string)
const category = computed(() => appStore.categories.find(c => c.id === categoryId.value))
const categoryVideos = computed(() => 
  category.value ? videoStore.getVideosByCategory(category.value.name) : []
)

const formatNumber = (num: number): string => {
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
    <div v-if="!category" class="h-full flex items-center justify-center">
      <div class="text-center">
        <Video class="w-16 h-16 text-white/30 mx-auto mb-4" />
        <h2 class="text-xl font-bold mb-2">分类不存在</h2>
        <button 
          class="text-tiktik-primary hover:underline"
          @click="router.back()"
        >
          返回上一页
        </button>
      </div>
    </div>

    <template v-else>
      <div class="relative h-64">
        <div class="absolute inset-0 bg-gradient-to-br from-tiktik-primary/30 via-black to-tiktik-secondary/30"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
        
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <div class="max-w-4xl mx-auto">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-14 h-14 bg-gradient-to-br from-tiktik-primary to-tiktik-secondary rounded-xl flex items-center justify-center text-3xl">
                {{ category.emoji }}
              </div>
              <div>
                <h1 class="text-3xl font-bold mb-1">{{ category.name }}</h1>
                <p class="text-white/60">{{ formatNumber(category.videoCount) }} 条视频</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-6 py-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Flame class="w-5 h-5 text-tiktik-primary" />
            热门内容
          </h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <button
            v-for="video in categoryVideos"
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

        <div v-if="categoryVideos.length === 0" class="text-center py-16">
          <Video class="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h2 class="text-xl font-bold mb-2">暂无相关视频</h2>
          <p class="text-white/60">该分类下还没有内容</p>
        </div>
      </div>
    </template>
  </div>
</template>
