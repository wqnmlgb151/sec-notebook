/* ============================================================
   sec-notebook — Vue3 学习笔记系统
   数据源：wqnmlgb151/study > 计算机技术学习/web渗透测试
   架构：内嵌文件列表 + raw CDN 直连 + 字符串模板
   ============================================================ */
'use strict';

var _Vue = Vue;
var createApp = _Vue.createApp,
    ref = _Vue.ref, computed = _Vue.computed,
    onMounted = _Vue.onMounted, onUnmounted = _Vue.onUnmounted,
    nextTick = _Vue.nextTick;

var GITHUB_REPO_BASE = 'https://github.com/wqnmlgb151/study/blob/main/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%8A%80%E6%9C%AF%E5%AD%A6%E4%B9%A0/web%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95';
var RAW_BASE = 'https://raw.githubusercontent.com/wqnmlgb151/study/main/%E8%AE%A1%E7%AE%97%E6%9C%BA%E6%8A%80%E6%9C%AF%E5%AD%A6%E4%B9%A0/web%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95';

var FILE_LIST = [
  '01 代理配置和IP地址.md','02 web运行原理与操作系统.md','03.快速搭建渗透测试环境.md',
  '04.渗透常见的DOS命令.md','05.Linux基础操作与配置.md','06.Linux用户权限管理.md',
  '07.Linux系统状态管理、安全加固.md','08.Kali.md','09.抓包工具介绍.md',
  '10.http协议.md','11.BurpSuite详解.md','12.数据传输与加密算法.md',
  '13.信息收集.md','14.MySQL基础.md','15.PHP基础.md','16.前后端交互.md',
  '17.身份验证原理.md','18.SQL注入.md','19.SQL注入利用方式.md'
];

function parseFileName(rawName) {
  var m = rawName.match(/^(\d+)[\.\s]*(.+)\.md$/i);
  var title = m ? m[2] : rawName.replace(/\.md$/i, '');
  return {
    rawName: rawName, num: m ? parseInt(m[1],10) : 0, title: title,
    downloadUrl: RAW_BASE + '/' + encodeURIComponent(rawName),
    htmlUrl: GITHUB_REPO_BASE + '/' + encodeURIComponent(rawName),
    icon: getIcon(title)
  };
}

function getIcon(t) {
  t = t.toLowerCase();
  if (t.indexOf('sql')!==-1||t.indexOf('注入')!==-1) return '🗄️';
  if (t.indexOf('burp')!==-1||t.indexOf('代理')!==-1||t.indexOf('抓包')!==-1) return '🔍';
  if (t.indexOf('kali')!==-1||t.indexOf('linux')!==-1) return '💻';
  if (t.indexOf('dos')!==-1||t.indexOf('命令')!==-1) return '⌨️';
  if (t.indexOf('http')!==-1||t.indexOf('协议')!==-1) return '🌐';
  if (t.indexOf('认证')!==-1||t.indexOf('身份')!==-1) return '🔑';
  if (t.indexOf('加密')!==-1) return '🔐';
  if (t.indexOf('收集')!==-1) return '📋';
  if (t.indexOf('基础')!==-1||t.indexOf('入门')!==-1||t.indexOf('搭建')!==-1) return '📖';
  if (t.indexOf('工具')!==-1) return '🛠️';
  if (t.indexOf('mysql')!==-1||t.indexOf('php')!==-1) return '🖥️';
  if (t.indexOf('前后端')!==-1||t.indexOf('交互')!==-1) return '🔗';
  if (t.indexOf('运行')!==-1||t.indexOf('操作系统')!==-1) return '⚙️';
  if (t.indexOf('权限')!==-1) return '🛡️';
  if (t.indexOf('状态')!==-1||t.indexOf('安全加固')!==-1) return '📊';
  if (t.indexOf('数据传输')!==-1||t.indexOf('加密算法')!==-1) return '💎';
  return '📝';
}

/* -------- Vue3 应用（字符串模板，避免 in-DOM 编译问题）-------- */
var AppTemplate = '' +
'<div class="notes-layout">' +
  '<button class="sidebar-toggle hide-desktop" @click="showSidebar=!showSidebar" :aria-label="showSidebar?\'收起目录\':\'展开目录\'">' +
    '<span v-if="showSidebar">✕ 收起目录</span>' +
    '<span v-else>☰ 展开目录 ({{files.length}} 篇)</span>' +
  '</button>' +
  '<aside :class="[\'notes-sidebar\',showSidebar?\'open\':\'\']">' +
    '<div class="sidebar-inner">' +
      '<div class="sidebar-header">' +
        '<h3 class="sidebar-title"><span style="font-size:1.2rem">📚</span> 课程目录</h3>' +
        '<span class="sidebar-count">{{files.length}} 篇</span>' +
      '</div>' +
      '<nav class="sidebar-nav" aria-label="课程目录">' +
        '<div v-for="f in files" :key="f.rawName" :class="[\'sidebar-item\',sel&&sel.rawName===f.rawName?\'active\':\'\']" role="button" tabindex="0" @click="selectFile(f)" @keydown.enter="selectFile(f)" @keydown.space.prevent="selectFile(f)" :aria-label="\'打开笔记: \'+f.title" :title="f.title">' +
          '<span class="sidebar-item-icon">{{f.icon}}</span>' +
          '<div class="sidebar-item-content">' +
            '<span class="sidebar-item-num">{{f.num<10?\'0\'+f.num:f.num}}</span>' +
            '<span class="sidebar-item-title">{{f.title}}</span>' +
          '</div>' +
        '</div>' +
      '</nav>' +
      '<div class="sidebar-footer">' +
        '<a :href="GITHUB_BASE" target="_blank" rel="noopener" class="sidebar-resource-link">📁 在 GitHub 查看全部资源</a>' +
      '</div>' +
    '</div>' +
  '</aside>' +
  '<div v-if="showSidebar" class="sidebar-overlay hide-desktop" @click="showSidebar=false"></div>' +
  '<section class="notes-content"><div class="content-area">' +
    '<div v-if="!sel&&!isLoading" class="content-empty">' +
      '<div class="content-empty-icon">📖</div><h2>Web 渗透测试学习笔记</h2><p>从左侧目录选择一篇笔记开始阅读</p>' +
      '<div class="content-empty-stats">' +
        '<div class="stat-card"><div class="stat-value">{{files.length}}</div><div class="stat-label">篇笔记</div></div>' +
        '<div class="stat-card"><div class="stat-value">GitHub</div><div class="stat-label">数据源</div></div>' +
        '<div class="stat-card"><div class="stat-value">GFM</div><div class="stat-label">渲染引擎</div></div>' +
      '</div>' +
      '<a :href="GITHUB_BASE" target="_blank" rel="noopener" class="btn btn-outline mt-3">在 GitHub 查看全部 →</a>' +
    '</div>' +
    '<div v-if="isLoading" class="content-loading">' +
      '<div class="skeleton skeleton-title"></div>' +
      '<div class="skeleton skeleton-line" style="width:80%"></div>' +
      '<div class="skeleton skeleton-line" style="width:60%"></div>' +
      '<div class="skeleton skeleton-block"></div>' +
      '<div class="skeleton skeleton-line" style="width:70%"></div>' +
    '</div>' +
    '<div v-if="err&&!isLoading" class="content-error">' +
      '<div class="content-error-icon">⚠️</div><h3>加载失败</h3><p>{{err}}</p>' +
      '<div style="display:flex;gap:0.75rem;justify-content:center;margin-top:1.5rem">' +
        '<button class="btn btn-primary" @click="retryLoad()">重新加载</button>' +
        '<button class="btn btn-outline" @click="backToList()">返回目录</button>' +
      '</div>' +
    '</div>' +
    '<div v-if="renderedHTML&&sel&&!err" class="markdown-wrapper">' +
      '<div class="content-toolbar">' +
        '<button class="btn btn-ghost btn-sm" @click="backToList()" aria-label="返回目录">← 目录</button>' +
        '<div class="content-toolbar-nav">' +
          '<button class="btn btn-ghost btn-sm" @click="goToPrev()" :disabled="!hasPrev" aria-label="上一篇">← 上一篇</button>' +
          '<span class="content-toolbar-pos">{{currentIndex+1}} / {{files.length}}</span>' +
          '<button class="btn btn-ghost btn-sm" @click="goToNext()" :disabled="!hasNext" aria-label="下一篇">下一篇 →</button>' +
        '</div>' +
        '<a :href="getGitHubUrl(sel)" target="_blank" rel="noopener" class="btn btn-outline btn-sm">在 GitHub 查看 ↗</a>' +
      '</div>' +
      '<div class="content-file-header">' +
        '<span class="content-file-icon">{{sel.icon}}</span>' +
        '<div><h2 class="content-file-title">{{sel.title}}</h2>' +
        '<div class="content-file-meta"><span>{{sel.rawName}}</span><span>编号 #{{sel.num}}</span></div></div>' +
      '</div>' +
      '<div class="markdown-body" v-html="renderedHTML"></div>' +
      '<div class="content-footer-nav">' +
        '<button class="btn btn-outline" @click="goToPrev()" :disabled="!hasPrev">← {{hasPrev?files[currentIndex-1].title:\'已是第一篇\'}}</button>' +
        '<button class="btn btn-outline" @click="goToNext()" :disabled="!hasNext">{{hasNext?files[currentIndex+1].title:\'已是最后一篇\'}} →</button>' +
      '</div>' +
      '<div class="content-kbd-hints"><kbd>Ctrl+←</kbd> 上一篇 &nbsp;<kbd>Ctrl+→</kbd> 下一篇 &nbsp;<kbd>ESC</kbd> 返回目录</div>' +
    '</div>' +
  '</div></section>' +
'</div>';

var PenTestApp = {
  template: AppTemplate,
  setup: function () {
    var filesArr = FILE_LIST.map(function(n){return parseFileName(n);});
    filesArr.sort(function(a,b){return a.num-b.num;});

    var files = ref(filesArr), sel = ref(null), renderedHTML = ref('');
    var isLoading = ref(false), err = ref(null), showSidebar = ref(true);

    function loadMarkdown(file) {
      sel.value = file; isLoading.value = true; err.value = null; renderedHTML.value = '';
      fetch(file.downloadUrl)
        .then(function(res){
          if(!res.ok){var m='文件加载失败';if(res.status===404)m='文件不存在';else if(res.status>=500)m='服务器错误，请稍后重试';throw new Error(m);}
          return res.text();
        })
        .then(function(text){
          if(typeof marked!=='undefined') renderedHTML.value = marked.parse(text);
          else renderedHTML.value = '<pre>'+text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</pre>';
          isLoading.value = false;
          nextTick(function(){
            var c=document.querySelector('.content-area'); if(c)c.scrollTop=0;
            if(typeof hljs!=='undefined') hljs.highlightAll();
          });
          if(window.innerWidth<=768) showSidebar.value = false;
        })
        .catch(function(e){err.value=e.message||'加载失败';isLoading.value=false;});
    }

    function selectFile(f){loadMarkdown(f);window.location.hash=encodeURIComponent(f.rawName);}
    function backToList(){sel.value=null;renderedHTML.value='';err.value=null;window.location.hash='';}
    function retryLoad(){if(sel.value)loadMarkdown(sel.value);}

    var currentIndex = computed(function(){
      if(!sel.value) return -1;
      for(var i=0;i<files.value.length;i++){if(files.value[i].rawName===sel.value.rawName)return i;}
      return -1;
    });
    var hasPrev = computed(function(){return currentIndex.value>0;});
    var hasNext = computed(function(){return currentIndex.value<files.value.length-1;});

    function goToPrev(){if(hasPrev.value)loadMarkdown(files.value[currentIndex.value-1]);}
    function goToNext(){if(hasNext.value)loadMarkdown(files.value[currentIndex.value+1]);}
    function getGitHubUrl(f){return f?f.htmlUrl:GITHUB_REPO_BASE;}

    function onKeydown(e){
      if(sel.value&&!isLoading.value){
        if(e.key==='ArrowLeft'&&e.ctrlKey){e.preventDefault();goToPrev();}
        if(e.key==='ArrowRight'&&e.ctrlKey){e.preventDefault();goToNext();}
        if(e.key==='Escape'){e.preventDefault();backToList();}
      }
    }

    var hashCheckTimer=null;
    onMounted(function(){
      if(typeof marked!=='undefined')marked.setOptions({gfm:true,breaks:true,headerIds:true,mangle:false});
      document.addEventListener('keydown',onKeydown);
      var hash=window.location.hash.slice(1);
      if(hash){var d=decodeURIComponent(hash);var a=0;
        hashCheckTimer=setInterval(function(){a++;
          if(files.value.length>0){clearInterval(hashCheckTimer);hashCheckTimer=null;
            for(var i=0;i<files.value.length;i++){if(files.value[i].rawName===d){selectFile(files.value[i]);break;}}
          }else if(a>=15){clearInterval(hashCheckTimer);hashCheckTimer=null;}
        },100);}
    });
    onUnmounted(function(){
      document.removeEventListener('keydown',onKeydown);
      if(hashCheckTimer){clearInterval(hashCheckTimer);hashCheckTimer=null;}
    });

    return {
      GITHUB_BASE:GITHUB_REPO_BASE, files:files, sel:sel, renderedHTML:renderedHTML,
      isLoading:isLoading, err:err, showSidebar:showSidebar,
      currentIndex:currentIndex, hasPrev:hasPrev, hasNext:hasNext,
      selectFile:selectFile, backToList:backToList, retryLoad:retryLoad,
      goToPrev:goToPrev, goToNext:goToNext, getGitHubUrl:getGitHubUrl
    };
  }
};

var appElement = document.getElementById('app');
if (appElement) { createApp(PenTestApp).mount('#app'); }
