import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {esc} from './seo.mjs';
import MarkdownIt from 'markdown-it';
const {unescapeAll: decode} = new MarkdownIt().utils;
// Static demos have independent layouts. Supply missing metadata in the build only.
// Existing metadata, noindex redirects, editorial text and UI markup remain authoritative.
const text=s=>decode(s.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
export function enrichStaticPages(root,gallery){
 const walk=(dir,base='')=>{for(const entry of readdirSync(dir,{withFileTypes:true})){
  if(!base&&['dots','reactor-study'].includes(entry.name))continue;
  const file=join(dir,entry.name),rel=base+'/'+entry.name;
  if(entry.isDirectory()){walk(file,rel);continue;}
  if(!entry.name.endsWith('.html'))continue;
  let html=readFileSync(file,'utf8');
  if(!/<html\b/i.test(html)||/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html))continue;
  const existingTitle=html.match(/<title>([^<]+)<\/title>/i)?.[1];
  const title=existingTitle?decode(existingTitle):text(html.match(/<h[12]\b[^>]*>([\s\S]*?)<\/h[12]>/i)?.[1]||'');if(!title)continue;
  if(!existingTitle)html=html.replace(/<\/head>/i,`<title>${esc(title)}</title></head>`);
  const route=rel.replace(/index\.html$/,'');
  const url=new URL(route,'https://vincejiang.com').href;
  const existingMatch=html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*\bcontent=("([^"]*)"|'([^']*)')/i);
  const existing=existingMatch?decode(existingMatch[2]??existingMatch[3]):null;
  const item=gallery.find(g=>g.href===route);
  const body=html.split(/<body\b[^>]*>/i)[1]||'';
  const paragraph=body.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1];
  const desc=esc(existing||item?.desc||(title+' — '+text(paragraph||body).slice(0,140)));
  const fields=[['name','description',desc],['property','og:title',esc(title)],['property','og:description',desc],['property','og:url',esc(url)],['property','og:type','website'],['name','twitter:card','summary']];
  let additions='';
  if(!/<link\b[^>]*\brel=["']canonical["']/i.test(html))additions+=`<link rel="canonical" href="${esc(url)}">`;
  for(const [attr,key,value]of fields)if(!new RegExp(`<meta\\b[^>]*\\b${attr}=["']${key}["']`,'i').test(html))additions+=`<meta ${attr}="${key}" content="${value}">`;
  if(additions){html=html.replace(/<\/head>/i,additions+'\n</head>');writeFileSync(file,html);}
 }};walk(root);
}
