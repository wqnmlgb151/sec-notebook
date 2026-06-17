<template>
  <div v-if="toasts.length" class="toast-container" aria-live="polite" aria-atomic="true">
    <div
      v-for="t in toasts"
      :key="t.id"
      :class="['toast', 'toast-' + t.type, { 'toast-hiding': t.hiding }]"
      role="alert"
    >{{ t.message }}</div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const toasts = inject('toasts', [])
</script>
