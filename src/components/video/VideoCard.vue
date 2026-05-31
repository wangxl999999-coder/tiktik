<script setup lang="ts">
import { ref, computed } from 'vue'
import VideoPlayer from './VideoPlayer.vue'
import VideoActions from './VideoActions.vue'
import VideoInfo from './VideoInfo.vue'
import CommentModal from './CommentModal.vue'
import ShareModal from './ShareModal.vue'
import ReportModal from './ReportModal.vue'
import type { Video } from '@/types'
import { useVideoStore } from '@/stores/video'

const props = defineProps<{
  video: Video
  isActive: boolean
}>()

const emit = defineEmits<{
  (e: 'next'): void
  (e: 'prev'): void
}>()

const videoPlayerRef = ref<InstanceType<typeof VideoPlayer> | null>(null)

const showComments = ref(false)
const showShare = ref(false)
const showReport = ref(false)

const openComments = () => {
  showComments.value = true
}

const openShare = () => {
  showShare.value = true
}

const openReport = () => {
  showReport.value = true
}
</script>

<template>
  <div class="h-full w-full relative snap-start snap-always">
    <VideoPlayer
      v-if="isActive"
      ref="videoPlayerRef"
      :video-url="video.videoUrl"
      :poster="video.coverUrl"
      :auto-play="isActive"
      @next="emit('next')"
      @prev="emit('prev')"
    />
    
    <div v-else class="h-full w-full flex items-center justify-center">
      <img 
        :src="video.coverUrl" 
        :alt="video.title"
        class="w-full h-full object-cover"
      />
    </div>

    <VideoActions 
      :video="video"
      @open-comments="openComments"
      @open-share="openShare"
      @open-report="openReport"
    />

    <VideoInfo :video="video" />

    <CommentModal 
      :video="video"
      :visible="showComments"
      @close="showComments = false"
    />

    <ShareModal 
      :video="video"
      :visible="showShare"
      @close="showShare = false"
    />

    <ReportModal 
      :video="video"
      :visible="showReport"
      @close="showReport = false"
    />
  </div>
</template>
