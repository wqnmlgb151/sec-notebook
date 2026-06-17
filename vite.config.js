import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs'

function copyStaticAssets() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      try {
        const dist = resolve(__dirname, 'dist')

        // 复制 CSS
        const cssDir = resolve(__dirname, 'css')
        const distCss = resolve(dist, 'css')
        if (existsSync(cssDir)) {
          if (!existsSync(distCss)) mkdirSync(distCss, { recursive: true })
          readdirSync(cssDir).forEach(f => copyFileSync(resolve(cssDir, f), resolve(distCss, f)))
        }

        // 复制 _redirects
        const redirects = resolve(__dirname, '_redirects')
        if (existsSync(redirects)) copyFileSync(redirects, resolve(dist, '_redirects'))
      } catch (e) {
        console.warn('[vite] 静态资源复制失败:', e.message)
      }
    }
  }
}

export default defineConfig({
  plugins: [vue(), copyStaticAssets()],
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.')
    }
  },
  server: {
    open: '/'
  }
})
