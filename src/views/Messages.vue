<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  MessageCircle, 
  Heart, 
  UserPlus, 
  Bell, 
  Send,
  Check,
  MoreHorizontal,
  Search
} from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const activeTab = ref('all')
const searchQuery = ref('')

const tabs = [
  { id: 'all', name: '全部' },
  { id: 'message', name: '私信', icon: MessageCircle },
  { id: 'like', name: '点赞', icon: Heart },
  { id: 'follow', name: '关注', icon: UserPlus },
  { id: 'system', name: '通知', icon: Bell }
]

const filteredMessages = computed(() => {
  let messages = [...appStore.messages]
  
  if (activeTab.value !== 'all') {
    messages = messages.filter(m => m.type === activeTab.value)
  }
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    messages = messages.filter(m => 
      m.content.toLowerCase().includes(query) || 
      m.fromUser?.nickname.toLowerCase().includes(query)
    )
  }
  
  return messages.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})

const notifications = computed(() => 
  appStore.notifications.filter(n => n.type !== 'announcement')
)

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

const markAsRead = (id: string) => {
  appStore.markMessageAsRead(id)
}

const markAllAsRead = () => {
  appStore.markAllMessagesAsRead()
}
</script>

<template>
  <div class="min-h-full py-6 px-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold">消息</h1>
        <button 
          v-if="appStore.unreadMessagesCount > 0"
          class="text-sm text-tiktik-primary hover:underline flex items-center gap-1"
          @click="markAllAsRead"
        >
          <Check class="w-4 h-4" />
          全部已读
        </button>
      </div>

      <div class="relative mb-6">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索消息..."
          class="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/10 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-tiktik-primary transition-colors"
        />
      </div>

      <div class="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-colors"
          :class="activeTab === tab.id 
            ? 'bg-tiktik-primary text-white' 
            : 'bg-white/10 text-white/70 hover:bg-white/20'"
          @click="activeTab = tab.id"
        >
          <component v-if="tab.icon" :is="tab.icon" class="w-4 h-4" />
          <span>{{ tab.name }}</span>
          <span 
            v-if="tab.id === 'message' && appStore.unreadMessagesCount > 0"
            class="w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center"
          >
            {{ appStore.unreadMessagesCount > 99 ? '99+' : appStore.unreadMessagesCount }}
          </span>
        </button>
      </div>

      <div class="space-y-2">
        <div
          v-for="message in filteredMessages"
          :key="message.id"
          class="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          :class="{ 'bg-tiktik-primary/10': !message.isRead }"
          @click="markAsRead(message.id)"
        >
          <div class="relative">
            <img 
              :src="message.fromUser?.avatar || '/default-avatar.png'" 
              :alt="message.fromUser?.nickname || '系统消息'"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div 
              v-if="message.type === 'like'"
              class="absolute -bottom-1 -right-1 w-6 h-6 bg-tiktik-primary rounded-full flex items-center justify-center"
            >
              <Heart class="w-3 h-3 text-white" fill="white" />
            </div>
            <div 
              v-if="message.type === 'follow'"
              class="absolute -bottom-1 -right-1 w-6 h-6 bg-tiktik-secondary rounded-full flex items-center justify-center"
            >
              <UserPlus class="w-3 h-3 text-white" />
            </div>
            <div 
              v-if="message.type === 'system'"
              class="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
            >
              <Bell class="w-3 h-3 text-white" />
            </div>
            <div 
              v-if="message.type === 'message'"
              class="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <MessageCircle class="w-3 h-3 text-white" />
            </div>
            <span 
              v-if="!message.isRead"
              class="absolute top-0 right-0 w-3 h-3 bg-tiktik-primary rounded-full"
            ></span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <span class="font-medium">
                {{ message.fromUser?.nickname || '系统消息' }}
              </span>
              <span class="text-xs text-white/50">{{ formatTime(message.createdAt) }}</span>
            </div>
            <p class="text-sm text-white/70 truncate">{{ message.content }}</p>
          </div>

          <button class="p-2 rounded-full hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
            <MoreHorizontal class="w-5 h-5 text-white/50" />
          </button>
        </div>

        <div v-if="filteredMessages.length === 0" class="text-center py-16">
          <MessageCircle class="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h2 class="text-xl font-bold mb-2">暂无消息</h2>
          <p class="text-white/60">你的消息会在这里显示</p>
        </div>
      </div>

      <div v-if="notifications.length > 0" class="mt-10">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
          <Bell class="w-5 h-5 text-yellow-400" />
          系统通知
        </h2>
        
        <div class="space-y-3">
          <div
            v-for="notification in notifications.slice(0, 3)"
            :key="notification.id"
            class="p-4 bg-gradient-to-r from-yellow-500/10 to-transparent border-l-4 border-yellow-500 rounded-r-xl"
          >
            <div class="flex items-start justify-between mb-1">
              <span class="font-medium text-yellow-400">{{ notification.title }}</span>
              <span class="text-xs text-white/50">{{ formatTime(notification.createdAt) }}</span>
            </div>
            <p class="text-sm text-white/70">{{ notification.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
