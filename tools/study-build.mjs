import {readFileSync,writeFileSync,mkdirSync,cpSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderDocuments,esc,url,BASE} from './study.mjs';
import {COURSES} from './study-import.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const names={CSCI3130:'计算理论',CSCI3150:'操作系统',CSCI3160:'算法设计与分析',CSCI3230:'人工智能'};
const kind=d=>{const f=path.basename(d.key);return /^HW|^Ex|^Sp/.test(f)?'作业与题解':/^Lab/.test(f)?'实验':/^T\d/.test(f)?'辅导':/^L\d/.test(f)?'课程伴读':/^ESTR/.test(f)?'拓展阅读':'阅读与复习';};
const title=d=>d.headings.find(h=>h.level===1)?.title||path.basename(d.key,'.md');
const link=d=>`<a href="${esc(url(d.key))}">${esc(path.basename(d.key,'.md'))}</a>`;
function shell(t,body,course='',article=false){
 return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(t)} · Study</title><meta name="description" content="Vince 的课程伴读、作业解析与复习笔记"><link rel="stylesheet" href="${BASE}study.css"><link rel="stylesheet" href="${BASE}katex/katex.min.css"><script src="${BASE}study.js" defer></script></head><body${article?' class="reading"':''}><a class="skip" href="#main">跳到正文</a><header><a class="brand" href="/">Vince Jiang</a><nav aria-label="面包屑"><a href="${BASE}">Study · 2026T1</a>${course?`<span>/</span><a href="${BASE}${course}/">${course}</a>`:''}</nav></header>${body}<footer>课程学习笔记 · 原始课件留在本地 <a href="${BASE}">返回四门课程</a></footer></body></html>`;
}
export function buildStudy(out,{check=false}={}){
 const manifest=JSON.parse(readFileSync(path.join(ROOT,'tools/study-content/manifest.json'),'utf8'));
 const docs=renderDocuments(manifest.map(d=>({...d,text:readFileSync(path.join(ROOT,'tools/study-content',d.key),'utf8')})));
 const metrics={documents:docs.length,headings:docs.reduce((s,d)=>s+d.headings.length,0),anchors:docs.reduce((s,d)=>s+d.ids.size,0),formulas:docs.reduce((s,d)=>s+(d.html.match(/class="katex"/g)||[]).length,0)};
 if(check){console.error('study check ✓ '+JSON.stringify(metrics));return metrics;}
 const dest=path.join(out,'study/2026T1');mkdirSync(dest,{recursive:true});
 const write=(key,html)=>{const p=path.join(dest,key);mkdirSync(path.dirname(p),{recursive:true});writeFileSync(p,html);};
 for(const f of ['study.css','study.js'])cpSync(path.join(ROOT,'templates',f),path.join(dest,f));
 mkdirSync(path.join(dest,'katex'),{recursive:true});cpSync(path.join(ROOT,'tools/node_modules/katex/dist/katex.min.css'),path.join(dest,'katex/katex.min.css'));
 cpSync(path.join(ROOT,'tools/node_modules/katex/dist/fonts'),path.join(dest,'katex/fonts'),{recursive:true});
 cpSync(path.join(ROOT,'tools/node_modules/katex/LICENSE'),path.join(dest,'katex/LICENSE'));
 write('index.html',shell('2026T1 课程笔记',`<main id="main" class="landing"><p class="eyebrow">STUDY / 2026T1</p><h1>课程笔记</h1><p class="intro">从概念到推导，从例题到复习。</p><div class="courses">${COURSES.map((c,i)=>`<a class="course" href="${BASE}${c}/"><span class="number">0${i+1}</span><span><b>${c}</b><strong>${names[c]}</strong><small>${docs.filter(d=>d.key.startsWith(c+'/')).length} 份笔记</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div><p class="boundary">按课程收录伴读、辅导、作业与实验解析。各篇保留原有资料版本；2026T1 是整理目录，部分笔记使用历史课件。</p></main>`));
 for(const c of COURSES){
  const ds=docs.filter(d=>d.key.startsWith(c+'/'));
  const groups=['阅读与复习','课程伴读','辅导','作业与题解','实验','拓展阅读'].map(k=>({k,ds:ds.filter(d=>kind(d)===k)})).filter(g=>g.ds.length);
  const contents=groups.map(g=>`<section class="note-group"><h2>${g.k}<small>${g.ds.length}</small></h2><ul class="note-list">${g.ds.map(d=>`<li>${link(d)}</li>`).join('')}</ul></section>`).join('');
  write(`${c}/index.html`,shell(`${c} ${names[c]}`,`<main id="main" class="landing"><p class="eyebrow">${c} / ${ds.length} 份笔记</p><h1>${names[c]}</h1><label class="search">筛选笔记<input type="search" placeholder="输入讲次或主题…" aria-label="筛选课程笔记"></label><p id="filter-status" role="status"></p>${contents}</main>`,c));
  for(let i=0;i<ds.length;i++){
   const d=ds[i];
   const nav=`<details class="course-nav"><summary>课程目录 · ${c}</summary><nav aria-label="课程目录">${groups.map(g=>`<h2>${g.k}</h2><ul>${g.ds.map(x=>`<li><a ${x===d?'aria-current="page" ':''}href="${esc(url(x.key))}">${esc(path.basename(x.key,'.md'))}</a></li>`).join('')}</ul>`).join('')}</nav></details>`;
   const toc=`<details class="toc"><summary>本文目录</summary><nav aria-label="本文目录"><ol>${d.headings.filter(h=>h.level>1&&h.level<=3).map(h=>`<li class="level-${h.level}"><a href="#${esc(encodeURIComponent(h.id))}">${esc(h.title)}</a></li>`).join('')}</ol></nav></details>`;
   write(d.key.replace(/\.md$/,'.html'),shell(title(d),`<div class="reading-layout"><aside>${nav}</aside><main id="main"><p class="eyebrow">${c} / ${kind(d)}</p><article>${d.html}</article><nav class="adjacent" aria-label="相邻笔记">${i?`<div><small>上一篇</small>${link(ds[i-1])}</div>`:'<div></div>'}${i<ds.length-1?`<div><small>下一篇</small>${link(ds[i+1])}</div>`:''}</nav></main><aside>${toc}</aside></div>`,c,true));
  }
 }
 mkdirSync(path.join(out,'study'),{recursive:true});writeFileSync(path.join(out,'study/index.html'),shell('课程笔记',`<main id="main" class="landing"><h1>课程笔记</h1><a href="${BASE}">2026T1 · 四门课程</a></main>`));
 console.error('study build ✓ '+JSON.stringify(metrics));return metrics;
}
if(process.argv[1]===fileURLToPath(import.meta.url))buildStudy(process.argv[2]||'/tmp/vince-study-preview',{check:process.argv.includes('--check')});
