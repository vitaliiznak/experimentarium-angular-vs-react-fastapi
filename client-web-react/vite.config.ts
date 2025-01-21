import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const API_TARGET ='http://localhost:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Needed for Docker
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
  resolve: {
    alias: {
      '@codebase/testing': path.resolve(__dirname, '../packages/testing')
    }
  }
})
