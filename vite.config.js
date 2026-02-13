import { defineConfig } from 'vite';

const stripModuleAttributes = () => ({
  name: 'strip-module-attributes',
  apply: 'build',
  transformIndexHtml(html) {
    return html
      .replace(/ type="module"/g, '')
      .replace(/ crossorigin/g, '');
  },
});

export default defineConfig({
  base: './',
  plugins: [stripModuleAttributes()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        format: 'iife',
      },
    },
  },
});
