import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'large-bold-lioness.ngrok-free.app',
      // Add other allowed hosts here if needed
    ],
    port: 3000,
    host: true
  }
})

