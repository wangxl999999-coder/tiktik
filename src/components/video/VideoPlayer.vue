<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Settings,
  SkipBack,
  SkipForward,
  Repeat
} from 'lucide-vue-next'
import { useVideoStore } from '@/stores/video'

const props = defineProps<{
  videoUrl: string
  poster?: string
  autoPlay?: boolean
}>()

const emit = defineEmits<{
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'ended'): void
  (e: 'timeupdate', currentTime: number, duration: number): void
  (e: 'next'): void
  (e: 'prev'): void
}>()

const videoStore = useVideoStore()

const videoRef = ref<HTMLVideoElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(videoStore.playerSettings.muted)
const volume = ref(videoStore.playerSettings.volume)
const playbackRate = ref(videoStore.playerSettings.playbackRate)
const currentTime = ref(0)
const duration = ref(0)
const showControls = ref(true)
const showSettings = ref(false)
const showVolumeSlider = ref(false)
const isDragging = ref(false)
const controlsTimer = ref<number | null>(null)
const isLoading = ref(true)
const hasError = ref(false)

const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2]

const progress = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
})

const formattedTime = computed(() => {
  const format = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${format(currentTime.value)} / ${format(duration.value)}`
})

const togglePlay = () => {
  if (!videoRef.value) return
  
  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play().catch(() => {})
  }
}

const toggleMute = () => {
  if (!videoRef.value) return
  isMuted.value = !isMuted.value
  videoRef.value.muted = isMuted.value
  videoStore.updatePlayerSettings({ muted: isMuted.value })
}

const handleVolumeChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  volume.value = parseFloat(target.value)
  if (videoRef.value) {
    videoRef.value.volume = volume.value
    isMuted.value = volume.value === 0
    videoStore.updatePlayerSettings({ volume: volume.value, muted: isMuted.value })
  }
}

const setPlaybackRate = (rate: number) => {
  playbackRate.value = rate
  if (videoRef.value) {
    videoRef.value.playbackRate = rate
    videoStore.updatePlayerSettings({ playbackRate: rate })
  }
  showSettings.value = false
}

const handleTimeUpdate = () => {
  if (!videoRef.value || isDragging.value) return
  currentTime.value = videoRef.value.currentTime
  emit('timeupdate', currentTime.value, duration.value)
}

const handleLoadedMetadata = () => {
  if (!videoRef.value) return
  duration.value = videoRef.value.duration
  isLoading.value = false
  
  if (props.autoPlay && videoStore.playerSettings.autoPlay) {
    videoRef.value.play().catch(() => {
      isPlaying.value = false
    })
  }
}

const handlePlay = () => {
  isPlaying.value = true
  isLoading.value = false
  emit('play')
  hideControlsWithDelay()
}

const handlePause = () => {
  isPlaying.value = false
  emit('pause')
  showControls.value = true
  if (controlsTimer.value) {
    clearTimeout(controlsTimer.value)
  }
}

const handleEnded = () => {
  isPlaying.value = false
  emit('ended')
  if (videoStore.playerSettings.autoPlay) {
    emit('next')
  }
}

const handleWaiting = () => {
  isLoading.value = true
}

const handleCanPlay = () => {
  isLoading.value = false
}

const handleError = () => {
  isLoading.value = false
  hasError.value = true
}

const handleProgressClick = (e: MouseEvent) => {
  if (!videoRef.value || !containerRef.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  const newTime = percent * duration.value
  
  videoRef.value.currentTime = newTime
  currentTime.value = newTime
}

const handleProgressDrag = (e: MouseEvent) => {
  isDragging.value = true
  handleProgressClick(e)
  
  const handleMove = (moveEvent: MouseEvent) => {
    handleProgressClick(moveEvent)
  }
  
  const handleUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseup', handleUp)
  }
  
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleUp)
}

const skip = (seconds: number) => {
  if (!videoRef.value) return
  videoRef.value.currentTime = Math.max(0, Math.min(duration.value, videoRef.value.currentTime + seconds))
}

const hideControlsWithDelay = () => {
  if (controlsTimer.value) {
    clearTimeout(controlsTimer.value)
  }
  controlsTimer.value = window.setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 3000)
}

const handleMouseMove = () => {
  showControls.value = true
  showSettings.value = false
  showVolumeSlider.value = false
  hideControlsWithDelay()
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  if (e.deltaY > 0) {
    emit('next')
  } else {
    emit('prev')
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

  switch (e.key) {
    case ' ':
      e.preventDefault()
      togglePlay()
      break
    case 'ArrowUp':
      e.preventDefault()
      emit('prev')
      break
    case 'ArrowDown':
      e.preventDefault()
      emit('next')
      break
    case 'ArrowLeft':
      e.preventDefault()
      skip(-5)
      break
    case 'ArrowRight':
      e.preventDefault()
      skip(5)
      break
    case 'm':
    case 'M':
      toggleMute()
      break
    case 'f':
    case 'F':
      setPlaybackRate(playbackRate.value >= 2 ? 0.5 : playbackRate.value + 0.25)
      break
  }
}

const reload = () => {
  hasError.value = false
  isLoading.value = true
  if (videoRef.value) {
    videoRef.value.load()
  }
}

watch(() => props.videoUrl, () => {
  currentTime.value = 0
  duration.value = 0
  isPlaying.value = false
  isLoading.value = true
  hasError.value = false
  nextTick(() => {
    if (videoRef.value && props.autoPlay) {
      videoRef.value.play().catch(() => {})
    }
  })
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  if (videoRef.value) {
    videoRef.value.volume = volume.value
    videoRef.value.muted = isMuted.value
    videoRef.value.playbackRate = playbackRate.value
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (controlsTimer.value) {
    clearTimeout(controlsTimer.value)
  }
})

defineExpose({
  play: () => videoRef.value?.play(),
  pause: () => videoRef.value?.pause(),
  reload
})
</script>

<template>
  <div 
    ref="containerRef"
    class="video-container"
    @mousemove="handleMouseMove"
    @mouseleave="isPlaying && (showControls = false)"
    @wheel.passive="handleWheel"
  >
    <video
      ref="videoRef"
      class="video-element"
      :src="videoUrl"
      :poster="poster"
      :muted="isMuted"
      :loop="videoStore.playerSettings.loop"
      playsinline
      webkit-playsinline
      @click="togglePlay"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @play="handlePlay"
      @pause="handlePause"
      @ended="handleEnded"
      @waiting="handleWaiting"
      @canplay="handleCanPlay"
      @error="handleError"
    />

    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black/30">
      <div class="w-12 h-12 border-4 border-white/30 border-t-tiktik-primary rounded-full animate-spin"></div>
    </div>

    <div v-if="hasError" class="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
      <p class="text-white/80 mb-4">视频加载失败</p>
      <button 
        class="px-6 py-2 bg-tiktik-primary rounded-full hover:bg-opacity-90 transition-colors"
        @click="reload"
      >
        重新加载
      </button>
    </div>

    <div 
      v-if="!isPlaying && !isLoading && !hasError"
      class="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
      @click="togglePlay"
    >
      <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
        <Play class="w-10 h-10 text-white ml-1" fill="white" />
      </div>
    </div>

    <transition name="fade">
      <div 
        v-if="showControls"
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4"
      >
        <div 
          class="relative h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer group"
          @click="handleProgressClick"
          @mousedown="handleProgressDrag"
        >
          <div 
            class="absolute h-full bg-tiktik-primary rounded-full"
            :style="{ width: `${progress}%` }"
          >
            <div class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -mr-2"></div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button 
              class="p-2 rounded-full hover:bg-white/20 transition-colors"
              @click="togglePlay"
            >
              <Pause v-if="isPlaying" class="w-6 h-6" />
              <Play v-else class="w-6 h-6" />
            </button>

            <button 
              class="p-2 rounded-full hover:bg-white/20 transition-colors"
              @click="skip(-5)"
            >
              <SkipBack class="w-5 h-5" />
            </button>

            <button 
              class="p-2 rounded-full hover:bg-white/20 transition-colors"
              @click="skip(5)"
            >
              <SkipForward class="w-5 h-5" />
            </button>

            <div class="relative">
              <button 
                class="p-2 rounded-full hover:bg-white/20 transition-colors"
                @click="toggleMute"
                @mouseenter="showVolumeSlider = true"
                @mouseleave="showVolumeSlider = false"
              >
                <VolumeX v-if="isMuted || volume === 0" class="w-5 h-5" />
                <Volume2 v-else class="w-5 h-5" />
              </button>
              
              <div 
                v-show="showVolumeSlider"
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 rounded-lg"
                @mouseenter="showVolumeSlider = true"
                @mouseleave="showVolumeSlider = false"
              >
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  :value="isMuted ? 0 : volume"
                  class="w-24 h-1 accent-tiktik-primary cursor-pointer"
                  @input="handleVolumeChange"
                />
              </div>
            </div>

            <span class="text-sm text-white/80 font-mono">{{ formattedTime }}</span>
          </div>

          <div class="flex items-center gap-3">
            <div class="relative">
              <button 
                class="p-2 rounded-full hover:bg-white/20 transition-colors"
                @click="showSettings = !showSettings"
              >
                <Settings class="w-5 h-5" :class="{ 'animate-spin-slow': showSettings }" />
              </button>

              <div 
                v-if="showSettings"
                class="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg overflow-hidden min-w-[120px]"
              >
                <div class="px-3 py-2 text-xs text-white/60 border-b border-white/10">播放速度</div>
                <button
                  v-for="rate in playbackRates"
                  :key="rate"
                  class="w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors flex items-center justify-between"
                  :class="{ 'text-tiktik-primary': playbackRate === rate }"
                  @click="setPlaybackRate(rate)"
                >
                  <span>{{ rate }}x</span>
                  <span v-if="playbackRate === rate">✓</span>
                </button>
              </div>
            </div>

            <button 
              class="p-2 rounded-full hover:bg-white/20 transition-colors"
              @click="videoStore.updatePlayerSettings({ loop: !videoStore.playerSettings.loop })"
              :class="{ 'text-tiktik-primary': videoStore.playerSettings.loop }"
            >
              <Repeat class="w-5 h-5" />
            </button>

            <button 
              class="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <Maximize2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div class="absolute bottom-24 right-4 text-xs text-white/60 bg-black/30 px-2 py-1 rounded">
      <span class="mr-2">↑↓ 切换视频</span>
      <span class="mr-2">空格 播放/暂停</span>
      <span>M 静音</span>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-runnable-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #FE2C55;
  margin-top: -5px;
}

input[type="range"]::-moz-range-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #FE2C55;
  border: none;
}
</style>
