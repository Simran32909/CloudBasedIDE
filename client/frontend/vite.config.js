import { defineConfig } from 'vite'
import reactSWC from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [reactSWC()],
  base: '/CloudBasedIDE/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  esbuild: {
    loader: 'jsx',
    include: ['**/*.js', '**/*.jsx'],
  }
})