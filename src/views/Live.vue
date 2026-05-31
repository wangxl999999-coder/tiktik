<script setup lang="ts">
import { computed } from 'vue'
import { Radio, Users, Eye, Heart } from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const liveRooms = computed(() => appStore.liveRooms)

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}
</script>

<template>
  <div class="min-h-full py-6 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center gap-3 mb-8">
        <div class="relative">
          <Radio class="w-8 h-8 text-tiktik-primary" />
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-tiktik-danger rounded-full animate-pulse"></span>
        </div>
        <h1 class="text-3xl font-bold">直播</h1>
      </div>

      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <span class="px-3 py-1 bg-tiktik-danger rounded-full text-xs font-medium animate-pulse">
            热门直播
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="room in liveRooms"
            :key="room.id"
            class="group cursor-pointer"
          >
            <div class="relative aspect-video rounded-2xl overflow-hidden mb-3">
              <img 
                :src="room.coverUrl" 
                :alt="room.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <div class="absolute top-3 left-3 flex items-center gap-2">
                  <span class="flex items-center gap-1 px-2 py-1 bg-tiktik-danger rounded-lg text-xs font-medium">
                    <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    直播中
                  </span>
                  <span class="flex items-center gap-1 px-2 py-1 bg-black/50 rounded-lg text-xs">
                    <Eye class="w-3 h-3" />
                    {{ formatNumber(room.viewersCount) }}
                  </span>
                </div>
                
                <div class="absolute bottom-3 left-3 right-3">
                  <h3 class="font-bold text-lg mb-1 truncate">{{ room.title }}</h3>
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-2">
                      <img 
                        :src="room.anchor.avatar" 
                        :alt="room.anchor.nickname"
                        class="w-7 h-7 rounded-full border-2 border-tiktik-primary"
                      />
                      <span class="text-sm">{{ room.anchor.nickname }}</span>
                    </div>
                    <span class="flex items-center gap-1 text-sm text-white/70">
                      <Heart class="w-3 h-3 text-tiktik-primary" />
                      {{ formatNumber(room.likesCount) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span v-for="tag in room.tags.slice(0, 2)" :key="tag" class="px-2 py-0.5 bg-white/10 rounded text-xs">
                  {{ tag }}
                </span>
              </div>
              <span class="text-xs text-white/50">{{ room.category }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center py-16">
        <Radio class="w-16 h-16 text-white/30 mx-auto mb-4" />
        <h2 class="text-xl font-bold mb-2">更多精彩直播即将上线</h2>
        <p class="text-white/60">敬请期待更多优质直播内容</p>
      </div>
    </div>
  </div>
</template>
