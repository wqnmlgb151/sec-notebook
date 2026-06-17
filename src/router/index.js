import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomePage.vue'),
    meta: { title: '首页 — sec-notebook' }
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('../views/NotesPage.vue'),
    meta: { title: '学习笔记 — WebPenTest Lab' }
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('../views/DetailPage.vue'),
    meta: { title: '漏洞详情 — WebPenTest Lab' }
  },
  {
    path: '/lab',
    name: 'lab',
    component: () => import('../views/LabPage.vue'),
    meta: { title: '安全实验室 — WebPenTest Lab' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutPage.vue'),
    meta: { title: '关于项目 — WebPenTest Lab' }
  },
  {
    // 兼容旧 URL: /html/xxx.html → /xxx
    path: '/html/:page.html',
    redirect: to => '/' + to.params.page
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return savedPosition || { top: 0 }
  }
})

router.afterEach(to => {
  document.title = to.meta.title || 'sec-notebook'
})

export default router
