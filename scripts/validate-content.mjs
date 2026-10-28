import { validateEditorial } from './lib/content.mjs';
const launch = process.argv.includes('--launch');
const result = validateEditorial({ launch });
console.log(
  JSON.stringify({ mode: launch ? 'launch' : 'editorial', ...result }, null, 2),
);
if (result.errors.length) process.exitCode = 1;
