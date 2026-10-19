import {readFileSync,writeFileSync,mkdirSync,cpSync,existsSync} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {renderDocuments,esc,url,BASE} from './study.mjs';
import {COURSES} from './study-import.mjs';
import {metadata} from './seo.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const assetVersion=f=>createHash('sha256').update(readFileSync(path.join(ROOT,'templates',f))).digest('hex').slice(0,12);
const names={CSCI3130:'计算理论',CSCI3150:'操作系统',CSCI3160:'算法设计与分析',CSCI3230:'人工智能',GENA2122:'美国文化与历史议题'};
const MIDTERM_PATH=BASE+'midterm/';
const MIDTERMS=[
 {course:'CSCI3130',scope:'Lec 1–6',notes:[
  {file:'L01-L06-期中详细复习.md',label:'详细知识点',desc:'从定义讲到自动机构造、语言证明、文法转换与 CYK。'},
  {file:'L01-L06-期中简略复习.md',label:'简略总结',desc:'集中回顾核心定义、算法步骤、必要条件与公式。'}]},
 {course:'CSCI3160',scope:'Warm Up 1–DP 4',notes:[
  {file:'期中-全面复习稿.md',label:'详细知识点',desc:'完整展开算法原理、执行步骤、正确性证明与复杂度。'},
  {file:'期中-快速总结稿.md',label:'简略总结',desc:'快速查阅各讲的核心概念、关键算法与递推。'},
  {file:'MT-真题精讲与标准答案.md',label:'真题详细解析',desc:'保留十道大题的题干与数据，逐步推导并配图说明。'}]}
];
const midtermKeys=new Set(MIDTERMS.flatMap(m=>m.notes.map(n=>m.course+'/'+n.file)));
const OLD_MIDTERMS={
 'CSCI3130/L00-L06-期中全面复习.md':url('CSCI3130/L01-L06-期中详细复习.md'),
 'CSCI3130/L00-L06-期中快速总结.md':url('CSCI3130/L01-L06-期中简略复习.md'),
 'CSCI3130/L00-L06-期中模拟卷.md':MIDTERM_PATH+'#csci3130',
 'CSCI3130/L00-L06-模拟卷解析.md':MIDTERM_PATH+'#csci3130'
};
const midtermOverview=()=>`<section class="midterm-overview" aria-labelledby="midterm-heading"><div class="section-heading"><h2 id="midterm-heading">期中复习</h2><a href="${MIDTERM_PATH}">进入专区 →</a></div><div class="courses">${MIDTERMS.map((m,i)=>`<a class="course" href="${MIDTERM_PATH}#${m.course.toLowerCase()}"><span class="number">0${i+1}</span><span><b>${m.course}</b><strong>${names[m.course]}</strong><small>${esc(m.scope)} · ${m.notes.length} 份复习文档</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div></section>`;
const midtermPage=()=>`<main id="main" class="landing"><p class="eyebrow">STUDY / 2026T1 / MIDTERM</p><h1>期中复习</h1><p class="intro">详细稿用于理解与推导，简略稿用于回顾，真题解析用于检查解题过程。</p>${MIDTERMS.map(m=>`<section class="note-group midterm-course" id="${m.course.toLowerCase()}"><h2>${m.course} · ${names[m.course]}</h2><p class="boundary">范围：${esc(m.scope)}</p><ul class="note-list midterm-docs">${m.notes.map(n=>`<li><a href="${esc(url(m.course+'/'+n.file))}"><strong>${esc(n.label)}</strong><span>${esc(n.desc)}</span></a></li>`).join('')}</ul><p><a href="${BASE}${m.course}/">查看 ${m.course} 全部课程笔记 →</a></p></section>`).join('')}</main>`;
const kind=d=>{const f=path.basename(d.key);return midtermKeys.has(d.key)?'期中复习':/^HW|^Ex|^Sp/.test(f)?'作业与题解':/^Lab/.test(f)?'实验':/^T\d/.test(f)?'辅导':/^L\d/.test(f)?'课程伴读':/^ESTR/.test(f)?'拓展阅读':'阅读与复习';};
const title=d=>d.headings.find(h=>h.level===1)?.title||path.basename(d.key,'.md');
const link=d=>`<a href="${esc(url(d.key))}">${esc(path.basename(d.key,'.md'))}</a>`;
function shell(t,body,course='',article=false,seo={}){
 const canonical='https://vincejiang.com'+(seo.path||BASE+(course?course+'/':''));
 const label=(article?course+' · ':'')+t+' · Study';
 const description=seo.description||`${course?course+' '+names[course]+'：':''}${t}，Vince 的课程伴读、作业解析与复习笔记。`;
 const head=metadata({title:label,description,url:canonical,image:'https://vincejiang.com/assets/og.png',data:{'@context':'https://schema.org','@type':article?'LearningResource':'CollectionPage',name:t,description,url:canonical,inLanguage:'zh-CN',...(seo.updated?{dateModified:seo.updated}:{}),...(article?{author:{'@type':'Person',name:'Vince Jiang',url:'https://vincejiang.com/'}}:{})}});
 return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><script>${readFileSync(path.join(ROOT,'templates/study-theme.js'),'utf8')}</script><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(label)}</title>${head}<link rel="stylesheet" href="${BASE}study.css?v=${assetVersion('study.css')}"><link rel="stylesheet" href="${BASE}katex/katex.min.css"><script src="${BASE}study.js?v=${assetVersion('study.js')}" defer></script></head><body${article?' class="reading"':''}><a class="skip" href="#main">跳到正文</a><header><a class="brand" href="/">Vince Jiang</a><nav aria-label="面包屑"><a href="/study/">Study</a><span>/</span><a href="${BASE}">2026T1</a>${course?`<span>/</span><a href="${BASE}${course}/">${course}</a>`:''}</nav><label class="theme-control">外观<select id="study-theme" aria-label="Study 外观"><option value="system">跟随系统</option><option value="light">浅色</option><option value="dark">深色</option></select></label></header>${body}<footer>Vince 的课程学习笔记 · 原始课件留在本地 <a href="${BASE}">返回课程目录</a></footer></body></html>`;
}
export function buildStudy(out,{check=false}={}){
 const manifest=JSON.parse(readFileSync(path.join(ROOT,'tools/study-content/manifest.json'),'utf8'));
 const historyPath=path.join(ROOT,'posts-manifest.json');
 const history=existsSync(historyPath)?JSON.parse(readFileSync(historyPath,'utf8')).paths||{}:{};
 const docs=renderDocuments(manifest.map(d=>({...d,text:readFileSync(path.join(ROOT,'tools/study-content',d.key),'utf8')})));
 for(const key of midtermKeys)if(!docs.some(d=>d.key===key))throw new Error('Missing midterm document: '+key);
 const metrics={documents:docs.length,headings:docs.reduce((s,d)=>s+d.headings.length,0),anchors:docs.reduce((s,d)=>s+d.ids.size,0),formulas:docs.reduce((s,d)=>s+(d.html.match(/class="katex"/g)||[]).length,0)};
 if(check){console.error('study check ✓ '+JSON.stringify(metrics));return metrics;}
 const dest=path.join(out,'study/2026T1');mkdirSync(dest,{recursive:true});
 const write=(key,html)=>{const p=path.join(dest,key);mkdirSync(path.dirname(p),{recursive:true});writeFileSync(p,html);};
 for(const f of ['study.css','study.js'])cpSync(path.join(ROOT,'templates',f),path.join(dest,f));
 mkdirSync(path.join(dest,'katex'),{recursive:true});cpSync(path.join(ROOT,'tools/node_modules/katex/dist/katex.min.css'),path.join(dest,'katex/katex.min.css'));
 cpSync(path.join(ROOT,'tools/node_modules/katex/dist/fonts'),path.join(dest,'katex/fonts'),{recursive:true});
 cpSync(path.join(ROOT,'tools/node_modules/katex/LICENSE'),path.join(dest,'katex/LICENSE'));
 write('index.html',shell('2026T1 课程笔记',`<main id="main" class="landing"><p class="eyebrow">STUDY / 2026T1</p><h1>课程笔记</h1><p class="intro">从概念到推导，从例题到复习。</p>${midtermOverview()}<h2>全部课程</h2><div class="courses">${COURSES.map((c,i)=>`<a class="course" href="${BASE}${c}/"><span class="number">0${i+1}</span><span><b>${c}</b><strong>${names[c]}</strong><small>${docs.filter(d=>d.key.startsWith(c+'/')).length} 份笔记</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div><p class="boundary">按课程收录伴读、辅导、作业与实验解析。各篇保留原有资料版本；2026T1 是整理目录，部分笔记使用历史课件。</p></main>`));
 for(const c of COURSES){
  const ds=docs.filter(d=>d.key.startsWith(c+'/'));
  const groups=['期中复习','阅读与复习','课程伴读','辅导','作业与题解','实验','拓展阅读'].map(k=>({k,ds:ds.filter(d=>kind(d)===k)})).filter(g=>g.ds.length);
  const contents=groups.map(g=>`<section class="note-group"><h2>${g.k}<small>${g.ds.length}</small></h2><ul class="note-list">${g.ds.map(d=>`<li>${link(d)}</li>`).join('')}</ul></section>`).join('');
  write(`${c}/index.html`,shell(`${c} ${names[c]}`,`<main id="main" class="landing"><p class="eyebrow">${c} / ${ds.length} 份笔记</p><h1>${names[c]}</h1><label class="search">筛选笔记<input type="search" placeholder="输入讲次或主题…" aria-label="筛选课程笔记"></label><p id="filter-status" role="status"></p>${contents}</main>`,c));
  for(let i=0;i<ds.length;i++){
   const d=ds[i], hintMode=d.key.includes("分级提示"),updated=history['tools/study-content/'+d.key]?.slice(0,10);
   const nav=hintMode?`<p class="hint-boundary">提示模式 · 逐级展开<br><a href="${BASE}${c}/">返回课程目录（离开提示模式）</a></p>`:`<details class="course-nav"><summary>课程目录 · ${c}</summary><nav aria-label="课程目录">${groups.map(g=>`<h2>${g.k}</h2><ul>${g.ds.map(x=>`<li><a ${x===d?'aria-current="page" ':''}href="${esc(url(x.key))}">${esc(path.basename(x.key,'.md'))}</a></li>`).join('')}</ul>`).join('')}</nav></details>`;
   const toc=`<details class="toc"><summary>本文目录</summary><nav aria-label="本文目录"><ol>${d.headings.filter(h=>h.level>1&&h.level<=3).map(h=>`<li class="level-${h.level}"><a href="#${esc(encodeURIComponent(h.id))}">${esc(h.title)}</a></li>`).join('')}</ol></nav></details>`;
   write(d.key.replace(/\.md$/,'.html'),shell(title(d),`<div class="reading-layout"><aside>${nav}</aside><main id="main"><p class="eyebrow">${c} / ${kind(d)}${updated?` · 本站更新 <time datetime="${updated}">${updated}</time>`:''}</p><article>${d.html}</article>${hintMode?'':`<nav class="adjacent" aria-label="相邻笔记">${i?`<div><small>上一篇</small>${link(ds[i-1])}</div>`:'<div></div>'}${i<ds.length-1?`<div><small>下一篇</small>${link(ds[i+1])}</div>`:''}</nav>`}</main><aside>${toc}</aside></div>`,c,true,{path:url(d.key),updated,description:`${c} ${names[c]} · ${kind(d)}：${title(d)}。${hintMode?'分级提示逐级展开，先独立尝试，再按需继续。':d.headings.filter(h=>h.level===2).slice(0,4).map(h=>h.title).join('；')}`.slice(0,170)}));
  }
 }
 write('midterm/index.html',shell('期中复习',midtermPage(),'',false,{path:MIDTERM_PATH,description:'CSCI3130 Lec 1–6 与 CSCI3160 Warm Up 1–DP 4 的详细复习、简略总结及现有期中真题解析。'}));
 for(const [old,target] of Object.entries(OLD_MIDTERMS))write(old.replace(/\.md$/,'.html'),`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0; url=${esc(target)}"><link rel="canonical" href="https://vincejiang.com${esc(target.split('#')[0])}"><title>期中复习文档已更新</title></head><body><p>期中复习文档已更新。<a href="${esc(target)}">前往现行复习文档</a></p></body></html>`);
 mkdirSync(path.join(out,'study'),{recursive:true});writeFileSync(path.join(out,'study/index.html'),shell('课程学习笔记',`<main id="main" class="landing"><p class="eyebrow">STUDY</p><h1>课程学习笔记</h1><p class="intro">按课程理解概念与推导，按复习范围回顾重点。</p>${midtermOverview()}<section class="note-group"><h2>课程目录</h2><p><a href="${BASE}">2026T1 · 查看全部课程笔记 →</a></p><p class="boundary">收录 CSCI3130、CSCI3150、CSCI3160、CSCI3230 和 GENA2122 的课程伴读、辅导与作业解析。</p></section></main>`,'',false,{path:'/study/'}));
 console.error('study build ✓ '+JSON.stringify(metrics));return metrics;
}
if(process.argv[1]===fileURLToPath(import.meta.url))buildStudy(process.argv[2]||'/tmp/vince-study-preview',{check:process.argv.includes('--check')});
