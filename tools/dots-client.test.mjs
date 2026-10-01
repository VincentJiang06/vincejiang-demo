import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FeedbackState} from '../dots/feedback-state.mjs';
import {validate} from './dots-validate.mjs';
const state=()=>{const s=new FeedbackState();s.applySnapshot({items:{a:{counts:{up:7,down:2,heart:3},mine:{up:false,down:true,heart:false}}}},s.readToken());return s;};
test('optimistic opinion switching and independent heart use the same stable item',()=>{
 const s=state();assert.deepEqual(s.begin('a','up'),{id:'a',reaction:'up',value:true});
 assert.deepEqual(s.data.items.a.counts,{up:8,down:1,heart:3});assert.deepEqual(s.data.items.a.mine,{up:true,down:false,heart:false});
 s.complete('a',structuredClone(s.data.items.a));assert.equal(s.pending.size,0);
 s.begin('a','heart');assert.deepEqual(s.data.items.a.counts,{up:8,down:1,heart:4});s.complete('a',structuredClone(s.data.items.a));
 assert.equal(s.begin('a','up').value,false);assert.deepEqual(s.data.items.a.counts,{up:7,down:1,heart:4});
});
test('pending blocks duplicate clicks and stale polling; failed requests restore confirmed state',()=>{
 const s=state();const before=structuredClone(s.data);const oldRead=s.readToken();s.begin('a','up');
 assert.equal(s.begin('a','heart'),null);assert.equal(s.applySnapshot({items:{}},oldRead),false);
 s.rollback('a');assert.deepEqual(s.data,before);assert.equal(s.pending.size,0);
 assert.equal(s.applySnapshot({items:{}},oldRead),false);assert.equal(s.applySnapshot(before,s.readToken()),true);
 assert.equal(s.begin('unknown','up'),null);
});
test('artwork allows only normalized Apple catalog CDN images; other public fields remain gated',()=>{
 const data=JSON.parse(readFileSync(new URL('../dots/content/index.json',import.meta.url)));
 const track=data.editions.find(e=>e.kind==='music').items[0];
 track.artwork='https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ee/fe/75/eefe75fe-7fe7-0dc4-d27d-9afc05527560/4712862000680.jpg/320x320bb.jpg';
 assert.doesNotThrow(()=>validate(data));
 for(const bad of ['https://evil.example/cover.jpg','http://is1-ssl.mzstatic.com/image/thumb/a/320x320bb.jpg','https://is1-ssl.mzstatic.com.evil.example/image/thumb/a/320x320bb.jpg','https://is1-ssl.mzstatic.com/image/thumb/a/320x320bb.jpg?token=secret','data:image/svg+xml,<svg/>']){track.artwork=bad;assert.throws(()=>validate(data));}
});
