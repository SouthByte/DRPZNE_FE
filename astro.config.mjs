// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Use esbuild for CSS minification (more lenient than lightningcss)
      cssMinify: 'esbuild',
    },
  },
});
