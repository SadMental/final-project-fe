import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      '/chat': {
        target: 'http://43.203.23.179:8081',
        changeOrigin: true,
        secure: false,
      },
      '/giftcard': {
        target: 'http://43.203.23.179:8081',  // ← 백엔드 주소
        changeOrigin: true,
        secure: false,
      }
    }
  },

  plugins: [react()],

  define: {
    global: "window",
  }
})