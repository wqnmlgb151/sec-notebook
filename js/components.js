/* ============================================================
   WebPenTest Lab — 公共组件
   功能：统一的 Header 导航栏 & Footer 页脚注入
   所有页面通过占位元素引用，修改一处全局生效
   注意：模板内容为纯静态 HTML，切勿拼接用户数据以防止 XSS
   ============================================================ */
'use strict';

/* -------- 共享 Header 模板（无预设 active 状态，由 highlightCurrentNav 动态设置）-------- */
const HEADER_HTML = `
  <div class="header-inner">
    <a href="/html/index.html" class="logo">
      <div class="logo-icon">&#128214;</div>
      sec<span>notebook</span>
    </a>
    <button class="hamburger" aria-label="菜单">
      <span></span><span></span><span></span>
    </button>
    <nav class="main-nav">
      <a href="/html/index.html">首页</a>
      <div class="nav-dropdown">
        <a href="/html/list.html" tabindex="0">学习笔记</a>
        <div class="dropdown-menu">
          <a href="/html/list.html">Web渗透测试笔记</a>
        </div>
      </div>
      <a href="/html/detail.html">漏洞详情</a>
      <a href="/html/login.html">安全实验室</a>
      <a href="/html/about.html">关于项目</a>
    </nav>
  </div>`;

/* -------- 共享 Footer 模板 -------- */
const FOOTER_HTML = `
  <div class="container">
    <div class="footer-links">
      <a href="/html/index.html">首页</a>
      <a href="/html/list.html">学习笔记</a>
      <a href="/html/detail.html">漏洞详情</a>
      <a href="/html/login.html">安全实验室</a>
      <a href="/html/about.html">关于项目</a>
    </div>
    <p class="copyright">
      &copy; ${new Date().getFullYear()} WebPenTest Lab. 仅用于教育学习目的，请勿用于非法用途。
    </p>
  </div>`;

/* -------- 注入组件到占位元素 -------- */
(function injectComponents() {
  const headerEl = document.getElementById('site-header');
  if (headerEl) {
    headerEl.innerHTML = HEADER_HTML;
  }

  const footerEl = document.getElementById('site-footer');
  if (footerEl) {
    footerEl.innerHTML = FOOTER_HTML;
  }
})();
