import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';

// HTML's JavaScript MIME-type essences, including the legacy accepted values.
// Data blocks, JSON-LD, import maps and speculation rules are not executable.
const javascriptTypes = new Set([
  'application/ecmascript', 'application/javascript', 'application/x-ecmascript',
  'application/x-javascript', 'text/ecmascript', 'text/javascript',
  'text/javascript1.0', 'text/javascript1.1', 'text/javascript1.2',
  'text/javascript1.3', 'text/javascript1.4', 'text/javascript1.5',
  'text/jscript', 'text/livescript', 'text/x-ecmascript', 'text/x-javascript',
]);
const asciiTrim = (value) => value.replace(/^[\t\n\f\r ]+|[\t\n\f\r ]+$/g, '');

/** @param {import('parse5').DefaultTreeAdapterTypes.Element} node */
function isExecutable(node) {
  const type = node.attrs.find((attribute) => attribute.name === 'type');
  if (!type) {
    // An absent/empty language is JavaScript; a legacy non-JS language is inert.
    const language = node.attrs.find((attribute) => attribute.name === 'language');
    return !language || language.value === '' || javascriptTypes.has(`text/${language.value.toLowerCase()}`);
  }
  const value = asciiTrim(type.value).toLowerCase();
  if (value === '' || value === 'module') return true;
  return javascriptTypes.has(asciiTrim(value.split(';', 1)[0]));
}

/**
 * Exclude actual executable script tags after Astro has compiled their code.
 * Insert at source offsets rather than serialize: every pre-existing byte,
 * including JS literals/document.write, data blocks and attribute order, stays
 * intact. With scripting enabled, noscript is raw text; template content is
 * intentionally not traversed because its scripts are inert during parsing.
 *
 * @param {string} html
 * @returns {string}
 */
export function protectScriptTags(html) {
  /** @type {import('parse5').ParserError[]} */
  const parseErrors = [];
  const document = parse(html, {
    sourceCodeLocationInfo: true,
    scriptingEnabled: true,
    onParseError: (error) => parseErrors.push(error),
  });
  /** @type {number[]} */
  const offsets = [];
  /** @param {import('parse5').DefaultTreeAdapterTypes.Node} node */
  const visit = (node) => {
    if ('tagName' in node && node.tagName === 'script' && isExecutable(node)) {
      const start = node.sourceCodeLocation?.startTag;
      if (!start || !/^<script(?=[\t\n\f\r />])/i.test(html.slice(start.startOffset, start.endOffset))) {
        throw new Error('Cannot locate executable script opening tag.');
      }
      if (parseErrors.some((error) => error.code === 'duplicate-attribute'
        && error.startOffset >= start.startOffset && error.startOffset < start.endOffset)) {
        throw new Error('Duplicate attribute in executable script opening tag.');
      }
      const current = node.attrs.find((attribute) => attribute.name === 'data-cfasync');
      if (current && current.value !== 'false') {
        throw new Error('Unexpected data-cfasync value on executable script.');
      }
      if (current && node.attrs.some((attribute) => attribute.name === 'src')) {
        const optOut = start.attrs?.['data-cfasync'];
        const src = start.attrs?.src;
        if (!optOut || !src || optOut.startOffset >= src.startOffset) {
          throw new Error('Existing data-cfasync must precede src on executable script.');
        }
      }
      if (!current) offsets.push(start.startOffset + '<script'.length);
    }
    if ('childNodes' in node) for (const child of node.childNodes) visit(child);
  };
  visit(document);
  // Reverse edits keep all parser offsets valid; first attribute is before src.
  let result = html;
  for (const offset of offsets.sort((a, b) => b - a)) {
    result = result.slice(0, offset) + ' data-cfasync="false"' + result.slice(offset);
  }
  return result;
}

/**
 * Apply only to generated HTML, after bundling and without changing JS assets.
 * Validate every page before writing any, so unexpected attributes fail closed.
 * @param {URL | string} directory
 */
export async function protectGeneratedHtml(directory) {
  const root = directory instanceof URL ? fileURLToPath(directory) : directory;
  const files = (await readdir(root, { recursive: true }))
    .filter((file) => file.endsWith('.html')).sort();
  /** @type {{ file: string, html: string }[]} */
  const updates = [];
  for (const file of files) {
    const absolute = join(root, file);
    const html = await readFile(absolute, 'utf8');
    let protectedHtml;
    try {
      protectedHtml = protectScriptTags(html);
    } catch (error) {
      throw new Error(`Rocket Loader exclusion failed for ${file}.`, { cause: error });
    }
    if (protectedHtml !== html) updates.push({ file: absolute, html: protectedHtml });
  }
  for (const update of updates) await writeFile(update.file, update.html, 'utf8');
  return { htmlFiles: files.length, changedFiles: updates.length };
}
