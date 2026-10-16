import test from 'node:test';
import assert from 'node:assert/strict';
import {escapeHTML,chatId,activeStories,validateMedia,seed} from '../js/model.js';
test('user content cannot inject HTML or break attributes',()=>{assert.equal(escapeHTML('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');});
test('both participants resolve the same conversation',()=>assert.equal(chatId('z','a'),chatId('a','z')));
test('expired stories disappear at the exact expiration boundary',()=>assert.deepEqual(activeStories([{id:1,expiresAt:100},{id:2,expiresAt:101}],100),[{id:2,expiresAt:101}]));
test('reject executable files and oversized media',()=>{assert.throws(()=>validateMedia({type:'text/html',size:100}));assert.throws(()=>validateMedia({type:'image/svg+xml',size:100}));assert.throws(()=>validateMedia({type:'image/png',size:21*1024*1024}));assert.doesNotThrow(()=>validateMedia({type:'video/mp4',size:200}));});
test('seeded posts and stories belong to existing demo users',()=>{const s=seed();assert.equal(s.users.length,3);for(const p of [...s.posts,...s.stories])assert(s.users.some(u=>u.id===p.authorId));});
