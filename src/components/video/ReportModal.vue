<script setup lang="ts">
import { ref } from 'vue'
import { X, Flag, AlertTriangle, CheckCircle } from 'lucide-vue-next'
import type { Video } from '@/types'

const props = defineProps<{
  video: Video
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const selectedReason = ref('')
const customReason = ref('')
const step = ref(1)
const submitting = ref(false)

const reportReasons = [
  { id: 'spam', label: '垃圾广告', icon: '📧' },
  { id: 'violence', label: '暴力内容', icon: '⚔️' },
  { id: 'porn', label: '色情低俗', icon: '🔞' },
  { id: 'copyright', label: '侵权内容', icon: '©️' },
  { id: 'fake', label: '虚假信息', icon: '❌' },
  { id: 'illegal', label: '违法违规', icon: '🚫' },
  { id: 'harassment', label: '辱骂骚扰', icon: '😠' },
  { id: 'other', label: '其他原因', icon: '📝' }
]

const submitReport = async () => {
  if (!selectedReason.value) return
  
  submitting.value = true
  
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  step.value = 3
  submitting.value = false
  
  setTimeout(() => {
    handleClose()
    step.value = 1
    selectedReason.value = ''
    customReason.value = ''
  }, 2000)
}

const handleClose = () => {
  emit('close')
}

const goBack = () => {
  if (step.value > 1) {
    step.value--
  } else {
    handleClose()
  }
}
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="handleClose">
      <div class="modal-content max-w-md">
        <div v-if="step === 1">
          <div class="flex items-center justify-between p-4 border-b border-white/10">
            <h3 class="text-lg font-bold flex items-center gap-2">
              <Flag class="w-5 h-5 text-tiktik-danger" />
              举报视频
            </h3>
            <button 
              class="p-2 rounded-full hover:bg-white/10 transition-colors"
              @click="handleClose"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-4">
            <div class="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-4">
              <img 
                :src="video.coverUrl" 
                :alt="video.title"
                class="w-14 h-14 rounded-lg object-cover"
              />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm truncate">{{ video.title }}</p>
                <p class="text-xs text-white/50">@{{ video.author.nickname }}</p>
              </div>
            </div>

            <p class="text-sm text-white/70 mb-4">请选择举报原因：</p>
            
            <div class="grid grid-cols-2 gap-2 mb-4">
              <button
                v-for="reason in reportReasons"
                :key="reason.id"
                class="flex items-center gap-2 p-3 rounded-xl text-left transition-colors"
                :class="selectedReason === reason.id 
                  ? 'bg-tiktik-primary/20 border-2 border-tiktik-primary' 
                  : 'bg-white/5 border-2 border-transparent hover:bg-white/10'"
                @click="selectedReason = reason.id"
              >
                <span class="text-xl">{{ reason.icon }}</span>
                <span class="text-sm">{{ reason.label }}</span>
              </button>
            </div>

            <button 
              :disabled="!selectedReason"
              class="w-full py-3 bg-tiktik-danger rounded-full font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              @click="step = 2"
            >
              下一步
            </button>
          </div>
        </div>

        <div v-if="step === 2">
          <div class="flex items-center gap-3 p-4 border-b border-white/10">
            <button 
              class="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
              @click="goBack"
            >
              ←
            </button>
            <h3 class="text-lg font-bold">补充说明</h3>
          </div>

          <div class="p-4">
            <div class="mb-4 p-3 bg-tiktik-warning/10 border border-tiktik-warning/30 rounded-xl">
              <div class="flex items-start gap-2">
                <AlertTriangle class="w-5 h-5 text-tiktik-warning flex-shrink-0 mt-0.5" />
                <p class="text-sm text-white/80">
                  请详细描述问题，这将帮助我们更快地处理举报内容。
                </p>
              </div>
            </div>

            <p class="text-sm text-white/70 mb-2">
              举报原因：
              <span class="text-white font-medium">
                {{ reportReasons.find(r => r.id === selectedReason)?.label }}
              </span>
            </p>

            <textarea
              v-model="customReason"
              rows="4"
              class="input-field resize-none mb-4"
              placeholder="请描述具体问题（选填）..."
              maxlength="500"
            />

            <div class="flex gap-3">
              <button 
                class="flex-1 py-3 bg-white/10 rounded-full font-medium hover:bg-white/20 transition-colors"
                @click="goBack"
              >
                取消
              </button>
              <button 
                :disabled="submitting"
                class="flex-1 py-3 bg-tiktik-danger rounded-full font-medium hover:bg-opacity-90 transition-all disabled:opacity-50"
                @click="submitReport"
              >
                {{ submitting ? '提交中...' : '提交举报' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="step === 3" class="p-8 text-center">
          <div class="w-20 h-20 bg-tiktik-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle class="w-10 h-10 text-tiktik-success" />
          </div>
          <h3 class="text-xl font-bold mb-2">举报已提交</h3>
          <p class="text-white/60">
            感谢您的反馈，我们会尽快处理。
          </p>
        </div>
      </div>
    </div>
  </Transition>
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
</style>
