<template>
  <!-- 页面标题 -->
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

  <!-- 笔记阅读器（来自原 App.vue） -->
  <div class="notes-layout">
    <button class="sidebar-toggle hide-desktop" @click="showSidebar = !showSidebar" :aria-label="showSidebar ? '收起目录' : '展开目录'">
      <span v-if="showSidebar">✕ 收起目录</span>
      <span v-else>☰ 展开目录 ({{ files.length }} 篇)</span>
    </button>

    <aside :class="['notes-sidebar', showSidebar ? 'open' : '']">
      <div class="sidebar-inner">
        <div class="sidebar-header">
          <h3 class="sidebar-title"><span style="font-size: 1.2rem">📚</span> 课程目录</h3>
          <span class="sidebar-count">
            <template v-if="isDirLoading">同步中...</template>
            <template v-else-if="preloadProgress.done < preloadProgress.total && !preloadProgress.timedOut">缓存中 {{ preloadProgress.done }}/{{ preloadProgress.total }}</template>
            <template v-else-if="preloadProgress.timedOut">已缓存 {{ preloadProgress.done }}/{{ preloadProgress.total }}</template>
            <template v-else>{{ files.length }} 篇 ✓</template>
          </span>
        </div>

        <nav class="sidebar-nav" aria-label="课程目录">
          <div v-for="f in files" :key="f.rawName" :class="['sidebar-item', sel && sel.rawName === f.rawName ? 'active' : '']" role="button" tabindex="0" @click="selectFile(f)" @keydown.enter="selectFile(f)" @keydown.space.prevent="selectFile(f)" :aria-label="'打开笔记: ' + f.title" :title="f.title">
            <span class="sidebar-item-icon">{{ f.icon }}</span>
            <div class="sidebar-item-content">
              <span class="sidebar-item-num">{{ f.num < 10 ? '0' + f.num : f.num }}</span>
              <span class="sidebar-item-title">{{ f.title }}</span>
            </div>
          </div>
        </nav>

        <div class="sidebar-footer">
          <a :href="GITHUB_REPO_BASE" target="_blank" rel="noopener" class="sidebar-resource-link">📁 在 GitHub 查看全部资源</a>
        </div>
      </div>
    </aside>

    <div v-if="showSidebar" class="sidebar-overlay hide-desktop" @click="showSidebar = false"></div>

    <section class="notes-content">
      <div class="content-area">
        <!-- 空状态 -->
        <div v-if="!sel && !isLoading" class="content-empty">
          <div class="content-empty-icon">📖</div>
          <h2>Web 渗透测试学习笔记</h2>
          <p>从左侧目录选择一篇笔记开始阅读</p>
          <div class="content-empty-stats">
            <div class="stat-card"><div class="stat-value">{{ files.length }}</div><div class="stat-label">篇笔记</div></div>
            <div class="stat-card"><div class="stat-value">GitHub</div><div class="stat-label">数据源</div></div>
            <div class="stat-card"><div class="stat-value">GFM</div><div class="stat-label">渲染引擎</div></div>
          </div>
          <a :href="GITHUB_REPO_BASE" target="_blank" rel="noopener" class="btn btn-outline mt-3">在 GitHub 查看全部 →</a>
        </div>

        <!-- 加载中 -->
        <div v-if="isLoading" class="content-loading">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-line" style="width: 80%"></div>
          <div class="skeleton skeleton-line" style="width: 60%"></div>
          <div class="skeleton skeleton-block"></div>
          <div class="skeleton skeleton-line" style="width: 70%"></div>
        </div>

        <!-- 错误 -->
        <div v-if="err && !isLoading" class="content-error">
          <div class="content-error-icon">⚠️</div>
          <h3>加载失败</h3>
          <p>{{ err }}</p>
          <div class="err-actions">
            <button class="btn btn-primary" @click="retryLoad()">重新加载</button>
            <button class="btn btn-outline" @click="backToList()">返回目录</button>
          </div>
        </div>

        <!-- Markdown 渲染 -->
        <div v-if="renderedHTML && sel && !err" class="markdown-wrapper">
          <div class="content-toolbar">
            <button class="btn btn-ghost btn-sm" @click="backToList()" aria-label="返回目录">← 目录</button>
            <div class="content-toolbar-nav">
              <button class="btn btn-ghost btn-sm" @click="goToPrev()" :disabled="!hasPrev" aria-label="上一篇">← 上一篇</button>
              <span class="content-toolbar-pos">{{ currentIndex + 1 }} / {{ files.length }}</span>
              <button class="btn btn-ghost btn-sm" @click="goToNext()" :disabled="!hasNext" aria-label="下一篇">下一篇 →</button>
            </div>
            <a :href="getGitHubUrl(sel)" target="_blank" rel="noopener" class="btn btn-outline btn-sm">在 GitHub 查看 ↗</a>
          </div>

          <div class="content-file-header">
            <span class="content-file-icon">{{ sel.icon }}</span>
            <div>
              <h2 class="content-file-title">{{ sel.title }}</h2>
              <div class="content-file-meta"><span>{{ sel.rawName }}</span><span>编号 #{{ sel.num }}</span></div>
            </div>
          </div>

          <div class="markdown-body" v-html="renderedHTML"></div>

          <div class="content-footer-nav">
            <button class="btn btn-outline" @click="goToPrev()" :disabled="!hasPrev">← {{ hasPrev ? files[currentIndex - 1].title : '已是第一篇' }}</button>
            <button class="btn btn-outline" @click="goToNext()" :disabled="!hasNext">{{ hasNext ? files[currentIndex + 1].title : '已是最后一篇' }} →</button>
          </div>

          <div class="content-kbd-hints"><kbd>Ctrl+←</kbd> 上一篇 &nbsp; <kbd>Ctrl+→</kbd> 下一篇 &nbsp; <kbd>ESC</kbd> 返回目录</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
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

import {
  GITHUB_REPO_BASE,
  FILE_LIST_FALLBACK,
  fetchFileList,
  parseFileName
} from '../../vue/notes.js'

marked.setOptions({ gfm: true, breaks: true, headerIds: true, mangle: false })

const route = useRoute()
const router = useRouter()

const filesArr = FILE_LIST_FALLBACK.map(n => parseFileName(n))
filesArr.sort((a, b) => a.num - b.num)

const files = ref([...filesArr])
const sel = ref(null)
const renderedHTML = ref('')
const isLoading = ref(false)
const err = ref(null)
const showSidebar = ref(true)
const isDirLoading = ref(true)
const preloadProgress = ref({ done: 0, total: 0, timedOut: false })
const noteCache = new Map()
const FETCH_TIMEOUT = 15000

let loadAbortController = null

function fetchWithTimeout(url, signal, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new DOMException('请求超时', 'TimeoutError')), timeoutMs)
    fetch(url, { signal }).then(res => { clearTimeout(timer); resolve(res) }).catch(e => { clearTimeout(timer); reject(e) })
  })
}

async function preloadNotes(list) {
  preloadProgress.value = { done: 0, total: list.length, timedOut: false }
  const CONCURRENCY = 3
  const queue = [...list]
  async function worker() {
    while (queue.length) {
      const f = queue.shift()
      try {
        const res = await fetchWithTimeout(f.downloadUrl, null, 10000)
        if (res.ok) noteCache.set(f.rawName, await res.text())
      } catch (_) { /* 静默跳过 */ }
      preloadProgress.value = { ...preloadProgress.value, done: preloadProgress.value.done + 1 }
    }
  }
  const workers = Array.from({ length: CONCURRENCY }, () => worker())
  const timeout = new Promise(resolve => setTimeout(resolve, 60000))
  await Promise.race([Promise.all(workers), timeout])
  if (preloadProgress.value.done < preloadProgress.value.total) {
    preloadProgress.value = { ...preloadProgress.value, timedOut: true }
  }
}

;(async () => {
  const liveNames = await fetchFileList()
  const arr = liveNames.map(n => parseFileName(n))
  arr.sort((a, b) => a.num - b.num)
  files.value = arr
  isDirLoading.value = false
  preloadNotes(arr)
})()

async function loadMarkdown(file, isRetry) {
  if (loadAbortController) loadAbortController.abort()
  loadAbortController = new AbortController()
  const { signal } = loadAbortController

  sel.value = file
  isLoading.value = true
  err.value = null
  renderedHTML.value = ''

  if (noteCache.has(file.rawName)) {
    const text = noteCache.get(file.rawName)
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
    return
  }

  try {
    const res = await fetchWithTimeout(file.downloadUrl, signal, FETCH_TIMEOUT)
    if (!res.ok) {
      let m = '文件加载失败'
      if (res.status === 404) m = '文件不存在'
      else if (res.status === 403) m = 'GitHub API 限流，请稍后重试'
      else if (res.status >= 500) m = 'GitHub 服务器错误，请稍后重试'
      throw new Error(m)
    }
    const text = await res.text()
    noteCache.set(file.rawName, text)
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
    if (e.name === 'AbortError') return
    if (e.name === 'TimeoutError' || e.message === '请求超时') {
      if (!isRetry) {
        isLoading.value = false
        err.value = '首次请求超时，正在自动重试...'
        loadAbortController = null
        return loadMarkdown(file, true)
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

function selectFile(f) {
  loadMarkdown(f)
  router.replace({ hash: '#' + encodeURIComponent(f.rawName) })
}

function backToList() {
  sel.value = null
  renderedHTML.value = ''
  err.value = null
  router.replace({ hash: '' })
}

function retryLoad() {
  if (sel.value) loadMarkdown(sel.value)
}

const currentIndex = computed(() => {
  if (!sel.value) return -1
  return files.value.findIndex(f => f.rawName === sel.value.rawName)
})

const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < files.value.length - 1)

function goToPrev() {
  if (hasPrev.value) loadMarkdown(files.value[currentIndex.value - 1])
}

function goToNext() {
  if (hasNext.value) loadMarkdown(files.value[currentIndex.value + 1])
}

function getGitHubUrl(f) {
  return f ? f.htmlUrl : GITHUB_REPO_BASE
}

function onKeydown(e) {
  if (sel.value && !isLoading.value) {
    if (e.key === 'ArrowLeft' && e.ctrlKey) { e.preventDefault(); goToPrev() }
    if (e.key === 'ArrowRight' && e.ctrlKey) { e.preventDefault(); goToNext() }
    if (e.key === 'Escape') { e.preventDefault(); backToList() }
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)

  const hash = route.hash ? decodeURIComponent(route.hash.slice(1)) : ''
  if (hash) {
    const stopWatch = watch(files, (val) => {
      if (val.length > 0) {
        stopWatch()
        const found = val.find(f => f.rawName === hash)
        if (found) selectFile(found)
      }
    })
    onUnmounted(() => stopWatch())
  }
})

onUnmounted(() => {
  if (loadAbortController) loadAbortController.abort()
  document.removeEventListener('keydown', onKeydown)
})
</script>
