import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { copyFileSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'copy-vercel-config',
      closeBundle() {
        // Copy vercel.json to dist folder
        try {
          copyFileSync('vercel.json', 'dist/vercel.json')
          console.log('vercel.json copied to dist')
        } catch (e) {
          console.error('Failed to copy vercel.json:', e)
        }
      }
    }
  ],
  server: {
    port: 5173,
    host: true
  }
})
