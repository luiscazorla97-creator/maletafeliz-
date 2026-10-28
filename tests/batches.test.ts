import { it, expect } from 'vitest';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  readdirSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
it('reuses a daily batch and does not create or publish articles', () => {
  const root = mkdtempSync(join(tmpdir(), 'maletafeliz-batch-'));
  try {
    mkdirSync(join(root, 'editorial'), { recursive: true });
    mkdirSync(join(root, 'content/articles'), { recursive: true });
    writeFileSync(
      join(root, 'editorial/plan.json'),
      JSON.stringify(
        ['america', 'europe', 'asia', 'africa', 'oceania'].map(
          (continent, i) => ({ id: `topic-${i}`, continent }),
        ),
      ),
    );
    const script = resolve('scripts/editorial-batch.mjs');
    const first = JSON.parse(
      execFileSync(process.execPath, [script, '5'], {
        cwd: root,
        encoding: 'utf8',
      }),
    );
    const second = JSON.parse(
      execFileSync(process.execPath, [script, '5'], {
        cwd: root,
        encoding: 'utf8',
      }),
    );
    expect(first.topicIds).toHaveLength(5);
    expect(first.status).toBe('reserved-not-generated');
    expect(second.reused).toBe(true);
    expect(second.batch.id).toBe(first.id);
    expect(readdirSync(join(root, 'content/articles'))).toHaveLength(0);
    expect(readdirSync(join(root, 'editorial/batches'))).toHaveLength(1);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
it('rejects batch sizes outside the agreed maximum', () => {
  expect(() =>
    execFileSync(
      process.execPath,
      [resolve('scripts/editorial-batch.mjs'), '6'],
      { stdio: 'pipe' },
    ),
  ).toThrow();
});
