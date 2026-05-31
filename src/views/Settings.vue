<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, 
  Image, 
  FileText, 
  Bell, 
  Shield, 
  Trash2, 
  ArrowLeft,
  Camera,
  CheckCircle,
  AlertTriangle
} from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const formData = reactive({
  nickname: userStore.currentUser?.nickname || '',
  bio: userStore.currentUser?.bio || '',
  avatar: userStore.currentUser?.avatar || ''
})

const activeTab = ref('profile')
const saving = ref(false)
const showDeleteConfirm = ref(false)
const deleting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const saveProfile = async () => {
  if (!formData.nickname.trim()) {
    errorMessage.value = '昵称不能为空'
    return
  }

  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await userStore.updateProfile({
      nickname: formData.nickname.trim(),
      bio: formData.bio.trim(),
      avatar: formData.avatar
    })

    if (result.success) {
      successMessage.value = '保存成功'
      setTimeout(() => {
        successMessage.value = ''
      }, 2000)
    } else {
      errorMessage.value = result.message
    }
  } catch (e) {
    errorMessage.value = '保存失败，请重试'
  } finally {
    saving.value = false
  }
}

const handleAvatarChange = () => {
  const newSeed = Date.now()
  formData.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`
}

const deleteAccount = async () => {
  deleting.value = true
  
  try {
    const result = await userStore.deleteAccount()
    if (result.success) {
      router.push('/login')
    }
  } catch (e) {
    console.error(e)
  } finally {
    deleting.value = false
    showDeleteConfirm.value = false
  }
}

const tabs = [
  { id: 'profile', name: '账号资料', icon: User },
  { id: 'notifications', name: '消息通知', icon: Bell },
  { id: 'privacy', name: '隐私设置', icon: Shield }
]
</script>

<template>
  <div class="min-h-full py-8 px-6">
    <div class="max-w-2xl mx-auto">
      <button 
        class="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        @click="router.back()"
      >
        <ArrowLeft class="w-5 h-5" />
        <span>返回</span>
      </button>

      <h1 class="text-3xl font-bold mb-8">账号设置</h1>

      <div class="flex gap-2 mb-8 border-b border-white/10">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex items-center gap-2 px-5 py-3 font-medium border-b-2 transition-colors -mb-px"
          :class="activeTab === tab.id 
            ? 'text-tiktik-primary border-tiktik-primary' 
            : 'text-white/60 border-transparent hover:text-white'"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="w-5 h-5" />
          <span>{{ tab.name }}</span>
        </button>
      </div>

      <div v-if="activeTab === 'profile'" class="card p-6">
        <h2 class="text-xl font-bold mb-6">编辑资料</h2>

        <div v-if="successMessage" class="mb-4 p-3 bg-tiktik-success/20 border border-tiktik-success/30 rounded-lg text-tiktik-success text-sm flex items-center gap-2">
          <CheckCircle class="w-5 h-5" />
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="mb-4 p-3 bg-tiktik-danger/20 border border-tiktik-danger/30 rounded-lg text-tiktik-danger text-sm flex items-center gap-2">
          <AlertTriangle class="w-5 h-5" />
          {{ errorMessage }}
        </div>

        <div class="space-y-6">
          <div class="flex items-center gap-6">
            <div class="relative">
              <img 
                :src="formData.avatar" 
                alt="头像"
                class="w-24 h-24 rounded-full object-cover border-4 border-white/10"
              />
              <button 
                class="absolute bottom-0 right-0 w-9 h-9 bg-tiktik-primary rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-colors"
                @click="handleAvatarChange"
              >
                <Camera class="w-5 h-5" />
              </button>
            </div>
            <div>
              <h3 class="font-medium text-lg">{{ formData.nickname }}</h3>
              <p class="text-white/60 text-sm">点击相机图标更换头像</p>
            </div>
          </div>

          <div>
            <label class="block text-sm text-white/70 mb-2 flex items-center gap-2">
              <User class="w-4 h-4" />
              昵称
            </label>
            <input
              v-model="formData.nickname"
              type="text"
              maxlength="20"
              class="input-field"
              placeholder="请输入昵称"
            />
          </div>

          <div>
            <label class="block text-sm text-white/70 mb-2 flex items-center gap-2">
              <FileText class="w-4 h-4" />
              个人简介
            </label>
            <textarea
              v-model="formData.bio"
              maxlength="100"
              rows="3"
              class="input-field resize-none"
              placeholder="介绍一下你自己吧~"
            />
            <div class="text-right text-xs text-white/40 mt-1">{{ formData.bio.length }}/100</div>
          </div>

          <button 
            :disabled="saving"
            class="w-full py-3 bg-tiktik-primary rounded-full font-medium hover:bg-opacity-90 transition-all disabled:opacity-50"
            @click="saveProfile"
          >
            {{ saving ? '保存中...' : '保存修改' }}
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'notifications'" class="card p-6">
        <h2 class="text-xl font-bold mb-6">消息通知</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <h4 class="font-medium">点赞通知</h4>
              <p class="text-sm text-white/60">有人点赞你的视频时通知我</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" checked />
              <div class="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tiktik-primary"></div>
            </label>
          </div>

          <div class="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <h4 class="font-medium">评论通知</h4>
              <p class="text-sm text-white/60">有人评论你的视频时通知我</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" checked />
              <div class="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tiktik-primary"></div>
            </label>
          </div>

          <div class="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <h4 class="font-medium">关注通知</h4>
              <p class="text-sm text-white/60">有人关注你时通知我</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" checked />
              <div class="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tiktik-primary"></div>
            </label>
          </div>

          <div class="flex items-center justify-between py-3">
            <div>
              <h4 class="font-medium">系统公告</h4>
              <p class="text-sm text-white/60">接收系统公告和活动通知</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" />
              <div class="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tiktik-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'privacy'" class="card p-6">
        <h2 class="text-xl font-bold mb-6">隐私设置</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <h4 class="font-medium">私密账号</h4>
              <p class="text-sm text-white/60">只有你批准的用户才能关注你并看你的视频</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" />
              <div class="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tiktik-primary"></div>
            </label>
          </div>

          <div class="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <h4 class="font-medium">允许推荐给好友</h4>
              <p class="text-sm text-white/60">允许将你的账号推荐给可能认识的人</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" checked />
              <div class="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tiktik-primary"></div>
            </label>
          </div>

          <div class="mt-8 pt-6 border-t border-white/10">
            <h3 class="text-lg font-medium text-tiktik-danger mb-4 flex items-center gap-2">
              <Trash2 class="w-5 h-5" />
              账号注销
            </h3>
            <p class="text-sm text-white/60 mb-4">
              注销账号后，你的所有数据将被永久删除，且无法恢复。
            </p>
            <button 
              class="px-6 py-2 border border-tiktik-danger text-tiktik-danger rounded-full hover:bg-tiktik-danger hover:text-white transition-colors"
              @click="showDeleteConfirm = true"
            >
              注销账号
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
      <div class="modal-content max-w-md">
        <div class="p-6">
          <div class="w-16 h-16 bg-tiktik-danger/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle class="w-8 h-8 text-tiktik-danger" />
          </div>
          <h3 class="text-xl font-bold text-center mb-2">确认注销账号？</h3>
          <p class="text-white/60 text-center mb-6">
            此操作将永久删除你的账号及所有数据，且无法恢复。
          </p>
          
          <div class="flex gap-3">
            <button 
              class="flex-1 py-3 bg-white/10 rounded-full font-medium hover:bg-white/20 transition-colors"
              @click="showDeleteConfirm = false"
            >
              取消
            </button>
            <button 
              :disabled="deleting"
              class="flex-1 py-3 bg-tiktik-danger rounded-full font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
              @click="deleteAccount"
            >
              {{ deleting ? '注销中...' : '确认注销' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
