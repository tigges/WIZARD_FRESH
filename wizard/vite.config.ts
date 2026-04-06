import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const basePath = process.env.VITE_BASE_PATH || '/WIZARD_FRESH/'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: basePath,
})
