import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {esc,metadata} from './seo.mjs';
import {validate} from './dots-validate.mjs';
const ORIGIN='https://dots.vincejiang.com';
const replaceRequired=(html,from,to)=>{if(!html.includes(from))throw new Error('Dots template marker missing: '+from);return html.replace(from,to);};
const kind=e=>e.kind==='hn'?'每日精读':'每周歌单';
const path=e=>`/editions/${encodeURIComponent(e.id)}/`;
const source=s=>`<li><a href="${esc(s.url)}" rel="noopener noreferrer">${esc(s.label)}</a></li>`;
const list=editions=>`<ul>${editions.map(e=>`<li><time datetime="${esc(e.date)}">${esc(e.date)}</time> · ${kind(e)} · <a href="${path(e)}">${esc(e.title)}</a><p>${esc(e.intro)}</p></li>`).join('')}</ul>`;
function shell(title,description,url,body,data){
 return `<!doctype html><html lang="zh-Hans"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · Dots</title>${metadata({title:title+' · Dots',description,url,data})}<link rel="icon" href="/mandy.svg"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/reading.css"></head><body><header class="header"><a class="brand" href="/">dots.</a><nav aria-label="主导航"><a href="/editions/">往期文章</a><a href="/#privacy">关于与隐私</a></nav></header><main class="static-reading">${body}</main><footer><a href="/">返回云朵书桌</a><a href="/editions/">全部期次</a></footer></body></html>`;
}
export function buildDots(dir){
 const data=JSON.parse(readFileSync(join(dir,'content/index.json'),'utf8'));validate(data);
 const editions=data.editions.filter(e=>!e.sample);
 const write=(p,s)=>{mkdirSync(join(dir,p),{recursive:true});writeFileSync(join(dir,p,'index.html'),s);};
 for(const e of editions){
  const url=ORIGIN+path(e);
  const body=`<p>${kind(e)} · <time datetime="${esc(e.date)}">${esc(e.date)}</time>（香港时间）</p><h1>${esc(e.title)}</h1><p class="intro">${esc(e.intro)}</p>${e.note?`<p>${esc(e.note)}</p>`:''}<p><a href="/#edition/${encodeURIComponent(e.id)}">打开互动版与反馈</a></p><nav aria-label="本期目录"><ol>${e.items.map(i=>`<li><a href="#${esc(i.id)}">${esc(i.title)}</a></li>`).join('')}</ol></nav>${e.items.map(i=>`<article id="${esc(i.id)}"><h2>${esc(i.title)}</h2>${i.category?`<p>${esc(i.category)}</p>`:''}${i.artist?`<p>${esc(i.artist)} · ${esc(i.album)} · 发行 ${esc(i.releaseDate)}</p>`:''}${i.preview?`<p>${esc(i.preview)}</p>`:''}${i.body.map(b=>`${b.heading?`<h3>${esc(b.heading)}</h3>`:''}<p>${esc(b.text)}</p>`).join('')}${i.takeaway?`<p class="takeaway">${esc(i.takeaway)}</p>`:''}<h3>来源</h3><ul>${i.sources.map(source).join('')}</ul></article>`).join('')}`;
  write('editions/'+e.id,shell(e.title,e.intro,url,body,{'@context':'https://schema.org','@type':'CollectionPage',name:e.title,description:e.intro,url,inLanguage:'zh-Hans',datePublished:e.date,hasPart:e.items.map(i=>({'@type':'CreativeWork',name:i.title,url:url+'#'+i.id,citation:i.sources.map(s=>s.url)}))}));
 }
 const desc='Dots 已发布的每日精读与每周歌单，保留每期正文、日期、判断边界与原始来源。';
 write('editions',shell('往期文章',desc,ORIGIN+'/editions/',`<h1>往期文章</h1><p>${desc}</p>${list(editions)}`,{'@context':'https://schema.org','@type':'CollectionPage',name:'Dots 往期文章',url:ORIGIN+'/editions/'}));
 let home=readFileSync(join(dir,'index.html'),'utf8');
 home=replaceRequired(home,'<p class="loading">正在打开书桌…</p>',`<div class="reading"><h1>Dots · Mandy 的云朵书桌</h1><p>每日精读与每周歌单，保留来源、争议与判断。</p>${list(editions)}<p><a href="/editions/">浏览全部文章</a></p></div>`);
 home=replaceRequired(home,'</head>','<meta property="og:title" content="Dots · Mandy 的云朵书桌"><meta property="og:description" content="每日精读与每周歌单，保留来源、争议与判断。"><meta property="og:url" content="'+ORIGIN+'/"><meta property="og:type" content="website"><meta name="twitter:card" content="summary"></head>');
 home=replaceRequired(home,'<a href="#privacy">关于与隐私</a>','<a href="/editions/">文章目录</a><a href="#privacy">关于与隐私</a>');
 home=replaceRequired(home,'请启用 JavaScript 来浏览精读、歌单与反馈。内容原始文件可在','完整文章可从上方目录阅读；互动和反馈需要 JavaScript。内容原始文件可在');
 writeFileSync(join(dir,'index.html'),home);
 writeFileSync(join(dir,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
 const urls=[ORIGIN+'/',ORIGIN+'/editions/',...editions.map(e=>ORIGIN+path(e))];
 writeFileSync(join(dir,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${esc(u)}</loc></url>`).join('')}</urlset>\n`);
}
