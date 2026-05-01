/* ============================================================
   WebPenTest Lab — 安全实验室页面脚本
   功能：登录/注册标签切换、表单验证与提交
   ============================================================ */
'use strict';

(function () {
  // 标签切换
  const tabs = document.querySelectorAll('.lab-tab');
  const panels = document.querySelectorAll('.lab-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = this.getAttribute('data-tab');
      tabs.forEach(function (t) { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');
      if (target === 'login') {
        document.getElementById('login-panel').classList.add('active');
      } else {
        document.getElementById('register-panel').classList.add('active');
      }
    });
  });

  // 登录表单验证与提交
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('[name="email"]');
      const passwordInput = this.querySelector('[name="password"]');

      const emailValid = FormValidator.validateField(emailInput, [
        { rule: 'required' }, { rule: 'email' }
      ]);
      const passValid = FormValidator.validateField(passwordInput, [
        { rule: 'required' }
      ]);

      if (emailValid && passValid) {
        Toast.success('登录成功！欢迎进入安全实验室(演示)');
        this.reset();
      }
    });
  }

  // 注册表单验证与提交
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const usernameInput = this.querySelector('[name="username"]');
      const emailInput = this.querySelector('[name="email"]');
      const phoneInput = this.querySelector('[name="phone"]');
      const passwordInput = this.querySelector('[name="password"]');
      const confirmInput = this.querySelector('[name="confirm"]');
      const agreeCheck = this.querySelector('[name="agree"]');

      var valid = true;

      valid = FormValidator.validateField(usernameInput, [
        { rule: 'required' }, { rule: 'minLength', param: 3 }
      ]) && valid;

      valid = FormValidator.validateField(emailInput, [
        { rule: 'required' }, { rule: 'email' }
      ]) && valid;

      valid = FormValidator.validateField(phoneInput, [
        { rule: 'required' }, { rule: 'phone' }
      ]) && valid;

      valid = FormValidator.validateField(passwordInput, [
        { rule: 'required' }, { rule: 'password' }
      ]) && valid;

      // 密码一致性校验 — 复用 FormValidator.rules.match
      valid = FormValidator.validateField(confirmInput, [
        { rule: 'match', param: passwordInput.value, fieldName: '密码' }
      ]) && valid;

      // 同意条款
      if (!agreeCheck.checked) {
        Toast.error('请先阅读并同意服务条款');
        valid = false;
      }

      if (valid) {
        Toast.success('注册成功！欢迎加入安全实验室(演示)');
        this.reset();
        // 清除表单错误状态
        clearFormErrors(this);
        // 切回登录标签
        document.querySelector('.lab-tab[data-tab="login"]').click();
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
