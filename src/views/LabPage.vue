<template>
  <h1 class="sr-only">安全实验室 — 登录与注册</h1>
  <div class="lab-container">
    <div class="hero-bg-orb hero-bg-orb--cyan" style="width: 400px; height: 400px; opacity: 0.1;"></div>
    <div class="hero-bg-orb hero-bg-orb--purple" style="width: 350px; height: 350px; opacity: 0.1; bottom: 0; right: 0; top: auto;"></div>

    <div class="lab-card">
      <!-- 标签切换 -->
      <div class="lab-tabs">
        <button :class="['lab-tab', { active: activeTab === 'login' }]" @click="activeTab = 'login'">登录</button>
        <button :class="['lab-tab', { active: activeTab === 'register' }]" @click="activeTab = 'register'">注册</button>
      </div>

      <div class="security-badge">🔒 本页面为前端演示，不会向服务器发送您的凭据</div>

      <!-- 登录面板 -->
      <div v-show="activeTab === 'login'" class="lab-panel">
        <form @submit.prevent="handleLogin" novalidate>
          <div class="form-group">
            <label class="form-label" for="login-email">邮箱地址</label>
            <input type="email" id="login-email" v-model="loginForm.email" :class="['form-input', { error: loginErrors.email }]" placeholder="user@example.com" autocomplete="email" />
            <div :class="['form-error', { visible: loginErrors.email }]">{{ loginErrors.email }}</div>
          </div>
          <div class="form-group">
            <label class="form-label" for="login-password">密码</label>
            <input type="password" id="login-password" v-model="loginForm.password" :class="['form-input', { error: loginErrors.password }]" placeholder="请输入密码" autocomplete="current-password" />
            <div :class="['form-error', { visible: loginErrors.password }]">{{ loginErrors.password }}</div>
          </div>
          <div class="flex-between" style="margin-bottom: 1.5rem;">
            <label class="form-check"><input type="checkbox" v-model="loginForm.remember" /> 记住我</label>
            <button type="button" class="link-btn" @click="toast.info('功能开发中...')">忘记密码？</button>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">登录实验室</button>
        </form>
      </div>

      <!-- 注册面板 -->
      <div v-show="activeTab === 'register'" class="lab-panel">
        <form @submit.prevent="handleRegister" novalidate>
          <div class="form-group">
            <label class="form-label" for="reg-username">用户名</label>
            <input type="text" id="reg-username" v-model="regForm.username" :class="['form-input', { error: regErrors.username }]" placeholder="3-20位字母或数字" autocomplete="username" />
            <div :class="['form-error', { visible: regErrors.username }]">{{ regErrors.username }}</div>
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-email">邮箱地址</label>
            <input type="email" id="reg-email" v-model="regForm.email" :class="['form-input', { error: regErrors.email }]" placeholder="user@example.com" autocomplete="email" />
            <div :class="['form-error', { visible: regErrors.email }]">{{ regErrors.email }}</div>
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-phone">手机号</label>
            <input type="tel" id="reg-phone" v-model="regForm.phone" :class="['form-input', { error: regErrors.phone }]" placeholder="11位手机号" autocomplete="tel" />
            <div :class="['form-error', { visible: regErrors.phone }]">{{ regErrors.phone }}</div>
            <div class="form-hint">仅用于演示验证，不会发送短信</div>
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-password">密码</label>
            <input type="password" id="reg-password" v-model="regForm.password" :class="['form-input', { error: regErrors.password }]" placeholder="至少8位，包含大小写字母和数字" autocomplete="new-password" />
            <div class="password-strength">
              <div v-if="regForm.password" :class="['password-strength-bar', strengthClass]" :style="{ width: strengthWidth }" role="meter" :aria-valuenow="strength" :aria-valuemax="4"></div>
            </div>
            <span v-if="regForm.password" class="password-strength-text">密码强度: {{ strengthLabel }}</span>
            <div :class="['form-error', { visible: regErrors.password }]">{{ regErrors.password }}</div>
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-confirm">确认密码</label>
            <input type="password" id="reg-confirm" v-model="regForm.confirm" :class="['form-input', { error: regErrors.confirm }]" placeholder="请再次输入密码" />
            <div :class="['form-error', { visible: regErrors.confirm }]">{{ regErrors.confirm }}</div>
          </div>
          <div class="form-group">
            <label class="form-check"><input type="checkbox" v-model="regForm.agree" /> 我已阅读并同意 <button type="button" class="link-btn" @click="toast.info('服务条款')">服务条款</button> 和 <button type="button" class="link-btn" @click="toast.info('隐私政策')">隐私政策</button></label>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">创建账号</button>
        </form>
      </div>

      <!-- 安全意识提示 -->
      <div class="leak-panel">
        <h4>⚠️ 安全意识提示</h4>
        <p style="color: var(--color-text-tertiary); font-size: 0.82rem; margin-bottom: 0.5rem;">真实网站中，请务必检查以下几点：</p>
        <ul style="color: var(--color-text-tertiary); font-size: 0.82rem; padding-left: 1.2rem; line-height: 1.8;">
          <li>地址栏是否为 <strong style="color: var(--color-accent-emerald);">HTTPS</strong></li>
          <li>域名是否正确，谨防<strong style="color: var(--color-accent-red);">钓鱼网站</strong></li>
          <li>不要在公共 Wi-Fi 下登录敏感账户</li>
          <li>为不同网站使用<strong style="color: var(--color-accent-glow);">不同的密码</strong></li>
          <li>开启<strong style="color: var(--color-accent);">双因素认证 (2FA)</strong></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useToast } from '../composables/useToast.js'

const toast = useToast()
const activeTab = ref('login')

// ---- 登录表单 ----
const loginForm = reactive({ email: '', password: '', remember: false })
const loginErrors = reactive({ email: '', password: '' })

function validateLogin() {
  loginErrors.email = loginErrors.password = ''
  if (!loginForm.email.trim()) { loginErrors.email = '请输入邮箱地址'; return false }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) { loginErrors.email = '请输入有效的邮箱地址'; return false }
  if (!loginForm.password) { loginErrors.password = '请输入密码'; return false }
  return true
}

function handleLogin() {
  if (validateLogin()) {
    toast.success('登录演示成功！（仅前端验证）')
  }
}

// ---- 注册表单 ----
const regForm = reactive({ username: '', email: '', phone: '', password: '', confirm: '', agree: false })
const regErrors = reactive({ username: '', email: '', phone: '', password: '', confirm: '' })

const strength = computed(() => {
  let score = 0
  const pw = regForm.password
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  return Math.min(score, 4)
})

const strengthLabel = computed(() => ['', '弱', '中', '强', '非常强'][strength.value] || '')
const strengthClass = computed(() => {
  if (strength.value <= 1) return 'strength-weak'
  if (strength.value === 2) return 'strength-medium'
  if (strength.value === 3) return 'strength-strong'
  return 'strength-very-strong'
})
const strengthWidth = computed(() => !regForm.password ? '0' : (strength.value * 25) + '%')

function validateRegister() {
  regErrors.username = regErrors.email = regErrors.phone = regErrors.password = regErrors.confirm = ''
  if (!regForm.username.trim() || regForm.username.length < 3) { regErrors.username = '用户名至少需要3个字符'; return false }
  if (!regForm.email.trim()) { regErrors.email = '请输入邮箱地址'; return false }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) { regErrors.email = '请输入有效的邮箱地址'; return false }
  if (!regForm.phone.trim()) { regErrors.phone = '请输入手机号'; return false }
  if (!/^1[3-9]\d{9}$/.test(regForm.phone)) { regErrors.phone = '请输入有效的11位手机号'; return false }
  if (!regForm.password) { regErrors.password = '请输入密码'; return false }
  if (regForm.password.length < 8) { regErrors.password = '密码至少需要8个字符'; return false }
  if (!/[a-z]/.test(regForm.password) || !/[A-Z]/.test(regForm.password)) { regErrors.password = '密码需同时包含大小写字母'; return false }
  if (!/\d/.test(regForm.password)) { regErrors.password = '密码需包含数字'; return false }
  if (regForm.password !== regForm.confirm) { regErrors.confirm = '两次输入的密码不一致'; return false }
  if (!regForm.agree) { toast.error('请先同意服务条款'); return false }
  return true
}

function handleRegister() {
  if (validateRegister()) {
    toast.success('注册演示成功！（仅前端验证）')
  }
}
</script>

<style scoped>
.lab-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1rem 2rem;
  position: relative;
  overflow: hidden;
}
.lab-card {
  width: 100%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.015);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  position: relative;
  z-index: 10;
  box-shadow: 0 50px 100px rgba(0, 0, 0, 0.5);
}
.lab-tabs { display: flex; border-bottom: 1px solid var(--border-subtle); margin-bottom: 1.5rem; }
.lab-tab {
  flex: 1; padding: 0.75rem; text-align: center; font-weight: 600; font-size: 0.95rem;
  color: var(--color-text-tertiary); cursor: pointer; border-bottom: 2px solid transparent;
  transition: all var(--duration-fast); background: none; font-family: inherit;
}
.lab-tab.active { color: var(--color-accent-glow); border-bottom-color: var(--color-accent); }
.security-badge {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1rem; background: rgba(16,185,129,0.08);
  border: 1px solid rgba(16,185,129,0.2); border-radius: var(--radius-md);
  margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--color-accent-emerald);
}
.leak-panel {
  background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
  border-radius: var(--radius-lg); padding: 1.25rem; margin-top: 1.5rem; font-size: 0.85rem;
}
.leak-panel h4 { color: var(--color-accent-red); margin-bottom: 0.5rem; }
</style>
