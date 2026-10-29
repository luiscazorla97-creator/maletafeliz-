// Runs only after build:release. Credentials stay in the process/proxy, never browser assets.
import { writeFile } from 'node:fs/promises';
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
if (!account || !/^[a-f0-9]{32}$/i.test(account) || !token)
  throw Error(
    'Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN securely in environment settings before deploying.',
  );
const domain = 'maletafeliz.com';
const sites = [
  { project: 'maletafeliz-web', hostname: domain },
  { project: 'maletafeliz-www', hostname: `www.${domain}` },
];
async function api(path, { method = 'GET', body } = {}) {
  const multipart = body instanceof FormData;
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(!multipart && body !== undefined
        ? { 'Content-Type': 'application/json' }
        : {}),
    },
    body: multipart
      ? body
      : body === undefined
        ? undefined
        : JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  const data = await response.json();
  if (!response.ok || !data.success)
    throw Error(
      `Cloudflare ${method} ${path.split('?')[0]} failed: HTTP ${response.status}, codes ${(data.errors || []).map((e) => e.code).join(',')}. Check account access and token permissions.`,
    );
  return data.result;
}
for (const site of sites) {
  site.projectPath = `/accounts/${account}/pages/projects/${site.project}`;
  const current = await api(site.projectPath);
  if (current.production_branch !== 'main')
    throw Error(
      `The Pages project production branch differs from main (${site.project}); inspect the existing project before changing it.`,
    );
  if (current.source?.type !== 'github')
    throw Error(
      `The Pages project ${site.project} must use its authorized GitHub integration; no asset upload or project replacement will be attempted.`,
    );
  site.target = current.subdomain;
  if (
    typeof site.target !== 'string' ||
    !/^[a-z0-9-]+\.pages\.dev$/.test(site.target)
  )
    throw Error(
      `Cloudflare did not return a valid Pages subdomain for ${site.project}. Inspect the project before deploying or configuring DNS.`,
    );
}
const zones = await api(`/zones?name=${encodeURIComponent(domain)}`);
if (zones.length !== 1)
  throw Error(
    'The token must have access to the maletafeliz.com zone (Zone Read and DNS Edit).',
  );
const zone = zones[0].id;
const readAddresses = async ({ hostname, target }) => {
  const records = await api(
    `/zones/${zone}/dns_records?name=${encodeURIComponent(hostname)}`,
  );
  const addresses = records.filter((r) =>
    ['A', 'AAAA', 'CNAME'].includes(r.type),
  );
  if (
    addresses.some(
      (r) =>
        r.type !== 'CNAME' ||
        r.content.replace(/\.$/, '').toLowerCase() !== target,
    )
  )
    throw Error(
      `An existing website DNS record for ${hostname} would need changing. Deployment stopped without replacing it.`,
    );
  return addresses;
};
// Check both hostnames before triggering a build or changing domains/DNS.
for (const site of sites) {
  await readAddresses(site);
  site.domains = await api(`${site.projectPath}/domains`);
}
const domainStates = [];
const deploymentStates = [];
for (const site of sites) {
  const { hostname, project, projectPath, target, domains } = site;
  const form = new FormData();
  form.set('branch', 'main');
  const deployment = await api(`${projectPath}/deployments`, {
    method: 'POST',
    body: form,
  });
  deploymentStates.push({
    project,
    hostname,
    pagesSubdomain: target,
    deploymentId: deployment.id,
    buildStatus: 'pending',
    buildVerified: false,
  });
  if (!domains.some((d) => d.name === hostname))
    await api(`${projectPath}/domains`, {
      method: 'POST',
      body: { name: hostname },
    });
  // Associating a custom domain can create DNS automatically. Re-read it to
  // avoid duplicate CNAMEs and stop if another actor introduced a conflict.
  const addresses = await readAddresses(site);
  if (!addresses.length)
    await api(`/zones/${zone}/dns_records`, {
      method: 'POST',
      body: {
        type: 'CNAME',
        name: hostname,
        content: target,
        proxied: true,
        ttl: 1,
      },
    });
  const state = await api(`${projectPath}/domains/${hostname}`);
  domainStates.push({ name: hostname, project, status: state.status });
}
await writeFile(
  '/tmp/maletafeliz-deployment-result.json',
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      domain,
      domains: domainStates,
      deployments: deploymentStates,
      buildStatus: 'pending',
      buildVerified: false,
      url: `https://${domain}`,
      httpVerified: false,
    },
    null,
    2,
  ),
);
console.log(
  'Cloudflare Git builds requested for both main branches. Build completion, DNS, HTTPS, the www redirect, article routes and the sitemap still require verification before claiming public launch.',
);
