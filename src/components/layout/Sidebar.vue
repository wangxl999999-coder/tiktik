<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Users, 
  Flame, 
  UserPlus, 
  Utensils,
  Music,
  Plane,
  Cpu,
  Heart,
  Dumbbell,
  Headphones,
  Shirt,
  Hash,
  TrendingUp,
  ChevronRight
} from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const iconMap: Record<string, any> = {
  utensils: Utensils,
  music: Music,
  plane: Plane,
  cpu: Cpu,
  heart: Heart,
  dumbbell: Dumbbell,
  headphones: Headphones,
  shirt: Shirt
}

const followingList = computed(() => appStore.getFollowingList().slice(0, 6))
const hotTopics = computed(() => appStore.getHotTopics().slice(0, 5))
const recommendedAccounts = computed(() => appStore.getRecommendedAccounts().slice(0, 6))
const categories = computed(() => appStore.categories.slice(0, 8))

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <aside 
    class="w-64 h-full bg-black/50 border-r border-white/10 overflow-y-auto hide-scrollbar flex-shrink-0"
    :class="{ 'w-0 overflow-hidden': appStore.sidebarCollapsed }"
  >
    <div class="p-4 space-y-6">
      <div v-if="userStore.isLoggedIn">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-medium text-white/60 uppercase tracking-wider">我的关注</h3>
          <button 
            class="text-xs text-tiktik-primary hover:underline"
            @click="navigateTo('/following')"
          >
            查看全部
          </button>
        </div>
        <div class="space-y-2">
          <button
            v-for="user in followingList"
            :key="user.id"
            class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
            @click="navigateTo(`/profile/${user.id}`)"
          >
            <img :src="user.avatar" :alt="user.nickname" class="w-9 h-9 rounded-full object-cover" />
            <div class="flex-1 min-w-0 text-left">
              <div class="font-medium text-sm truncate">{{ user.nickname }}</div>
              <div class="text-xs text-white/50">{{ formatNumber(user.followersCount) }} 粉丝</div>
            </div>
          </button>
        </div>
      </div>

      <div>
        <div class="flex items-center gap-2 mb-3">
          <Flame class="w-4 h-4 text-tiktik-primary" />
          <h3 class="text-sm font-medium text-white/60 uppercase tracking-wider">热门话题</h3>
        </div>
        <div class="space-y-1">
          <button
            v-for="topic in hotTopics"
            :key="topic.id"
            class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
            @click="navigateTo(`/topic/${topic.id}`)"
          >
            <Hash class="w-5 h-5 text-white/50" />
            <div class="flex-1 min-w-0 text-left">
              <div class="text-sm truncate">{{ topic.name }}</div>
              <div class="flex items-center gap-2 mt-0.5">
                <TrendingUp 
                  v-if="topic.trend === 'up'" 
                  class="w-3 h-3 text-tiktik-primary" 
                />
                <span class="text-xs text-white/50">{{ formatNumber(topic.viewsCount) }} 播放</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div>
        <div class="flex items-center gap-2 mb-3">
          <UserPlus class="w-4 h-4 text-tiktik-secondary" />
          <h3 class="text-sm font-medium text-white/60 uppercase tracking-wider">推荐账号</h3>
        </div>
        <div class="space-y-2">
          <button
            v-for="user in recommendedAccounts"
            :key="user.id"
            class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
            @click="navigateTo(`/profile/${user.id}`)"
          >
            <img :src="user.avatar" :alt="user.nickname" class="w-9 h-9 rounded-full object-cover" />
            <div class="flex-1 min-w-0 text-left">
              <div class="flex items-center gap-1">
                <span class="font-medium text-sm truncate">{{ user.nickname }}</span>
                <span v-if="user.isVerified" class="text-tiktik-primary">✓</span>
              </div>
              <div class="text-xs text-white/50">{{ formatNumber(user.followersCount) }} 粉丝</div>
            </div>
            <ChevronRight class="w-4 h-4 text-white/30" />
          </button>
        </div>
      </div>

      <div>
        <div class="flex items-center gap-2 mb-3">
          <Utensils class="w-4 h-4 text-yellow-400" />
          <h3 class="text-sm font-medium text-white/60 uppercase tracking-wider">分类浏览</h3>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="category in categories"
            :key="category.id"
            class="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            @click="navigateTo(`/category/${category.id}`)"
          >
            <component :is="iconMap[category.icon]" class="w-4 h-4" />
            <span class="text-sm truncate">{{ category.name }}</span>
          </button>
        </div>
      </div>

      <div class="pt-4 border-t border-white/10">
        <div class="text-xs text-white/40 space-y-2">
          <p class="flex flex-wrap gap-2">
            <span class="hover:text-white/60 cursor-pointer">关于我们</span>
            <span class="hover:text-white/60 cursor-pointer">帮助中心</span>
            <span class="hover:text-white/60 cursor-pointer">用户协议</span>
            <span class="hover:text-white/60 cursor-pointer">隐私政策</span>
          </p>
          <p>© 2024 TikTik v{{ appStore.currentVersion }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>
