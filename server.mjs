import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('.',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'};
http.createServer(async(req,res)=>{try{const route=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+(route==='/'?'/index.html':route));if(!file.startsWith(root)||!['.html','.js','.css','.svg'].includes(path.extname(file)))throw Error();const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)],'X-Content-Type-Options':'nosniff'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(5173,'127.0.0.1',()=>console.log('SocialApp: http://127.0.0.1:5173'));
