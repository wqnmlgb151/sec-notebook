/* ============================================================
   WebPenTest Lab — Vue3 学习笔记系统
   功能：动态抓取 GitHub 仓库 Markdown 笔记、渲染展示
   数据源：wqnmlgb151/study > 计算机技术学习/web渗透测试
   使用 Vue3 CDN + marked.js + highlight.js
   ============================================================ */
'use strict';

const { createApp, ref, computed, onMounted, onUnmounted, nextTick } = Vue;

/* -------- 配置常量 -------- */
var API_BASE = 'https://api.github.com/repos/wqnmlgb151/study/contents/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%8A%80%E6%9C%AF%E5%AD%A6%E4%B9%A0/web%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95';
var GITHUB_BASE = 'https://github.com/wqnmlgb151/study/blob/main/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%8A%80%E6%9C%AF%E5%AD%A6%E4%B9%A0/web%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95';
var GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/wqnmlgb151/study/main/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%8A%80%E6%9C%AF%E5%AD%A6%E4%B9%A0/web%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95';

/* -------- Markdown 渲染器配置 -------- */
function setupMarked() {
  if (typeof marked === 'undefined') { return false; }
  marked.setOptions({
    gfm: true,
    breaks: true,
    headerIds: true,
    mangle: false
  });
  // 配置 highlight.js
  if (typeof hljs !== 'undefined') {
    marked.setOptions({
      highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (e) { /* fall through */ }
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
    /* ---- 响应式数据 ---- */
    var files = ref([]);
    var subdirs = ref([]);
    var selectedFile = ref(null);
    var markdownContent = ref('');
    var renderedHTML = ref('');
    var isLoading = ref(false);
    var isDirLoading = ref(true);
    var error = ref(null);
    var dirError = ref(null);
    var searchQuery = ref('');
    var showSidebar = ref(true);

    /* ---- 从 GitHub API 获取目录列表 ---- */
    function fetchDirectory() {
      isDirLoading.value = true;
      dirError.value = null;

      fetch(API_BASE, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      })
        .then(function (res) {
          if (!res.ok) {
            throw new Error('API 请求失败 (' + res.status + '): ' + (res.status === 403 ? 'GitHub API 限流，请稍后再试' : '请检查网络连接'));
          }
          return res.json();
        })
        .then(function (data) {
          var mdFiles = [];
          var dirs = [];
          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item.type === 'file' && item.name.toLowerCase().indexOf('.md') !== -1) {
              // 解析文件名：数字前缀 + 标题
              var match = item.name.match(/^(\d+)[\.\s]*(.+)\.md$/i);
              var num = match ? parseInt(match[1], 10) : 0;
              var title = match ? match[2] : item.name.replace(/\.md$/i, '');
              mdFiles.push({
                name: item.name,
                title: title,
                num: num,
                path: item.path,
                downloadUrl: item.download_url,
                htmlUrl: item.html_url,
                size: item.size,
                icon: getFileIcon(title)
              });
            } else if (item.type === 'dir') {
              dirs.push({ name: item.name, path: item.path, htmlUrl: item.html_url });
            }
          }
          // 按编号排序
          mdFiles.sort(function (a, b) { return a.num - b.num; });
          files.value = mdFiles;
          subdirs.value = dirs;
          isDirLoading.value = false;
        })
        .catch(function (err) {
          dirError.value = err.message || '无法加载文件列表';
          isDirLoading.value = false;
        });
    }

    /* ---- 获取文件类型图标 ---- */
    function getFileIcon(title) {
      var t = title.toLowerCase();
      if (t.indexOf('sql') !== -1 || t.indexOf('注入') !== -1) return '\uD83D\uDCCB';
      if (t.indexOf('burp') !== -1 || t.indexOf('代理') !== -1) return '\uD83D\uDD0D';
      if (t.indexOf('kali') !== -1 || t.indexOf('linux') !== -1) return '\uD83D\uDCBB';
      if (t.indexOf('dos') !== -1 || t.indexOf('命令') !== -1) return '\u2328\uFE0F';
      if (t.indexOf('http') !== -1 || t.indexOf('协议') !== -1) return '\uD83C\uDF10';
      if (t.indexOf('认证') !== -1 || t.indexOf('身份') !== -1) return '\uD83D\uDD11';
      if (t.indexOf('漏洞') !== -1 || t.indexOf('扫描') !== -1) return '\uD83D\uDEE1\uFE0F';
      if (t.indexOf('信息收集') !== -1) return '\uD83D\uDCCB';
      if (t.indexOf('xss') !== -1) return '\uD83D\uDC89';
      if (t.indexOf('csrf') !== -1) return '\uD83C\uDFAD';
      if (t.indexOf('ssrf') !== -1) return '\uD83D\uDD01';
      if (t.indexOf('文件包含') !== -1 || t.indexOf('上传') !== -1) return '\uD83D\uDCC2';
      if (t.indexOf('基础') !== -1 || t.indexOf('入门') !== -1) return '\uD83D\uDCD6';
      if (t.indexOf('工具') !== -1) return '\uD83D\uDEE0\uFE0F';
      return '\uD83D\uDCDD';
    }

    /* ---- 加载并渲染 Markdown 文件 ---- */
    function loadMarkdown(file) {
      selectedFile.value = file;
      isLoading.value = true;
      error.value = null;
      markdownContent.value = '';
      renderedHTML.value = '';

      fetch(file.downloadUrl)
        .then(function (res) {
          if (!res.ok) {
            var msg = '文件加载失败';
            if (res.status === 404) { msg = '文件不存在，可能已被移除'; }
            else if (res.status === 403) { msg = '访问受限，请稍后重试（GitHub 限流）'; }
            else if (res.status >= 500) { msg = '服务器错误，请稍后重试'; }
            throw new Error(msg);
          }
          return res.text();
        })
        .then(function (text) {
          markdownContent.value = text;
          if (typeof marked !== 'undefined') {
            renderedHTML.value = marked.parse(text);
          } else {
            renderedHTML.value = '<pre>' + escapeHtml(text) + '</pre>';
          }
          isLoading.value = false;
          // 滚动到顶部
          nextTick(function () {
            var contentEl = document.querySelector('.content-area');
            if (contentEl) { contentEl.scrollTop = 0; }
            // 高亮代码块
            if (typeof hljs !== 'undefined') { hljs.highlightAll(); }
          });
          // 移动端自动收起侧边栏
          if (window.innerWidth <= 768) {
            showSidebar.value = false;
          }
        })
        .catch(function (err) {
          error.value = err.message || '加载失败';
          isLoading.value = false;
        });
    }

    function escapeHtml(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    /* ---- 视图状态管理 ---- */
    function selectFile(file) {
      loadMarkdown(file);
      // 更新 URL hash
      window.location.hash = encodeURIComponent(file.name);
    }

    function backToList() {
      selectedFile.value = null;
      renderedHTML.value = '';
      markdownContent.value = '';
      error.value = null;
      window.location.hash = '';
    }

    function retryLoad() {
      if (selectedFile.value) {
        loadMarkdown(selectedFile.value);
      } else {
        fetchDirectory();
      }
    }

    /* ---- 计算属性 ---- */
    var filteredFiles = computed(function () {
      var q = searchQuery.value.toLowerCase().trim();
      if (!q) { return files.value; }
      return files.value.filter(function (f) {
        return f.title.toLowerCase().indexOf(q) !== -1 ||
               f.name.toLowerCase().indexOf(q) !== -1;
      });
    });

    var currentIndex = computed(function () {
      if (!selectedFile.value) { return -1; }
      for (var i = 0; i < files.value.length; i++) {
        if (files.value[i].name === selectedFile.value.name) { return i; }
      }
      return -1;
    });

    var hasPrev = computed(function () {
      return currentIndex.value > 0;
    });

    var hasNext = computed(function () {
      return currentIndex.value < files.value.length - 1;
    });

    /* ---- 导航 ---- */
    function goToPrev() {
      if (hasPrev.value) {
        loadMarkdown(files.value[currentIndex.value - 1]);
      }
    }

    function goToNext() {
      if (hasNext.value) {
        loadMarkdown(files.value[currentIndex.value + 1]);
      }
    }

    /* ---- 获取文件在 GitHub 的 URL ---- */
    function getGitHubUrl(file) {
      if (!file) { return GITHUB_BASE; }
      return file.htmlUrl || GITHUB_BASE;
    }

    /* ---- 格式化文件大小 ---- */
    function formatSize(bytes) {
      if (bytes < 1024) { return bytes + ' B'; }
      if (bytes < 1024 * 1024) { return (bytes / 1024).toFixed(1) + ' KB'; }
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    /* ---- 键盘事件 ---- */
    function onKeydown(e) {
      // 阅读模式下 ← → 翻页
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
      fetchDirectory();
      document.addEventListener('keydown', onKeydown);
      // 检查 URL hash 恢复选中文件
      var hash = window.location.hash.slice(1);
      if (hash) {
        var decodedHash = decodeURIComponent(hash);
        var attempts = 0;
        var MAX_ATTEMPTS = 25; // 25 * 200ms = 5s 超时
        // 延迟查找，等文件列表加载完成后再匹配
        hashCheckTimer = setInterval(function () {
          attempts++;
          if (files.value.length > 0) {
            clearInterval(hashCheckTimer);
            hashCheckTimer = null;
            for (var i = 0; i < files.value.length; i++) {
              if (files.value[i].name === decodedHash) {
                selectFile(files.value[i]);
                break;
              }
            }
          } else if (attempts >= MAX_ATTEMPTS) {
            clearInterval(hashCheckTimer);
            hashCheckTimer = null;
          }
        }, 200);
      }
    });

    onUnmounted(function () {
      document.removeEventListener('keydown', onKeydown);
      if (hashCheckTimer) {
        clearInterval(hashCheckTimer);
        hashCheckTimer = null;
      }
    });

    return {
      // 常量
      GITHUB_BASE: GITHUB_BASE,
      // 数据
      files: files,
      subdirs: subdirs,
      filteredFiles: filteredFiles,
      selectedFile: selectedFile,
      markdownContent: markdownContent,
      renderedHTML: renderedHTML,
      // 状态
      isLoading: isLoading,
      isDirLoading: isDirLoading,
      error: error,
      dirError: dirError,
      showSidebar: showSidebar,
      searchQuery: searchQuery,
      // 导航
      currentIndex: currentIndex,
      hasPrev: hasPrev,
      hasNext: hasNext,
      // 方法
      selectFile: selectFile,
      backToList: backToList,
      retryLoad: retryLoad,
      fetchDirectory: fetchDirectory,
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
