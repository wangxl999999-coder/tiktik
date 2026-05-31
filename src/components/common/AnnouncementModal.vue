<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const announcement = appStore.notifications.find(n => n.type === 'announcement' && !n.isRead)

const close = () => {
  if (announcement) {
    appStore.markNotificationAsRead(announcement.id)
  }
  appStore.closeAnnouncement()
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content max-w-md">
      <div class="relative">
        <img 
          v-if="announcement?.imageUrl"
          :src="announcement.imageUrl" 
          alt="公告"
          class="w-full h-40 object-cover"
        />
        <button 
          class="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          @click="close"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-6">
        <h2 class="text-xl font-bold mb-2">{{ announcement?.title }}</h2>
        <p class="text-white/70 mb-6">{{ announcement?.content }}</p>
        
        <div class="flex gap-3">
          <button 
            class="flex-1 py-3 bg-white/10 rounded-full font-medium hover:bg-white/20 transition-colors"
            @click="close"
          >
            稍后再说
          </button>
          <button 
            class="flex-1 py-3 bg-tiktik-primary rounded-full font-medium hover:bg-opacity-90 transition-colors"
            @click="close"
          >
            立即体验
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
