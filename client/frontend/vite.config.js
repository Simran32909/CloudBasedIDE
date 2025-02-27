import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Use CloudBasedIDE base for GitHub Pages, / for all other environments
  const base = mode === 'github' ? '/CloudBasedIDE/' : '/';

  return {
    plugins: [react()],
    base: base,
  }
})