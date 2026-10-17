import test from 'node:test';
import assert from 'node:assert/strict';
import {uploadMedia} from '../js/media-upload.js';

const secureUrl = 'https://res.cloudinary.com/zlvzklj5/image/upload/v1/test.png';
const file = new File(['test'], 'test.png', {type:'image/png'});
test('Cloudinary sends multipart image/video and returns secure_url', async t => {
  const calls=[];
  t.mock.method(globalThis,'fetch',async (url,options)=>{calls.push({url,options});return {ok:true,json:async()=>({secure_url:secureUrl})};});
  for(const media of [file,new File(['video'],'test.mp4',{type:'video/mp4'})]) {
    assert.equal(await uploadMedia(media),secureUrl);
    const {url,options}=calls.at(-1);
    assert.equal(url,'https://api.cloudinary.com/v1_1/zlvzklj5/auto/upload');
    assert.equal(options.method,'POST');
    assert.equal(options.body.get('upload_preset'),'social_uploads');
    assert.equal(options.body.get('file').name,media.name);
    assert.equal(options.headers,undefined);
  }
});
test('Cloudinary failures and invalid URLs reject instead of saving invalid media',async t=>{
  const results=[
    {ok:false,status:400,json:async()=>({error:{message:'Upload preset not found'}})},
    {ok:true,json:async()=>({})},
    {ok:true,json:async()=>({secure_url:'http://res.cloudinary.com/zlvzklj5/test'})},
    {ok:true,json:async()=>{throw Error('not JSON');}}
  ];
  t.mock.method(globalThis,'fetch',async()=>results.shift());
  await assert.rejects(uploadMedia(file),/Upload preset not found/);
  await assert.rejects(uploadMedia(file),/valid secure media URL/);
  await assert.rejects(uploadMedia(file),/valid secure media URL/);
  await assert.rejects(uploadMedia(file),/invalid response/);
});
test('invalid media is rejected before any request',async t=>{
  const request=t.mock.method(globalThis,'fetch',async()=>{throw Error('unexpected request');});
  await assert.rejects(uploadMedia(new File(['bad'],'bad.html',{type:'text/html'})),/Choose a/);
  await assert.rejects(uploadMedia({type:'video/mp4',size:21*1024*1024}),/20 MB/);
  assert.equal(request.mock.callCount(),0);
});
test('network failure gives an actionable upload error',async t=>{
  t.mock.method(globalThis,'fetch',async()=>{throw new TypeError('Failed to fetch');});
  await assert.rejects(uploadMedia(file),/Could not reach Cloudinary/);
});
