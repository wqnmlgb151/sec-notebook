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
| 核心框架 | Vue 3（CDN）+ marked.js + highlight.js |
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
| Vue 3 (CDN) | 学习笔记动态加载、搜索筛选、Markdown 渲染 |
| marked.js + highlight.js | GitHub Flavored Markdown 渲染 + 代码语法高亮 |
| GitHub REST API | 动态抓取仓库目录与 .md 文件内容 |

---

## 目录结构

```
sec-notebook/
├── html/                    # 页面文件
│   ├── index.html           # 首页 — Hero + Bento Grid + 工具展示
│   ├── list.html            # 学习笔记 — GitHub 动态抓取 + Markdown 渲染
│   ├── detail.html          # 漏洞详情 — SQL注入/XSS/CSRF/SSRF/文件上传/IDOR
│   ├── login.html           # 安全实验室 — 登录/注册 + 表单验证 + 密码强度
│   └── about.html           # 关于项目 — 背景/目标/技术栈/时间线
├── css/
│   └── common.css           # 公共样式表 — 设计令牌 + 组件 + 布局 + 动画 + 笔记系统
├── js/
│   ├── common.js            # 公共脚本 — 导航/Toast/表单验证/密码强度/滚动动画
│   ├── components.js        # 公共组件 — Header + Footer 模板注入
│   └── auth.js              # 安全实验室 — 登录/注册标签切换与表单提交
├── vue/
│   └── app.js               # Vue3 核心 — GitHub API 抓取 + Markdown 渲染 + 搜索筛选
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
- 终端风格攻击示例代码块
- 漏洞原理 → 攻击类型 → 防御方案 完整知识结构
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

### 本地运行

```bash
# 方式一：直接用浏览器打开
start html/index.html

# 方式二：使用 VS Code Live Server
# 安装 Live Server 扩展 → 右键 index.html → Open with Live Server

# 方式三：使用 Python 简易服务器
cd sec-notebook
python -m http.server 8080
# 访问 http://localhost:8080/html/index.html
```

### Cloudflare Pages 部署

1. 将项目推送到 GitHub 仓库
2. Cloudflare Pages → 创建项目 → 连接 GitHub
3. 构建配置：**无需构建命令**，输出目录留空（根目录）
4. 部署完成后访问 `https://<your-project>.pages.dev/html/index.html`

> 已是纯静态项目，无需 `npm install` / `npm build`

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

### 2026-05-01
- 新增 GitHub 动态抓取 Markdown 学习笔记系统
- 集成 marked.js + highlight.js 客户端渲染
- 添加 CSP 安全策略 + ARIA 无障碍属性
- 修复 CLS 布局偏移与动画重绘性能问题
- 提取 inline JS 至独立模块
- 完善加载/空/错误全状态覆盖
