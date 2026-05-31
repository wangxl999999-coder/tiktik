<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  X, 
  Link2, 
  Copy, 
  Check,
  MessageCircle,
  Download,
  QrCode
} from 'lucide-vue-next'
import type { Video } from '@/types'
import { useVideoStore } from '@/stores/video'

const props = defineProps<{
  video: Video
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const videoStore = useVideoStore()
const copied = ref(false)
const shareLink = ref('')

const shareOptions = [
  { name: '私信', icon: MessageCircle, color: 'text-blue-400' },
  { name: '保存视频', icon: Download, color: 'text-green-400' },
  { name: '二维码', icon: QrCode, color: 'text-purple-400' },
  { name: '复制链接', icon: Link2, color: 'text-yellow-400' }
]

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (e) {
    console.error('复制失败', e)
  }
}

const handleShare = (option: typeof shareOptions[0]) => {
  if (option.name === '复制链接') {
    copyLink()
  }
  videoStore.shareVideo(props.video.id)
}

const handleClose = () => {
  emit('close')
}

onMounted(() => {
  shareLink.value = `${window.location.origin}/video/${props.video.id}`
})
</script>

<template>
  <Transition name="slide">
    <div v-if="visible" class="modal-overlay" @click.self="handleClose">
      <div class="modal-slide-in max-w-lg w-full bg-tiktik-gray rounded-t-2xl overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-white/10">
          <h3 class="text-lg font-bold">分享视频</h3>
          <button 
            class="p-2 rounded-full hover:bg-white/10 transition-colors"
            @click="handleClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-4 gap-4 mb-6">
            <button
              v-for="option in shareOptions"
              :key="option.name"
              class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors"
              @click="handleShare(option)"
            >
              <div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
                <component :is="option.icon" class="w-7 h-7" :class="option.color" />
              </div>
              <span class="text-xs text-white/80">{{ option.name }}</span>
            </button>
          </div>

          <div class="p-4 bg-white/5 rounded-xl">
            <div class="flex items-center gap-3">
              <img 
                :src="video.coverUrl" 
                :alt="video.title"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-sm truncate">{{ video.title }}</h4>
                <p class="text-xs text-white/50 truncate mt-1">{{ video.description }}</p>
              </div>
            </div>
          </div>

          <div class="mt-4 flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            <Link2 class="w-5 h-5 text-white/50 flex-shrink-0" />
            <span class="flex-1 text-sm text-white/70 truncate">{{ shareLink }}</span>
            <button 
              class="flex items-center gap-1 px-3 py-1.5 bg-tiktik-primary rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors"
              @click="copyLink"
            >
              <Check v-if="copied" class="w-4 h-4" />
              <Copy v-else class="w-4 h-4" />
              <span>{{ copied ? '已复制' : '复制' }}</span>
            </button>
          </div>

          <p class="text-center text-xs text-white/40 mt-6">
            分享给好友，一起看精彩内容~
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.modal-slide-in {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
