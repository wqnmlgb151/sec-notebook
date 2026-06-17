# sec-notebook

> **Web前端应用开发** 课程结课大作业

---

## 项目简介

sec-notebook 是一个**暗黑赛博玻璃态 (Dark Cyber Glassmorphism)** 风格的 Web 安全学习平台。以 OWASP Top 10 漏洞分类为框架，系统化整理常见 Web 安全漏洞的原理、攻击向量与防御方案，同时支持**动态抓取 GitHub 仓库 Markdown 学习笔记**进行在线渲染阅读。

| 指标 | 说明 |
|------|------|
| 页面数 | 5 个（首页 / 笔记库 / 详情 / 实验室 / 关于） |
| 架构 | Vue 3 SPA 单页应用（Vue Router 4 客户端路由） |
| 响应式 | 三端适配（≤768px 手机 / 769-1024px 平板 / ≥1025px 桌面） |
| 核心框架 | Vue 3（Vite + SFC 单文件组件） |
| 部署方式 | 纯静态，可部署至 Cloudflare Pages / Vercel / GitHub Pages |

---

## 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 语义化标签 | 统一页面结构 |
| CSS3 自定义属性 | 70+ 设计令牌（颜色、间距、圆角、阴影、字体） |
| CSS3 Flex + Grid | 响应式布局 + Bento Grid 便当盒网格 |
| CSS3 动画 | 玻璃态毛玻璃、霓虹辉光、故障动画、扫描线 |
| Vue 3 (SFC + Vite) | SPA 单页应用框架 |
| Vue Router 4 | 客户端路由、懒加载、滚动行为控制 |
| marked.js + highlight.js | GitHub Flavored Markdown 渲染 + 代码语法高亮 |
| DOMPurify | XSS 安全净化 Markdown 渲染后的 HTML |
| GitHub REST API | 动态抓取仓库目录与 .md 文件内容 |

---

## 目录结构

```
sec-notebook/
├── index.html                # SPA 唯一入口，<div id="app"> + <script type="module">
├── src/                      # Vue 3 源码
│   ├── main.js               # createApp + router + 全局 CSS + Toast 状态
│   ├── App.vue               # 根组件：跳过导航 + AppHeader + <router-view> + AppFooter + Toast
│   ├── router/
│   │   └── index.js          # 5 条路由（/ /notes /detail /lab /about）+ 旧URL兼容 + 404兜底
│   ├── views/
│   │   ├── HomePage.vue      # 首页 — Hero + 统计数据 + Bento Grid + 19篇笔记索引
│   │   ├── NotesPage.vue     # 学习笔记 — GitHub API 抓取 + Markdown 渲染 + 键盘翻页
│   │   ├── DetailPage.vue    # 漏洞详情 — 6 大 OWASP 漏洞数据驱动 + 侧边栏滚动高亮
│   │   ├── LabPage.vue       # 安全实验室 — 登录/注册标签切换 + 表单验证 + 密码强度
│   │   └── AboutPage.vue     # 关于项目 — 背景/目标/技术栈/时间线
│   ├── components/
│   │   ├── AppHeader.vue     # 全局导航栏（router-link 高亮 + 汉堡菜单 + 滚动效果）
│   │   ├── AppFooter.vue     # 全局页脚
│   │   └── ToastContainer.vue # Toast 消息容器
│   └── composables/
│       └── useToast.js       # Toast 通知系统
├── css/                      # 全局样式（保持不变）
│   ├── tokens.css            # 设计令牌 — 70+ 自定义属性
│   ├── base.css              # 全局基础 — 重置/排版/布局/动画/响应式
│   ├── components.css        # 组件样式 — 导航/卡片/按钮/表单/终端/Toast
│   ├── notes.css             # 笔记系统 — 侧边栏/Markdown渲染/骨架屏
│   └── common.css            # @import 聚合入口（向后兼容）
├── vue/
│   └── notes.js              # GitHub API 工具 + Markdown 解析函数
├── vite.config.js            # Vite + @vitejs/plugin-vue + 静态资源复制插件
├── package.json              # 依赖：vue, vue-router, marked, highlight.js, dompurify
├── _redirects                # Cloudflare Pages：/* → /index.html (SPA 回退)
└── readme.md                 # 本文件
```

---

## 页面说明

### 首页 (`/`)
- Hero 首屏（Glitch 文字 + 霓虹辉光徽章 + 背景光球）
- 统计数据（笔记数 / SQL注入专题 / GFM渲染 / GitHub数据源）
- Bento Grid 核心模块（注入攻击 / XSS / 访问控制 / 文件操作 / 渗透测试方法论）
- 19 篇笔记卡片 → 点击跳转 `/notes#文件名`
- 常用工具展示（Burp Suite / Nmap / SQLMap）

### 学习笔记 (`/notes`)
- 动态从 GitHub 仓库 `wqnmlgb151/study` 抓取 Web渗透测试 .md 笔记
- 桌面端双栏布局：左侧目录导航 + 右侧 Markdown 渲染
- 支持 GFM（表格/代码高亮/任务列表/引用块）
- 键盘快捷键：Ctrl+←→ 翻页、ESC 返回目录
- GitHub API 限流自动重试 + 并发预加载缓存
- 移动端侧边栏折叠

### 漏洞详情 (`/detail`)
- 6 大 OWASP 漏洞深度分析（SQL注入/XSS/CSRF/SSRF/文件上传/IDOR）
- 侧边栏滚动高亮：rAF 节流 scroll 事件 + getBoundingClientRect 检测
- 每篇文章：原理 + 攻击示例（终端模拟） + 攻击类型 + 防御方案
- 支持 `?id=xss` URL 参数定位到指定漏洞
- 响应式：桌面端侧栏置顶，移动端隐藏

### 安全实验室 (`/lab`)
- 登录 / 注册标签切换
- 表单验证（邮箱格式、手机号、密码强度、确认密码匹配）
- 密码强度实时指示器（弱/中/强/非常强）
- Toast 消息系统（成功/错误/信息）

### 关于项目 (`/about`)
- 项目背景与目标
- 技术栈表格
- 设计理念（Dark Cyber Glassmorphism）
- 开发规划时间线
- 免责声明

---

## 快速开始

```bash
# 安装依赖（仅首次）
npm install

# 启动开发服务器（HMR 热更新，自动打开 http://localhost:5173）
npm run dev

# 生产构建 → dist/
npm run build

# 本地预览生产构建
npm run preview
```

---

## 部署到 Cloudflare Pages

1. **构建命令**：`npm run build`
2. **输出目录**：`dist`
3. **SPA 回退规则**（已在 `_redirects` 中配置）：
   ```
   /* /index.html 200
   ```

所有路由请求都会重写为 `/index.html`，Vue Router 在客户端接管路由分发。无需额外配置。

---

## 架构说明

### 路由设计

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | HomePage.vue | 首页 |
| `/notes` | NotesPage.vue | 学习笔记 |
| `/detail` | DetailPage.vue | 漏洞详情 |
| `/lab` | LabPage.vue | 安全实验室 |
| `/about` | AboutPage.vue | 关于项目 |
| `/html/:page.html` | redirect → `/:page` | 旧 URL 兼容 |
| `/*` | redirect → `/` | 404 兜底 |

### CSS 分层架构
设计令牌（`tokens.css`）→ 全局基础（`base.css`）→ 可复用组件（`components.css`）→ 页面级样式（`notes.css`），每层职责清晰。

### 构建输出
- 入口 `index.html` + 共享 vendor chunk（vue + vue-router）
- 每个页面独立 chunk（懒加载，首屏仅加载首页）
- CSS 文件独立打包（全局 main.css + 页面 scoped CSS）
- `_redirects` 自动复制到 dist/

### 向后兼容
旧的多页面 URL（如 `/html/index.html`、`/html/list.html`）通过 Vue Router 重定向规则自动跳转到新的 SPA 路径。
