<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Phone, Lock, Eye, EyeOff, User, CheckCircle } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const phone = ref('')
const nickname = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const register = async () => {
  if (!phone.value) {
    error.value = '请输入手机号'
    return
  }
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    error.value = '请输入正确的手机号'
    return
  }
  if (!nickname.value.trim()) {
    error.value = '请输入昵称'
    return
  }
  if (!password.value) {
    error.value = '请输入密码'
    return
  }
  if (password.value.length < 6) {
    error.value = '密码长度不能少于6位'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await userStore.register(phone.value, password.value, nickname.value.trim())
    if (result.success) {
      success.value = true
      setTimeout(() => {
        router.push('/home')
      }, 1500)
    } else {
      error.value = result.message
    }
  } catch (e) {
    error.value = '注册失败，请重试'
  } finally {
    loading.value = false
  }
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
        <template v-if="!success">
          <h2 class="text-2xl font-bold mb-6 text-center">创建新账号</h2>

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
                />
              </div>
            </div>

            <div>
              <label class="block text-sm text-white/70 mb-2">昵称</label>
              <div class="relative">
                <User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  v-model="nickname"
                  type="text"
                  placeholder="请输入昵称"
                  maxlength="20"
                  class="input-field pl-12"
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
                  placeholder="请设置密码（至少6位）"
                  class="input-field pl-12 pr-12"
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

            <div>
              <label class="block text-sm text-white/70 mb-2">确认密码</label>
              <div class="relative">
                <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="请再次输入密码"
                  class="input-field pl-12 pr-12"
                />
                <button 
                  type="button"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <button 
              :disabled="loading"
              class="w-full py-3 bg-tiktik-primary rounded-full font-medium text-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              @click="register"
            >
              <span v-if="loading">注册中...</span>
              <span v-else>注册</span>
            </button>

            <div class="text-center">
              <p class="text-white/60 text-sm">
                已有账号？
                <button 
                  class="text-tiktik-primary font-medium hover:underline"
                  @click="router.push('/login')"
                >
                  立即登录
                </button>
              </p>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="text-center py-8">
            <div class="w-20 h-20 bg-tiktik-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle class="w-10 h-10 text-tiktik-success" />
            </div>
            <h3 class="text-2xl font-bold mb-2">注册成功！</h3>
            <p class="text-white/60">正在跳转到首页...</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
