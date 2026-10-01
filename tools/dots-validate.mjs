import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {safeArtwork} from '../dots/media.mjs';
const keys=(value,allowed)=>{assert(value&&typeof value==='object'&&!Array.isArray(value));for(const k of Object.keys(value))assert(allowed.includes(k),`不允许的公开字段: ${k}`);};
const text=(value)=>assert(typeof value==='string'&&value.trim().length>0,'缺少正文/标题');
const date=(value)=>{assert(/^\d{4}-\d{2}-\d{2}$/.test(value),'日期格式');assert(new Date(value).toISOString().slice(0,10)===value,'日期无效');};
export function validate(data){
 keys(data,['schema','timezone','editions','examples']);assert.equal(data.schema,'dots.content/1');assert.equal(data.timezone,'Asia/Hong_Kong');assert(Array.isArray(data.editions));assert(Array.isArray(data.examples));
 const ids=new Set();const unique=(id)=>{assert(typeof id==='string'&&/^[a-z0-9][a-z0-9-]{2,119}$/.test(id),`不合法 ID: ${id}`);assert(!ids.has(id),`重复 ID: ${id}`);ids.add(id);};
 for(const e of [...data.editions,...data.examples]){keys(e,['id','kind','date','title','intro','note','items','sample']);unique(e.id);assert(['hn','music'].includes(e.kind));text(e.title);text(e.intro);if(e.sample){assert(data.examples.includes(e),'示例不得混入正式内容');}else{date(e.date);assert(data.editions.includes(e));}
 assert(Array.isArray(e.items)&&e.items.length>0&&e.items.length<=50);if(e.kind==='hn'&&!e.sample)assert.equal(e.items.length,10,'正式 HN 必须十篇');
 for(const i of e.items){keys(i,['id','title','category','body','takeaway','sources','artist','album','releaseDate','durationMs','catalogId','artwork','preview']);unique(i.id);text(i.title);if(i.artwork!==undefined)assert(safeArtwork(i.artwork),'封面必须是核验的 Apple CDN 固定尺寸 URL');if(i.preview!==undefined)text(i.preview);assert(Array.isArray(i.body)&&i.body.length>0);for(const b of i.body){keys(b,['heading','text']);if(b.heading)text(b.heading);text(b.text);}assert(Array.isArray(i.sources));if(!e.sample)assert(i.sources.length>0,'正式内容必须有来源');for(const s of i.sources){keys(s,['label','url']);text(s.label);assert.equal(new URL(s.url).protocol,'https:');}if(e.kind==='music'&&!e.sample){text(i.artist);text(i.album);date(i.releaseDate);assert(Number.isInteger(i.durationMs)&&i.durationMs>0);assert(i.sources.some(s=>new URL(s.url).hostname==='music.apple.com'),'必须有官方曲目链接');}if(e.kind==='hn'&&!e.sample){text(i.takeaway);assert(i.sources.some(s=>new URL(s.url).hostname==='news.ycombinator.com'),'必须保留 HN 讨论');}}
 }
 return {editions:data.editions.length,items:data.editions.reduce((n,e)=>n+e.items.length,0)};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const path=process.argv[2]||fileURLToPath(new URL('../dots/content/index.json',import.meta.url));console.log(validate(JSON.parse(readFileSync(path,'utf8'))));}
