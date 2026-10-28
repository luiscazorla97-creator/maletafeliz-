// Runs only after build:release. Credentials stay in the process/proxy, never browser assets.
import { spawnSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
if (!account || !/^[a-f0-9]{32}$/i.test(account) || !token)
  throw Error(
    'Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN securely in environment settings before deploying.',
  );
const project = 'maletafeliz',
  domain = 'maletafeliz.com';
async function api(path, { method = 'GET', body, allowMissing = false } = {}) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30000),
  });
  if (response.status === 404 && allowMissing) return null;
  const data = await response.json();
  if (!response.ok || !data.success)
    throw Error(
      `Cloudflare ${method} ${path.split('?')[0]} failed: HTTP ${response.status}, codes ${(data.errors || []).map((e) => e.code).join(',')}. Check account access and token permissions.`,
    );
  return data.result;
}
let current = await api(`/accounts/${account}/pages/projects/${project}`, {
  allowMissing: true,
});
if (current && current.production_branch !== 'main')
  throw Error(
    'The Pages project production branch differs from main; inspect the existing project before changing it.',
  );
const zones = await api(`/zones?name=${encodeURIComponent(domain)}`);
if (zones.length !== 1)
  throw Error(
    'The token must have access to the maletafeliz.com zone (Zone Read and DNS Edit).',
  );
const zone = zones[0].id;
const records = await api(
  `/zones/${zone}/dns_records?name=${encodeURIComponent(domain)}`,
);
const rootAddresses = records.filter((r) =>
  ['A', 'AAAA', 'CNAME'].includes(r.type),
);
if (
  rootAddresses.some(
    (r) =>
      r.type !== 'CNAME' ||
      !current ||
      r.content.replace(/\.$/, '') !== current.subdomain,
  )
)
  throw Error(
    'An existing website DNS record would need changing. Deployment stopped without replacing it.',
  );
if (!current)
  current = await api(`/accounts/${account}/pages/projects`, {
    method: 'POST',
    body: { name: project, production_branch: 'main' },
  });
const target = current.subdomain;
if (typeof target !== 'string' || !/^[a-z0-9-]+\.pages\.dev$/.test(target))
  throw Error(
    'Cloudflare did not return a valid Pages subdomain. Inspect the project before deploying or configuring DNS.',
  );
const run = spawnSync(
  process.execPath,
  [
    'node_modules/wrangler/bin/wrangler.js',
    'pages',
    'deploy',
    'dist',
    '--project-name',
    project,
    '--branch',
    'main',
  ],
  { stdio: 'inherit', env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } },
);
if (run.status !== 0)
  throw Error(`Wrangler deployment failed (exit ${run.status}).`);
const domains = await api(
  `/accounts/${account}/pages/projects/${project}/domains`,
);
if (!domains.some((d) => d.name === domain))
  await api(`/accounts/${account}/pages/projects/${project}/domains`, {
    method: 'POST',
    body: { name: domain },
  });
if (!rootAddresses.length)
  await api(`/zones/${zone}/dns_records`, {
    method: 'POST',
    body: {
      type: 'CNAME',
      name: domain,
      content: target,
      proxied: true,
      ttl: 1,
    },
  });
const status = await api(
  `/accounts/${account}/pages/projects/${project}/domains/${domain}`,
);
await writeFile(
  '/tmp/maletafeliz-deployment-result.json',
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      project,
      pagesSubdomain: target,
      domain,
      status: status.status,
      url: `https://${domain}`,
      httpVerified: false,
    },
    null,
    2,
  ),
);
console.log(
  `Cloudflare deployment submitted. Domain state: ${status.status}. Verify HTTPS, DNS, article routes and the sitemap before claiming public launch.`,
);
