import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves from /Showerhead-website/
export default defineConfig({
  plugins: [react()],
  base: '/Showerhead-website/',
})
