import {firebaseConfig,useEmulators} from './firebase-config.js';
import {demoKey,seed} from './model.js';
import {uploadMedia} from './media-upload.js';
import {localRegister,localLogin,removeLocalAccount,normalizeEmail,validateRegistration} from './local-auth.js';
export const isDemo=!firebaseConfig;
let state,fs,auth,db,sdkAuth,authListener=()=>{};
const listeners=new Set();
const emit=()=>listeners.forEach(f=>f());
function read(){try{return {...seed(),...JSON.parse(localStorage.getItem(demoKey)||'null'),calls:JSON.parse(localStorage.getItem(demoKey)||'null')?.calls||[],candidates:JSON.parse(localStorage.getItem(demoKey)||'null')?.candidates||[]};}catch{return {...seed(),calls:[],candidates:[]};}}
if(isDemo){state=read();window.addEventListener('storage',e=>{if(e.key===demoKey){state=read();emit();}});}
const save=()=>{localStorage.setItem(demoKey,JSON.stringify(state));emit();};
export function subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);}
export async function initialize(onUser){authListener=onUser;if(isDemo){onUser(sessionStorage.getItem('socialapp-demo-user'));return;}
 const base='https://www.gstatic.com/firebasejs/11.10.0/';
 const app=await import(base+'firebase-app.js');
 [fs,sdkAuth]=await Promise.all([import(base+'firebase-firestore.js'),import(base+'firebase-auth.js')]);
 const instance=app.initializeApp(firebaseConfig);db=fs.getFirestore(instance);auth=sdkAuth.getAuth(instance);
 if(useEmulators){sdkAuth.connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});fs.connectFirestoreEmulator(db,'127.0.0.1',8080);}
 await sdkAuth.setPersistence(auth,sdkAuth.browserSessionPersistence);
 sdkAuth.onAuthStateChanged(auth,async user=>{if(user?.emailVerified){try{const ref=fs.doc(db,'users',user.uid);const existing=await fs.getDoc(ref);if(!existing.exists())await put('users',user.uid,{name:user.displayName||'New member',handle:'user_'+user.uid.slice(0,12).toLowerCase(),bio:'',avatar:'',createdAt:Date.now()});onUser(user.uid);}catch(error){window.dispatchEvent(new CustomEvent('app-error',{detail:error.message}));onUser(null);}}else onUser(null);});
}
export async function login(email,password){email=normalizeEmail(email);if(isDemo){const id=await localLogin(email,password);sessionStorage.setItem('socialapp-demo-user',id);authListener(id);return;}
 const credential=await sdkAuth.signInWithEmailAndPassword(auth,email,password);if(!credential.user.emailVerified){await sdkAuth.signOut(auth);throw Error('Please verify your email first. Use Resend verification if you need a new link.');}}
export async function register(email,password,name){email=normalizeEmail(email);validateRegistration(email,password,name);if(isDemo){const id=await localRegister(email,password,name);try{await put('users',id,{name:name.trim(),handle:'user_'+id.replaceAll('-','').slice(0,12),bio:'',avatar:'',createdAt:Date.now()});}catch(error){removeLocalAccount(id);throw error;}return;}
 const credential=await sdkAuth.createUserWithEmailAndPassword(auth,email,password);
 try{await sdkAuth.updateProfile(credential.user,{displayName:name.trim()});await sdkAuth.sendEmailVerification(credential.user);}finally{await sdkAuth.signOut(auth);}
}
export async function resendVerification(email,password){if(isDemo)throw Error('Local test accounts cannot send email. Connect Firebase for verification.');const c=await sdkAuth.signInWithEmailAndPassword(auth,normalizeEmail(email),password);try{if(!c.user.emailVerified)await sdkAuth.sendEmailVerification(c.user);}finally{await sdkAuth.signOut(auth);}}
export async function resetPassword(email){if(isDemo)throw Error('Email reset needs Firebase. Local test accounts cannot send email.');return sdkAuth.sendPasswordResetEmail(auth,normalizeEmail(email));}
export async function demoLogin(id='demo-dipak'){if(!isDemo||!['demo-dipak','demo-aarya','demo-rohan'].includes(id))throw Error('Only sample profiles can be switched without a password.');sessionStorage.setItem('socialapp-demo-user',id);authListener(id);}
export async function logout(){if(isDemo){sessionStorage.removeItem('socialapp-demo-user');authListener(null);}else await sdkAuth.signOut(auth);}
export function watch(name,callback,filters=[],onError=console.error){if(isDemo){const run=()=>callback((state[name]||[]).filter(row=>filters.every(([key,op,value])=>op==='array-contains'?row[key]?.includes(value):row[key]===value)));run();return subscribe(run);}
 const q=fs.query(fs.collection(db,name),...filters.map(f=>fs.where(...f)));
 return fs.onSnapshot(q,snapshot=>callback(snapshot.docs.map(d=>({...d.data(),id:d.id}))),onError);
}
function mutate(fn){state=read();const previous=structuredClone(state);fn();try{save();}catch(e){state=previous;throw Error('Demo storage is full. Delete some media or choose a smaller file.');}}
export async function put(name,id,data){if(isDemo){mutate(()=>{state[name]??=[];const next={...data,id},i=state[name].findIndex(v=>v.id===id);if(i<0)state[name].push(next);else state[name][i]=next;});return id;}await fs.setDoc(fs.doc(db,name,id),data);return id;}
export async function patch(name,id,data){if(isDemo){mutate(()=>{const item=state[name]?.find(v=>v.id===id);if(!item)throw Error('This item no longer exists.');Object.assign(item,data);});}else await fs.updateDoc(fs.doc(db,name,id),data);}
export async function add(name,data){const id=crypto.randomUUID();await put(name,id,data);return id;}
export async function remove(name,id){if(isDemo){mutate(()=>{state[name]=(state[name]||[]).filter(x=>x.id!==id);});}else await fs.deleteDoc(fs.doc(db,name,id));}
export async function upload(file){return uploadMedia(file);}
