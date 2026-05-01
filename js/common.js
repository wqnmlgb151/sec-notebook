/* ============================================================
   WebPenTest Lab — 公共脚本
   功能：导航交互、表单验证、页面特效
   ============================================================ */
'use strict';

/* -------- 导航交互 -------- */
document.addEventListener('DOMContentLoaded', function () {
  initNavigation();
  initScrollEffects();
  initPasswordStrength();
});

/* 导航：汉堡菜单 + 下拉菜单 + 滚动效果 */
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  const header = document.querySelector('.site-header');

  if (!hamburger || !mainNav) { return; }

  // 创建遮罩层
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  // 汉堡菜单切换
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-controls', 'main-nav');
  mainNav.id = 'main-nav';
  hamburger.addEventListener('click', function () {
    const isActive = !mainNav.classList.contains('active');
    hamburger.classList.toggle('active');
    mainNav.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
    if (isActive) {
      // 将焦点移到导航第一个链接
      setTimeout(function () {
        var firstLink = mainNav.querySelector('a');
        if (firstLink) { firstLink.focus(); }
      }, 100);
    }
  });

  // 点击遮罩关闭
  overlay.addEventListener('click', closeMenu);

  // 移动端下拉菜单
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(function (dropdown) {
    const link = dropdown.querySelector('> a');
    if (link) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
      });
    }
  });

  // 点击导航链接后关闭菜单(移动端)
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768 && !link.parentElement.classList.contains('nav-dropdown')) {
        closeMenu();
      }
    });
  });

  // 滚动时 header 样式变化（使用 rAF 节流）
  let scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        if (header) {
          header.classList.toggle('header-scrolled', window.scrollY > 50);
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // 高亮当前页面对应的导航项
  highlightCurrentNav();

  function closeMenu() {
    hamburger.classList.remove('active');
    mainNav.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

/* 高亮当前页面导航 */
function highlightCurrentNav() {
  var currentPath = window.location.pathname;
  var pageName = currentPath.split('/').pop() || 'index.html';
  if (currentPath === '/' || pageName === '') { pageName = 'index.html'; }
  var navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    // 匹配绝对路径 /html/xxx.html 或相对路径 xxx.html
    if (href && (href.indexOf(pageName) !== -1 || (pageName === 'index.html' && href.indexOf('index.html') !== -1))) {
      link.classList.add('active');
    }
  });
}

/* -------- 滚动动画 -------- */
function initScrollEffects() {
  if (!('IntersectionObserver' in window)) { return; }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
    observer.observe(el);
  });

  // 回退：2s 后强制显示所有尚未可见的元素（覆盖 Observer 漏触发）
  setTimeout(function () {
    document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(function (el) {
      el.classList.add('visible');
    });
  }, 2000);
}

/* -------- Toast 消息系统 -------- */
const Toast = {
  container: null,

  _ensureContainer: function () {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this.container);
    }
    return this.container;
  },

  show: function (message, type) {
    var typeSafe = type || 'info';
    this._ensureContainer();
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + typeSafe;
    toast.setAttribute('role', 'alert');
    toast.textContent = message;
    this.container.appendChild(toast);
    setTimeout(function () {
      toast.classList.add('toast-hiding');
      setTimeout(function () {
        if (toast.parentNode) { toast.parentNode.removeChild(toast); }
      }, 300);
    }, 3000);
  },

  success: function (msg) { this.show(msg, 'success'); },
  error: function (msg)   { this.show(msg, 'error'); },
  info: function (msg)    { this.show(msg, 'info'); }
};

/* -------- 密码强度检测 -------- */
function initPasswordStrength() {
  const passwordInput = document.querySelector('.password-strength-input');
  if (!passwordInput) { return; }

  passwordInput.addEventListener('input', function () {
    const val = this.value;
    const barContainer = document.querySelector('.password-strength');
    if (!barContainer) { return; }

    let bar = barContainer.querySelector('.password-strength-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'password-strength-bar';
      bar.setAttribute('role', 'meter');
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', '4');
      barContainer.appendChild(bar);
    }

    const STENGTH_LABELS = ['', '弱', '中', '强', '非常强'];
    const strength = getPasswordStrength(val);
    bar.className = 'password-strength-bar';
    bar.style.width = '';
    var label = '';
    if (val.length === 0) {
      bar.style.width = '0';
      label = '';
    } else if (strength <= 1) {
      bar.classList.add('strength-weak');
      label = STENGTH_LABELS[1];
    } else if (strength === 2) {
      bar.classList.add('strength-medium');
      label = STENGTH_LABELS[2];
    } else if (strength === 3) {
      bar.classList.add('strength-strong');
      label = STENGTH_LABELS[3];
    } else {
      bar.classList.add('strength-very-strong');
      label = STENGTH_LABELS[4];
    }
    bar.setAttribute('aria-valuenow', strength);
    bar.setAttribute('aria-valuetext', label);
    // 更新或创建文本标签
    var textLabel = barContainer.querySelector('.password-strength-text');
    if (!textLabel) {
      textLabel = document.createElement('span');
      textLabel.className = 'password-strength-text';
      textLabel.style.cssText = 'font-size:0.75rem;color:var(--color-text-tertiary);margin-top:0.2rem;display:block;';
      barContainer.appendChild(textLabel);
    }
    textLabel.textContent = label ? '密码强度: ' + label : '';
  });
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8)  { score++; }
  if (password.length >= 12) { score++; }
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) { score++; }
  if (/\d/.test(password))   { score++; }
  if (/[^a-zA-Z0-9]/.test(password)) { score++; }
  return Math.min(score, 4);
}

/* -------- 通用表单验证工具 -------- */
const FormValidator = {
  rules: {
    required: function (value) {
      return value.trim() !== '' ? null : '此字段为必填项';
    },
    email: function (value) {
      if (!value) { return null; }
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : '请输入有效的邮箱地址';
    },
    phone: function (value) {
      if (!value) { return null; }
      return /^1[3-9]\d{9}$/.test(value) ? null : '请输入有效的11位手机号';
    },
    minLength: function (value, min) {
      return value.length >= min ? null : '至少需要 ' + min + ' 个字符';
    },
    password: function (value) {
      if (!value) { return null; }
      if (value.length < 8) { return '密码至少需要8个字符'; }
      if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) { return '密码需同时包含大小写字母'; }
      if (!/\d/.test(value)) { return '密码需包含数字'; }
      return null;
    },
    match: function (value, targetValue, fieldName) {
      return value === targetValue ? null : '两次输入的' + (fieldName || '密码') + '不一致';
    }
  },

  /**
   * 验证单个字段
   * @param {HTMLInputElement} input
   * @param {Array} validations - [{rule: 'required'}, {rule: 'minLength', param: 6}]
   * @return {boolean}
   */
  validateField: function (input, validations) {
    var errorId = input.id + '-error';
    let errorEl = input.parentElement.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      input.parentElement.appendChild(errorEl);
    }
    // 确保错误元素有 id 用于 aria-describedby
    errorEl.id = errorId;

    for (let i = 0; i < validations.length; i++) {
      const v = validations[i];
      const ruleFn = this.rules[v.rule];
      if (!ruleFn) { continue; }

      let error;
      if (v.param !== undefined) {
        error = ruleFn(input.value, v.param, v.fieldName);
      } else {
        error = ruleFn(input.value);
      }

      if (error) {
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', errorId);
        errorEl.textContent = error;
        errorEl.classList.add('visible');
        return false;
      }
    }

    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    errorEl.classList.remove('visible');
    return true;
  },

  /**
   * 验证整个表单
   * @param {HTMLFormElement} form
   * @param {Object} fieldConfigs - {fieldName: [{rule: 'required'}, ...]}
   * @return {boolean}
   */
  validateForm: function (form, fieldConfigs) {
    let isValid = true;
    for (const fieldName in fieldConfigs) {
      if (!Object.prototype.hasOwnProperty.call(fieldConfigs, fieldName)) { continue; }
      const input = form.querySelector('[name="' + fieldName + '"]');
      if (!input) { continue; }
      if (!this.validateField(input, fieldConfigs[fieldName])) {
        isValid = false;
      }
    }
    return isValid;
  }
};

/* -------- 实时输入验证绑定 -------- */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-validate]').forEach(function (input) {
    const rulesStr = input.getAttribute('data-validate');
    if (!rulesStr) { return; }
    try {
      const rules = JSON.parse(rulesStr);
      input.addEventListener('blur', function () {
        FormValidator.validateField(input, rules);
      });
      input.addEventListener('input', function () {
        if (input.classList.contains('error')) {
          FormValidator.validateField(input, rules);
        }
      });
    } catch (e) {
      // data-validate JSON 解析失败，静默跳过
    }
  });
});
