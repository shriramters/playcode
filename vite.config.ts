import { defineConfig } from 'vite'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.GH_PAGES ? '/playcode/' : '/',
  build: {
    brotliSize: false,
    assetsInlineLimit: 0,
  },
  plugins: [reactRefresh()],
})
