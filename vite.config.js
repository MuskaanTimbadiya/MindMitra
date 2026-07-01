import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Disable fast refresh during testing to avoid preamble errors
      fastRefresh: typeof process !== 'undefined' && process.env.NODE_ENV === 'test' ? false : true,
    })
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/setupTests.js',
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  }
})
