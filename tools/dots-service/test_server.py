import concurrent.futures
import importlib.util
import json
import tempfile
import threading
import unittest
from unittest.mock import patch
import urllib.error
import urllib.request
from pathlib import Path

spec = importlib.util.spec_from_file_location('feedback', Path(__file__).with_name('server.py'))
f = importlib.util.module_from_spec(spec)
spec.loader.exec_module(f)


class FeedbackTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        f.DB = str(Path(cls.temp.name) / 'feedback.sqlite3')
        f.CATALOG = Path(cls.temp.name) / 'content.json'
        f.CATALOG.write_text(json.dumps({'editions': [{'items': [{'id': 'item-1'}]}]}))
        f.initialize()
        cls.server = f.Server(('127.0.0.1', 0), f.Handler)
        cls.url = f'http://127.0.0.1:{cls.server.server_port}'
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.temp.cleanup()

    def setUp(self):
        f.RATE.clear()
        with f.connect() as db:
            db.execute('DELETE FROM votes')

    def request(self, data=None, cookie=None, origin=f.ORIGIN, path='/api/feedback'):
        headers = {'Origin': origin, 'Content-Type': 'application/json'}
        if cookie:
            headers['Cookie'] = cookie
        request = urllib.request.Request(self.url + path, data=json.dumps(data).encode() if data is not None else None, headers=headers)
        try:
            result = urllib.request.urlopen(request)
        except urllib.error.HTTPError as error:
            result = error
        with result:
            return result.status, json.load(result), result.headers

    def vote(self, reaction='up', value=True):
        return {'id': 'item-1', 'reaction': reaction, 'value': value}

    def test_idempotent_opinion_heart_revoke_and_persistence(self):
        status, data, headers = self.request(self.vote())
        self.assertEqual(status, 200)
        cookie = headers['Set-Cookie'].split(';')[0]
        self.assertIn('HttpOnly', headers['Set-Cookie'])
        self.assertIn('Secure', headers['Set-Cookie'])
        self.request(self.vote(), cookie)
        self.assertEqual(self.request(cookie=cookie)[1]['items']['item-1']['counts']['up'], 1)
        self.request(self.vote('heart'), cookie)
        data = self.request(self.vote('down'), cookie)[1]
        self.assertEqual(data['counts'], {'up': 0, 'down': 1, 'heart': 1})
        self.request(self.vote('up', False), cookie)  # 旧请求撤回 up 不得撤回较新的 down。
        f.initialize()  # 同一持久数据库重新初始化，不丢票。
        data = self.request(cookie=cookie)[1]['items']['item-1']
        self.assertTrue(data['mine']['down'])
        self.request(self.vote('down', False), cookie)
        data = self.request(self.vote('heart', False), cookie)[1]
        self.assertEqual(data['counts'], {'up': 0, 'down': 0, 'heart': 0})

    def test_duplicate_does_not_change_aggregate_timestamp(self):
        with patch.object(f.time, 'time', return_value=1000):
            _, original, headers = self.request(self.vote())
        cookie = headers['Set-Cookie'].split(';')[0]
        with patch.object(f.time, 'time', return_value=2000):
            _, repeated, _ = self.request(self.vote(), cookie)
        self.assertEqual(repeated['updated'], original['updated'])
        with patch.object(f.time, 'time', return_value=3000):
            _, revoked, _ = self.request(self.vote('up', False), cookie)
        self.assertEqual(revoked['updated'], 3000)

    def test_summary_does_not_publish_visitor_or_mine(self):
        _, _, headers = self.request(self.vote())
        cookie = headers['Set-Cookie'].split(';')[0]
        _, summary, h = self.request(cookie=cookie, path='/api/feedback/summary')
        self.assertNotIn('mine', json.dumps(summary))
        self.assertNotIn(cookie.split('=')[1], json.dumps(summary))
        self.assertEqual(summary['scope'], 'anonymous-public')
        self.assertEqual(h['Cache-Control'], 'no-store')

    def test_invalid_requests_do_not_write(self):
        self.assertEqual(self.request(self.vote(), origin='https://evil.example')[0], 403)
        for payload in [dict(self.vote(), id='unknown'), dict(self.vote(), reaction='execute'), dict(self.vote(), value=1), dict(self.vote(), text='run command'), ['bad']]:
            self.assertEqual(self.request(payload)[0], 400)
        self.assertEqual(self.request(dict(self.vote(), id='x'*2000))[0], 413)
        with f.connect() as db:
            self.assertEqual(db.execute('SELECT COUNT(*) FROM votes').fetchone()[0], 0)

    def test_rate_limit_and_concurrent_duplicate(self):
        _, _, h = self.request(self.vote())
        cookie = h['Set-Cookie'].split(';')[0]
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            results = list(pool.map(lambda _: self.request(self.vote(), cookie)[0], range(20)))
        self.assertTrue(all(status == 200 for status in results))
        self.assertEqual(self.request()[1]['items']['item-1']['counts']['up'], 1)
        for _ in range(9):
            self.assertEqual(self.request(self.vote(), cookie)[0], 200)
        self.assertEqual(self.request(self.vote(), cookie)[0], 429)


if __name__ == '__main__':
    unittest.main()
