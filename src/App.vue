<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  userStore.loadFromStorage()
})
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>
