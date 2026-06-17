import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../css/common.css'
import '../css/notes.css'

const app = createApp(App)

// Toast 全局状态
import { ref } from 'vue'
const toasts = ref([])
app.provide('toasts', toasts)

app.use(router).mount('#app')
