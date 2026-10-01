#!/usr/bin/env python3
"""Validate the emitted study tree; optionally re-hash the untouched local sources."""
import argparse, hashlib, json
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.links=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        for attr in ('href','src'):
            if attr in a: self.links.append(a[attr])

def verify(root, desktop=None):
    root=Path(root); base=root/'study'; pages={}; errors=[]; checked=0
    for f in base.rglob('*'):
        if f.is_symlink(): errors.append(f'symlink: {f}')
        if not f.is_file(): continue
        if f.suffix.lower() not in {'.html','.css','.js','.woff','.woff2','.ttf'} and f.name!='LICENSE': errors.append(f'unexpected asset: {f}')
        if f.suffix=='.html':
            text=f.read_text(); p=Page();p.feed(text);pages[f.resolve()]=p
            for id,n in Counter(p.ids).items():
                if n>1:errors.append(f'duplicate id: {f}#{id}')
            if any(x in text for x in ['/Users/','file://','vince-course-study','AGENTS.md','CLAUDE.md','katex-error']): errors.append(f'private metadata or render error: {f}')
    for f,p in pages.items():
        for link in p.links:
            u=urlsplit(link)
            if u.scheme or u.netloc:continue
            if u.path.startswith('/') and not u.path.startswith('/study/'):continue
            target=(root/unquote(u.path).lstrip('/')) if u.path.startswith('/') else f.parent/unquote(u.path)
            if not u.path:target=f
            if target.is_dir():target=target/'index.html'
            target=target.resolve();checked+=1
            if not target.is_file():errors.append(f'missing file: {f.name} → {link}')
            elif u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:errors.append(f'missing id: {f.name} → {link}')
    if desktop:
        manifest=json.loads((Path(__file__).parent/'study-content/manifest.json').read_text())
        for d in manifest:
            course,rel=d['key'].split('/',1)
            f=Path(desktop)/course/'study'/rel
            if hashlib.sha256(f.read_bytes()).hexdigest()!=d['sourceSha256']:errors.append(f'source changed: {d["key"]}')
        print(f'Source hashes unchanged: {len(manifest)}')
    if errors:raise AssertionError('\n'.join(errors))
    print(f'Validated {len(pages)} HTML pages, {checked} local links/assets; no forbidden assets or metadata.')

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('output');p.add_argument('--desktop');a=p.parse_args();verify(a.output,a.desktop)
