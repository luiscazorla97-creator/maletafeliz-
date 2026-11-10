import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse, type DefaultTreeAdapterTypes } from 'parse5';
import { describe, expect, it } from 'vitest';
import { protectGeneratedHtml, protectScriptTags } from '../scripts/lib/rocket-loader.mjs';

function scriptBodyHashes(html: string) {
  const hashes: string[] = [];
  function visit(node: DefaultTreeAdapterTypes.Node) {
    if ('tagName' in node && node.tagName === 'script') {
      const location = node.sourceCodeLocation!;
      const body = html.slice(location.startTag!.endOffset, location.endTag?.startOffset ?? location.endOffset);
      hashes.push(createHash('sha256').update(body).digest('hex'));
    }
    if ('childNodes' in node) for (const child of node.childNodes) visit(child);
  }
  visit(parse(html, { sourceCodeLocationInfo: true, scriptingEnabled: true }));
  return hashes;
}

describe('post-build Rocket Loader exclusions', () => {
  it('preserves parser order, JS body hashes, assets and existing attributes', () => {
    const html = `<!doctype html><html><head><script>window.atOptions = {key:'same',width:728};</script><script src="https://bauval.org/22/unchanged" crossorigin='anonymous'></script><SCRIPT TYPE="MoDuLe" src="/_astro/analytics.same.js"></SCRIPT></head><body><script async data-cfasync='false' src="https://bauval.org/21/unchanged"></script><script>document.write("\\u003cscript src='nested.js'>\\u003c/script>"); const literal = '<script src="not-a-tag.js">';</script></body></html>`;
    const expected = html
      .replace('<script>', '<script data-cfasync="false">')
      .replace('<script src="https://bauval.org/22/', '<script data-cfasync="false" src="https://bauval.org/22/')
      .replace('<SCRIPT TYPE=', '<SCRIPT data-cfasync="false" TYPE=')
      .replace('<script>document.write', '<script data-cfasync="false">document.write');
    const result = protectScriptTags(html);
    expect(result).toBe(expected);
    expect(scriptBodyHashes(result)).toEqual(scriptBodyHashes(html));
    expect(protectScriptTags(result)).toBe(result);
  });

  it('uses browser parsing for comments, template content, noscript and raw text at EOF', () => {
    const inert = `<!-- <script src="comment.js"></script> --><template><script src="template.js"></script></template><noscript><script src="noscript.js"></script></noscript><textarea><script src="textarea.js"></script></textarea>`;
    const html = inert + `<script>const text = '<script src="literal.js">'; // end of file`;
    const result = protectScriptTags(html);
    expect(result).toBe(inert + `<script data-cfasync="false">const text = '<script src="literal.js">'; // end of file`);
    expect(scriptBodyHashes(result)).toEqual(scriptBodyHashes(html));
  });

  it('leaves JSON-LD, import maps and other non-JavaScript data blocks byte-identical', () => {
    const html = `<script type='APPLICATION/LD+JSON'>{"@type":"Article","name":"Preserved"}</script><script type="importmap">{"imports":{"x":"./x.js"}}</script><script type="application/json">{"text":"<script>"}</script><script type="speculationrules">{"prefetch":[]}</script><script language="vbscript">inert</script>`;
    expect(protectScriptTags(html)).toBe(html);
    expect(scriptBodyHashes(protectScriptTags(html))).toEqual(scriptBodyHashes(html));
  });

  it('recognizes classic JavaScript MIME types and places the opt-out before src', () => {
    const html = `<script type=" TEXT/JAVASCRIPT; charset=utf-8 " defer src='same.js'></script><script type="" src="empty.js"></script><script language="JavaScript" src="legacy.js"></script>`;
    const result = protectScriptTags(html);
    expect(result).toBe(html.replaceAll('<script ', '<script data-cfasync="false" '));
    expect(protectScriptTags(result)).toBe(result);
  });

  it('rejects unexpected or duplicate executable opt-out attributes', () => {
    for (const value of ['true', 'FALSE', '']) {
      expect(() => protectScriptTags(`<script data-cfasync="${value}" src="a.js"></script>`)).toThrow('Unexpected data-cfasync');
    }
    expect(() => protectScriptTags('<script data-cfasync="false" data-cfasync="true" src="a.js"></script>')).toThrow('Duplicate attribute');
    expect(() => protectScriptTags('<script src="a.js" data-cfasync="false"></script>')).toThrow('must precede src');
    expect(() => protectScriptTags('<script data-cfasync="false" src="a.js" SRC="b.js"></script>')).toThrow('Duplicate attribute');
  });

  it('transforms generated HTML recursively while leaving all non-HTML assets untouched', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'maletafeliz-rocket-'));
    try {
      await mkdir(join(dir, 'en'));
      const html = '<script type="module" src="/_astro/same.js"></script>';
      await writeFile(join(dir, 'en', 'index.html'), html);
      await writeFile(join(dir, '404.html'), '<h1>Not found</h1>');
      const js = 'const literal = "<script src=unchanged>";';
      await writeFile(join(dir, 'same.js'), js);
      expect(await protectGeneratedHtml(pathToFileURL(dir + '/'))).toEqual({ htmlFiles: 2, changedFiles: 1 });
      expect(await readFile(join(dir, 'en', 'index.html'), 'utf8')).toBe(protectScriptTags(html));
      expect(await readFile(join(dir, 'same.js'), 'utf8')).toBe(js);
      expect(await protectGeneratedHtml(dir)).toEqual({ htmlFiles: 2, changedFiles: 0 });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('fails before writing any output page if another page has an unexpected opt-out', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'maletafeliz-rocket-'));
    try {
      const first = '<script src="must-stay-original.js"></script>';
      await writeFile(join(dir, 'a.html'), first);
      await writeFile(join(dir, 'z.html'), '<script data-cfasync="true" src="bad.js"></script>');
      await expect(protectGeneratedHtml(dir)).rejects.toThrow('z.html');
      expect(await readFile(join(dir, 'a.html'), 'utf8')).toBe(first);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
