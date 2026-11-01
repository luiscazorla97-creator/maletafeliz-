"""Run after npm run build (preview mode), against the retained pre-design inventory."""
import hashlib, json, pathlib, subprocess, sys
root = pathlib.Path(__file__).resolve().parents[2]
subprocess.run([sys.executable, str(root/'docs/design/capture-routes.py'), '/tmp/maletafeliz-routes-after.json'], cwd=root, check=True)
before = json.loads((root/'docs/design/explorer-atlas-before.json').read_text())
changed = [name for name, digest in before['files'].items() if not (root/name).is_file() or hashlib.sha256((root/name).read_bytes()).hexdigest() != digest]
routes_before = json.loads((root/'docs/design/explorer-atlas-routes-before.json').read_text())
routes_after = json.loads(pathlib.Path('/tmp/maletafeliz-routes-after.json').read_text())
route_changes = sorted(set(routes_before) ^ set(routes_after))
seo_changes = [name for name in routes_before.keys() & routes_after.keys() if routes_before[name]['seo'] != routes_after[name]['seo']]
article_changes = [name for name in routes_before.keys() & routes_after.keys() if routes_before[name]['articleTextHash'] != routes_after[name]['articleTextHash']]
result = {'protectedFiles':len(before['files']), 'changedProtectedFiles':changed, 'routesBefore':len(routes_before), 'routesAfter':len(routes_after), 'routeChanges':route_changes, 'seoChanges':seo_changes, 'articleTextChanges':article_changes, 'publishedCounts': before['publishedCounts']}
(root/'docs/design/explorer-atlas-preservation.json').write_text(json.dumps(result, indent=2)+'\n')
print(json.dumps(result,indent=2))
if changed or route_changes or seo_changes or article_changes:sys.exit(1)
