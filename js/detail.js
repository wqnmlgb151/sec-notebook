/* ============================================================
   WebPenTest Lab — 漏洞详情页脚本
   功能：读取 URL 参数 id，自动滚动到对应漏洞章节
   ============================================================ */
'use strict';

(function () {
  var params = new URLSearchParams(window.location.search);
  var vulnId = params.get('id');
  if (vulnId) {
    // 白名单校验：仅允许已知的漏洞章节 ID
    var ALLOWED_IDS = ['sqli', 'xss', 'csrf', 'ssrf', 'file-upload', 'idor'];
    if (ALLOWED_IDS.indexOf(vulnId) === -1) { return; }
    var target = document.getElementById(vulnId);
    if (target) {
      setTimeout(function () {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }
})();
