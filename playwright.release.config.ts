import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
export default defineConfig({
  testDir: './tests/release',
  workers: 2,
  timeout: 60000,
  use: {
    baseURL: 'http://127.0.0.1:4322',
    launchOptions: {
      executablePath:
        process.env.CHROMIUM_PATH ||
        (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
      args: ['--no-sandbox'],
    },
  },
  webServer: {
    command:
      'ASTRO_TELEMETRY_DISABLED=1 npx astro preview --ignore-lock --host 127.0.0.1 --port 4322',
    url: 'http://127.0.0.1:4322/es/',
    reuseExistingServer: false,
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: 'mobile',
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
