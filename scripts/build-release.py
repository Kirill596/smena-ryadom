"""Rebuild the deployed static release without reverting its newer copy/editor.

The legacy TSX predates the deployed site. Pin the last approved release and
apply only CTA changes; fail closed if any expected anchor changes.
Requires Python 3 and Git, no third-party packages.
"""
from pathlib import Path
import hashlib
import io
import json
import re
import subprocess
import zipfile
from html import escape

ROOT = Path(__file__).resolve().parents[1]
BASE = '160669389729adac2614cde9e6ac3f1da0acd481'
config = json.loads((ROOT / 'public/config.json').read_text(encoding='utf-8'))
url = config['affiliateUrl']
assert url.startswith('https://'), 'affiliateUrl must use HTTPS'
original = subprocess.check_output(['git', 'show', f'{BASE}:site-release.zip'], cwd=ROOT)
with zipfile.ZipFile(io.BytesIO(original)) as archive:
    files = {name: archive.read(name) for name in archive.namelist()}

chunk = 'docs/_next/static/chunks/986-fbb83c1047ef5fe0.js'
source = files[chunk].decode('utf-8')

def replace_once(old, new):
    global source
    assert source.count(old) == 1, f'Unexpected release structure: {old[:80]}'
    source = source.replace(old, new, 1)

# A build-time fallback gives every Samokat CTA a real href before config loads.
# The runtime fetch permits centralized updates and has no attribution side effects.
replace_once('function l({city:', 'function isSamokat(v){return v.id==="samokat-courier"||/^самокат$/i.test(String(v.employer||"").trim())}function l({city:')
replace_once('const [items,setItems]=(0,s.useState)([r.us]);',
    'const [items,setItems]=(0,s.useState)([r.us]);\n'
    ' const [affiliate,setAffiliate]=(0,s.useState)(' + json.dumps(url) + ');\n'
    ' (0,s.useEffect)(()=>{fetch((0,n.l)("/config.json"),{cache:"no-store"})'
    '.then(r=>{if(!r.ok)throw Error();return r.json()})'
    '.then(c=>{if(new URL(c.affiliateUrl).protocol==="https:")setAffiliate(c.affiliateUrl)})'
    '.catch(()=>{})},[]);')
replace_once('async function apply(v){setMessage("");',
    'async function apply(v){if(isSamokat(v)){location.assign(affiliate);return}setMessage("");')
replace_once('!ready?(0,i.jsx)("button",{className:"button",children:"Подробнее и выбор города"})',
    '!ready?(0,i.jsx)(isSamokat(v)?"a":"button",{className:"button",href:isSamokat(v)?affiliate:undefined,children:"Подробнее и выбор города"})')
replace_once('(0,i.jsx)("button",{className:"button",onClick:()=>apply(v),children:"Перейти к заключению договора"})',
    '(0,i.jsx)(isSamokat(v)?"a":"button",{className:"button",href:isSamokat(v)?affiliate:undefined,onClick:isSamokat(v)?undefined:()=>apply(v),children:"Перейти к заключению договора"})')
replace_once('href:(0,n.l)("/jobs/samokat-courier")+"?offer="+encodeURIComponent(v.id)+(city?"&city="+encodeURIComponent(city):"")',
    'href:isSamokat(v)?affiliate:(0,n.l)("/jobs/samokat-courier")+"?offer="+encodeURIComponent(v.id)+(city?"&city="+encodeURIComponent(city):"")')
new_name = '986-' + hashlib.sha256(source.encode()).hexdigest()[:16] + '.js'
files.pop(chunk)
files['docs/_next/static/chunks/' + new_name] = source.encode()
html_count = 0
for name, data in list(files.items()):
    if not name.endswith(('.html', '.txt', '.js', '.json')):
        continue
    text = data.decode('utf-8').replace(Path(chunk).name, new_name)
    if name.endswith('.html'):
        old = '<button class="button">Подробнее и выбор города</button>'
        html_count += text.count(old)
        text = text.replace(old, '<a class="button" href="' + escape(url, quote=True) + '">Подробнее и выбор города</a>')
    files[name] = text.encode()
assert html_count == 72, f'Expected home, detail and 70 city CTAs, got {html_count}'
files['docs/config.json'] = (json.dumps(config, ensure_ascii=False, indent=2) + '\n').encode()

# Only the home page is shortened. Detail/city/legal/admin pages stay intact.
landing = (ROOT / 'public/landing.html').read_text(encoding='utf-8')
assert landing.count('{{AFFILIATE_URL}}') == 1
files['docs/index.html'] = landing.replace('{{AFFILIATE_URL}}', escape(url, quote=True)).encode()

# Only clear the generated docs tree within this repository, including stale chunks.
docs = (ROOT / 'docs').resolve()
assert docs.parent == ROOT.resolve() and docs.name == 'docs'
if docs.exists():
    for path in sorted(docs.rglob('*'), key=lambda p: len(p.parts), reverse=True):
        if path.is_file():
            path.unlink()
        elif path.is_dir():
            path.rmdir()
for name, data in files.items():
    path = ROOT / name
    assert path.resolve().is_relative_to(docs)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
with zipfile.ZipFile(ROOT / 'site-release.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for name, data in sorted(files.items()):
        info = zipfile.ZipInfo(name, date_time=(2026, 9, 30, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        archive.writestr(info, data)
print(f'Built {len(files)} files; {html_count} prerendered CTAs; {new_name}')
