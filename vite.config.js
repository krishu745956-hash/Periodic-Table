import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Periodic-Table/',
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['three']
    }
  }
})
