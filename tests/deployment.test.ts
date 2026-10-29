import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const account = 'f'.repeat(32);
const projectPath = `/accounts/${account}/pages/projects/maletafeliz-web`;
const zonePath = '/zones/test-zone/dns_records';
const marker = '__MALETAFELIZ_DEPLOY_TEST__';
const hostnames = ['maletafeliz.com', 'www.maletafeliz.com'];
const assignedSubdomain = 'maletafeliz-web-a1b2.pages.dev';
const sites = [
  {
    project: 'maletafeliz-web',
    hostname: hostnames[0],
    path: projectPath,
    target: assignedSubdomain,
  },
  {
    project: 'maletafeliz-www',
    hostname: hostnames[1],
    path: `/accounts/${account}/pages/projects/maletafeliz-www`,
    target: 'maletafeliz-www-c3d4.pages.dev',
  },
];

type MockResponse = { result?: unknown; status?: number };
type Responses = Record<string, MockResponse | MockResponse[]>;
type Event = {
  kind: 'request' | 'spawn' | 'write';
  method?: string;
  path?: string;
  body?: any;
  args?: string[];
  multipart?: boolean;
  contentType?: string | null;
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
  const multipart = options.body instanceof FormData;
  record({ kind: 'request', method, path,
    body: multipart ? Object.fromEntries(options.body) : options.body ? JSON.parse(options.body) : undefined,
    ...(multipart ? { multipart: true, contentType: new Headers(options.headers).get('Content-Type') } : {}),
  });
  const configured = responses[method + ' ' + path];
  const response = Array.isArray(configured) ? configured.shift() : configured;
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
  throw Error('Git deployments must not spawn Wrangler or upload assets');
};
fsPromises.writeFile = async (path, content) => {
  if (path !== '/tmp/maletafeliz-deployment-result.json') throw Error('Unexpected write path');
  record({ kind: 'write', path, body: JSON.parse(content) });
};
syncBuiltinESMExports();
`;

function runDeployment(responses: Responses) {
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

const gitProject = {
  production_branch: 'main',
  subdomain: assignedSubdomain,
  source: { type: 'github' },
};

function responses(overrides: Responses = {}): Responses {
  return {
    'GET /zones?name=maletafeliz.com': { result: [{ id: 'test-zone' }] },
    ...Object.fromEntries(
      sites.flatMap((site) => [
        [
          `GET ${site.path}`,
          { result: { ...gitProject, subdomain: site.target } },
        ],
        [
          `GET ${zonePath}?name=${site.hostname}`,
          { result: [{ type: 'MX', content: 'mail.example.com' }] },
        ],
        [
          `GET ${site.path}/domains/${site.hostname}`,
          { result: { status: 'pending' } },
        ],
        [`GET ${site.path}/domains`, { result: [] }],
        [`POST ${site.path}/domains`, { result: {} }],
        [
          `POST ${site.path}/deployments`,
          { result: { id: `test-${site.project}` } },
        ],
      ]),
    ),
    [`POST ${zonePath}`]: { result: { id: 'new-cname' } },
    ...overrides,
  };
}

const mutations = (events: Event[]) =>
  events.filter((event) => event.kind === 'request' && event.method !== 'GET');

describe('Cloudflare Git deployment DNS safeguards', () => {
  it('triggers both Git builds and points each hostname to its own allocated Pages subdomain', () => {
    const run = runDeployment(responses());
    expect(run.status, run.stderr).toBe(0);
    const dnsChanges = run.events.filter(
      (event) =>
        event.kind === 'request' &&
        event.path?.startsWith(zonePath) &&
        event.method !== 'GET',
    );
    expect(dnsChanges).toEqual(
      sites.map((site) => ({
        kind: 'request',
        method: 'POST',
        path: zonePath,
        body: {
          type: 'CNAME',
          name: site.hostname,
          content: site.target,
          proxied: true,
          ttl: 1,
        },
      })),
    );
    for (const site of sites) {
      const trigger = mutations(run.events).find(
        (event) => event.path === `${site.path}/deployments`,
      );
      expect(trigger).toMatchObject({
        body: { branch: 'main' },
        multipart: true,
        contentType: null,
      });
      expect(
        mutations(run.events).find(
          (event) => event.path === `${site.path}/domains`,
        )?.body,
      ).toEqual({ name: site.hostname });
    }
    expect(run.events.some((event) => event.kind === 'spawn')).toBe(false);
    const firstMutation = run.events.findIndex(
      (event) => event.kind === 'request' && event.method !== 'GET',
    );
    for (const hostname of hostnames)
      expect(
        run.events
          .slice(0, firstMutation)
          .some((event) => event.path === `${zonePath}?name=${hostname}`),
      ).toBe(true);
    expect(
      run.events.find((event) => event.kind === 'write')?.body,
    ).toMatchObject({
      deployments: sites.map((site) => ({
        project: site.project,
        hostname: site.hostname,
        pagesSubdomain: site.target,
        deploymentId: `test-${site.project}`,
        buildStatus: 'pending',
        buildVerified: false,
      })),
      buildStatus: 'pending',
      buildVerified: false,
      httpVerified: false,
    });
  });

  it.each([
    ['maletafeliz.com', 'A', '192.0.2.10'],
    ['www.maletafeliz.com', 'AAAA', '2001:db8::10'],
    ['www.maletafeliz.com', 'CNAME', 'another-site.pages.dev'],
    ['www.maletafeliz.com', 'CNAME', assignedSubdomain],
  ])(
    'stops before any mutation for incompatible %s %s DNS',
    (hostname, type, content) => {
      const run = runDeployment(
        responses({
          [`GET ${zonePath}?name=${hostname}`]: {
            result: [{ type, content }],
          },
        }),
      );
      expect(run.status).not.toBe(0);
      expect(run.stderr).toContain(
        `An existing website DNS record for ${hostname} would need changing`,
      );
      expect(run.events.length).toBeGreaterThan(0);
      expect(
        run.events.every(
          (event) => event.kind === 'request' && event.method === 'GET',
        ),
      ).toBe(true);
    },
  );

  it.each(sites)(
    'stops before any mutation when $project uses a different production branch',
    (site) => {
      const run = runDeployment(
        responses({
          [`GET ${site.path}`]: {
            result: {
              ...gitProject,
              production_branch: 'production',
            },
          },
        }),
      );
      expect(run.status).not.toBe(0);
      expect(run.stderr).toContain('production branch differs from main');
      expect(
        run.events.every(
          (event) => event.kind === 'request' && event.method === 'GET',
        ),
      ).toBe(true);
    },
  );

  it.each(sites)(
    'rejects $project without the GitHub integration before any mutation',
    (site) => {
      const run = runDeployment(
        responses({
          [`GET ${site.path}`]: { result: { ...gitProject, source: null } },
        }),
      );
      expect(run.status).not.toBe(0);
      expect(run.stderr).toContain('authorized GitHub integration');
      expect(mutations(run.events)).toEqual([]);
    },
  );

  it('re-reads DNS after association and reuses CNAMEs Cloudflare created automatically', () => {
    const run = runDeployment(
      responses(
        Object.fromEntries(
          sites.map((site) => [
            `GET ${zonePath}?name=${site.hostname}`,
            [
              { result: [] },
              { result: [{ type: 'CNAME', content: site.target }] },
            ],
          ]),
        ),
      ),
    );
    expect(run.status, run.stderr).toBe(0);
    expect(
      mutations(run.events).filter((event) => event.path === zonePath),
    ).toEqual([]);
    expect(
      mutations(run.events)
        .filter((event) => event.path?.endsWith('/domains'))
        .map((event) => event.body.name),
    ).toEqual(hostnames);
  });

  it('keeps already configured domains and CNAMEs without duplicating or replacing them', () => {
    const run = runDeployment(
      responses({
        ...Object.fromEntries(
          sites.flatMap((site) => [
            [`GET ${site.path}/domains`, { result: [{ name: site.hostname }] }],
            [
              `GET ${zonePath}?name=${site.hostname}`,
              {
                result: [
                  { type: 'CNAME', content: site.target + '.' },
                  { type: 'MX', content: 'mail.example.com' },
                ],
              },
            ],
          ]),
        ),
      }),
    );
    expect(run.status, run.stderr).toBe(0);
    expect(mutations(run.events).map((event) => event.path)).toEqual(
      sites.map((site) => `${site.path}/deployments`),
    );
  });
});
