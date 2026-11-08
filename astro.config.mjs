import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  env: {
    schema: {
      // Base URL of the Payload CMS. Server-only: the browser goes through this site's
      // /api and /partials routes instead of calling the CMS directly.
      CMS_URL: envField.string({ context: 'server', access: 'secret', url: true }),
    },
    validateSecrets: true,
  },
  vite: {
    plugins: [tailwindcss()],
    build: { cssMinify: 'esbuild' },
  },
});
