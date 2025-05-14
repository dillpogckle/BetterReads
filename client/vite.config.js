import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      input: "./src/main.jsx"
    },
    outDir: "/app/static",
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: {
      origin: '*' // or use '*' for full access
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    origin: 'http://vite:5173',
  },
  base: "/static"
})
