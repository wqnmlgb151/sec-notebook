<template>
  <header :class="['site-header', { 'header-scrolled': scrolled }]">
    <div class="header-inner">
      <router-link to="/" class="logo">
        <div class="logo-icon">&#128214;</div>
        sec<span>notebook</span>
      </router-link>
      <button
        class="hamburger"
        :class="{ active: menuOpen }"
        @click="toggleMenu"
        aria-label="菜单"
        :aria-expanded="menuOpen"
        aria-controls="main-nav"
      >
        <span></span><span></span><span></span>
      </button>
      <nav id="main-nav" :class="['main-nav', { active: menuOpen }]">
        <router-link to="/">首页</router-link>
        <div class="nav-dropdown">
          <router-link to="/notes" tabindex="0">学习笔记</router-link>
          <div class="dropdown-menu">
            <router-link to="/notes">Web渗透测试笔记</router-link>
          </div>
        </div>
        <router-link to="/detail">漏洞详情</router-link>
        <router-link to="/lab">安全实验室</router-link>
        <router-link to="/about">关于项目</router-link>
      </nav>
    </div>
  </header>
  <div :class="['nav-overlay', { active: menuOpen }]" @click="closeMenu"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menuOpen = ref(false)
const scrolled = ref(false)

let scrollTicking = false

function onScroll() {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      scrolled.value = window.scrollY > 50
      scrollTicking = false
    })
    scrollTicking = true
  }
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

function closeMenu() {
  menuOpen.value = false
  document.body.style.overflow = ''
}

router.afterEach(() => closeMenu())

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.body.style.overflow = ''
})
</script>
