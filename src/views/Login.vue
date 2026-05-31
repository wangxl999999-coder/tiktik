<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Phone, Lock, Eye, EyeOff, User } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const phone = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const login = async () => {
  if (!phone.value) {
    error.value = '请输入手机号'
    return
  }
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    error.value = '请输入正确的手机号'
    return
  }
  if (!password.value) {
    error.value = '请输入密码'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await userStore.login(phone.value, password.value)
    if (result.success) {
      const redirect = route.query.redirect as string || '/home'
      router.push(redirect)
    } else {
      error.value = result.message
    }
  } catch (e) {
    error.value = '登录失败，请重试'
  } finally {
    loading.value = false
  }
}

const quickLogin = () => {
  phone.value = '13800138000'
  password.value = '123456'
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-tiktik-dark via-black to-tiktik-gray flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="w-16 h-16 bg-gradient-to-r from-tiktik-primary to-tiktik-secondary rounded-2xl flex items-center justify-center">
            <span class="text-3xl font-bold">T</span>
          </div>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-tiktik-primary to-tiktik-secondary bg-clip-text text-transparent mb-2">
          TikTik
        </h1>
        <p class="text-white/60">记录美好生活</p>
      </div>

      <div class="card p-8">
        <h2 class="text-2xl font-bold mb-6 text-center">登录你的账号</h2>

        <div v-if="error" class="mb-4 p-3 bg-tiktik-danger/20 border border-tiktik-danger/30 rounded-lg text-tiktik-danger text-sm">
          {{ error }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm text-white/70 mb-2">手机号</label>
            <div class="relative">
              <Phone class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                v-model="phone"
                type="tel"
                placeholder="请输入手机号"
                maxlength="11"
                class="input-field pl-12"
                @keyup.enter="login"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm text-white/70 mb-2">密码</label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="input-field pl-12 pr-12"
                @keyup.enter="login"
              />
              <button 
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" class="w-4 h-4 rounded border-white/20 bg-white/10 text-tiktik-primary focus:ring-tiktik-primary" />
              <span class="text-white/70">记住我</span>
            </label>
            <a href="#" class="text-tiktik-primary hover:underline">忘记密码？</a>
          </div>

          <button 
            :disabled="loading"
            class="w-full py-3 bg-tiktik-primary rounded-full font-medium text-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            @click="login"
          >
            <span v-if="loading">登录中...</span>
            <span v-else>登录</span>
          </button>

          <div class="text-center">
            <p class="text-white/60 text-sm">
              还没有账号？
              <button 
                class="text-tiktik-primary font-medium hover:underline"
                @click="router.push('/register')"
              >
                立即注册
              </button>
            </p>
          </div>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/10"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-tiktik-gray text-white/50">快捷登录</span>
            </div>
          </div>

          <div class="flex justify-center gap-4">
            <button class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <User class="w-6 h-6" />
            </button>
          </div>

          <div class="text-center pt-4">
            <button 
              class="text-xs text-white/40 hover:text-white/60 transition-colors underline"
              @click="quickLogin"
            >
              快速体验：点击自动填充测试账号（密码：123456）
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
