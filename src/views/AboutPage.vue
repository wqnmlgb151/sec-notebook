<template>
  <section class="page-hero">
    <div class="hero-bg-orb hero-bg-orb--cyan" style="width:350px;height:350px;opacity:0.08;top:-5%;right:-5%"></div>
    <div class="hero-bg-orb hero-bg-orb--purple" style="width:250px;height:250px;opacity:0.06;bottom:0;left:-5%"></div>
    <div class="container">
      <nav aria-label="面包屑导航"><div class="breadcrumb">
        <router-link to="/">首页</router-link><span class="sep">/</span><span>关于项目</span>
      </div></nav>
      <h1>关于 <span class="highlight">sec-notebook</span></h1>
      <p>以攻促防，构建 Web 安全知识体系</p>
    </div>
  </section>

  <section class="section" style="padding-top: 0;">
    <div class="container" style="max-width: 800px;">
      <!-- 项目背景 -->
      <div class="card card-glow-cyan" style="padding: 2.5rem; margin-bottom: 2rem;">
        <h2 style="margin-bottom: 1rem;">项目背景</h2>
        <p>Web 应用已成为现代社会的基础设施，但安全问题层出不穷。从 OWASP 每年发布的 Top 10 榜单可以看出，SQL 注入、XSS、CSRF 等经典漏洞在数十年后依然活跃。本项目旨在为前端开发者、安全初学者提供一个系统化的 Web 安全学习平台，从攻击者视角理解漏洞原理，从根本上建立安全防御思维。</p>
      </div>

      <!-- 项目目标 -->
      <div class="card card-glow-cyan" style="padding: 2.5rem; margin-bottom: 2rem;">
        <h2 style="margin-bottom: 1rem;">项目目标</h2>
        <div class="grid grid-2">
          <div class="card card-glass" style="padding: 1.5rem;">
            <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📚</div>
            <h4 style="margin-bottom: 0.3rem;">知识体系</h4>
            <p style="font-size: 0.85rem;">基于 OWASP 标准分类，覆盖主流 Web 漏洞类型</p>
          </div>
          <div class="card card-glass" style="padding: 1.5rem;">
            <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🔬</div>
            <h4 style="margin-bottom: 0.3rem;">实战导向</h4>
            <p style="font-size: 0.85rem;">每个漏洞配有攻击示例和防御方案</p>
          </div>
          <div class="card card-glass" style="padding: 1.5rem;">
            <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🛡️</div>
            <h4 style="margin-bottom: 0.3rem;">防御优先</h4>
            <p style="font-size: 0.85rem;">强调安全编码实践和防护措施</p>
          </div>
          <div class="card card-glass" style="padding: 1.5rem;">
            <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🎓</div>
            <h4 style="margin-bottom: 0.3rem;">教育目的</h4>
            <p style="font-size: 0.85rem;">所有内容仅用于学习，不涉及真实攻击</p>
          </div>
        </div>
      </div>

      <!-- 技术栈 -->
      <div class="card card-glow-cyan" style="padding: 2.5rem; margin-bottom: 2rem;">
        <h2 style="margin-bottom: 1rem;">技术栈</h2>
        <div style="overflow-x: auto;">
          <table class="data-table">
            <thead><tr><th>技术</th><th>版本</th><th>用途</th></tr></thead>
            <tbody>
              <tr><td>HTML5</td><td>-</td><td>语义化页面结构</td></tr>
              <tr><td>CSS3</td><td>-</td><td>响应式布局、玻璃态设计、动画特效</td></tr>
              <tr><td>JavaScript (ES6+)</td><td>-</td><td>导航交互、表单验证、Toast 系统</td></tr>
              <tr><td>Vue.js</td><td>3.x</td><td>SPA 单页应用、数据驱动视图</td></tr>
              <tr><td>Vue Router</td><td>4.x</td><td>客户端路由、懒加载</td></tr>
              <tr><td>Vite</td><td>6.x</td><td>构建工具、HMR 热更新</td></tr>
              <tr><td>marked + highlight.js</td><td>-</td><td>Markdown 渲染、代码高亮</td></tr>
              <tr><td>DOMPurify</td><td>-</td><td>XSS 安全净化</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 设计理念 -->
      <div class="card card-glow-cyan" style="padding: 2.5rem; margin-bottom: 2rem;">
        <h2 style="margin-bottom: 1rem;">设计理念</h2>
        <p>本项目的 UI 设计采用 <strong>Dark Cyber Glassmorphism</strong> 风格，融合以下设计元素：</p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem;">
          <span class="badge badge-cyan">暗色主题</span>
          <span class="badge badge-purple">玻璃态/毛玻璃</span>
          <span class="badge badge-blue">霓虹辉光</span>
          <span class="badge badge-green">噪点纹理</span>
          <span class="badge badge-orange">大圆角卡片</span>
          <span class="badge badge-cyan">终端风格</span>
          <span class="badge badge-purple">Glitch动画</span>
          <span class="badge badge-red">扫描线效果</span>
          <span class="badge badge-blue">Bento Grid</span>
        </div>
      </div>

      <!-- 开发规划时间线 -->
      <div class="card card-glow-cyan" style="padding: 2.5rem; margin-bottom: 2rem;">
        <h2 style="margin-bottom: 1.5rem;">开发规划</h2>
        <div class="timeline">
          <div class="timeline-item">
            <h4>第一阶段：主题与功能确定</h4>
            <p style="font-size: 0.9rem;">确定网络安全渗透测试主题，规划核心功能清单与页面结构</p>
          </div>
          <div class="timeline-item">
            <h4>第二阶段：基础页面搭建</h4>
            <p style="font-size: 0.9rem;">HTML5 语义化结构、CSS3 暗色主题与玻璃态样式系统</p>
          </div>
          <div class="timeline-item">
            <h4>第三阶段：交互与响应式</h4>
            <p style="font-size: 0.9rem;">JavaScript 导航交互、Vue3 组件化重构、三端响应式适配</p>
          </div>
          <div class="timeline-item">
            <h4>第四阶段：SPA 重构</h4>
            <p style="font-size: 0.9rem;">Vue Router 单页应用迁移、模块化架构</p>
          </div>
        </div>
      </div>

      <!-- 免责声明 -->
      <div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);border-radius:var(--radius-lg);padding:1.5rem;margin-bottom:2rem">
        <h4 style="color: var(--color-accent-red); margin-bottom: 0.75rem;">⚠️ 免责声明</h4>
        <p style="color: var(--color-text-tertiary); font-size: 0.85rem; line-height: 1.8;">
          本项目仅为 Web 前端课程大作业，所有内容仅供教育学习目的。项目中涉及的安全知识与技术仅用于帮助开发者理解漏洞原理、提升安全防御意识。<strong style="color: var(--color-accent-red);">未经授权对他人系统进行渗透测试属于违法行为。</strong>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.timeline {
  position: relative;
  padding-left: 2rem;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--border-default);
}
.timeline-item {
  position: relative;
  margin-bottom: 2rem;
  padding-left: 2rem;
}
.timeline-item::before {
  content: '';
  position: absolute;
  left: -2.3rem;
  top: 0.4rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 12px var(--color-accent-glow);
}
</style>
