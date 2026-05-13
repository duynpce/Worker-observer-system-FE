import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  return {
    plugins: [react(), tailwindcss()],
    build: {
      minify: 'terser' as const,
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
        format: {
          comments: isProduction,
        },
        mangle: {
          toplevel: isProduction,
        },
      },
    },
    test: {
      clearMocks: true,
      globals: true,
      environment: 'jsdom',
      setupFiles: './vite.setup.ts',
    },
  };
})
