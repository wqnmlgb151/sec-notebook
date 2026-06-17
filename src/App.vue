<template>
  <a href="#main-content" class="skip-nav">跳到主要内容</a>
  <AppHeader />
  <main id="main-content">
    <router-view />
  </main>
  <AppFooter />
  <ToastContainer />
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import ToastContainer from './components/ToastContainer.vue'
</script>
