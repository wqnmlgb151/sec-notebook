<template>
  <!-- ============================================================
   页面标题区 — 面包屑 + 主标题 + 副标题
   ============================================================ -->
  <section class="page-hero">
    <div class="hero-bg-orb hero-bg-orb--cyan" style="width:300px;height:300px;opacity:0.06;top:-5%;right:-5%"></div>
    <div class="container">
      <nav aria-label="面包屑导航"><div class="breadcrumb">
        <router-link to="/">首页</router-link><span class="sep">/</span><span>学习笔记</span>
      </div></nav>
      <h1>Web <span class="highlight">渗透测试</span> 学习笔记</h1>
      <p>基于 GitHub 仓库动态渲染 Markdown，支持代码高亮与 GFM 语法，键盘驱动阅读体验</p>
    </div>
  </section>

  <!-- ============================================================
   双栏布局 — 左侧目录 + 右侧内容
   桌面端 (>1024px)：并排显示
   移动端 (≤768px)：侧边栏默认隐藏，按钮切换滑出
   ============================================================ -->
  <div class="notes-layout">

    <!-- 移动端侧边栏切换按钮（桌面端隐藏） -->
    <button
      class="sidebar-toggle hide-desktop"
      @click="showSidebar = !showSidebar"
      :aria-label="showSidebar ? '收起目录' : '展开目录'"
    >
      <span v-if="showSidebar">✕ 收起目录</span>
      <span v-else>☰ 展开目录 ({{ files.length }} 篇)</span>
    </button>

    <!-- ====== 左侧：笔记目录侧边栏 ====== -->
    <aside :class="['notes-sidebar', showSidebar ? 'open' : '']">
      <div class="sidebar-inner">
        <!-- 目录标题 + 状态文字 -->
        <div class="sidebar-header">
          <h3 class="sidebar-title"><span style="font-size: 1.2rem">📚</span> 课程目录</h3>
          <!--
            目录状态四种情况：
            - isDirLoading：正在从 GitHub API 获取文件列表
            - preloadProgress 未完成：后台静默缓存笔记内容
            - preloadProgress 超时：部分笔记已缓存，显示已缓存数量
            - 全部完成：显示 "19 篇 ✓"
          -->
          <span class="sidebar-count">
            <template v-if="isDirLoading">同步中...</template>
            <template v-else-if="preloadProgress.done < preloadProgress.total && !preloadProgress.timedOut">
              缓存中 {{ preloadProgress.done }}/{{ preloadProgress.total }}
            </template>
            <template v-else-if="preloadProgress.timedOut">
              已缓存 {{ preloadProgress.done }}/{{ preloadProgress.total }}
            </template>
            <template v-else>{{ files.length }} 篇 ✓</template>
          </span>
        </div>

        <!-- 笔记列表 — 键盘可操作 (role="button" + tabindex) -->
        <nav class="sidebar-nav" aria-label="课程目录">
          <div
            v-for="f in files"
            :key="f.rawName"
            :class="['sidebar-item', sel && sel.rawName === f.rawName ? 'active' : '']"
            role="button"
            tabindex="0"
            @click="selectFile(f)"
            @keydown.enter="selectFile(f)"
            @keydown.space.prevent="selectFile(f)"
            :aria-label="'打开笔记: ' + f.title"
            :title="f.title"
          >
            <span class="sidebar-item-icon">{{ f.icon }}</span>
            <div class="sidebar-item-content">
              <span class="sidebar-item-num">{{ f.num < 10 ? '0' + f.num : f.num }}</span>
              <span class="sidebar-item-title">{{ f.title }}</span>
            </div>
          </div>
        </nav>

        <!-- 底部链接：跳转到 GitHub 仓库 -->
        <div class="sidebar-footer">
          <a :href="GITHUB_REPO_BASE" target="_blank" rel="noopener" class="sidebar-resource-link">
            📁 在 GitHub 查看全部资源
          </a>
        </div>
      </div>
    </aside>

    <!-- 移动端遮罩层：点击关闭侧边栏 -->
    <div v-if="showSidebar" class="sidebar-overlay hide-desktop" @click="showSidebar = false"></div>

    <!-- ====== 右侧：笔记内容区 ====== -->
    <section class="notes-content">
      <div class="content-area">
        <!--
          内容区四种状态（互斥，同一时刻只显示一种）：
          1. 空状态   — 用户尚未选择笔记（sel === null）
          2. 加载中   — 正在 fetch 笔记内容（isLoading === true）
          3. 错误状态 — 网络错误或 API 限流（err !== null）
          4. 渲染成功 — Markdown 渲染完毕（renderedHTML 有值）
        -->

        <!-- ====== 状态 1：空状态（首次进入，未选笔记） ====== -->
        <div v-if="!sel && !isLoading" class="content-empty">
          <div class="content-empty-icon">📖</div>
          <h2>Web 渗透测试学习笔记</h2>
          <p>从左侧目录选择一篇笔记开始阅读</p>
          <div class="content-empty-stats">
            <div class="stat-card"><div class="stat-value">{{ files.length }}</div><div class="stat-label">篇笔记</div></div>
            <div class="stat-card"><div class="stat-value">GitHub</div><div class="stat-label">数据源</div></div>
            <div class="stat-card"><div class="stat-value">GFM</div><div class="stat-label">渲染引擎</div></div>
          </div>
          <a :href="GITHUB_REPO_BASE" target="_blank" rel="noopener" class="btn btn-outline mt-3">
            在 GitHub 查看全部 →
          </a>
        </div>

        <!-- ====== 状态 2：骨架屏加载中 ====== -->
        <div v-if="isLoading" class="content-loading">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-line" style="width: 80%"></div>
          <div class="skeleton skeleton-line" style="width: 60%"></div>
          <div class="skeleton skeleton-block"></div>
          <div class="skeleton skeleton-line" style="width: 70%"></div>
        </div>

        <!-- ====== 状态 3：错误状态 + 重试按钮 ====== -->
        <div v-if="err && !isLoading" class="content-error">
          <div class="content-error-icon">⚠️</div>
          <h3>加载失败</h3>
          <p>{{ err }}</p>
          <div class="err-actions">
            <button class="btn btn-primary" @click="retryLoad()">重新加载</button>
            <button class="btn btn-outline" @click="backToList()">返回目录</button>
          </div>
        </div>

        <!-- ====== 状态 4：Markdown 渲染成功 ====== -->
        <div v-if="renderedHTML && sel && !err" class="markdown-wrapper">

          <!-- 工具栏：返回目录 | 翻页按钮 | GitHub 链接 -->
          <div class="content-toolbar">
            <button class="btn btn-ghost btn-sm" @click="backToList()" aria-label="返回目录">
              ← 目录
            </button>
            <div class="content-toolbar-nav">
              <button
                class="btn btn-ghost btn-sm"
                @click="goToPrev()"
                :disabled="!hasPrev"
                aria-label="上一篇"
              >← 上一篇</button>
              <span class="content-toolbar-pos">{{ currentIndex + 1 }} / {{ files.length }}</span>
              <button
                class="btn btn-ghost btn-sm"
                @click="goToNext()"
                :disabled="!hasNext"
                aria-label="下一篇"
              >下一篇 →</button>
            </div>
            <a :href="getGitHubUrl(sel)" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
              在 GitHub 查看 ↗
            </a>
          </div>

          <!-- 文件信息头：图标 + 标题 + 元数据 -->
          <div class="content-file-header">
            <span class="content-file-icon">{{ sel.icon }}</span>
            <div>
              <h2 class="content-file-title">{{ sel.title }}</h2>
              <div class="content-file-meta">
                <span>{{ sel.rawName }}</span>
                <span>编号 #{{ sel.num }}</span>
              </div>
            </div>
          </div>

          <!--
            Markdown 渲染内容 — 通过 v-html 注入
            安全性：marked.parse() 输出已由 DOMPurify.sanitize() 净化
            代码高亮：由 highlight.js 的 highlightAll() 在 nextTick 中处理
          -->
          <div class="markdown-body" v-html="renderedHTML"></div>

          <!-- 底部翻页：大按钮 + 篇名预览 -->
          <div class="content-footer-nav">
            <button class="btn btn-outline" @click="goToPrev()" :disabled="!hasPrev">
              ← {{ hasPrev ? files[currentIndex - 1].title : '已是第一篇' }}
            </button>
            <button class="btn btn-outline" @click="goToNext()" :disabled="!hasNext">
              {{ hasNext ? files[currentIndex + 1].title : '已是最后一篇' }} →
            </button>
          </div>

          <!-- 键盘快捷键提示 -->
          <div class="content-kbd-hints">
            <kbd>Ctrl+←</kbd> 上一篇 &nbsp;
            <kbd>Ctrl+→</kbd> 下一篇 &nbsp;
            <kbd>ESC</kbd> 返回目录
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
/**
 * NotesPage.vue — 学习笔记页面
 *
 * 数据流（自上而下）：
 *   GitHub REST API (api.github.com)
 *     → fetchFileList() 获取仓库文件树
 *     → parseFileName() 解析文件名 → { num, title, icon, downloadUrl, ... }
 *     → 用户点击笔记 → fetch(raw.githubusercontent.com) 获取 .md 原文
 *     → marked.parse() 解析为 HTML
 *     → DOMPurify.sanitize() 净化（防御 XSS）
 *     → v-html 渲染
 *     → highlight.js 代码语法高亮
 *
 * 容错策略：
 *   - API 限流/网络故障 → 回退到内置 19 篇文件列表 (FILE_LIST_FALLBACK)
 *   - 单篇加载超时 (15s) → 自动重试 1 次 → 显示错误 + 重试按钮
 *   - 预加载超时 (60s) → 部分缓存，已缓存的笔记仍可即时打开
 *   - 请求取消：切换笔记时 AbortController 取消上一个未完成的 fetch
 */

import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// ---- 第三方库 ----
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// highlight.js 按需加载语言包（只注册项目中用到的 8 种语言）
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import sql from 'highlight.js/lib/languages/sql'
import php from 'highlight.js/lib/languages/php'
import bash from 'highlight.js/lib/languages/bash'
import python from 'highlight.js/lib/languages/python'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('php', php)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('python', python)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)

// ---- 项目内工具模块 (vue/notes.js) ----
// GITHUB_REPO_BASE: GitHub 仓库根 URL
// FILE_LIST_FALLBACK: API 不可用时的内置 19 篇文件列表
// fetchFileList(): 从 GitHub API 获取最新文件列表
// parseFileName(name): 解析文件名 → { num, title, icon, downloadUrl, htmlUrl, rawName }
import {
  GITHUB_REPO_BASE,
  FILE_LIST_FALLBACK,
  fetchFileList,
  parseFileName
} from '../../vue/notes.js'

// marked 配置：GFM 语法、换行转 <br>、保留标题 id
marked.setOptions({ gfm: true, breaks: true, headerIds: true, mangle: false })

// ---- Vue Router ----
const route = useRoute()   // 读取当前路由信息（hash、query 等）
const router = useRouter() // 编程式导航（replace 更新 hash）

// ============================================================
// 响应式状态（全部使用 ref，便于整体替换值）
// ============================================================

// 初始化：用内置回退列表填充，避免白屏等待
const filesArr = FILE_LIST_FALLBACK.map(n => parseFileName(n))
filesArr.sort((a, b) => a.num - b.num)

/** @type {Ref<Array>} 笔记文件列表（初始为回退数据，API 成功后更新为实时数据） */
const files = ref([...filesArr])

/** @type {Ref<Object|null>} 当前选中的笔记文件对象 */
const sel = ref(null)

/** @type {Ref<string>} DOMPurify 净化后的 HTML 字符串 */
const renderedHTML = ref('')

/** @type {Ref<boolean>} 正在加载笔记内容 */
const isLoading = ref(false)

/** @type {Ref<string|null>} 错误消息（null = 无错误） */
const err = ref(null)

/** @type {Ref<boolean>} 移动端侧边栏展开/收起 */
const showSidebar = ref(true)

/** @type {Ref<boolean>} 正在从 GitHub API 获取文件列表 */
const isDirLoading = ref(true)

/** @type {Ref<Object>} 预加载进度 { done, total, timedOut } */
const preloadProgress = ref({ done: 0, total: 0, timedOut: false })

// ============================================================
// 常量 + 非响应式状态
// ============================================================

/** 笔记内容缓存：Map<文件名, Markdown 原文> */
const noteCache = new Map()

/** 单次 fetch 超时时间 (ms) */
const FETCH_TIMEOUT = 15000

/** 当前活跃的 AbortController（切换笔记时取消上一个请求） */
let loadAbortController = null

// ============================================================
// 工具函数
// ============================================================

/**
 * 带超时的 fetch 封装
 * @param {string} url
 * @param {AbortSignal|null} signal - AbortController 的 signal
 * @param {number} timeoutMs - 超时毫秒数
 * @returns {Promise<Response>}
 */
function fetchWithTimeout(url, signal, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new DOMException('请求超时', 'TimeoutError')),
      timeoutMs
    )
    fetch(url, { signal })
      .then(res => { clearTimeout(timer); resolve(res) })
      .catch(e => { clearTimeout(timer); reject(e) })
  })
}

// ============================================================
// 预加载 — 后台静默缓存全部笔记内容
// ============================================================

/**
 * 并发预加载笔记内容到内存缓存
 *
 * 策略：
 *   - 3 路并发 (CONCURRENCY = 3)，避免浏览器连接池耗尽
 *   - 单个请求 10s 超时，单篇失败不影响其他
 *   - 总超时 60s，超时后用已缓存的笔记（timedOut 标记）
 */
async function preloadNotes(list) {
  preloadProgress.value = { done: 0, total: list.length, timedOut: false }
  const CONCURRENCY = 3
  const queue = [...list] // 浅拷贝，worker 通过 shift() 消费

  // worker 函数：不断从队列取任务，直到队列为空
  async function worker() {
    while (queue.length) {
      const f = queue.shift()
      try {
        const res = await fetchWithTimeout(f.downloadUrl, null, 10000)
        if (res.ok) noteCache.set(f.rawName, await res.text())
      } catch (_) {
        // 单篇预加载失败不影响整体，用户点击时再实时请求
      }
      preloadProgress.value = {
        ...preloadProgress.value,
        done: preloadProgress.value.done + 1
      }
    }
  }

  // 启动 3 个并发 worker
  const workers = Array.from({ length: CONCURRENCY }, () => worker())

  // 60s 全局超时 — 不阻塞用户交互，已缓存的部分可使用
  const timeout = new Promise(resolve => setTimeout(resolve, 60000))
  await Promise.race([Promise.all(workers), timeout])

  // 如果超时或部分失败，标记 timedOut
  if (preloadProgress.value.done < preloadProgress.value.total) {
    preloadProgress.value = { ...preloadProgress.value, timedOut: true }
  }
}

// ============================================================
// 初始化 — IIFE：获取 GitHub 文件列表 → 更新 files → 后台预加载
// ============================================================
;(async () => {
  const liveNames = await fetchFileList()        // GitHub API 获取文件列表
  const arr = liveNames.map(n => parseFileName(n))
  arr.sort((a, b) => a.num - b.num)
  files.value = arr                              // 替换回退数据
  isDirLoading.value = false                     // 目录加载完毕
  preloadNotes(arr)                              // 后台预加载（不 await，不阻塞渲染）
})()

// ============================================================
// 核心：加载并渲染 Markdown
// ============================================================

/**
 * 加载单篇笔记的 Markdown 内容，渲染为 HTML
 *
 * 渲染管道：
 *   fetch .md → marked.parse() → DOMPurify.sanitize() → v-html
 *
 * 缓存优先：
 *   如果 noteCache 中已有该文件的原文，跳过 fetch 直接渲染
 *
 * 请求取消：
 *   每次调用前 abort 上一个未完成的请求，避免旧请求覆盖新选择
 *
 * 超时重试：
 *   首次超时自动重试 1 次，给用户友好提示
 *
 * @param {Object} file - 笔记文件对象 { rawName, downloadUrl, ... }
 * @param {boolean} [isRetry=false] - 是否为超时后的自动重试
 */
async function loadMarkdown(file, isRetry) {
  // 取消上一个未完成的请求（用户快速切换笔记时）
  if (loadAbortController) loadAbortController.abort()
  loadAbortController = new AbortController()
  const { signal } = loadAbortController

  // 设置当前选中 + 重置状态
  sel.value = file
  isLoading.value = true
  err.value = null
  renderedHTML.value = ''

  // ---- 命中缓存：直接渲染，不发起网络请求 ----
  if (noteCache.has(file.rawName)) {
    const text = noteCache.get(file.rawName)
    renderedHTML.value = DOMPurify.sanitize(marked.parse(text))
    isLoading.value = false
    // nextTick：等待 DOM 更新完成后执行滚动和高亮
    nextTick(() => {
      const c = document.querySelector('.content-area')
      if (c) c.scrollTop = 0                          // 内容区滚回顶部
      hljs.highlightAll()                              // 代码语法高亮
      // 左侧目录滚动到当前项可见
      const active = document.querySelector('.sidebar-item.active')
      if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    })
    // 移动端自动收起侧边栏，给内容腾空间
    if (window.innerWidth <= 768) showSidebar.value = false
    return
  }

  // ---- 缓存未命中：发起网络请求 ----
  try {
    const res = await fetchWithTimeout(file.downloadUrl, signal, FETCH_TIMEOUT)

    // HTTP 错误码映射为中文提示
    if (!res.ok) {
      let m = '文件加载失败'
      if (res.status === 404) m = '文件不存在'
      else if (res.status === 403) m = 'GitHub API 限流，请稍后重试'
      else if (res.status >= 500) m = 'GitHub 服务器错误，请稍后重试'
      throw new Error(m)
    }

    const text = await res.text()
    noteCache.set(file.rawName, text) // 写入缓存
    renderedHTML.value = DOMPurify.sanitize(marked.parse(text))
    isLoading.value = false

    nextTick(() => {
      const c = document.querySelector('.content-area')
      if (c) c.scrollTop = 0
      hljs.highlightAll()
      const active = document.querySelector('.sidebar-item.active')
      if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    })

    if (window.innerWidth <= 768) showSidebar.value = false

  } catch (e) {
    // AbortError：请求被取消，不做任何处理（用户切换了笔记）
    if (e.name === 'AbortError') return

    // 超时：自动重试一次
    if (e.name === 'TimeoutError' || e.message === '请求超时') {
      if (!isRetry) {
        isLoading.value = false
        err.value = '首次请求超时，正在自动重试...'
        loadAbortController = null
        return loadMarkdown(file, true) // 递归重试
      }
      err.value = 'GitHub 连接超时，请检查网络或使用 VPN 后重试'
    } else if (e.message && e.message.includes('Failed to fetch')) {
      err.value = '网络连接失败，请检查网络后重试'
    } else {
      err.value = e.message || '加载失败'
    }
    isLoading.value = false
  }
}

// ============================================================
// 用户交互函数
// ============================================================

/** 选择笔记并更新 URL hash（用于分享链接和浏览器前进/后退） */
function selectFile(f) {
  loadMarkdown(f)
  router.replace({ hash: '#' + encodeURIComponent(f.rawName) })
}

/** 返回目录（清除选中、渲染内容和错误） */
function backToList() {
  sel.value = null
  renderedHTML.value = ''
  err.value = null
  router.replace({ hash: '' })
}

/** 重试加载当前笔记 */
function retryLoad() {
  if (sel.value) loadMarkdown(sel.value)
}

// ============================================================
// 派生状态 (computed) — 翻页相关
// ============================================================

/** 当前笔记在文件列表中的索引（-1 表示未选中任何笔记） */
const currentIndex = computed(() => {
  if (!sel.value) return -1
  return files.value.findIndex(f => f.rawName === sel.value.rawName)
})

/** 是否有上一篇 */
const hasPrev = computed(() => currentIndex.value > 0)

/** 是否有下一篇 */
const hasNext = computed(() => currentIndex.value < files.value.length - 1)

/** 翻到上一篇 */
function goToPrev() {
  if (hasPrev.value) loadMarkdown(files.value[currentIndex.value - 1])
}

/** 翻到下一篇 */
function goToNext() {
  if (hasNext.value) loadMarkdown(files.value[currentIndex.value + 1])
}

/** 获取笔记在 GitHub 上的原始 URL（用于"在 GitHub 查看"链接） */
function getGitHubUrl(f) {
  return f ? f.htmlUrl : GITHUB_REPO_BASE
}

// ============================================================
// 键盘快捷键
// ============================================================

/**
 * 全局键盘事件处理
 *
 * Ctrl+←  上一篇
 * Ctrl+→  下一篇
 * ESC     返回目录
 *
 * 仅在已选中笔记且非加载中时响应
 */
function onKeydown(e) {
  if (sel.value && !isLoading.value) {
    if (e.key === 'ArrowLeft' && e.ctrlKey) { e.preventDefault(); goToPrev() }
    if (e.key === 'ArrowRight' && e.ctrlKey) { e.preventDefault(); goToNext() }
    if (e.key === 'Escape') { e.preventDefault(); backToList() }
  }
}

// ============================================================
// 生命周期
// ============================================================

onMounted(() => {
  // 注册键盘快捷键（全局监听）
  document.addEventListener('keydown', onKeydown)

  /**
   * 处理 URL hash 定位 — 支持从首页 / 外部链接直达具体笔记
   *
   * 例如：首页点击笔记卡片 → 导航到 /notes#01 代理配置和IP地址.md
   * 路由切换后，组件挂载，读取 route.hash 定位目标笔记
   *
   * watch() 等待 files 数组填充（API 可能尚未返回），
   * 一旦填充完毕立即停止监听并定位。
   */
  const hash = route.hash ? decodeURIComponent(route.hash.slice(1)) : ''
  if (hash) {
    const stopWatch = watch(files, (val) => {
      if (val.length > 0) {
        stopWatch() // 停止监听，避免后续 files 变化触发重复定位
        const found = val.find(f => f.rawName === hash)
        if (found) selectFile(found)
      }
    })
    // 组件卸载时清理 watch（防止内存泄漏）
    onUnmounted(() => stopWatch())
  }
})

onUnmounted(() => {
  // 取消进行中的 fetch 请求
  if (loadAbortController) loadAbortController.abort()
  // 移除键盘监听
  document.removeEventListener('keydown', onKeydown)
})
</script>
