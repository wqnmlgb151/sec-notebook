# sec-notebook

> **Web前端应用开发** 课程结课大作业

---

## 项目简介

sec-notebook 是一个**暗黑赛博玻璃态 (Dark Cyber Glassmorphism)** 风格的 Web 安全学习平台。以 OWASP Top 10 漏洞分类为框架，系统化整理常见 Web 安全漏洞的原理、攻击向量与防御方案，同时支持**动态抓取 GitHub 仓库 Markdown 学习笔记**进行在线渲染阅读。

| 指标 | 说明 |
|------|------|
| 页面数 | 5 个（首页 / 笔记库 / 详情 / 实验室 / 关于） |
| 页面跳转 | 三级结构（首页 → 列表 → 详情） |
| 响应式 | 三端适配（≤768px 手机 / 769-1024px 平板 / ≥1025px 桌面） |
| 核心框架 | Vue 3（Vite + SFC 单文件组件）|
| 部署方式 | 纯静态，可部署至 Cloudflare Pages / Vercel / GitHub Pages |

---

## 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 语义化标签 | Header/Nav/Main/Footer 四部分统一页面结构 |
| CSS3 自定义属性 | 70+ 设计令牌（颜色、间距、圆角、阴影、字体） |
| CSS3 Flex + Grid | 响应式布局 + Bento Grid 便当盒网格 |
| CSS3 动画 | 玻璃态毛玻璃、霓虹辉光、故障动画、扫描线 |
| JavaScript (ES6+) | 导航交互、表单验证、Toast 通知、滚动动画 |
| Vue 3 (SFC + Vite) | 学习笔记动态加载、搜索筛选、Markdown 渲染 |
| marked.js + highlight.js | GitHub Flavored Markdown 渲染 + 代码语法高亮 |
| DOMPurify | XSS 安全净化 Markdown 渲染后的 HTML |
| GitHub REST API | 动态抓取仓库目录与 .md 文件内容 |

---

## 目录结构

```
sec-notebook/
├── html/                    # 页面文件
│   ├── index.html           # 首页 — Hero + Bento Grid + 工具展示
│   ├── list.html            # 学习笔记 — GitHub 动态抓取 + Markdown 渲染
│   ├── detail.html          # 漏洞详情 — 数据驱动渲染 6 大 OWASP 漏洞（86 行）
│   ├── login.html           # 安全实验室 — 登录/注册 + 表单验证 + 密码强度
│   └── about.html           # 关于项目 — 背景/目标/技术栈/时间线
├── css/
│   ├── tokens.css           # 设计令牌 — 70+ 自定义属性（颜色/间距/圆角/阴影/字体）
│   ├── base.css             # 全局基础 — 重置 / 排版 / 布局 / 动画 / 响应式（290 行）
│   ├── components.css       # 组件样式 — 导航 / 卡片 / 按钮 / 表单 / 终端 / Toast（752 行）
│   ├── notes.css            # 笔记系统 — 侧边栏 / Markdown 渲染 / 骨架屏（505 行）
│   └── common.css           # @import 聚合入口（向后兼容）
├── js/
│   ├── common.js            # 公共脚本 — 导航/Toast/表单验证/密码强度/滚动动画（ES6）
│   ├── components.js        # 公共组件 — Header + Footer 模板注入
│   ├── auth.js              # 安全实验室 — 登录/注册标签切换与表单提交
│   └── vuln-data.js         # 漏洞详情数据 + DOM 渲染函数（数据驱动 detail.html）
├── vue/
│   ├── App.vue              # Vue3 SFC 主组件（template + script setup）
│   ├── notes.js             # GitHub API 抓取（async/await）+ 查表法 getIcon
│   └── main.js              # Vite 入口 — createApp + mount
├── vite.config.js           # Vite 构建配置（含自定义静态文件复制插件）
├── package.json             # 依赖声明
└── readme.md                # 本文件
```

---

## 页面说明

### 首页 (`index.html`)
- Hero 首屏（Glitch 文字 + 霓虹辉光徽章 + 背景光球）
- 统计数据（漏洞覆盖 / OWASP 标准 / 严重度分级 / 实战案例）
- Bento Grid 核心模块（注入攻击 / XSS / 访问控制 / 文件操作 / 渗透测试方法论）
- 常用工具展示（Burp Suite / Nmap / SQLMap）

### 学习笔记 (`list.html`)
- 动态从 GitHub 仓库 `wqnmlgb151/study` 抓取 **Web渗透测试 .md 笔记**
- 桌面端双栏布局：左侧目录导航 + 右侧 Markdown 渲染
- 支持 GFM（表格/代码高亮/任务列表/引用块）
- Ctrl+←→ 翻页 / ESC 返回目录 / URL hash 保持阅读位置
- 全状态覆盖：加载骨架屏 / 空状态引导 / 错误重试 / GitHub 跳转

### 漏洞详情 (`detail.html`)
- 6 大漏洞深度分析：SQL注入 / XSS / CSRF / SSRF / 文件上传 / IDOR
- **数据驱动渲染**：漏洞数据由 `js/vuln-data.js` 统一管理，侧边栏导航 + 文章内容均由 JS 动态生成
- 终端风格攻击示例代码块（支持可选展示）
- 漏洞原理 → 攻击类型（可选）→ 防御方案 灵活知识结构
- URL `?id=` 参数定位 + 侧边栏内容导航

### 安全实验室 (`login.html`)
- 登录/注册标签切换
- 完整表单验证：邮箱/手机号/密码强度/密码一致性
- 密码强度实时检测（弱→中→强→非常强）+ ARIA 无障碍
- 安全意识提示面板

### 关于项目 (`about.html`)
- 项目背景与目标
- 技术栈表格
- 设计理念标签云（暗色主题/玻璃态/霓虹辉光/Bento Grid 等）
- 开发规划时间线

---

## 设计系统

### 配色

| 角色 | 色值 | 用途 |
|------|------|------|
| 最深底色 | `#020617` | 页面背景 |
| 卡片底色 | `#0f172a` | 毛玻璃卡片 |
| 主强调色 | `#06b6d4` | 链接、按钮、辉光 |
| 青色辉光 | `#22d3ee` | 强调装饰 |
| 紫色 | `#a855f7` | 渐变、发光 |
| 红色 | `#ef4444` | 严重/错误 |
| 橙色 | `#f97316` | 高危/警告 |
| 翠绿 | `#10b981` | 成功/安全 |

### 视觉风格

- **玻璃态**：`backdrop-filter: blur()` + 半透明背景 + 半透明边框
- **霓虹辉光**：`box-shadow` 青/紫色多层发光
- **噪点纹理**：SVG `feTurbulence` 内联数据 URL
- **扫描线**：`repeating-linear-gradient` + `body::after` 固定叠加
- **Glitch 动画**：hover 触发文字错位 + 色彩分离
- **Bento Grid**：CSS Grid 便当盒式网格，支持宽/高跨越
- **终端风格**：红/黄/绿窗口按钮 + 深色代码背景

---

## 快速开始

### 本地开发

```bash
# 安装依赖（仅首次）
npm install

# 启动开发服务器（支持热更新）
npm run dev
# 浏览器自动打开 http://localhost:5173/html/list.html

# 生产构建
npm run build
# 输出到 dist/ 目录

# 预览生产构建
npm run preview
```

### 直接打开静态页面

除学习笔记页以外的 4 个页面可直接浏览器打开：

```bash
start html/index.html
```

### Cloudflare Pages 部署

1. 将项目推送到 GitHub 仓库
2. Cloudflare Pages → 创建项目 → 连接 GitHub
3. 构建配置：
   - **构建命令**：`npm install && npm run build`
   - **输出目录**：`dist`
4. 部署完成后访问 `https://<your-project>.pages.dev/html/index.html`

---

## 浏览器兼容

| Chrome | Edge | Firefox | Safari |
|--------|------|---------|--------|
| ✔ | ✔ | ✔ | ✔ |

---

## 合规声明

- 本项目为**原创前端课程作品**，符合课程大作业全部技术要求
- 所有页面包含 Header + Nav + Main + Footer 四部分统一结构
- 实现三级页面跳转（首页→笔记库→详情），无死链
- 响应式三端适配（≤768px / 769-1024px / ≥1025px）
- Vue3 实现数据驱动（学习笔记动态加载 + Markdown 渲染）
- 完整表单验证（非空/邮箱/手机号/密码强度/一致性）
- 安全知识内容仅用于教育学习目的

---

## 更新日志

### 2026-06-08
- **CSS 架构重构**：1570 行单文件拆分为 4 层模块（tokens → base → components → notes），全部 < 800 行
- **detail.html 数据驱动化**：6 个硬编码漏洞 article → `vuln-data.js` 数据数组 + DOM 动态渲染（309 → 86 行）
- **JS 代码质量提升**：`common.js` 19 处 `var` → `const`/`let`；`notes.js` `getIcon()` 17 层 if-else → 查表法；`fetchFileList()` 回调 → async/await；删除死令牌 `--color-accent-fuchsia`
- **笔记加载稳定性**：添加 15s 超时 + 内存缓存 + 自动重试 + 精确错误分类（超时/网络/限流/404/500）
- **侧边栏体验**：切换笔记后侧边栏自动滚动到当前项
- **inline style 清理**：`detail.html` 71 → 35 处，新增 7 个语义化 CSS 类
- **CSP 安全加固**：5 个页面全部按最小权限收紧——移除未使用的 CDN 白名单（unpkg/jsdelivr/cdnjs）；`list.html` 移除 `'unsafe-inline'` 并修复 `api.github.com` 缺失；`index.html` 显式 `connect-src 'none'`
- **无障碍**：`detail.html` 添加 `<noscript>` 降级提示

### 2026-05-01
- 新增 GitHub 动态抓取 Markdown 学习笔记系统
- 集成 marked.js + highlight.js 客户端渲染
- 添加 CSP 安全策略 + ARIA 无障碍属性
- 修复 CLS 布局偏移与动画重绘性能问题
- 提取 inline JS 至独立模块
- 完善加载/空/错误全状态覆盖
