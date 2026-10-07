import { defineConfig, type Plugin } from 'vite'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Gives the service worker (public/sw.js) the build's files to save for offline use, and a version that changes
 * with them, so each deploy installs a worker that saves its own files.
 */
const precacheServiceWorker = (): Plugin => ({
  name: 'precache-service-worker',
  apply: 'build',
  writeBundle(options, bundle) {
    const files = Object.keys(bundle).filter((f) => /\.(js|css)$/.test(f)).sort();
    // Word data every surah view needs; the per-surah files are saved as they are opened
    const precache = [...files, 'data/morphology/surahs.json', 'data/morphology/coverage.json'];
    const version = createHash('sha256').update(files.join('\n')).digest('hex').slice(0, 12);
    const path = join(options.dir!, 'sw.js');
    const source = readFileSync(path, 'utf8');
    const filled = source
      .replace("const VERSION = 'dev';", `const VERSION = '${version}';`)
      .replace('const PRECACHE = [];', `const PRECACHE = ${JSON.stringify(precache)};`);
    if (filled.includes("const VERSION = 'dev';") || filled.includes('const PRECACHE = [];')) {
      throw new Error('sw.js no longer has the VERSION and PRECACHE placeholders the build fills in')
    }
    writeFileSync(path, filled);
  }
})

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages serves the site from /Quran/ (the build and `vite preview`); the dev server stays at the root
  base: command === 'build' || isPreview ? '/Quran/' : '/',
  plugins: [react(), tailwindcss(), precacheServiceWorker()],
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
