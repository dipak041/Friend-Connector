import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
const saved=new Map();
globalThis.crypto??=webcrypto;
globalThis.localStorage={getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)};
globalThis.sessionStorage={getItem:()=>null};
globalThis.window={addEventListener:()=>{}};
const store=await import('../js/store.js');
test('demo writes persist, watchers update, recipient queries filter, unsubscribe stops updates',async()=>{
 let rows=[],count=0;const stop=store.watch('messages',value=>{rows=value;count++},[['members','array-contains','a']]);
 const id=await store.add('messages',{members:['a','b'],authorId:'a',text:'hello'});
 await store.add('messages',{members:['c','d'],authorId:'c',text:'private'});
 assert.equal(rows.length,1);assert.equal(rows[0].text,'hello');
 assert.equal(JSON.parse(saved.get('socialapp-demo-v2')).messages.length,2);
 await store.remove('messages',id);assert.equal(rows.length,0);
 stop();const before=count;await store.add('messages',{members:['a','b'],text:'later'});assert.equal(count,before);
});
test('quota failure rejects writes and restores in-memory state',async()=>{
 const original=localStorage.setItem;localStorage.setItem=()=>{throw Error('Quota exceeded')};
 await assert.rejects(store.put('posts','quota-test',{caption:'should not persist'}),/storage is full/);
 localStorage.setItem=original;let rows;const stop=store.watch('posts',v=>rows=v);assert(!rows.some(x=>x.id==='quota-test'));stop();
});
