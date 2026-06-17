<template>
  <footer class="site-footer">
    <div class="container">
      <nav aria-label="页脚导航">
        <div class="footer-links">
          <router-link to="/">首页</router-link>
          <router-link to="/notes">学习笔记</router-link>
          <router-link to="/detail">漏洞详情</router-link>
          <router-link to="/lab">安全实验室</router-link>
          <router-link to="/about">关于项目</router-link>
        </div>
      </nav>
      <p class="copyright">
        &copy; {{ year }} WebPenTest Lab. 仅用于教育学习目的，请勿用于非法用途。
      </p>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
