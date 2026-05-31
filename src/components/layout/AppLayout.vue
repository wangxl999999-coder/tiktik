<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import AnnouncementModal from '../common/AnnouncementModal.vue'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const appStore = useAppStore()

const isAuthLayout = computed(() => route.meta.layout === 'auth')
</script>

<template>
  <div class="h-screen w-full bg-black text-white overflow-hidden">
    <template v-if="!isAuthLayout">
      <Header />
      <div class="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar />
        <main class="flex-1 overflow-auto hide-scrollbar">
          <slot />
        </main>
      </div>
      <AnnouncementModal v-if="appStore.showAnnouncement" />
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>
