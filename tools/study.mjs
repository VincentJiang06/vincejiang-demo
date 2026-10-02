import MarkdownIt from 'markdown-it';
import texmath from 'markdown-it-texmath';
import katex from 'katex';
import hljs from 'highlight.js';
import path from 'node:path';
export const BASE='/study/2026T1/';
export const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const url=key=>BASE+key.replace(/\.md$/,'.html').split('/').map(x=>encodeURIComponent(x)).join('/');
const slug=s=>s.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu,'').trim().replace(/\s/g,'-');
const decode=s=>{try{return decodeURIComponent(s)}catch{return s}};
export function renderDocuments(docs) {
 const errors=[], byKey=new Map(docs.map(d=>[d.key,d]));
 if(byKey.size!==docs.length)throw new Error('duplicate document output key');
 const md=new MarkdownIt({html:false,linkify:true,highlight(code,lang){return `<pre class="hljs"><code>${lang&&hljs.getLanguage(lang)?hljs.highlight(code,{language:lang}).value:esc(code)}</code></pre>`;}});
 md.use(texmath,{engine:katex,delimiters:'dollars',katexOptions:{throwOnError:true,strict:'error',trust:false}});
 for(const type of Object.keys(md.renderer.rules).filter(x=>x.startsWith('math_'))){
  md.renderer.rules[type]=(tokens,i)=>{
   try{return katex.renderToString(tokens[i].content,{displayMode:type.includes('block')||type.includes('double'),throwOnError:true,strict:'error',trust:false});}
   catch(e){errors.push('math: '+e.message);return '';}
  };
 }
 // A narrow Markdown directive produces native, nested disclosures without raw HTML.
 md.block.ruler.before('fence','study_hint',(state,start,end,silent)=>{
  const line=state.src.slice(state.bMarks[start]+state.tShift[start],state.eMarks[start]);
  const open=line.match(/^:::hint (.+)$/), close=line===':::endhint';
  if(!open&&!close)return false;
  if(silent)return true;
  const t=state.push(open?'study_hint_open':'study_hint_close','details',open?1:-1);
  t.content=open?open[1]:'';t.map=[start,start+1];state.line=start+1;return true;
 },{alt:['paragraph']});
 md.renderer.rules.study_hint_open=(tokens,i)=>`<details class="study-hint"><summary>${esc(tokens[i].content)}</summary>\n`;
 md.renderer.rules.study_hint_close=()=>'</details>\n';
 // Only empty anchor elements are admitted; all other raw HTML stays escaped.
 md.inline.ruler.before('text','study_anchor',(state,silent)=>{
  const m=state.src.slice(state.pos).match(/^<a\s+(?:id|name)=["']([^"'<>]+)["']\s*><\/a>/i);
  if(!m)return false;
  if(!silent){const t=state.push('study_anchor','',0);t.content=m[1];}
  state.pos+=m[0].length;return true;
 });
 md.renderer.rules.study_anchor=(tokens,i)=>`<a id="${esc(tokens[i].content)}"></a>`;
 md.renderer.rules.table_open=()=>'<div class="table-scroll" tabindex="0"><table>';
 md.renderer.rules.table_close=()=>'</table></div>';
 // Parse all documents before resolving links, so forward references are checked.
 for(const d of docs){
  d.tokens=md.parse(d.text,{});d.ids=new Set();d.headings=[];
  let hintDepth=0;
  for(const token of d.tokens){
   if(token.type==='study_hint_open')hintDepth++;
   if(token.type==='study_hint_close'&&--hintDepth<0)errors.push(`${d.key}: unmatched hint closing directive`);
  }
  if(hintDepth>0)errors.push(`${d.key}: unclosed hint directive`);
  for(let i=0;i<d.tokens.length;i++){
   const t=d.tokens[i];
   for(const c of t.children||[])if(c.type==='study_anchor'){
    if(d.ids.has(c.content))errors.push(`${d.key}: duplicate anchor ${c.content}`);d.ids.add(c.content);
   }
  }
  for(let i=0;i<d.tokens.length;i++)if(d.tokens[i].type==='heading_open'){
   const t=d.tokens[i], inline=d.tokens[i+1], title=inline.children.filter(c=>!['study_anchor'].includes(c.type)).map(c=>c.content).join('');
   const base=slug(title)||'section';let id=base,n=0;while(d.ids.has(id))id=`${base}-${++n}`;
   d.ids.add(id);t.attrSet('id',id);d.headings.push({level:Number(t.tag.slice(1)),id,title});
  }
 }
 for(const d of docs){
  const rewrite=(href)=>{
   if(/^(https?:|mailto:)/i.test(href))return {href,external:true};
   if(/^[a-z]+:|^\/\//i.test(href))return {local:true};
   const [raw,fragment='']=decode(href).split('#');
   const key=raw?path.posix.normalize(path.posix.join(path.posix.dirname(d.key),raw)):d.key;
   const target=byKey.get(key);
   if(target){
    if(fragment&&!target.ids.has(fragment))errors.push(`${d.key}: missing anchor ${key}#${fragment}`);
    return {href:(raw?url(key):'')+(fragment?'#'+encodeURIComponent(fragment):'')};
   }
   if(/^(?:CSCI|GENA)\d+\/README\.md$/.test(key))return {href:BASE+key.split('/')[0]+'/'};
   if(/\.md$/i.test(raw)&&key.startsWith(d.key.split('/')[0]+'/')&&!/(?:记忆库|核验|README|更新记录)/.test(raw))errors.push(`${d.key}: missing document ${key}`);
   return {local:true,courseware:/\.(pdf|pptx?)(?:$|\?)/i.test(raw),page:fragment.match(/^page=(\d+)$/)?.[1]};
  };
  for(const t of d.tokens){
   const children=t.children||[];const stack=[];
   for(const c of children){
    if(c.type==='link_open'){
     const r=rewrite(c.attrGet('href'));stack.push(r);
     if(r.local){c.tag='span';c.attrs=[['class','local-reference']];}
     else {c.attrSet('href',decodeURI(r.href).replaceAll(' ', '%20'));if(r.external){c.attrSet('class','external');c.attrSet('rel','noopener noreferrer');}}
    } else if(c.type==='link_close'){
     const r=stack.pop();if(r?.local){c.tag='span';c.type='study_local_close';c.content=`（${r.courseware?'本地课件':'本地资料'}${r.page?' · p.'+r.page:''}）`;}
    } else if(c.type==='image'){c.type='study_image';c.content=c.content||'图片';}
   }
  }
  md.renderer.rules.study_local_close=(tokens,i)=>`${esc(tokens[i].content)}</span>`;
  md.renderer.rules.study_image=(tokens,i)=>`<span class="local-reference">${esc(tokens[i].content)}（本地素材，未公开）</span>`;
  d.html=md.renderer.render(d.tokens,md.options,{});
  if(/katex-error|class="texmath"/.test(d.html))errors.push(`${d.key}: invalid math`);
 }
 if(errors.length)throw new Error(errors.join('\n'));
 return docs;
}
