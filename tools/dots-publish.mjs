// 输入是已审校、可公开的单期 JSON。此命令只更新内容；提交/推送沿用现有 Git 工作流。
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {validate} from './dots-validate.mjs';
const input=process.argv[2];if(!input)throw Error('用法: node tools/dots-publish.mjs /path/to/edition.json');
const path=fileURLToPath(new URL('../dots/content/index.json',import.meta.url));
const data=JSON.parse(readFileSync(path,'utf8'));const edition=JSON.parse(readFileSync(input,'utf8'));
if(edition.sample)throw Error('正式发布不能标记 sample');
const old=data.editions.findIndex(e=>e.id===edition.id);
if(old>=0){const previous=data.editions[old];if(previous.kind!==edition.kind||previous.date!==edition.date)throw Error('已发布期次不得改变类型或日期');const priorIds=previous.items.map(x=>x.id);if(priorIds.join()!==edition.items.map(x=>x.id).join())throw Error('修订应保留稳定条目 ID 与顺序，避免反馈归属改变');data.editions[old]=edition;}else data.editions.push(edition);
data.editions.sort((a,b)=>b.date.localeCompare(a.date));
console.log(validate(data));writeFileSync(path,JSON.stringify(data,null,2)+'\n');
