#!/usr/bin/env python3
"""Mac: read public aggregate -> existing gh identity -> dedicated data branch. No scheduler."""
import datetime
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent.parent
REPO = 'https://github.com/VincentJiang06/vincejiang-demo.git'
BRANCH = 'dots-feedback'
URL = 'https://dots.vincejiang.com/api/feedback/summary'

def run(args, cwd=ROOT, check=True):
    return subprocess.run(args, cwd=cwd, check=check, text=True, capture_output=True)

def git(*args, cwd=ROOT, check=True):
    return run(['git', '-c', 'credential.helper=', '-c', 'credential.helper=!gh auth git-credential', *args], cwd, check)

def main():
    raw = json.loads(run(['curl', '--fail', '--silent', '--show-error', '--max-time', '20', URL]).stdout)
    if raw.get('schema') != 'dots.feedback/1' or raw.get('scope') != 'anonymous-public':
        raise ValueError('Unexpected feedback schema')
    # 显式白名单投影，cookie、IP、账号或逐访客数据不可能被复制到 Git。
    items = {}
    for item_id, value in raw['items'].items():
        if item_id.startswith('sample-'):
            continue
        counts = {key: value['counts'][key] for key in ('up','down','heart')}
        if not all(type(v) is int and v >= 0 for v in counts.values()):
            raise ValueError('Invalid aggregate')
        updated = value.get('updated')
        if updated is not None and type(updated) is not int:
            raise ValueError('Invalid timestamp')
        items[item_id] = {'counts':counts,'lastChangedAtUnix':updated}
    payload = {'schema':'dots.feedback.snapshot/1','scope':'anonymous-public','window':'lifetime-current-state','source':URL,'items':items}
    digest = hashlib.sha256(json.dumps(payload, sort_keys=True, separators=(',',':')).encode()).hexdigest()
    with tempfile.TemporaryDirectory(prefix='dots-feedback-') as folder:
        target = Path(folder)
        git('init','-q',cwd=target)
        git('remote','add','origin',REPO,cwd=target)
        exists = git('ls-remote','--heads','origin',BRANCH,cwd=target).stdout.strip()
        if exists:
            git('fetch','--depth=1','origin',BRANCH,cwd=target)
            git('checkout','-q','-b',BRANCH,'FETCH_HEAD',cwd=target)
        else:
            git('checkout','-q','--orphan',BRANCH,cwd=target)
        dest = target/'feedback'/'latest.json'
        if dest.exists() and json.loads(dest.read_text()).get('version') == digest:
            print('No aggregate change; no commit created.')
            return
        payload.update(version=digest,exportedAt=datetime.datetime.now(datetime.timezone.utc).isoformat())
        dest.parent.mkdir(exist_ok=True)
        dest.write_text(json.dumps(payload,ensure_ascii=False,indent=2,sort_keys=True)+'\n')
        (target/'README.md').write_text('# Dots anonymous feedback\n\n`feedback/latest.json` is a cumulative current-state snapshot, not an increment. Never add counts across exports. Stable item IDs join `main:dots/content/index.json`. Anonymous public popularity must not be treated as the owner\'s personal preference. Snapshot version hashes content; repeated exports with no change create no commit. No raw visitor records, cookies or IP addresses are published.\n')
        identity=git('log','-1','--format=%an%n%ae').stdout.splitlines()
        git('config','user.name',identity[0],cwd=target)
        git('config','user.email',identity[1],cwd=target)
        git('add','feedback/latest.json','README.md',cwd=target)
        git('commit','-q','-m','Update anonymous Dots feedback snapshot',cwd=target)
        # 普通 fast-forward push，竞态由 Git 拒绝，绝不 force；重跑会重新读取远端。
        git('push','origin',BRANCH,cwd=target)
        print('Published '+BRANCH+':feedback/latest.json version '+digest)

if __name__=='__main__':
    main()
