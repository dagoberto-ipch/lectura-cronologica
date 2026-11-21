import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Rutas relativas para que funcione también bajo /<repo>/ en GitHub Pages.
  base: './',
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const grupo = id.match(/\/src\/data\/temas\/(\d+)-/)
          if (!grupo) return undefined
          return `temas-${Math.min(Math.ceil(Number(grupo[1]) / 3), 3)}`
        },
      },
    },
  },
})
