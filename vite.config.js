import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs'

function copyStaticFiles() {
  return {
    name: 'copy-static-files',
    closeBundle() {
      try {
        const dist = resolve(__dirname, 'dist')
        if (!existsSync(resolve(dist, 'html'))) {
          mkdirSync(resolve(dist, 'html'), { recursive: true })
        }

        const staticPages = ['index', 'detail', 'login', 'about']
        staticPages.forEach(name => {
          const src = resolve(__dirname, 'html', name + '.html')
          const dest = resolve(dist, 'html', name + '.html')
          if (existsSync(src)) copyFileSync(src, dest)
        })

        const cssDir = resolve(__dirname, 'css')
        const jsDir = resolve(__dirname, 'js')
        const distCss = resolve(dist, 'css')
        const distJs = resolve(dist, 'js')

        if (existsSync(cssDir)) {
          if (!existsSync(distCss)) mkdirSync(distCss, { recursive: true })
          readdirSync(cssDir).forEach(f => copyFileSync(resolve(cssDir, f), resolve(distCss, f)))
        }

        if (existsSync(jsDir)) {
          if (!existsSync(distJs)) mkdirSync(distJs, { recursive: true })
          readdirSync(jsDir).forEach(f => copyFileSync(resolve(jsDir, f), resolve(distJs, f)))
        }

        const redirectsFile = resolve(__dirname, '_redirects')
        if (existsSync(redirectsFile)) copyFileSync(redirectsFile, resolve(dist, '_redirects'))
      } catch (e) {
        console.warn('[vite] 静态文件复制失败:', e.message)
      }
    }
  }
}

export default defineConfig({
  plugins: [vue(), copyStaticFiles()],
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'html/list.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.')
    }
  },
  server: {
    open: '/html/list.html'
  }
})
