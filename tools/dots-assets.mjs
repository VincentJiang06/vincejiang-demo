import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
// Run only on freshly copied build output. Source remains convenient for local previews.
export function versionDotsAssets(dir){
 const files=['app.js','style.css','feedback.css','feedback-state.mjs','media.mjs','mandy.svg'];
 const hash=createHash('sha256');for(const file of files){hash.update(file+'\0');hash.update(readFileSync(join(dir,file)));}
 const version=hash.digest('hex').slice(0,16);
 for(const file of ['index.html','app.js']){
  let text=readFileSync(join(dir,file),'utf8');
  for(const asset of files)text=text.replaceAll('/'+asset,'/'+asset+'?v='+version);
  writeFileSync(join(dir,file),text);
 }
 return version;
}
