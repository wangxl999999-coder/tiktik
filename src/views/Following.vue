<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Users, Video, Calendar } from 'lucide-vue-next'
import { useVideoStore } from '@/stores/video'
import { useUserStore } from '@/stores/user'
import VideoCard from '@/components/video/VideoCard.vue'

const router = useRouter()
const videoStore = useVideoStore()
const userStore = useUserStore()

const activeTab = ref('feed')
const containerRef = ref<HTMLDivElement | null>(null)
const currentIndex = ref(0)

const followingVideos = computed(() => videoStore.getFollowingVideos())
const followingUsers = computed(() => userStore.followingUsers)

const tabs = [
  { id: 'feed', name: '动态', icon: Video },
  { id: 'following', name: '已关注', icon: Users }
]

const handleNext = () => {
  if (currentIndex.value < followingVideos.value.length - 1) {
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

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

const navigateToUser = (id: string) => {
  router.push(`/profile/${id}`)
}

onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
  }
})
</script>

<template>
  <div class="h-full">
    <div v-if="!userStore.isLoggedIn" class="h-full flex items-center justify-center">
      <div class="text-center">
        <Users class="w-16 h-16 text-white/30 mx-auto mb-4" />
        <h2 class="text-xl font-bold mb-2">登录后查看关注动态</h2>
        <p class="text-white/60 mb-4">关注你喜欢的创作者，不错过任何精彩内容</p>
        <button 
          class="px-8 py-3 bg-tiktik-primary rounded-full font-medium hover:bg-opacity-90 transition-colors"
          @click="router.push('/login')"
        >
          立即登录
        </button>
      </div>
    </div>

    <template v-else>
      <div class="flex border-b border-white/10 mb-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors"
          :class="activeTab === tab.id ? 'text-tiktik-primary' : 'text-white/60 hover:text-white'"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="w-5 h-5" />
          <span>{{ tab.name }}</span>
          <span 
            v-if="tab.id === 'following' && followingUsers.length > 0"
            class="px-2 py-0.5 bg-white/10 rounded-full text-xs"
          >
            {{ followingUsers.length }}
          </span>
        </button>
      </div>

      <div v-if="activeTab === 'feed'" class="h-[calc(100%-60px)]">
        <div v-if="followingVideos.length === 0" class="h-full flex items-center justify-center">
          <div class="text-center">
            <Video class="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h2 class="text-xl font-bold mb-2">暂无更新</h2>
            <p class="text-white/60 mb-4">你关注的创作者还没有发布新作品</p>
            <button 
              class="px-8 py-3 bg-tiktik-primary rounded-full font-medium hover:bg-opacity-90 transition-colors"
              @click="router.push('/discover')"
            >
              去发现更多
            </button>
          </div>
        </div>

        <div 
          v-else
          ref="containerRef"
          class="h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar"
        >
          <div
            v-for="(video, index) in followingVideos"
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
      </div>

      <div v-if="activeTab === 'following'" class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="user in followingUsers"
            :key="user.id"
            class="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            @click="navigateToUser(user.id)"
          >
            <img 
              :src="user.avatar" 
              :alt="user.nickname"
              class="w-14 h-14 rounded-full object-cover"
            />
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">{{ user.nickname }}</div>
              <div class="text-sm text-white/60">
                {{ formatNumber(user.followersCount) }} 粉丝 · 
                {{ user.worksCount }} 作品
              </div>
            </div>
            <button 
              class="px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
              @click.stop="userStore.toggleFollow(user.id)"
            >
              已关注
            </button>
          </div>
        </div>

        <div v-if="followingUsers.length === 0" class="text-center py-16">
          <Users class="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h2 class="text-xl font-bold mb-2">还没有关注任何人</h2>
          <p class="text-white/60 mb-4">去发现页看看，关注你喜欢的创作者吧</p>
          <button 
            class="px-8 py-3 bg-tiktik-primary rounded-full font-medium hover:bg-opacity-90 transition-colors"
            @click="router.push('/discover')"
          >
            去发现
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
