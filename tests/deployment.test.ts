import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const account = 'f'.repeat(32);
const projectPath = `/accounts/${account}/pages/projects/maletafeliz`;
const zonePath = '/zones/test-zone/dns_records';
const marker = '__MALETAFELIZ_DEPLOY_TEST__';

type MockResponse = { result?: unknown; status?: number };
type Event = {
  kind: 'request' | 'spawn' | 'write';
  method?: string;
  path?: string;
  body?: any;
  args?: string[];
};

// Loaded before the deployment module in a separate Node process. Every network,
// Wrangler and report-write effect is replaced, including ESM named imports.
const preload = `
import childProcess from 'node:child_process';
import fsPromises from 'node:fs/promises';
import { syncBuiltinESMExports } from 'node:module';
const responses = JSON.parse(process.env.MALETAFELIZ_TEST_RESPONSES);
const record = event => console.log(${JSON.stringify(marker)} + JSON.stringify(event));
globalThis.fetch = async (input, options = {}) => {
  const url = new URL(input);
  if (url.origin !== 'https://api.cloudflare.com') throw Error('Unexpected API origin');
  const method = options.method || 'GET';
  const path = url.pathname.replace(/^\\/client\\/v4/, '') + url.search;
  record({ kind: 'request', method, path, body: options.body ? JSON.parse(options.body) : undefined });
  const response = responses[method + ' ' + path];
  if (!response) throw Error('Unmocked request: ' + method + ' ' + path);
  const status = response.status || 200;
  return new Response(JSON.stringify({
    success: status < 400,
    result: response.result ?? null,
    errors: status === 404 ? [{ code: 8000007 }] : [],
  }), { status, headers: { 'Content-Type': 'application/json' } });
};
childProcess.spawnSync = (_command, args) => {
  record({ kind: 'spawn', args });
  return { status: 0 };
};
fsPromises.writeFile = async (path, content) => {
  if (path !== '/tmp/maletafeliz-deployment-result.json') throw Error('Unexpected write path');
  record({ kind: 'write', path, body: JSON.parse(content) });
};
syncBuiltinESMExports();
`;

function runDeployment(responses: Record<string, MockResponse>) {
  const result = spawnSync(
    process.execPath,
    [
      '--import',
      'data:text/javascript;base64,' + Buffer.from(preload).toString('base64'),
      resolve('scripts/deploy-cloudflare.mjs'),
    ],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      timeout: 10000,
      // No inherited credentials, proxy configuration or Wrangler environment.
      env: {
        CLOUDFLARE_ACCOUNT_ID: account,
        CLOUDFLARE_API_TOKEN: 'test-token-never-sent',
        MALETAFELIZ_TEST_RESPONSES: JSON.stringify(responses),
      },
    },
  );
  if (result.error) throw result.error;
  const events = result.stdout
    .split('\n')
    .filter((line) => line.startsWith(marker))
    .map((line) => JSON.parse(line.slice(marker.length)) as Event);
  return { ...result, events };
}

const zoneResponse = {
  'GET /zones?name=maletafeliz.com': { result: [{ id: 'test-zone' }] },
};

describe('Cloudflare deployment DNS safeguards', () => {
  it('uses the actual allocated Pages subdomain for the CNAME', () => {
    const assignedSubdomain = 'maletafeliz-a1b2.pages.dev';
    const run = runDeployment({
      [`GET ${projectPath}`]: { status: 404 },
      ...zoneResponse,
      [`GET ${zonePath}?name=maletafeliz.com`]: {
        result: [{ type: 'MX', content: 'mail.example.com' }],
      },
      [`POST /accounts/${account}/pages/projects`]: {
        result: { production_branch: 'main', subdomain: assignedSubdomain },
      },
      [`GET ${projectPath}/domains`]: { result: [] },
      [`POST ${projectPath}/domains`]: { result: { name: 'maletafeliz.com' } },
      [`POST ${zonePath}`]: { result: { id: 'new-cname' } },
      [`GET ${projectPath}/domains/maletafeliz.com`]: {
        result: { status: 'pending' },
      },
    });
    expect(run.status, run.stderr).toBe(0);
    const dnsChanges = run.events.filter(
      (event) =>
        event.kind === 'request' &&
        event.path?.startsWith(zonePath) &&
        event.method !== 'GET',
    );
    expect(dnsChanges).toEqual([
      {
        kind: 'request',
        method: 'POST',
        path: zonePath,
        body: {
          type: 'CNAME',
          name: 'maletafeliz.com',
          content: assignedSubdomain,
          proxied: true,
          ttl: 1,
        },
      },
    ]);
    expect(run.events.find((event) => event.kind === 'spawn')?.args).toEqual([
      'node_modules/wrangler/bin/wrangler.js',
      'pages',
      'deploy',
      'dist',
      '--project-name',
      'maletafeliz',
      '--branch',
      'main',
    ]);
    expect(
      run.events.find((event) => event.kind === 'write')?.body,
    ).toMatchObject({
      pagesSubdomain: assignedSubdomain,
      httpVerified: false,
    });
  });

  it('stops before any mutation when an existing A record serves the apex', () => {
    const run = runDeployment({
      [`GET ${projectPath}`]: { status: 404 },
      ...zoneResponse,
      [`GET ${zonePath}?name=maletafeliz.com`]: {
        result: [{ type: 'A', content: '192.0.2.10' }],
      },
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain(
      'An existing website DNS record would need changing',
    );
    expect(run.events.length).toBeGreaterThan(0);
    expect(
      run.events.every(
        (event) => event.kind === 'request' && event.method === 'GET',
      ),
    ).toBe(true);
  });

  it('stops before any mutation when the project production branch differs', () => {
    const run = runDeployment({
      [`GET ${projectPath}`]: {
        result: {
          production_branch: 'production',
          subdomain: 'maletafeliz.pages.dev',
        },
      },
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain('production branch differs from main');
    expect(run.events).toEqual([
      { kind: 'request', method: 'GET', path: projectPath },
    ]);
  });
});
