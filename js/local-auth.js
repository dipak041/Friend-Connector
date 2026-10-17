// Browser-only testing identity. This is NOT server authentication or email verification.
const KEY='socialapp-local-accounts-v1';
const encoder=new TextEncoder();
export function normalizeEmail(email){return String(email).trim().toLowerCase();}
export function validateRegistration(email,password,name){
 if(!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail\.com$/.test(normalizeEmail(email)))throw Error('Use your Gmail address (name@gmail.com).');
 if(!name.trim()||name.trim().length>50)throw Error('Enter a name between 1 and 50 characters.');
 if(password.length<10||password.length>128)throw Error('Use a password between 10 and 128 characters.');
}
async function derive(password,salt){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new Uint8Array(salt),iterations:600000,hash:'SHA-256'},key,256);return Array.from(new Uint8Array(bits));}
const accounts=()=>JSON.parse(localStorage.getItem(KEY)||'[]');
export async function localRegister(email,password,name){email=normalizeEmail(email);validateRegistration(email,password,name);const list=accounts();if(list.some(a=>a.email===email))throw Error('This email is already registered in this browser. Please log in.');const salt=Array.from(crypto.getRandomValues(new Uint8Array(16))),hash=await derive(password,salt),id=crypto.randomUUID();const current=accounts();if(current.some(a=>a.email===email))throw Error('This email is already registered.');localStorage.setItem(KEY,JSON.stringify([...current,{id,email,salt,hash}]));return id;}
export function removeLocalAccount(id){localStorage.setItem(KEY,JSON.stringify(accounts().filter(a=>a.id!==id)));}
export async function localLogin(email,password){const key='socialapp-local-attempts',attempts=JSON.parse(sessionStorage.getItem(key)||'{"count":0,"until":0}');if(attempts.until>Date.now())throw Error('Too many attempts. Wait one minute before trying again.');const account=accounts().find(a=>a.email===normalizeEmail(email));const computed=await derive(password,account?.salt||Array(16).fill(0));let different=account?0:1;for(let i=0;i<32;i++)different|=computed[i]^(account?.hash[i]||0);if(different){const count=Date.now()-(attempts.started||0)>60000?1:attempts.count+1;sessionStorage.setItem(key,JSON.stringify({count,started:count===1?Date.now():attempts.started,until:count>=5?Date.now()+60000:0}));throw Error('Email or password is incorrect.');}sessionStorage.removeItem(key);return account.id;}
