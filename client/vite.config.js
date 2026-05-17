import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  // Alias @ untuk import bersih
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Semua pengaturan server ada di dalam blok ini
  server: {
    port: 5173,
    
    // Izinkan Ngrok
    allowedHosts: true, 
    
    // Tembus layar keamanan Ngrok
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
    
    // Proxy API ke backend
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})