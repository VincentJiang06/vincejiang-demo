// 同一条目的所有视图共用 pending；旧 GET 不能覆盖较新的点击或失败回退。
export class FeedbackState {
  constructor(){this.data={items:{}};this.pending=new Map();this.revision=0;}
  readToken(){return this.revision;}
  applySnapshot(data,token){if(token!==this.revision||this.pending.size)return false;this.data=data;return true;}
  begin(id,reaction){
    const item=this.data.items[id];
    if(!item||this.pending.has(id)||!['up','down','heart'].includes(reaction))return null;
    this.pending.set(id,structuredClone(item));this.revision++;
    const mine={up:false,down:false,heart:false,...item.mine};const value=!mine[reaction];
    const next={...mine,[reaction]:value};
    if(value&&reaction==='up')next.down=false;
    if(value&&reaction==='down')next.up=false;
    for(const key of ['up','down','heart'])item.counts[key]+=(Number(next[key])-Number(mine[key]));
    item.mine=next;return {id,reaction,value};
  }
  complete(id,result){if(!this.pending.has(id))return;this.data.items[id]=result;this.pending.delete(id);this.revision++;}
  rollback(id){if(!this.pending.has(id))return;this.data.items[id]=this.pending.get(id);this.pending.delete(id);this.revision++;}
}
