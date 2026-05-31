<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import VideoCard from '@/components/video/VideoCard.vue'
import { useVideoStore } from '@/stores/video'

const route = useRoute()
const router = useRouter()
const videoStore = useVideoStore()

const videoId = computed(() => route.params.id as string)
const videoIndex = computed(() => 
  videoStore.videos.findIndex(v => v.id === videoId.value)
)
const video = computed(() => 
  videoStore.videos.find(v => v.id === videoId.value)
)

const handleNext = () => {
  if (videoIndex.value < videoStore.videos.length - 1) {
    const nextVideo = videoStore.videos[videoIndex.value + 1]
    router.push(`/video/${nextVideo.id}`)
  }
}

const handlePrev = () => {
  if (videoIndex.value > 0) {
    const prevVideo = videoStore.videos[videoIndex.value - 1]
    router.push(`/video/${prevVideo.id}`)
  }
}

onMounted(() => {
  if (videoIndex.value !== -1) {
    videoStore.currentVideoIndex = videoIndex.value
  }
})
</script>

<template>
  <div class="h-full relative">
    <button 
      class="absolute top-4 left-4 z-50 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      @click="router.back()"
    >
      <ArrowLeft class="w-6 h-6" />
    </button>

    <div v-if="!video" class="h-full flex items-center justify-center">
      <div class="text-center">
        <h2 class="text-xl font-bold mb-2">视频不存在</h2>
        <button 
          class="text-tiktik-primary hover:underline"
          @click="router.push('/home')"
        >
          返回首页
        </button>
      </div>
    </div>

    <VideoCard
      v-else
      :video="video"
      :is-active="true"
      @next="handleNext"
      @prev="handlePrev"
    />
  </div>
</template>
