import test from 'node:test';
import assert from 'node:assert/strict';
import { renderDocuments } from './study.mjs';

test('study rendering preserves equations, explicit/repeated anchors and resolves scoped Unicode links', () => {
 const docs = [
  {key:'CSCI3130/第一 讲.md', text:'# 第一讲\n\n<a id="a1"></a>\n## 标题\n## 标题\n\n[显式](#a1) [重复](#标题-1) [下一篇](子目录/第二讲.md#证明) [课件](../课件/原文.pdf#page=3) [课程](README.md)\n\n$x^2$\n\n$$\n\\frac{1}{2}\n$$\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n```c\nint x = 1;\n```\n\n<script>alert(1)</script>'},
  {key:'CSCI3130/子目录/第二讲.md',text:'# 第二讲\n\n## 证明\n\n[返回](../第一%20讲.md#a1)'}
 ];
 const result=renderDocuments(docs);
 assert.equal(result.length,2);
 const a=result[0].html, b=result[1].html;
 assert.match(a,/id="a1"/); assert.match(a,/id="标题-1"/);
 assert.match(a,/href="\/study\/2026T1\/CSCI3130\/子目录\/第二讲.html#证明"/);
 assert.match(b,/href="\/study\/2026T1\/CSCI3130\/第一%20讲.html#a1"/);
 assert.match(a,/href="\/study\/2026T1\/CSCI3130\/"/); assert.match(a,/本地课件/); assert.doesNotMatch(a,/href="[^\"]*\.pdf/);
 assert.match(a,/katex/); assert.match(a,/<table>/); assert.match(a,/<pre/);
 assert.doesNotMatch(a,/<script>/);
 assert.throws(()=>renderDocuments([{key:'CSCI3130/a.md',text:'# A\n[坏锚点](#missing)'}]),/missing/);
 assert.throws(()=>renderDocuments([{key:'CSCI3130/a.md',text:'# A\n\n$\\invalidcommand{x}$'}]),/math/);
 assert.throws(()=>renderDocuments([{key:'CSCI3130/a.md',text:'# A\n[漏文档](missing.md)'}]),/missing.md/);
});

test('publication projection removes workflow metadata and private paths without deleting academic prose', async () => {
 const {publicText, isNote} = await import('./study-import.mjs');
 assert.equal(isNote('exercise/Ex01.md'),true);
 for(const name of ['核验/a.md','记忆库/L01.md','AGENTS.md','更新记录.md','PDF/a.pdf'])assert.equal(isNote(name),false);
 const result=publicText('# 例题\n$x=1$\n- 编写：vince-course-study 4.2.0\n路径 `/Users/vince/Lab`。\n补充内容不进入讲义记忆库。');
 assert.match(result,/\$x=1\$/);assert.doesNotMatch(result,/vince-course|\/Users\/vince|记忆库/);
 assert.match(result,/课程工作目录/);
});

test('source catalog rejects duplicate output keys rather than silently overwriting a page', () => {
 assert.throws(()=>renderDocuments([{key:'CSCI3130/a.md',text:'# A'},{key:'CSCI3130/a.md',text:'# B'}]),/duplicate document/);
});

test('generated study pages version their UI assets so updated styles reach returning readers', async () => {
 const {mkdtempSync,readFileSync,rmSync}=await import('node:fs');
 const {tmpdir}=await import('node:os');
 const {join}=await import('node:path');
 const {buildStudy}=await import('./study-build.mjs');
 const out=mkdtempSync(join(tmpdir(),'study-output-'));
 try {
  buildStudy(out);
  const html=readFileSync(join(out,'study/2026T1/index.html'),'utf8');
  assert.match(html,/study\.css\?v=[a-f0-9]{12}/);
  assert.match(html,/study\.js\?v=[a-f0-9]{12}/);
  for(const key of ['CSCI3230/HW01-2026T1-分级提示','CSCI3150/HW01-Shell分级提示-2026T1']){
   const hint=readFileSync(join(out,'study/2026T1',key+'.html'),'utf8');
   const outside=hint.replace(/<article>[\s\S]*?<\/article>/,'');
   assert.doesNotMatch(outside,/相邻笔记|HW01[^"<>]*解析|HW01-Shell进程与管道/);
   assert.match(outside,/返回课程目录（离开提示模式）/);
   assert.doesNotMatch(hint,/<details class="study-hint" open/);
  }
 } finally {rmSync(out,{recursive:true,force:true});}
});

test('hint disclosures are nested, closed by default, and preserve math and checked links', () => {
 const text='# 提示版\n\n## Q1a\n\n:::hint 提示 1 · 切入点\n\n先想概念。\n\n:::hint 提示 2 · 关键关系\n\n$x^2$\n\n:::hint 提示 3 · 自检\n\n[回题目](#q1a)\n\n:::endhint\n:::endhint\n:::endhint\n\n:::hint 查看完整解析前确认\n\n[确认查看](答案.md)\n\n:::endhint';
 const html=renderDocuments([{key:'CSCI3230/hint.md',text},{key:'CSCI3230/答案.md',text:'# 完整解法'}])[0].html;
 assert.equal((html.match(/<details class="study-hint">/g)||[]).length,4);
 assert.doesNotMatch(html,/<details[^>]*\sopen(?:[\s=>])/);
 assert.match(html,/<summary>提示 1 · 切入点<\/summary>[\s\S]*<details class="study-hint">[\s\S]*<summary>提示 2/);
 assert.match(html,/<\/details>\s*<\/details>\s*<\/details>/);
 assert.match(html,/class="katex"/); assert.match(html,/href="#q1a"/);
 assert.match(html,/<summary>查看完整解析前确认<\/summary>[\s\S]*href="[^\"]*答案.html"/);
 assert.throws(()=>renderDocuments([{key:'CSCI3230/a.md',text:':::hint 未结束\n\n正文'}]),/unclosed hint/);
 assert.throws(()=>renderDocuments([{key:'CSCI3230/a.md',text:':::endhint'}]),/unmatched hint/);
});

test('course-scoped import reads only selected sources and preserves other published courses', async () => {
 const {importNotes,COURSES}=await import('./study-import.mjs');
 const {mkdtempSync,mkdirSync,writeFileSync,readFileSync,copyFileSync,rmSync,existsSync,realpathSync}=await import('node:fs');
 const {tmpdir}=await import('node:os');
 const {join}=await import('node:path');
 const {fileURLToPath}=await import('node:url');
 const {spawnSync}=await import('node:child_process');
 const root=realpathSync(mkdtempSync(join(tmpdir(),'study-scope-')));
 const desktop=join(root,'Desktop'), dest=join(root,'published');
 const put=(base,rel,text)=>{const file=join(base,rel);mkdirSync(join(file,'..'),{recursive:true});writeFileSync(file,text);};
 try {
  // Only the selected source exists: touching another course is a scope violation.
  const authored='# CSCI3230 阅读导航\n\n先学向量，再学线性回归。\n';
  put(desktop,'CSCI3230/study/阅读导航.md',authored);
  put(desktop,'CSCI3230/study/第一 讲.md','# 第一讲\n\n$x=1$\n');
  const retained={key:'CSCI3150/留存.md',sourceSha256:'unchanged-source',publishedSha256:'unchanged-published',projection:false,extra:'retain metadata'};
  put(dest,'CSCI3150/留存.md','do not change other course bytes\n');
  put(dest,'manifest.json',JSON.stringify([retained,{key:'CSCI3230/旧清单.md',sourceSha256:'old'}]));
  const report=importNotes(desktop,dest,{courses:['CSCI3230']});
  assert.equal(readFileSync(join(dest,'CSCI3230/阅读导航.md'),'utf8'),authored);
  assert.equal(readFileSync(join(dest,'CSCI3150/留存.md'),'utf8'),'do not change other course bytes\n');
  assert.deepEqual(report.filter(x=>!x.key.startsWith('CSCI3230/')),[retained]);
  assert.deepEqual(report.filter(x=>x.key.startsWith('CSCI3230/')).map(x=>x.key).sort(),['CSCI3230/第一 讲.md','CSCI3230/阅读导航.md'].sort());
  assert.deepEqual(JSON.parse(readFileSync(join(dest,'manifest.json'),'utf8')),report);
  assert.equal(existsSync(join(dest,'CSCI3130')),false);
  const before=readFileSync(join(dest,'manifest.json'),'utf8');
  for(const courses of [[],['CSCI9999'],['../CSCI3230'],['CSCI3230','CSCI3230'],'CSCI3230',null]) {
   assert.throws(()=>importNotes(desktop,dest,{courses}),/course/i);
   assert.equal(readFileSync(join(dest,'manifest.json'),'utf8'),before);
  }
  // Exercise CLI in an isolated copy so its default destination cannot touch the repo.
  const cli=join(root,'tools/study-import.mjs');mkdirSync(join(root,'tools'),{recursive:true});
  copyFileSync(fileURLToPath(new URL('./study-import.mjs',import.meta.url)),cli);
  const result=spawnSync(process.execPath,[cli,desktop,'--course=CSCI3230'],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.equal(readFileSync(join(root,'tools/study-content/CSCI3230/阅读导航.md'),'utf8'),authored);
  const rejected=spawnSync(process.execPath,[cli,desktop,'--course=CSCI9999'],{encoding:'utf8'});
  assert.notEqual(rejected.status,0);assert.match(rejected.stderr,/course/i);
  // Default remains a four-course import; existing synthetic navigation stays for 3130/3150.
  for(const course of COURSES.filter(x=>x!=='CSCI3230')) {
   put(desktop,course+'/study/阅读导航.md','# '+course+' 原创导引\n');
   put(desktop,course+'/study/讲义.md','# 讲义\n');
  }
  const all=importNotes(desktop,join(root,'full'));
  assert.equal(all.length,8);
  for(const course of COURSES)assert.equal(all.filter(x=>x.key.startsWith(course+'/')).length,2);
  assert.match(readFileSync(join(root,'full/CSCI3130/阅读导航.md'),'utf8'),/讲义\.md/);
  assert.match(readFileSync(join(root,'full/CSCI3150/阅读导航.md'),'utf8'),/讲义\.md/);
  assert.equal(readFileSync(join(root,'full/CSCI3160/阅读导航.md'),'utf8'),'# CSCI3160 原创导引\n');
  assert.equal(readFileSync(join(root,'full/CSCI3230/阅读导航.md'),'utf8'),authored);
 } finally {rmSync(root,{recursive:true,force:true});}
});
