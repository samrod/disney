import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
  },
  server: {
    port: 8080,
    open: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
