"""Dots anonymous feedback: SQLite transactions, finite enums, no free text or identity claims."""
from contextlib import contextmanager
import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
import threading
import time
import uuid
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ORIGIN = os.environ.get('DOTS_ORIGIN', 'https://dots.vincejiang.com')
DB = os.environ.get('DOTS_DB', '/data/feedback.sqlite3')
CATALOG = Path(os.environ.get('DOTS_CATALOG', '/app/content.json'))
COOKIE = '__Host-dots-visitor'
TTL = 90 * 24 * 3600
MAX_BODY = 1024
RATE_LOCK = threading.Lock()
RATE = {}
SALT = secrets.token_bytes(32)  # 仅本进程短时限流哈希，不是访问凭证，不写磁盘。


@contextmanager
def connect():
    db = sqlite3.connect(DB, timeout=5)
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA synchronous=FULL')
    try:
        with db:
            yield db
    finally:
        db.close()


def initialize():
    Path(DB).parent.mkdir(parents=True, exist_ok=True)
    with connect() as db:
        db.execute('PRAGMA journal_mode=WAL')
        db.execute('CREATE TABLE IF NOT EXISTS votes (item TEXT NOT NULL, visitor TEXT NOT NULL, opinion TEXT CHECK(opinion IN (\'up\',\'down\') OR opinion IS NULL), heart INTEGER NOT NULL DEFAULT 0 CHECK(heart IN (0,1)), updated INTEGER NOT NULL, PRIMARY KEY(item, visitor))')
        db.execute('CREATE INDEX IF NOT EXISTS votes_updated ON votes(updated)')


def content_ids():
    data = json.loads(CATALOG.read_text())
    return {i['id'] for e in data['editions'] + data.get('examples', []) for i in e['items']}


def allowed(ip):
    now = time.monotonic()
    key = hmac.new(SALT, ip.encode(), hashlib.sha256).digest()
    with RATE_LOCK:
        for k in list(RATE):
            if now - RATE[k][0] >= 60:
                del RATE[k]
        # 同一网络每分钟最多 30 次写入，全局每分钟最多 600 次；不长期保存网络标识。
        total = sum(v[1] for v in RATE.values())
        entry = RATE.setdefault(key, [now, 0])
        if entry[1] >= 30 or total >= 600:
            return False
        entry[1] += 1
        return True


def summary(visitor=None):
    ids = content_ids()
    result = {i: {'counts': {'up': 0, 'down': 0, 'heart': 0}, 'updated': None} for i in ids}
    with connect() as db:
        for row in db.execute('SELECT item, SUM(opinion=\'up\') AS up, SUM(opinion=\'down\') AS down, SUM(heart) AS heart, MAX(updated) AS updated FROM votes GROUP BY item'):
            if row['item'] in result:
                result[row['item']] = {'counts': {k: row[k] or 0 for k in ('up', 'down', 'heart')}, 'updated': row['updated']}
        if visitor:
            for row in db.execute('SELECT item, opinion, heart FROM votes WHERE visitor=?', (visitor,)):
                if row['item'] in result:
                    result[row['item']]['mine'] = {'up': row['opinion'] == 'up', 'down': row['opinion'] == 'down', 'heart': bool(row['heart'])}
    return {'schema': 'dots.feedback/1', 'scope': 'anonymous-public', 'items': result}


class Handler(BaseHTTPRequestHandler):
    server_version = 'Dots'
    def log_message(self, *args):
        pass  # 应用不记录 IP、Cookie 或请求正文。

    def send(self, code, data, cookie=None):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(code)
        for k, v in [('Content-Type', 'application/json; charset=utf-8'), ('Cache-Control', 'no-store'), ('X-Content-Type-Options', 'nosniff'), ('Content-Length', str(len(body)))]:
            self.send_header(k, v)
        if cookie:
            self.send_header('Set-Cookie', f'{COOKIE}={cookie}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age={TTL}')
        if code == 429:
            self.send_header('Retry-After', '60')
        self.end_headers()
        self.wfile.write(body)

    def visitor(self):
        try:
            c = SimpleCookie(self.headers.get('Cookie', ''))
            value = c[COOKIE].value if COOKIE in c else ''
            return value if re.fullmatch(r'[a-f0-9]{32}', value) else None
        except Exception:
            return None

    def do_GET(self):
        if self.path == '/api/health':
            try:
                with connect() as db:
                    db.execute('SELECT COUNT(*) FROM votes').fetchone()
                return self.send(200, {'ok': True})
            except sqlite3.Error:
                return self.send(503, {'error': 'storage_unavailable'})
        if self.path in ('/api/feedback', '/api/feedback/summary'):
            return self.send(200, summary(self.visitor() if self.path == '/api/feedback' else None))
        self.send(404, {'error': 'not_found'})

    def do_POST(self):
        if self.path != '/api/feedback':
            return self.send(404, {'error': 'not_found'})
        if self.headers.get('Origin') != ORIGIN or self.headers.get('Sec-Fetch-Site', 'same-origin') != 'same-origin':
            return self.send(403, {'error': 'same_origin_required'})
        if self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
            return self.send(415, {'error': 'json_required'})
        if self.headers.get('Transfer-Encoding'):
            return self.send(400, {'error': 'content_length_required'})
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if not 0 < size <= MAX_BODY:
                return self.send(413, {'error': 'body_size'})
            self.connection.settimeout(5)
            data = json.loads(self.rfile.read(size))
            if not isinstance(data, dict) or set(data) != {'id', 'reaction', 'value'}:
                raise ValueError()
            item, reaction, value = data['id'], data['reaction'], data['value']
            if not isinstance(item, str) or item not in content_ids() or reaction not in ('up', 'down', 'heart') or type(value) is not bool:
                raise ValueError()
        except (ValueError, TypeError, TimeoutError):
            return self.send(400, {'error': 'invalid_vote'})
        # 只信任经 Tunnel/Traefik 注入的头；服务不开放宿主机公网端口。
        ip = self.headers.get('Cf-Connecting-Ip', self.client_address[0])
        if not allowed(ip):
            return self.send(429, {'error': 'rate_limited'})
        previous = self.visitor()
        visitor = previous or uuid.uuid4().hex
        now = int(time.time())
        try:
            with connect() as db:
                db.execute('BEGIN IMMEDIATE')
                db.execute('INSERT OR IGNORE INTO votes (item, visitor, updated) VALUES (?, ?, ?)', (item, visitor, now))
                if reaction == 'heart':
                    db.execute('UPDATE votes SET heart=?, updated=? WHERE item=? AND visitor=?', (int(value), now, item, visitor))
                elif value:
                    db.execute('UPDATE votes SET opinion=?, updated=? WHERE item=? AND visitor=?', (reaction, now, item, visitor))
                else:
                    db.execute('UPDATE votes SET opinion=CASE WHEN opinion=? THEN NULL ELSE opinion END, updated=? WHERE item=? AND visitor=?', (reaction, now, item, visitor))
            # 事务提交完成后才确认成功；撤回保留零值行的更新时间便于汇总读取。
            return self.send(200, summary(visitor)['items'][item], None if previous else visitor)
        except sqlite3.Error:
            return self.send(503, {'error': 'storage_unavailable'})


class Server(ThreadingHTTPServer):
    daemon_threads = True
    request_queue_size = 32
    def get_request(self):
        request, address = super().get_request()
        request.settimeout(10)
        return request, address


if __name__ == '__main__':
    initialize()
    Server(('0.0.0.0', int(os.environ.get('PORT', '8080'))), Handler).serve_forever()
