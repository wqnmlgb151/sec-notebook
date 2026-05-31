/* ============================================================
   WebPenTest Lab — 安全实验室页面脚本
   功能：登录/注册标签切换、表单验证与提交
   ============================================================ */
'use strict';

(function () {
  // 标签切换
  var tabs = document.querySelectorAll('.lab-tab');
  var panels = document.querySelectorAll('.lab-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.getAttribute('data-tab');
      tabs.forEach(function (t) { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');
      var panelId = target === 'login' ? 'login-panel' : 'register-panel';
      document.getElementById(panelId).classList.add('active');
      var firstInput = document.querySelector('#' + panelId + ' .form-input');
      if (firstInput) { setTimeout(function(){ firstInput.focus(); }, 50); }
    });
  });

  function getFormInput(form, name) {
    var input = form.querySelector('[name="' + name + '"]');
    if (!input) { console.warn('[auth] 表单缺少字段:', name); }
    return input;
  }

  // 登录表单验证与提交
  var loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = getFormInput(this, 'email');
      var passwordInput = getFormInput(this, 'password');
      if (!emailInput || !passwordInput) { return; }

      var emailValid = FormValidator.validateField(emailInput, [
        { rule: 'required' }, { rule: 'email' }
      ]);
      var passValid = FormValidator.validateField(passwordInput, [
        { rule: 'required' }
      ]);

      if (emailValid && passValid) {
        Toast.success('登录成功！欢迎进入安全实验室(演示)');
        this.reset();
      }
    });
  }

  // 注册表单验证与提交
  var registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var usernameInput = getFormInput(this, 'username');
      var emailInput = getFormInput(this, 'email');
      var phoneInput = getFormInput(this, 'phone');
      var passwordInput = getFormInput(this, 'password');
      var confirmInput = getFormInput(this, 'confirm');
      var agreeCheck = getFormInput(this, 'agree');
      if (!usernameInput || !emailInput || !passwordInput || !confirmInput) { return; }

      var fields = [
        [usernameInput, [{ rule: 'required' }, { rule: 'minLength', param: 3 }]],
        [emailInput,    [{ rule: 'required' }, { rule: 'email' }]],
        [phoneInput,    [{ rule: 'required' }, { rule: 'phone' }]],
        [passwordInput, [{ rule: 'required' }, { rule: 'password' }]],
        [confirmInput,  [{ rule: 'match', param: passwordInput.value, fieldName: '密码' }]]
      ];

      var valid = true;
      for (var i = 0; i < fields.length; i++) {
        valid = FormValidator.validateField(fields[i][0], fields[i][1]) && valid;
      }

      if (agreeCheck && !agreeCheck.checked) {
        Toast.error('请先阅读并同意服务条款');
        valid = false;
      }

      if (valid) {
        Toast.success('注册成功！欢迎加入安全实验室(演示)');
        this.reset();
        clearFormErrors(this);
        var loginTab = document.querySelector('.lab-tab[data-tab="login"]');
        if (loginTab) { loginTab.click(); }
      }
    });
  }

  /* 清除表单所有错误状态 */
  function clearFormErrors(form) {
    form.querySelectorAll('.form-input.error').forEach(function (input) {
      input.classList.remove('error');
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    });
    form.querySelectorAll('.form-error.visible').forEach(function (el) {
      el.classList.remove('visible');
    });
  }
})();
