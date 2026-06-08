/* ============================================================
   WebPenTest Lab — 漏洞详情页
   侧边栏滚动高亮 + URL ?id= 参数定位
   ============================================================ */
'use strict';

(function () {
  'use strict';

  var navLinks = document.querySelectorAll('.detail-nav-link');
  var articles = document.querySelectorAll('.detail-article');

  if (!navLinks.length || !articles.length) { return; }

  var linkMap = {};
  var HEADER_OFFSET = 120;

  for (var i = 0; i < navLinks.length; i++) {
    var href = navLinks[i].getAttribute('href');
    if (href && href.charAt(0) === '#') {
      linkMap[href.slice(1)] = navLinks[i];
    }
  }

  var activeLink = navLinks[0];

  function setActive(link) {
    if (link === activeLink) { return; }
    activeLink.classList.remove('is-active');
    link.classList.add('is-active');
    activeLink = link;
  }

  function updateActiveSection() {
    var scrollBottom = window.scrollY + window.innerHeight;
    if (scrollBottom >= document.documentElement.scrollHeight - 8) {
      setActive(navLinks[navLinks.length - 1]);
      return;
    }

    var current = articles[0];
    for (var j = 0; j < articles.length; j++) {
      if (articles[j].getBoundingClientRect().top <= HEADER_OFFSET) {
        current = articles[j];
      }
    }
    var link = linkMap[current.id];
    if (link) { setActive(link); }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // 点击侧边栏链接立即高亮（不等 scroll 事件）
  document.querySelector('.detail-nav').addEventListener('click', function (e) {
    var link = e.target.closest('.detail-nav-link');
    if (link) { setActive(link); }
  });

  updateActiveSection();

  // URL 参数 ?id= 定位
  var vulnId = new URLSearchParams(window.location.search).get('id');
  if (vulnId && linkMap[vulnId]) {
    setActive(linkMap[vulnId]);
    var target = document.getElementById(vulnId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
})();
