import { getViteConfig } from 'astro/config';
import type { InlineConfig } from 'vitest/node';
const config = {
  plugins: [],
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/**/*.spec.ts'],
    environment: 'node',
  } satisfies InlineConfig,
};
export default getViteConfig(config);
