import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
const memory=()=>{const values=new Map();return {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k),clear:()=>values.clear()};};
globalThis.crypto??=webcrypto;
globalThis.localStorage=memory();globalThis.sessionStorage=memory();
const {localRegister,localLogin,validateRegistration,normalizeEmail}=await import('../js/local-auth.js');
test('Gmail normalization and registration validation',()=>{assert.equal(normalizeEmail(' Person@GMAIL.COM '),'person@gmail.com');assert.throws(()=>validateRegistration('x@fake.gmail.com','a-long-password','X'));assert.throws(()=>validateRegistration('x@gmail.com','short','X'));assert.throws(()=>validateRegistration('x@gmail.com','a-long-password',' '));});
test('registration hashes passwords, login survives normalized email, duplicate and wrong password rejected',async()=>{
 const id=await localRegister('Test.User@gmail.com','example-test-only-123','Test User');
 const persisted=localStorage.getItem('socialapp-local-accounts-v1');assert(!persisted.includes('example-test-only-123'));assert.equal(JSON.parse(persisted)[0].hash.length,32);
 assert.equal(await localLogin(' TEST.USER@GMAIL.COM ','example-test-only-123'),id);
 await assert.rejects(localRegister('test.user@gmail.com','example-test-only-999','Different'),/already registered/);
 await assert.rejects(localLogin('test.user@gmail.com','wrong-password'),/incorrect/);
});
test('consecutive bad passwords produce a temporary cooldown',async()=>{sessionStorage.clear();for(let i=0;i<5;i++)await assert.rejects(localLogin('missing@gmail.com','incorrect'),/incorrect/);await assert.rejects(localLogin('missing@gmail.com','incorrect'),/Too many attempts/);});
