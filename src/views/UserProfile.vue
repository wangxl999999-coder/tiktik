<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Grid3X3, 
  Heart, 
  Bookmark, 
  Share2, 
  MoreHorizontal,
  MapPin,
  Calendar,
  Check,
  UserPlus
} from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { useVideoStore } from '@/stores/video'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const videoStore = useVideoStore()

const activeTab = ref('works')

const userId = computed(() => route.params.id as string)
const user = computed(() => userStore.getUserById(userId.value))
const userVideos = computed(() => 
  user.value ? videoStore.getVideosByUser(user.value.id) : []
)
const isFollowing = computed(() => userStore.isFollowing(userId.value))

const tabs = [
  { id: 'works', name: '作品', icon: Grid3X3, count: computed(() => user.value?.worksCount || 0) },
  { id: 'likes', name: '喜欢', icon: Heart, count: computed(() => user.value?.likesCount || 0) }
]

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const navigateToVideo = (id: string) => {
  router.push(`/video/${id}`)
}

const handleFollow = () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  userStore.toggleFollow(userId.value)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<template>
  <div class="min-h-full">
    <div v-if="!user" class="h-full flex items-center justify-center">
      <div class="text-center">
        <h2 class="text-xl font-bold mb-2">用户不存在</h2>
        <button 
          class="text-tiktik-primary hover:underline"
          @click="router.back()"
        >
          返回上一页
        </button>
      </div>
    </div>

    <template v-else>
      <div class="relative h-64 bg-gradient-to-r from-tiktik-primary/30 to-tiktik-secondary/30">
        <div class="absolute inset-0 bg-black/40"></div>
        <img 
          :src="`https://picsum.photos/1200/400?random=${user.id}`" 
          alt="封面"
          class="w-full h-full object-cover mix-blend-overlay"
        />
        
        <div class="absolute top-4 right-4 flex items-center gap-2">
          <button class="p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors">
            <Share2 class="w-5 h-5" />
          </button>
          <button class="p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors">
            <MoreHorizontal class="w-5 h-5" />
          </button>
        </div>

        <div class="absolute bottom-0 left-0 right-0 p-6">
          <div class="flex items-end gap-6">
            <img 
              :src="user.avatar" 
              :alt="user.nickname"
              class="w-28 h-28 rounded-full border-4 border-black object-cover -mb-14 relative z-10"
            />
            <div class="flex-1 pb-4">
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-2xl font-bold">{{ user.nickname }}</h1>
                <span v-if="user.isVerified" class="text-tiktik-primary text-xl">✓</span>
              </div>
              <p v-if="user.bio" class="text-white/80 mb-2">{{ user.bio }}</p>
              <div class="flex items-center gap-4 text-sm text-white/60">
                <span v-if="user.location" class="flex items-center gap-1">
                  <MapPin class="w-4 h-4" />
                  {{ user.location }}
                </span>
                <span class="flex items-center gap-1">
                  <Calendar class="w-4 h-4" />
                  加入于 {{ formatDate(user.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-20 px-6">
        <div class="flex items-center gap-8 mb-6">
          <div class="text-center">
            <div class="text-2xl font-bold">{{ formatNumber(user.worksCount) }}</div>
            <div class="text-sm text-white/60">作品</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold">{{ formatNumber(user.followingCount) }}</div>
            <div class="text-sm text-white/60">关注</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold">{{ formatNumber(user.followersCount) }}</div>
            <div class="text-sm text-white/60">粉丝</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold">{{ formatNumber(user.likesCount) }}</div>
            <div class="text-sm text-white/60">获赞</div>
          </div>
        </div>

        <div class="flex gap-3 mb-6">
          <button 
            class="flex-1 max-w-[200px] py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-colors"
            :class="isFollowing 
              ? 'bg-white/10 hover:bg-white/20' 
              : 'bg-tiktik-primary hover:bg-opacity-90'"
            @click="handleFollow"
          >
            <Check v-if="isFollowing" class="w-5 h-5" />
            <UserPlus v-else class="w-5 h-5" />
            {{ isFollowing ? '已关注' : '关注' }}
          </button>
          <button class="px-8 py-3 bg-white/10 rounded-full font-medium hover:bg-white/20 transition-colors">
            私信
          </button>
        </div>

        <div class="flex gap-2 mb-6 border-b border-white/10">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors -mb-px"
            :class="activeTab === tab.id 
              ? 'text-tiktik-primary border-tiktik-primary' 
              : 'text-white/60 border-transparent hover:text-white'"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" class="w-5 h-5" />
            <span>{{ tab.name }}</span>
            <span class="px-2 py-0.5 bg-white/10 rounded-full text-xs">{{ tab.count.value }}</span>
          </button>
        </div>

        <div v-if="activeTab === 'works'" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-8">
          <button
            v-for="video in userVideos"
            :key="video.id"
            class="group aspect-[9/16] rounded-xl overflow-hidden relative"
            @click="navigateToVideo(video.id)"
          >
            <img 
              :src="video.coverUrl" 
              :alt="video.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="absolute bottom-2 left-2 right-2">
                <p class="text-sm font-medium truncate">{{ video.title }}</p>
                <div class="flex items-center gap-2 text-xs text-white/70 mt-1">
                  <span>❤️ {{ formatNumber(video.likesCount) }}</span>
                </div>
              </div>
            </div>
          </button>

          <div v-if="userVideos.length === 0" class="col-span-full text-center py-16">
            <h2 class="text-xl font-bold mb-2">还没有发布作品</h2>
          </div>
        </div>

        <div v-if="activeTab === 'likes'" class="text-center py-16">
          <Heart class="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h2 class="text-xl font-bold mb-2">喜欢的视频</h2>
          <p class="text-white/60">该用户的喜欢列表是私密的</p>
        </div>
      </div>
    </template>
  </div>
</template>
