import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,rmSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {esc,jsonLd} from './seo.mjs';
import {enrichStaticPages} from './static-seo.mjs';
const ROOT=new URL('..',import.meta.url).pathname;

test('metadata safely represents quoted text and script-like content',()=>{
 const value={name:'"x" </script><script>alert(1)</script>'};
 assert.doesNotMatch(jsonLd(value),/<script|<\/script/);
 assert.deepEqual(JSON.parse(jsonLd(value)),value);
 assert.equal(esc('"<&'), '&quot;&lt;&amp;');
});

test('static metadata decodes entities once and preserves apostrophes and quotation marks',()=>{
 const dir=mkdtempSync(join(tmpdir(),'vj-static-seo-'));
 try{
  writeFileSync(join(dir,'index.html'),`<!doctype html><html><head><title>Vince's "A &amp; B"</title><meta content="Vince's A &amp; B" name="description"></head><body><h1>A &amp; B</h1></body></html>`);
  enrichStaticPages(dir,[]);
  const html=readFileSync(join(dir,'index.html'),'utf8');
  assert.ok(html.includes('property="og:title" content="Vince&#39;s &quot;A &amp; B&quot;"'));
  assert.ok(html.includes('property="og:description" content="Vince&#39;s A &amp; B"'));
  assert.doesNotMatch(html,/&amp;amp;/);
 }finally{rmSync(dir,{recursive:true,force:true});}
});

test('built public pages have consistent host sitemaps, published Dots prose, and Study canonicals',()=>{
 const out=mkdtempSync(join(tmpdir(),'vj-seo-'));
 try{
  const build=spawnSync(process.execPath,[join(ROOT,'tools/build-site.mjs'),'--out',out],{encoding:'utf8'});
  assert.equal(build.status,0,build.stderr);
  const audit=spawnSync(process.execPath,[join(ROOT,'tools/audit.mjs'),'--dir',out,'--json',join(out,'audit.json')],{encoding:'utf8'});
  assert.equal(audit.status,0,audit.stderr);
  const report=JSON.parse(readFileSync(join(out,'audit.json'),'utf8'));
  assert.deepEqual(report.pages.filter(p=>p.issues.length).map(p=>({url:p.url,issues:p.issues})),[]);
  for(const line of report.sitemaps)assert.match(line,/缺失 0；无效 0/);
  const sitemap=readFileSync(join(out,'sitemap.xml'),'utf8');
  const notes=JSON.parse(readFileSync(join(ROOT,'tools/study-content/manifest.json'),'utf8'));
  for(const d of notes){
   const path='/study/2026T1/'+d.key.replace(/\.md$/,'.html');
   const url=new URL(path,'https://vincejiang.com').href;
   const html=readFileSync(join(out,path),'utf8');
   assert.ok(sitemap.includes('<loc>'+esc(url)+'</loc>'),url);
   assert.ok(html.includes('rel="canonical" href="'+esc(url)+'"'),url);
   assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
   const ld=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
   assert.equal(ld.url,url);assert.equal(ld['@type'],'LearningResource');
   if(ld.dateModified)assert.ok(html.includes('<time datetime="'+ld.dateModified+'">'));
  }
  assert.doesNotMatch(sitemap,/https:\/\/vincejiang.com\/(dots|reactor-study)\//);
  const data=JSON.parse(readFileSync(join(ROOT,'dots/content/index.json'),'utf8'));
  for(const e of data.editions){
   const html=readFileSync(join(out,'dots/editions',e.id,'index.html'),'utf8');
   assert.ok(html.includes(esc(e.note||'')));
   for(const i of e.items){
    for(const b of i.body)assert.ok(html.includes(esc(b.text)),i.id);
    for(const s of i.sources)assert.ok(html.includes('href="'+esc(s.url)+'"'),s.url);
   }
   assert.doesNotMatch(html,/beacon\.js|<script[^>]+src=/);
  }
  for(const e of data.examples)assert.equal(existsSync(join(out,'dots/editions',e.id)),false);
  const home=readFileSync(join(out,'dots/index.html'),'utf8');
  assert.ok(home.includes('<h1>'));assert.ok(home.includes('href="/editions/"'));
  assert.doesNotMatch(home,/beacon\.js/);
 }finally{rmSync(out,{recursive:true,force:true});}
});
