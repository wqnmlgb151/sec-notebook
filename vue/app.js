/* ============================================================
   sec-notebook — Vue3 学习笔记系统
   功能：动态抓取 GitHub 仓库 Markdown 笔记、渲染展示
   数据源：wqnmlgb151/study > 计算机技术学习/web渗透测试
   架构：内嵌文件列表（无 API 限流）+ raw CDN 直连
   使用 Vue3 CDN + marked.js + highlight.js
   ============================================================ */
'use strict';

var _Vue = Vue;
var createApp = _Vue.createApp,
    ref = _Vue.ref,
    computed = _Vue.computed,
    onMounted = _Vue.onMounted,
    onUnmounted = _Vue.onUnmounted,
    nextTick = _Vue.nextTick;

/* -------- 配置 -------- */
var GITHUB_REPO_BASE = 'https://github.com/wqnmlgb151/study/blob/main/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%8A%80%E6%9C%AF%E5%AD%A6%E4%B9%A0/web%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95';
var RAW_BASE = 'https://raw.githubusercontent.com/wqnmlgb151/study/main/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%8A%80%E6%9C%AF%E5%AD%A6%E4%B9%A0/web%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95';

/* -------- 内嵌文件列表（无需 API 请求，避免限流）-------- */
var FILE_LIST = [
  '01 代理配置和IP地址.md',
  '02 web运行原理与操作系统.md',
  '03.快速搭建渗透测试环境.md',
  '04.渗透常见的DOS命令.md',
  '05.Linux基础操作与配置.md',
  '06.Linux用户权限管理.md',
  '07.Linux系统状态管理、安全加固.md',
  '08.Kali.md',
  '09.抓包工具介绍.md',
  '10.http协议.md',
  '11.BurpSuite详解.md',
  '12.数据传输与加密算法.md',
  '13.信息收集.md',
  '14.MySQL基础.md',
  '15.PHP基础.md',
  '16.前后端交互.md',
  '17.身份验证原理.md',
  '18.SQL注入.md',
  '19.SQL注入利用方式.md'
];

/* -------- 解析文件名为结构化数据 -------- */
function parseFileName(rawName) {
  var match = rawName.match(/^(\d+)[\.\s]*(.+)\.md$/i);
  return {
    rawName: rawName,
    num: match ? parseInt(match[1], 10) : 0,
    title: match ? match[2] : rawName.replace(/\.md$/i, ''),
    downloadUrl: RAW_BASE + '/' + encodeURIComponent(rawName),
    htmlUrl: GITHUB_REPO_BASE + '/' + encodeURIComponent(rawName),
    icon: getFileIcon(match ? match[2] : rawName)
  };
}

function getFileIcon(title) {
  var t = title.toLowerCase();
  if (t.indexOf('sql') !== -1 || t.indexOf('注入') !== -1) return '\uD83D\uDCCB';
  if (t.indexOf('burp') !== -1 || t.indexOf('代理') !== -1 || t.indexOf('抓包') !== -1) return '\uD83D\uDD0D';
  if (t.indexOf('kali') !== -1 || t.indexOf('linux') !== -1) return '\uD83D\uDCBB';
  if (t.indexOf('dos') !== -1 || t.indexOf('命令') !== -1) return '\u2328\uFE0F';
  if (t.indexOf('http') !== -1 || t.indexOf('协议') !== -1) return '\uD83C\uDF10';
  if (t.indexOf('认证') !== -1 || t.indexOf('身份') !== -1) return '\uD83D\uDD11';
  if (t.indexOf('加密') !== -1) return '\uD83D\uDD10';
  if (t.indexOf('信息收集') !== -1) return '\uD83D\uDCCB';
  if (t.indexOf('xss') !== -1) return '\uD83D\uDC89';
  if (t.indexOf('csrf') !== -1) return '\uD83C\uDFAD';
  if (t.indexOf('ssrf') !== -1) return '\uD83D\uDD01';
  if (t.indexOf('上传') !== -1) return '\uD83D\uDCC2';
  if (t.indexOf('基础') !== -1 || t.indexOf('入门') !== -1 || t.indexOf('搭建') !== -1) return '\uD83D\uDCD6';
  if (t.indexOf('工具') !== -1) return '\uD83D\uDEE0\uFE0F';
  if (t.indexOf('mysql') !== -1 || t.indexOf('php') !== -1) return '\uD83D\uDDA5\uFE0F';
  if (t.indexOf('前后端') !== -1 || t.indexOf('交互') !== -1) return '\uD83D\uDD17';
  if (t.indexOf('运行') !== -1 || t.indexOf('操作系统') !== -1) return '\u2699\uFE0F';
  if (t.indexOf('权限') !== -1) return '\uD83D\uDEE1\uFE0F';
  if (t.indexOf('状态') !== -1 || t.indexOf('安全加固') !== -1) return '\uD83D\uDCCA';
  if (t.indexOf('数据传输') !== -1 || t.indexOf('加密算法') !== -1) return '\uD83D\uDC8E';
  return '\uD83D\uDCDD';
}

/* -------- Markdown 渲染器配置 -------- */
function setupMarked() {
  if (typeof marked === 'undefined') { return false; }
  marked.setOptions({
    gfm: true,
    breaks: true,
    headerIds: true,
    mangle: false
  });
  if (typeof hljs !== 'undefined') {
    marked.setOptions({
      highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try { return hljs.highlight(code, { language: lang }).value; } catch (e) {}
        }
        return code;
      }
    });
  }
  return true;
}

/* -------- Vue3 应用 -------- */
var PenTestApp = {
  setup: function () {
    /* ---- 构建文件数据 ---- */
    var filesArr = FILE_LIST.map(function (name) { return parseFileName(name); });
    filesArr.sort(function (a, b) { return a.num - b.num; });

    var files = ref(filesArr);
    var selectedFile = ref(null);
    var renderedHTML = ref('');
    var isLoading = ref(false);
    var error = ref(null);
    var showSidebar = ref(true);

    /* ---- 加载并渲染 Markdown ---- */
    function loadMarkdown(file) {
      selectedFile.value = file;
      isLoading.value = true;
      error.value = null;
      renderedHTML.value = '';

      fetch(file.downloadUrl)
        .then(function (res) {
          if (!res.ok) {
            var msg = '文件加载失败';
            if (res.status === 404) { msg = '文件不存在，可能已被移除'; }
            else if (res.status >= 500) { msg = '服务器错误，请稍后重试'; }
            throw new Error(msg);
          }
          return res.text();
        })
        .then(function (text) {
          if (typeof marked !== 'undefined') {
            renderedHTML.value = marked.parse(text);
          } else {
            renderedHTML.value = '<pre>' + escapeHtml(text) + '</pre>';
          }
          isLoading.value = false;
          nextTick(function () {
            var contentEl = document.querySelector('.content-area');
            if (contentEl) { contentEl.scrollTop = 0; }
            if (typeof hljs !== 'undefined') { hljs.highlightAll(); }
          });
          if (window.innerWidth <= 768) { showSidebar.value = false; }
        })
        .catch(function (err) {
          error.value = err.message || '加载失败';
          isLoading.value = false;
        });
    }

    function escapeHtml(text) {
      return text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /* ---- 视图状态管理 ---- */
    function selectFile(file) {
      loadMarkdown(file);
      window.location.hash = encodeURIComponent(file.rawName);
    }

    function backToList() {
      selectedFile.value = null;
      renderedHTML.value = '';
      error.value = null;
      window.location.hash = '';
    }

    function retryLoad() {
      if (selectedFile.value) { loadMarkdown(selectedFile.value); }
    }

    /* ---- 计算属性 ---- */
    var currentIndex = computed(function () {
      if (!selectedFile.value) { return -1; }
      for (var i = 0; i < files.value.length; i++) {
        if (files.value[i].rawName === selectedFile.value.rawName) { return i; }
      }
      return -1;
    });

    var hasPrev = computed(function () { return currentIndex.value > 0; });
    var hasNext = computed(function () { return currentIndex.value < files.value.length - 1; });

    /* ---- 导航 ---- */
    function goToPrev() {
      if (hasPrev.value) { loadMarkdown(files.value[currentIndex.value - 1]); }
    }
    function goToNext() {
      if (hasNext.value) { loadMarkdown(files.value[currentIndex.value + 1]); }
    }

    function getGitHubUrl(file) {
      return file ? file.htmlUrl : GITHUB_REPO_BASE;
    }

    function formatSize(bytes) {
      if (!bytes || bytes < 1024) { return ''; }
      if (bytes < 1024 * 1024) { return (bytes / 1024).toFixed(1) + ' KB'; }
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    /* ---- 键盘事件 ---- */
    function onKeydown(e) {
      if (selectedFile.value && !isLoading.value) {
        if (e.key === 'ArrowLeft' && e.ctrlKey) { e.preventDefault(); goToPrev(); return; }
        if (e.key === 'ArrowRight' && e.ctrlKey) { e.preventDefault(); goToNext(); return; }
        if (e.key === 'Escape') { e.preventDefault(); backToList(); return; }
      }
    }

    /* ---- 生命周期 ---- */
    var hashCheckTimer = null;

    onMounted(function () {
      setupMarked();
      document.addEventListener('keydown', onKeydown);

      // URL hash 恢复选中文件
      var hash = window.location.hash.slice(1);
      if (hash) {
        var decoded = decodeURIComponent(hash);
        var attempts = 0;
        hashCheckTimer = setInterval(function () {
          attempts++;
          if (files.value.length > 0) {
            clearInterval(hashCheckTimer);
            hashCheckTimer = null;
            for (var i = 0; i < files.value.length; i++) {
              if (files.value[i].rawName === decoded) {
                selectFile(files.value[i]);
                break;
              }
            }
          } else if (attempts >= 15) {
            clearInterval(hashCheckTimer);
            hashCheckTimer = null;
          }
        }, 100);
      }
    });

    onUnmounted(function () {
      document.removeEventListener('keydown', onKeydown);
      if (hashCheckTimer) { clearInterval(hashCheckTimer); hashCheckTimer = null; }
    });

    return {
      GITHUB_BASE: GITHUB_REPO_BASE,
      files: files,
      selectedFile: selectedFile,
      renderedHTML: renderedHTML,
      isLoading: isLoading,
      error: error,
      showSidebar: showSidebar,
      currentIndex: currentIndex,
      hasPrev: hasPrev,
      hasNext: hasNext,
      selectFile: selectFile,
      backToList: backToList,
      retryLoad: retryLoad,
      goToPrev: goToPrev,
      goToNext: goToNext,
      getGitHubUrl: getGitHubUrl,
      formatSize: formatSize
    };
  }
};

/* -------- 挂载应用 -------- */
var appElement = document.getElementById('app');
if (appElement) {
  createApp(PenTestApp).mount('#app');
}
