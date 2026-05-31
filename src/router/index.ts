import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/following',
      name: 'Following',
      component: () => import('@/views/Following.vue'),
      meta: { title: '关注' }
    },
    {
      path: '/discover',
      name: 'Discover',
      component: () => import('@/views/Discover.vue'),
      meta: { title: '发现' }
    },
    {
      path: '/live',
      name: 'Live',
      component: () => import('@/views/Live.vue'),
      meta: { title: '直播' }
    },
    {
      path: '/messages',
      name: 'Messages',
      component: () => import('@/views/Messages.vue'),
      meta: { title: '消息', requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue'),
      meta: { title: '个人中心', requiresAuth: true }
    },
    {
      path: '/profile/:id',
      name: 'UserProfile',
      component: () => import('@/views/UserProfile.vue'),
      meta: { title: '用户主页' }
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/Search.vue'),
      meta: { title: '搜索' }
    },
    {
      path: '/topic/:id',
      name: 'Topic',
      component: () => import('@/views/Topic.vue'),
      meta: { title: '话题' }
    },
    {
      path: '/category/:id',
      name: 'Category',
      component: () => import('@/views/Category.vue'),
      meta: { title: '分类' }
    },
    {
      path: '/video/:id',
      name: 'Video',
      component: () => import('@/views/VideoDetail.vue'),
      meta: { title: '视频详情' }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { title: '登录', layout: 'auth' }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: { title: '注册', layout: 'auth' }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue'),
      meta: { title: '账号设置', requiresAuth: true }
    },
    {
      path: '/hot',
      name: 'Hot',
      component: () => import('@/views/Hot.vue'),
      meta: { title: '热门' }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.title) {
    document.title = `${to.meta.title} - TikTik`
  }

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
