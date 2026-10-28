export const SITE = 'https://maletafeliz.com';
export const production = import.meta.env.SITE_MODE === 'production';
export const absolute = (path: string) => new URL(path, SITE).href;
