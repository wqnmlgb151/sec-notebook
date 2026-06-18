/**
 * sec-notebook — Vue Router 配置
 *
 * 采用 createWebHistory 模式，URL 无 # 号，干净美观。
 * 每个页面组件使用动态 import() 实现路由懒加载——
 * 首屏仅加载首页 chunk，其他页面在用户首次访问时才按需下载。
 *
 * 路由表：
 *   /         → HomePage    首页
 *   /notes    → NotesPage   学习笔记（支持 #hash 定位具体笔记）
 *   /detail   → DetailPage  漏洞详情（支持 ?id= 参数定位具体漏洞）
 *   /lab      → LabPage     安全实验室
 *   /about    → AboutPage   关于项目
 *
 * 兼容规则：
 *   /html/:page.html → 重定向到 /:page
 *   用于兼容旧版多页面 URL（如 /html/index.html → /）
 *
 * 404 兜底：
 *   /:pathMatch(.*)* → 重定向到首页
 */
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  /* ---- 首页 ---- */
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomePage.vue'), // 懒加载：首屏即加载
    meta: { title: '首页 — sec-notebook' }
  },

  /* ---- 学习笔记（核心功能页）---- */
  {
    path: '/notes',
    name: 'notes',
    component: () => import('../views/NotesPage.vue'), // 懒加载：含 marked + highlight.js，约 131KB
    meta: { title: '学习笔记 — WebPenTest Lab' }
  },

  /* ---- 漏洞详情 ---- */
  {
    path: '/detail',
    name: 'detail',
    component: () => import('../views/DetailPage.vue'), // 懒加载：6 篇 OWASP 漏洞文章
    meta: { title: '漏洞详情 — WebPenTest Lab' }
  },

  /* ---- 安全实验室 ---- */
  {
    path: '/lab',
    name: 'lab',
    component: () => import('../views/LabPage.vue'), // 懒加载：登录/注册表单
    meta: { title: '安全实验室 — WebPenTest Lab' }
  },

  /* ---- 关于项目 ---- */
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutPage.vue'), // 懒加载：纯静态内容
    meta: { title: '关于项目 — WebPenTest Lab' }
  },

  /* ---- 旧版 URL 兼容 ---- */
  // 旧版多页面架构使用 /html/xxx.html 格式的 URL
  // Vue Router 的路径参数 :page 捕获 xxx 部分
  // redirect 函数动态构造新路径 /xxx
  // 例如：/html/index.html → /   /html/detail.html → /detail
  {
    path: '/html/:page.html',
    redirect: to => '/' + to.params.page
  },

  /* ---- 404 兜底 ---- */
  // :pathMatch(.*)* 匹配所有未被以上规则捕获的路径
  // 直接重定向到首页，避免用户看到空白页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  // createWebHistory 依赖浏览器 History API，URL 格式为 /notes
  // 需要服务器端配置 SPA 回退（_redirects 中 /* /index.html 200 已处理）
  history: createWebHistory(),

  routes,

  /**
   * scrollBehavior — 控制路由切换后的滚动位置
   *
   * 三种情况：
   * 1. 目标路由带 hash（如 /notes#文件名）→ 滚动到锚点元素，平滑动画
   * 2. 浏览器前进/后退 → 恢复保存的滚动位置
   * 3. 其他情况 → 滚动到页面顶部
   */
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      // hash 锚点定位（用于首页笔记卡片 → /notes#文件名 的跳转）
      return { el: to.hash, behavior: 'smooth' }
    }
    // 浏览器前进/后退时恢复位置，否则回到顶部
    return savedPosition || { top: 0 }
  }
})

/**
 * 全局后置守卫 — 每次路由切换完成后更新页面标题
 *
 * 标题来自路由 meta.title，fallback 为 'sec-notebook'
 * 这比在每个组件中手动设置 document.title 更统一、更易维护
 */
router.afterEach(to => {
  document.title = to.meta.title || 'sec-notebook'
})

export default router
