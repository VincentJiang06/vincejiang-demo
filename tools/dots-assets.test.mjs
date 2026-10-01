import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,cpSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {versionDotsAssets} from './dots-assets.mjs';
const source=new URL('../dots/',import.meta.url);
test('build changes every Dots asset URL, including module imports; version follows content',()=>{
 const root=mkdtempSync(join(tmpdir(),'dots-assets-'));try{
  const first=join(root,'a'),second=join(root,'b');cpSync(source,first,{recursive:true});cpSync(source,second,{recursive:true});
  const v=versionDotsAssets(first);assert.match(v,/^[a-f0-9]{16}$/);assert.equal(versionDotsAssets(second),v);
  const html=readFileSync(join(first,'index.html'),'utf8'),app=readFileSync(join(first,'app.js'),'utf8');
  for(const file of ['app.js','style.css','feedback.css','mandy.svg'])assert.ok(html.includes('/'+file+'?v='+v));
  for(const file of ['feedback-state.mjs','media.mjs'])assert.ok(app.includes('./'+file+'?v='+v));
  assert.ok(app.includes('/mandy.svg?v='+v));
  cpSync(source,second,{recursive:true});writeFileSync(join(second,'style.css'),readFileSync(join(second,'style.css'),'utf8')+'\n/* changed */');
  assert.notEqual(versionDotsAssets(second),v);
 }finally{rmSync(root,{recursive:true,force:true});}
});
