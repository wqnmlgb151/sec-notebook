<template>
  <section class="hero">
    <div class="hero-bg-orb hero-bg-orb--cyan"></div>
    <div class="hero-bg-orb hero-bg-orb--purple"></div>
    <div class="hero-content">
      <div class="hero-badge fade-in-up">
        <span class="dot"></span> Web 渗透测试学习手册
      </div>
      <h1 class="fade-in-up fade-in-up--delay-1">
        构建<span class="highlight"> Web 安全</span><br>攻防知识体系
      </h1>
      <p class="fade-in-up fade-in-up--delay-2">
        从代理配置到 SQL 注入，覆盖渗透测试全流程的 19 篇系统笔记。
        基于 GitHub 仓库动态渲染 Markdown，支持代码高亮与 GFM 语法，键盘驱动阅读体验。
      </p>
      <div class="fade-in-up fade-in-up--delay-3" style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
        <router-link to="/notes" class="btn btn-primary btn-lg">📖 开始学习</router-link>
        <router-link to="/detail" class="btn btn-outline btn-lg">漏洞分析</router-link>
      </div>
    </div>
  </section>

  <!-- 核心数据 -->
  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="grid grid-4" style="text-align:center">
        <div class="card card-glass" style="padding:1.5rem">
          <div style="font-size:2.5rem;font-weight:900;color:var(--color-accent-glow)">19</div>
          <p style="font-size:0.82rem;margin-top:0.4rem;color:var(--color-text-tertiary)">篇渗透测试笔记</p>
        </div>
        <div class="card card-glass" style="padding:1.5rem">
          <div style="font-size:2.5rem;font-weight:900;color:var(--color-accent-red)">SQL注入</div>
          <p style="font-size:0.82rem;margin-top:0.4rem;color:var(--color-text-tertiary)">攻防实战专题</p>
        </div>
        <div class="card card-glass" style="padding:1.5rem">
          <div style="font-size:2.5rem;font-weight:900;color:var(--color-accent-purple)">GFM</div>
          <p style="font-size:0.82rem;margin-top:0.4rem;color:var(--color-text-tertiary)">Markdown 实时渲染</p>
        </div>
        <div class="card card-glass" style="padding:1.5rem">
          <div style="font-size:2.5rem;font-weight:900;color:var(--color-accent-emerald)">GitHub</div>
          <p style="font-size:0.82rem;margin-top:0.4rem;color:var(--color-text-tertiary)">开源持续更新</p>
        </div>
      </div>
    </div>
  </section>

  <!-- OWASP Bento Grid -->
  <section class="section" style="padding-top:0">
    <div class="container">
      <h2 class="text-center mb-3">Web 安全核心领域</h2>
      <p class="text-center mb-4" style="color:var(--color-text-tertiary);max-width:600px;margin-left:auto;margin-right:auto">基于 OWASP Top 10 分类标准，系统化学习 Web 常见安全漏洞</p>
      <div class="bento-grid">
        <div class="bento-item">
          <div class="card-icon" style="background:rgba(6,182,212,0.15)">🗄️</div>
          <h3>注入类攻击</h3>
          <p>SQL 注入、命令注入、XXE — 理解攻击者如何通过恶意输入操控后端系统。</p>
          <div style="margin-top:1rem"><span class="badge badge-red">严重</span><span class="badge badge-cyan" style="margin-left:0.5rem">OWASP A03</span></div>
        </div>
        <div class="bento-item">
          <div class="card-icon" style="background:rgba(168,85,247,0.15)">💉</div>
          <h3>跨站脚本 (XSS)</h3>
          <p>反射型、存储型、DOM 型 XSS — 前端最常见也最容易被忽视的安全漏洞。</p>
          <div style="margin-top:1rem"><span class="badge badge-orange">高危</span><span class="badge badge-purple" style="margin-left:0.5rem">客户端安全</span></div>
        </div>
        <div class="bento-item">
          <div class="card-icon" style="background:rgba(249,115,22,0.15)">🔑</div>
          <h3>访问控制缺陷</h3>
          <p>CSRF、IDOR、SSRF — 权限校验不当导致的数据泄露与越权操作。</p>
          <div style="margin-top:1rem"><span class="badge badge-orange">高危</span><span class="badge badge-orange" style="margin-left:0.5rem">OWASP A01</span></div>
        </div>
        <div class="bento-item">
          <div class="card-icon" style="background:rgba(239,68,68,0.15)">📂</div>
          <h3>文件操作漏洞</h3>
          <p>文件上传、路径遍历 — 攻击者获取服务器文件系统访问权限的常见方式。</p>
          <div style="margin-top:1rem"><span class="badge badge-red">严重</span><span class="badge badge-red" style="margin-left:0.5rem">文件安全</span></div>
        </div>
        <div class="bento-item bento-item--wide" style="background:linear-gradient(135deg,rgba(6,182,212,0.05),rgba(168,85,247,0.05))">
          <h3 style="margin-bottom:1.5rem">渗透测试方法论</h3>
          <div class="grid grid-4" style="text-align:center">
            <div><div style="font-size:2rem;margin-bottom:0.5rem">🔍</div><div style="font-weight:700;margin-bottom:0.3rem">信息收集</div><p style="font-size:0.8rem;color:var(--color-text-tertiary)">子域名/端口/指纹</p></div>
            <div><div style="font-size:2rem;margin-bottom:0.5rem">🎯</div><div style="font-weight:700;margin-bottom:0.3rem">漏洞扫描</div><p style="font-size:0.8rem;color:var(--color-text-tertiary)">自动化+手动分析</p></div>
            <div><div style="font-size:2rem;margin-bottom:0.5rem">💥</div><div style="font-weight:700;margin-bottom:0.3rem">漏洞利用</div><p style="font-size:0.8rem;color:var(--color-text-tertiary)">PoC 编写与验证</p></div>
            <div><div style="font-size:2rem;margin-bottom:0.5rem">📋</div><div style="font-weight:700;margin-bottom:0.3rem">报告输出</div><p style="font-size:0.8rem;color:var(--color-text-tertiary)">风险评级与修复建议</p></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 笔记索引 -->
  <section class="section" style="padding-top:0">
    <div class="container">
      <h2 class="text-center mb-3">📚 全部学习笔记</h2>
      <p class="text-center mb-4" style="color:var(--color-text-tertiary);max-width:560px;margin-left:auto;margin-right:auto">从基础到实战，19 篇渗透测试笔记。点击跳转到阅读页面，支持 GFM 渲染与代码高亮</p>
      <div class="idx-notes-grid">
        <router-link v-for="n in notes" :key="n.num" :to="'/notes#' + encodeURIComponent(n.file)" class="idx-note-card">
          <span class="nb-num">{{ n.num < 10 ? '0' + n.num : n.num }}</span>
          <span class="nb-icon">{{ n.icon }}</span>
          <span class="nb-title">{{ n.title }}</span>
        </router-link>
      </div>
      <div class="text-center mt-4">
        <router-link to="/notes" class="btn btn-primary btn-lg">📖 进入阅读模式（Ctrl+←→ 翻页）</router-link>
      </div>
    </div>
  </section>

  <!-- 工具 -->
  <section class="section">
    <div class="container">
      <h2 class="text-center mb-3">常用渗透测试工具</h2>
      <p class="text-center mb-4" style="color:var(--color-text-tertiary);max-width:600px;margin-left:auto;margin-right:auto">行业标准工具，安全从业者的必备武器库</p>
      <div class="grid grid-3">
        <div class="card card-glow-cyan">
          <div class="card-icon" style="background:rgba(6,182,212,0.15)">🔍</div>
          <h3>Burp Suite</h3>
          <p>Web 安全测试的行业标准工具，支持代理拦截、爬虫、扫描、重放等完整功能。</p>
          <span class="badge badge-cyan" style="margin-top:0.75rem">代理工具</span>
        </div>
        <div class="card card-glow-cyan">
          <div class="card-icon" style="background:rgba(168,85,247,0.15)">🛡️</div>
          <h3>Nmap</h3>
          <p>网络发现与安全审计利器，支持主机发现、端口扫描、服务版本检测与操作系统指纹识别。</p>
          <span class="badge badge-purple" style="margin-top:0.75rem">信息收集</span>
        </div>
        <div class="card card-glow-cyan">
          <div class="card-icon" style="background:rgba(16,185,129,0.15)">⚡</div>
          <h3>SQLMap</h3>
          <p>自动化 SQL 注入检测与利用工具，支持多种数据库和注入技术，渗透测试必备。</p>
          <span class="badge badge-green" style="margin-top:0.75rem">注入检测</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'

const notes = [
  { num: 1, file: '01 代理配置和IP地址.md', icon: '🌐', title: '代理配置和IP地址' },
  { num: 2, file: '02 web运行原理与操作系统.md', icon: '⚙️', title: 'web运行原理与操作系统' },
  { num: 3, file: '03.快速搭建渗透测试环境.md', icon: '📖', title: '快速搭建渗透测试环境' },
  { num: 4, file: '04.渗透常见的DOS命令.md', icon: '⌨️', title: '渗透常见的DOS命令' },
  { num: 5, file: '05.Linux基础操作与配置.md', icon: '🐧', title: 'Linux基础操作与配置' },
  { num: 6, file: '06.Linux用户权限管理.md', icon: '🛡️', title: 'Linux用户权限管理' },
  { num: 7, file: '07.Linux系统状态管理、安全加固.md', icon: '📊', title: 'Linux系统状态管理安全加固' },
  { num: 8, file: '08.Kali.md', icon: '💻', title: 'Kali' },
  { num: 9, file: '09.抓包工具介绍.md', icon: '🔍', title: '抓包工具介绍' },
  { num: 10, file: '10.http协议.md', icon: '🌐', title: 'HTTP协议' },
  { num: 11, file: '11.BurpSuite详解.md', icon: '🔍', title: 'BurpSuite详解' },
  { num: 12, file: '12.数据传输与加密算法.md', icon: '💎', title: '数据传输与加密算法' },
  { num: 13, file: '13.信息收集.md', icon: '📋', title: '信息收集' },
  { num: 14, file: '14.MySQL基础.md', icon: '🖥️', title: 'MySQL基础' },
  { num: 15, file: '15.PHP基础.md', icon: '🖥️', title: 'PHP基础' },
  { num: 16, file: '16.前后端交互.md', icon: '🔗', title: '前后端交互' },
  { num: 17, file: '17.身份验证原理.md', icon: '🔑', title: '身份验证原理' },
  { num: 18, file: '18.SQL注入.md', icon: '🗄️', title: 'SQL注入' },
  { num: 19, file: '19.SQL注入利用方式.md', icon: '🗄️', title: 'SQL注入利用方式' }
]

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.idx-notes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
}
@media (min-width: 769px) { .idx-notes-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1025px) { .idx-notes-grid { grid-template-columns: repeat(4, 1fr); } }
.idx-note-card {
  display: flex; align-items: center; gap: 0.55rem;
  padding: 0.7rem 0.9rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  text-decoration: none; transition: all var(--duration-fast); cursor: pointer;
}
.idx-note-card:hover {
  background: rgba(6,182,212,0.06);
  border-color: rgba(6,182,212,0.3);
  box-shadow: 0 0 15px rgba(6,182,212,0.1);
}
.nb-num {
  font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700;
  color: var(--color-text-muted); min-width: 1.8em;
}
.nb-icon { font-size: 0.95rem; flex-shrink: 0; }
.nb-title {
  font-size: 0.8rem; color: var(--color-text-secondary);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.idx-note-card:hover .nb-title { color: var(--color-accent-glow); }
</style>
