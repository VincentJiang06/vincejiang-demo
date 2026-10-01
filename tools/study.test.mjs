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
