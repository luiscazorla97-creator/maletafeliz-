import { validateEditorial, readJson } from './lib/content.mjs';
import { verifyImageFiles } from './lib/images.mjs';
const launch = process.argv.includes('--launch');
const result = validateEditorial({ launch });
result.errors.push(
  ...(await verifyImageFiles(
    process.cwd(),
    readJson('content/images/manifest.json'),
  )),
);
console.log(
  JSON.stringify({ mode: launch ? 'launch' : 'editorial', ...result }, null, 2),
);
if (result.errors.length) process.exitCode = 1;
