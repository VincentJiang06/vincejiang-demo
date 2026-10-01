import {readdirSync,readFileSync,writeFileSync,mkdirSync,lstatSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
export const COURSES=['CSCI3130','CSCI3150','CSCI3160','CSCI3230'];
export const isNote=p=>p.endsWith('.md')&&!p.split('/').some(x=>['核验','记忆库','PDF','AGENTS.md','CLAUDE.md','更新记录.md'].includes(x))&&p!=='README.md';
export function publicText(s){
 return s.split('\n').filter(l=>!/^(- 编写：|本次来源核对范围|本次范围内索引共有|原件已归档，工作包已解压|.*`study\/exercise\/` 是用户明确指定)/.test(l))
 .join('\n')
 .replace(/(?:使用|按) \*\*vince-course-study [\d.]+\*\* (?:编写，[^。]+。|从原始 PDF 全新编写，)/g,'')
 .replace(/\/Users\/[^/\s`）)]+\//g,'课程工作目录/')
 .replace(/；旧版 study 已整体备份，不再混入当前正文。/g,'。')
 .replace(/；Tutorial只复用记忆条目。/g,'。')
 .replace(/(?:这个边界说明不进入讲义记忆库。|不将这个反向推论写进课程记忆库。|；它们不进入概念记忆库。|，本 Lab 不重复造新条目。|；外部材料不新增到讲义记忆库。)/g,'')
 .replace(/补充内容不进入讲义记忆库。/g,'补充内容。')
 .replace(/记忆库/g,'课程索引')
 .replace(/本次重写的 /g,'')
 .replace(/\n{3,}/g,'\n\n');
}
function walk(dir,rel=''){
 return readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
  if(e.isSymbolicLink())throw new Error('Symlinks are not eligible: '+path.join(dir,e.name));
  const key=rel?rel+'/'+e.name:e.name;
  if(e.isDirectory())return ['核验','记忆库','PDF'].includes(e.name)?[]:walk(path.join(dir,e.name),key);
  return isNote(key)?[key]:[];
 });
}
export function importNotes(desktop,dest){
 const report=[];
 for(const course of COURSES){
  const root=path.join(desktop,course,'study');
  if(lstatSync(path.dirname(root)).isSymbolicLink()||lstatSync(root).isSymbolicLink())throw new Error('study must be a real directory');
  const files=walk(root).sort((a,b)=>a.localeCompare(b,'zh-CN',{numeric:true}));
  for(const rel of files){
   const source=readFileSync(path.join(root,rel),'utf8');let text=publicText(source);
   if(course==='CSCI3160'&&rel==='exercise/Ex02-分治与线性合并.md')text=text.replaceAll('${a,b\\}$','$\\{a,b\\}$').replaceAll('${c,d\\}$','$\\{c,d\\}$');
   if(course==='CSCI3230'&&rel==='L05-P4-层次聚类.md')text=text.replaceAll('\\rvertd','\\rvert d');
   if(rel==='阅读导航.md'&&course!=='CSCI3160'){
    const boundary={CSCI3130:'各讲保留原有来源与考试证据说明。',CSCI3150:'L00–L02 与 Lab01 为 2026T1；L03–L06、L08–L15 为 2022 未核版；T01–T12 为 2025T2。',CSCI3230:'L01–L05 为 2026T1；L06–L10 为 2025T1 历史预习资料。正文保留各自版本和页码说明。'}[course];
    text=`# ${course} 阅读导航\n\n${boundary}\n\n`+files.filter(f=>f!==rel).map(f=>`- [${f.replace(/\.md$/,'')}](${f.replaceAll(' ','%20')})`).join('\n')+'\n';
   }
   // Memory paths are internal even when their visible labels are course concepts.
   text=text.replace(/\]\(([^)\n]*课程索引[^)\n]*)\)/g,'](local:course-index)');
   if(/vince-course|AGENTS\.md|CLAUDE\.md|\/Users\//.test(text))throw new Error('Review metadata in '+course+'/'+rel);
   const out=path.join(dest,course,rel);mkdirSync(path.dirname(out),{recursive:true});writeFileSync(out,text);
   report.push({key:course+'/'+rel,sourceSha256:createHash('sha256').update(source).digest('hex'),publishedSha256:createHash('sha256').update(text).digest('hex'),projection:source!==text});
  }
 }
 writeFileSync(path.join(dest,'manifest.json'),JSON.stringify(report,null,2)+'\n');
 return report;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const desktop=process.argv[2];if(!desktop)throw new Error('Usage: node tools/study-import.mjs /path/to/Desktop');
 const result=importNotes(desktop,fileURLToPath(new URL('./study-content/',import.meta.url)));
 console.log(JSON.stringify(Object.fromEntries(COURSES.map(c=>[c,result.filter(d=>d.key.startsWith(c+'/')).length]))));
}
