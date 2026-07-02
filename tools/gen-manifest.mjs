#!/usr/bin/env node
// gen-manifest.mjs —— 在「有 .git」的环境(CI runner,checkout fetch-depth:0)里跑,
// 把「发布判定 + 所有 git 派生日期」算好写进 posts-manifest.json,供容器内的 build-site.mjs 消费。
// 为什么分家:.dockerignore 排除了 .git,build-site 在容器里碰不到 git —— 所有 git 事实必须在这里定死。
//
// 发布判定(与 SPEC 一致):一篇 posts/**.md「已发布」⟺ 存在任一触碰过它的 commit,
//   其 message(subject+body)含「发布」或「[publish]」。draft/date/updated 的 frontmatter 覆盖由 build-site 处理。
//
// 输出 posts-manifest.json:
//   { generatedAt, posts: { "<relpath>": {published, firstPublish, lastPublish, commits} },
//     paths: { "<path>": "<lastCommitISO|null>" } }
import { execSync } from 'node:child_process';
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const POSTS_DIR = join(ROOT, 'posts');

function git(args) {
  try { return execSync(`git ${args}`, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); }
  catch { return ''; }
}

// 递归找 posts/ 下所有 .md
function findMd(dir) {
  let out = [];
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(findMd(p));
    else if (e.isFile() && e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

// 发布标记:必须是「有意发布」,不能被句中偶然提及触发(如「无发布词」「修复发布流程」)。
// 命中条件(任一):① 某行以「发布」开头,后接 空格/冒号/行尾(匹配 Vince 的「发布：标题」用法);
//                  ② 出现方括号标记 [发布] / [publish] / 【发布】(可置于任意位置,如 "feat: x [publish]")。
const PUBLISH_RE = /(^|\n)[ \t]*发布(?=[\s:：]|$)|[[【](?:发布|publish)[\]】]/i;

function commitsFor(relpath) {
  // %x1e 分隔每个 commit,%x1f 分隔字段:hash / author-date(ISO strict) / 完整 message
  const raw = git(`log --follow --format=%x1e%H%x1f%aI%x1f%B -- "${relpath}"`);
  const commits = [];
  for (const chunk of raw.split('\x1e')) {
    if (!chunk.trim()) continue;
    const parts = chunk.split('\x1f');
    if (parts.length < 3) continue;
    const hash = parts[0].trim();
    const date = parts[1].trim();
    const body = parts.slice(2).join('\x1f');
    commits.push({ hash, date, publishes: PUBLISH_RE.test(body) });
  }
  return commits; // 新→旧
}

const posts = {};
for (const abs of findMd(POSTS_DIR)) {
  const rel = relative(ROOT, abs);
  const commits = commitsFor(rel);
  const pub = commits.filter(c => c.publishes);
  posts[rel] = {
    published: pub.length > 0,
    firstPublish: pub.length ? pub[pub.length - 1].date : null, // 最旧的发布 commit
    lastPublish:  pub.length ? pub[0].date : null,               // 最新的发布 commit
    commits: commits.length,
  };
}

// 静态内容 / 配置的最后改动日期(供 sitemap lastmod 用真实 git 日期,不虚刷)
const PATHS = ['status-ai', 'vince-hifi-notes', 'mac-buying-demo', 'site.config.json', 'templates', 'tools', 'robots.txt'];
const paths = {};
for (const p of PATHS) {
  const d = git(`log -1 --format=%aI -- "${p}"`).trim();
  paths[p] = d || null;
}

const manifest = { generatedAt: new Date().toISOString(), posts, paths };
const outFile = join(ROOT, 'posts-manifest.json');
writeFileSync(outFile, JSON.stringify(manifest, null, 2) + '\n');
const n = Object.keys(posts).length;
const npub = Object.values(posts).filter(p => p.published).length;
console.error(`gen-manifest: ${n} 篇 md,${npub} 篇已发布 → ${relative(ROOT, outFile)}`);
