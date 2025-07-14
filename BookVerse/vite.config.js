// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.', // Optional, if your files are in root
  build: {
    rollupOptions: {
      input: '/BookVerse.html'
    }
  }
})
