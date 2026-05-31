<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { X, Heart, Send, Reply, MoreHorizontal } from 'lucide-vue-next'
import type { Video, Comment } from '@/types'
import { useVideoStore } from '@/stores/video'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  video: Video
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const videoStore = useVideoStore()
const userStore = useUserStore()

const commentInput = ref('')
const replyTo = ref<Comment | null>(null)
const replyInput = ref('')
const showMoreMenu = ref<string | null>(null)

const comments = computed(() => videoStore.getVideoComments(props.video.id))

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
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

const submitComment = () => {
  if (!userStore.isLoggedIn) {
    return
  }
  if (!commentInput.value.trim()) return
  
  videoStore.addComment(props.video.id, commentInput.value.trim())
  commentInput.value = ''
}

const submitReply = () => {
  if (!userStore.isLoggedIn || !replyTo.value) return
  if (!replyInput.value.trim()) return
  
  videoStore.addComment(props.video.id, replyInput.value.trim(), replyTo.value.id)
  replyTo.value = null
  replyInput.value = ''
}

const handleLike = (commentId: string) => {
  if (!userStore.isLoggedIn) return
  videoStore.toggleCommentLike(props.video.id, commentId)
}

const startReply = (comment: Comment) => {
  replyTo.value = comment
  showMoreMenu.value = null
}

const cancelReply = () => {
  replyTo.value = null
  replyInput.value = ''
}

const handleClose = () => {
  emit('close')
}

const isCommentLiked = (comment: Comment) => {
  return videoStore.isCommentLiked(props.video.id, comment.id)
}

onMounted(() => {
  if (!comments.value.length) {
    videoStore.getVideoComments(props.video.id)
  }
})
</script>

<template>
  <Transition name="slide">
    <div v-if="visible" class="modal-overlay" @click.self="handleClose">
      <div class="modal-slide-in max-w-lg w-full max-h-[80vh] bg-tiktik-gray rounded-t-2xl overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-white/10">
          <h3 class="text-lg font-bold">
            评论 ({{ formatNumber(video.commentsCount + comments.value.length) }})
          </h3>
          <button 
            class="p-2 rounded-full hover:bg-white/10 transition-colors"
            @click="handleClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="overflow-y-auto max-h-[50vh] hide-scrollbar">
          <div v-if="!comments.value.length" class="py-16 text-center">
            <p class="text-white/50">暂无评论，快来抢沙发吧~</p>
          </div>

          <div v-else class="divide-y divide-white/5">
            <div 
              v-for="comment in comments.value"
              :key="comment.id"
              class="p-4 hover:bg-white/5 transition-colors"
            >
              <div class="flex gap-3">
                <img 
                  :src="comment.user.avatar" 
                  :alt="comment.user.nickname"
                  class="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-sm">{{ comment.user.nickname }}</span>
                    <div class="relative">
                      <button 
                        class="p-1 rounded hover:bg-white/10 transition-colors"
                        @click="showMoreMenu = showMoreMenu === comment.id ? null : comment.id"
                      >
                        <MoreHorizontal class="w-4 h-4 text-white/50" />
                      </button>
                      <div 
                        v-if="showMoreMenu === comment.id"
                        class="absolute right-0 top-full mt-1 bg-black border border-white/10 rounded-lg py-1 min-w-[100px] z-20"
                      >
                        <button 
                          class="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                          @click="startReply(comment)"
                        >
                          回复
                        </button>
                        <button class="w-full px-4 py-2 text-left text-sm text-tiktik-danger hover:bg-white/10 transition-colors">
                          举报
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <p v-if="comment.parentId" class="text-xs text-white/50 mb-1">
                    回复 @{{ comments.value.find(c => c.id === comment.parentId)?.user.nickname }}
                  </p>
                  
                  <p class="text-sm text-white/90 mb-2 break-words">{{ comment.content }}</p>
                  
                  <div class="flex items-center justify-between text-xs text-white/50">
                    <span>{{ formatTime(comment.createdAt) }}</span>
                    <div class="flex items-center gap-4">
                      <button 
                        class="flex items-center gap-1 hover:text-tiktik-primary transition-colors"
                        @click="startReply(comment)"
                      >
                        <Reply class="w-3.5 h-3.5" />
                        回复
                      </button>
                      <button 
                        class="flex items-center gap-1"
                        :class="{ 'text-tiktik-primary': isCommentLiked(comment) }"
                        @click="handleLike(comment.id)"
                      >
                        <Heart 
                          class="w-3.5 h-3.5"
                          :class="{ 'fill-tiktik-primary': isCommentLiked(comment) }"
                        />
                        {{ formatNumber(comment.likesCount + (isCommentLiked(comment) ? 1 : 0)) }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-white/10 p-4 bg-black/30">
          <div v-if="replyTo" class="flex items-center justify-between mb-3 px-3 py-2 bg-white/5 rounded-lg">
            <span class="text-sm text-white/70">
              回复 <span class="text-tiktik-primary">@{{ replyTo.user.nickname }}</span>
            </span>
            <button 
              class="text-white/50 hover:text-white transition-colors"
              @click="cancelReply"
            >
              ×
            </button>
          </div>
          
          <div class="flex gap-3">
            <input
              v-model="replyTo ? replyInput : commentInput"
              type="text"
              :placeholder="replyTo ? '写下你的回复...' : '说点什么...'"
              class="flex-1 input-field py-2"
              maxlength="200"
              @keyup.enter="replyTo ? submitReply() : submitComment()"
            />
            <button 
              class="px-6 py-2 bg-tiktik-primary rounded-full font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!(replyTo ? replyInput : commentInput).trim()"
              @click="replyTo ? submitReply() : submitComment()"
            >
              <Send class="w-4 h-4" />
              <span>{{ replyTo ? '回复' : '发送' }}</span>
            </button>
          </div>
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
