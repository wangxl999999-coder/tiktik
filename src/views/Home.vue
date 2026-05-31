<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import VideoCard from '@/components/video/VideoCard.vue'
import { useVideoStore } from '@/stores/video'
import { useAppStore } from '@/stores/app'

const videoStore = useVideoStore()
const appStore = useAppStore()

const containerRef = ref<HTMLDivElement | null>(null)
const currentIndex = ref(0)
const isScrolling = ref(false)

const videos = computed(() => videoStore.getRecommendedVideos())

const handleNext = () => {
  if (currentIndex.value < videos.value.length - 1) {
    currentIndex.value++
    scrollToCurrent()
  }
}

const handlePrev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    scrollToCurrent()
  }
}

const scrollToCurrent = () => {
  if (!containerRef.value) return
  const target = containerRef.value.children[currentIndex.value] as HTMLElement
  target?.scrollIntoView({ behavior: 'smooth' })
}

const handleScroll = () => {
  if (!containerRef.value || isScrolling.value) return
  
  isScrolling.value = true
  
  requestAnimationFrame(() => {
    if (containerRef.value) {
      const scrollTop = containerRef.value.scrollTop
      const height = containerRef.value.clientHeight
      const newIndex = Math.round(scrollTop / height)
      if (newIndex !== currentIndex.value) {
        currentIndex.value = newIndex
        videoStore.currentVideoIndex = newIndex
      }
    }
    isScrolling.value = false
  })
}

watch(() => appStore.sidebarCollapsed, () => {
  nextTick(() => {
    scrollToCurrent()
  })
})

onMounted(() => {
  currentIndex.value = videoStore.currentVideoIndex
})
</script>

<template>
  <div class="h-full">
    <div 
      ref="containerRef"
      class="h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar"
      @scroll="handleScroll"
    >
      <div
        v-for="(video, index) in videos"
        :key="video.id"
        class="h-full w-full"
      >
        <VideoCard
          :video="video"
          :is-active="index === currentIndex"
          @next="handleNext"
          @prev="handlePrev"
        />
      </div>
    </div>

    <div class="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
      <button
        v-for="(video, index) in videos.slice(0, 10)"
        :key="video.id"
        class="w-1.5 rounded-full transition-all duration-300"
        :class="index === currentIndex 
          ? 'h-6 bg-tiktik-primary' 
          : 'h-1.5 bg-white/30 hover:bg-white/50'"
        @click="currentIndex = index; scrollToCurrent()"
      ></button>
    </div>
  </div>
</template>
