import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages serves the site from /Quran/ (the build and `vite preview`); the dev server stays at the root
  base: command === 'build' || isPreview ? '/Quran/' : '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // React changes far less often than the app, so browsers keep it cached across deploys
      output: { manualChunks: { react: ['react', 'react-dom', 'react-dom/client'] } }
    }
  },
  server: {
    port: 3000,
    host: true,
    open: false,
  },
  preview: {
    port: 3000,
    host: true,
  },
}))
