#!/usr/bin/env node
// Report-only audit of the three deployed host roots, with core issues separate from suggestions.
import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,readdirSync,existsSync,mkdtempSync,statSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import MarkdownIt from 'markdown-it';
const ROOT=new URL('..',import.meta.url).pathname;
const args=process.argv.slice(2),arg=k=>args.includes(k)?args[args.indexOf(k)+1]:null;
let DIR=arg('--dir');
if(!DIR){DIR=mkdtempSync(join(tmpdir(),'vj-audit-'));const r=spawnSync('node',[join(ROOT,'tools/build-site.mjs'),'--out',DIR],{encoding:'utf8'});if(r.status!==0){console.error(r.stderr);process.exit(1);}}
DIR=resolve(DIR);
const hosts=[{origin:'https://vincejiang.com',root:DIR,skip:['dots','reactor-study']},{origin:'https://dots.vincejiang.com',root:join(DIR,'dots'),skip:[]},{origin:'https://reactor.vincejiang.com',root:join(DIR,'reactor-study'),skip:[]}];
const {unescapeAll:decode}=new MarkdownIt().utils;
function attrs(tag){return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m=>[m[1].toLowerCase(),decode(m[2]??m[3]) ]));}
function files(dir,skip=[],base=''){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>{if(e.name.startsWith('.')||(!base&&skip.includes(e.name)))return [];const p=join(dir,e.name);return e.isDirectory()?files(p,skip,base+'/'+e.name):e.name.endsWith('.html')?[p]:[];});}
function resolves(url){const host=hosts.find(h=>h.origin===url.origin);if(!host)return true;
 if(url.origin==='https://vincejiang.com'&&url.pathname==='/status-ai/api')return true; // documented separate public service
 let p;try{p=join(host.root,decodeURIComponent(url.pathname));}catch{return false;}for(const file of [p,join(p,'index.html'),p+'.html'])if(existsSync(file)&&statSync(file).isFile())return true;return false;}
const pages=[],omitted=[];
for(const host of hosts){for(const f of files(host.root,host.skip)){
 const html=readFileSync(f,'utf8'),url=new URL(f.slice(host.root.length).replace(/index\.html$/,''),host.origin).href;
 const metas=(html.match(/<meta\b[^>]*>/gi)||[]).map(attrs),links=(html.match(/<link\b[^>]*>/gi)||[]).map(attrs);
 if(!/<html\b/i.test(html)||metas.some(m=>(m.name||'').toLowerCase()==='robots'&&/noindex/i.test(m.content||''))){omitted.push(url);continue;}
 const issues=[],suggestions=[],title=html.match(/<title>([^<]+)<\/title>/i)?.[1];
 const meta=key=>metas.find(m=>m.name===key||m.property===key)?.content;
 const canonical=links.find(l=>l.rel==='canonical')?.href;
 if(!title)issues.push('缺 title');if(!meta('description'))issues.push('缺 description');
 if(!canonical)issues.push('缺 canonical');else if(canonical!==url)issues.push(`canonical 与本页不一致: ${canonical}`);
 const h1=(html.match(/<h1[\s>]/gi)||[]).length;if(h1!==1)suggestions.push(`h1 数量 ${h1}，需结合页面语义判断`);
 if(!attrs(html.match(/<html\b[^>]*>/i)?.[0]||'').lang)issues.push('缺 lang');
 if(!meta('viewport'))suggestions.push('缺 viewport');
 for(const key of ['og:title','og:description','og:url','og:image','twitter:card'])if(!meta(key))suggestions.push(`分享预览缺 ${key}`);
 for(const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(attrs(script[1]).type==='application/ld+json'){try{JSON.parse(script[2]);}catch{issues.push('JSON-LD 无法解析');}}}
 const visible=html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'');
 const dead=[];for(const a of visible.matchAll(/<a\b[^>]*>/gi)){const href=attrs(a[0]).href;if(!href||href.startsWith('#')||/^(mailto:|tel:|javascript:|data:)/i.test(href))continue;try{const u=new URL(href,url);if(!resolves(u))dead.push(u.href);}catch{dead.push(href);}}
 if(dead.length)issues.push(`站内断链: ${[...new Set(dead)].slice(0,8).join(', ')}`);
 const images=(html.match(/<img\b[^>]*>/gi)||[]).map(attrs);if(images.some(i=>i.alt===undefined))suggestions.push('部分图片缺 alt');
 pages.push({url,host:host.origin,title,issues,suggestions});
}}
const sm=[];
for(const h of hosts){const p=join(h.root,'sitemap.xml');if(!existsSync(p)){sm.push(`${h.origin}: 缺 sitemap.xml`);continue;}
 const locs=[...readFileSync(p,'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>decode(m[1]));
 const ours=pages.filter(p=>p.host===h.origin).map(p=>p.url),missing=ours.filter(u=>!locs.includes(u));
 const invalid=locs.filter(u=>{try{const url=new URL(u);return url.origin!==h.origin||!resolves(url);}catch{return true;}});
 sm.push(`${h.origin}: ${locs.length} 条；缺失 ${missing.length}；无效 ${invalid.length}${missing.length?'\n  - 未收录: '+missing.slice(0,12).join(', '):''}${invalid.length?'\n  - 无效: '+invalid.slice(0,12).join(', '):''}`);
}
const dirty=pages.filter(p=>p.issues.length),report=[`# SEO / 可抓取性审计`,`完整且可索引页面 ${pages.length}；核心问题页 ${dirty.length}；跳过 noindex/片段 ${omitted.length}。社交卡片与 h1 建议单列，不作为搜索排名硬要求。`,`## 各主机 sitemap`,...sm.map(s=>'- '+s),`## 核心问题`,...dirty.map(p=>`- ${p.url}\n  - ${p.issues.join('\n  - ')}`),`## 建议`,...pages.filter(p=>p.suggestions.length).map(p=>`- ${p.url}: ${p.suggestions.join('；')}`),`## 解释`,`抓取允许和索引资格需结合线上 HTTP、robots.txt、CDN 与站长工具确认。llms.txt 只作现有内容索引，不计入排名得分。当前检查不测外链可达性或真实 Core Web Vitals。`].join('\n\n')+'\n';
console.log(report);if(arg('--out'))writeFileSync(arg('--out'),report);
if(arg('--json'))writeFileSync(arg('--json'),JSON.stringify({pages,omitted,sitemaps:sm},null,2));
