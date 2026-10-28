import { loadEnv } from 'vite';
import { verifyImageFiles } from './scripts/lib/images.mjs';
import { readJson } from './scripts/lib/content.mjs';
import { validateEditorial } from './scripts/lib/content.mjs';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  devToolbar: { enabled: false },
  site: 'https://maletafeliz.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    react(),
    {
      name: 'editorial-gate',
      hooks: {
        'astro:build:start': async () => {
          const result = validateEditorial({
            launch:
              (process.env.SITE_MODE ??
                loadEnv('production', process.cwd(), '').SITE_MODE) ===
              'production',
          });
          result.errors.push(
            ...(await verifyImageFiles(
              process.cwd(),
              readJson('content/images/manifest.json'),
            )),
          );
          if (result.errors.length) throw new Error(result.errors.join('\n'));
        },
      },
    },
  ],
  vite: { plugins: [tailwindcss()] },
});
