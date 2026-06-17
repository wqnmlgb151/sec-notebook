import { ref, provide } from 'vue'

let nextId = 0
const toasts = ref([])

export function provideToast(app) {
  app.provide('toasts', toasts)
}

export function useToast() {
  function show(message, type = 'info', duration = 3000) {
    const toast = { id: nextId++, message, type, hiding: false }
    toasts.value.push(toast)
    setTimeout(() => {
      toast.hiding = true
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== toast.id)
      }, 300)
    }, duration)
  }

  return {
    success: (msg) => show(msg, 'success'),
    error: (msg) => show(msg, 'error'),
    info: (msg) => show(msg, 'info')
  }
}
