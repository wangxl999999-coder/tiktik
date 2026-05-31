<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Flag,
  Music
} from 'lucide-vue-next'
import type { Video } from '@/types'
import { useVideoStore } from '@/stores/video'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  video: Video
}>()

const emit = defineEmits<{
  (e: 'openComments'): void
  (e: 'openShare'): void
  (e: 'openReport'): void
}>()

const router = useRouter()
const videoStore = useVideoStore()
const userStore = useUserStore()

const isAnimating = ref(false)

const isLiked = computed(() => videoStore.isLiked(props.video.id))
const isFavorited = computed(() => userStore.isFavorited(props.video.id))

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const handleLike = () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  isAnimating.value = true
  videoStore.toggleLike(props.video.id)
  
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}

const handleFavorite = () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  userStore.toggleFavorite(props.video.id)
}

const navigateToUser = (userId: string) => {
  router.push(`/profile/${userId}`)
}
</script>

<template>
  <div class="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-10">
    <div class="relative">
      <button 
        class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
        @click="navigateToUser(video.userId)"
      >
        <img 
          :src="video.author.avatar" 
          :alt="video.author.nickname"
          class="w-11 h-11 rounded-full object-cover border-2 border-transparent"
        />
      </button>
      <button 
        v-if="!video.isFollowing"
        class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-tiktik-primary rounded-full flex items-center justify-center text-sm font-bold hover:bg-opacity-90 transition-colors"
        @click.stop="userStore.toggleFollow(video.userId)"
      >
        +
      </button>
    </div>

    <button 
      class="flex flex-col items-center gap-1 group"
      @click="handleLike"
    >
      <div 
        class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
        :class="{ 'scale-110': isAnimating }"
      >
        <Heart 
          class="w-7 h-7 transition-all duration-300"
          :class="{ 'text-tiktik-primary fill-tiktik-primary scale-110': isLiked }"
        />
      </div>
      <span class="text-xs font-medium">{{ formatNumber(video.likesCount + (isLiked ? 1 : 0)) }}</span>
    </button>

    <button 
      class="flex flex-col items-center gap-1 group"
      @click="emit('openComments')"
    >
      <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
        <MessageCircle class="w-7 h-7" />
      </div>
      <span class="text-xs font-medium">{{ formatNumber(video.commentsCount) }}</span>
    </button>

    <button 
      class="flex flex-col items-center gap-1 group"
      @click="handleFavorite"
    >
      <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
        <Bookmark 
          class="w-7 h-7 transition-all"
          :class="{ 'text-yellow-400 fill-yellow-400': isFavorited }"
        />
      </div>
      <span class="text-xs font-medium">收藏</span>
    </button>

    <button 
      class="flex flex-col items-center gap-1 group"
      @click="emit('openShare')"
    >
      <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
        <Share2 class="w-7 h-7" />
      </div>
      <span class="text-xs font-medium">{{ formatNumber(video.sharesCount) }}</span>
    </button>

    <button 
      class="flex flex-col items-center gap-1 group"
      @click="emit('openReport')"
    >
      <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
        <Flag class="w-6 h-6 text-white/70" />
      </div>
      <span class="text-xs text-white/70">举报</span>
    </button>

    <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-spin-slow">
      <Music class="w-6 h-6" />
    </div>
  </div>
</template>
