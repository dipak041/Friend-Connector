import {firebaseConfig} from './firebase-config.js';
import {demoKey,seed,validateMedia} from './model.js';
export const isDemo=!firebaseConfig;
let state,fs,auth,db,storage,sdkAuth,sdkStorage;
const listeners=new Set();
const emit=()=>listeners.forEach(f=>f());
function read(){try{return JSON.parse(localStorage.getItem(demoKey))||seed();}catch{return seed();}}
if(isDemo){state=read();window.addEventListener('storage',e=>{if(e.key===demoKey){state=read();emit();}});}
const save=()=>{localStorage.setItem(demoKey,JSON.stringify(state));emit();};
export function subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);}
export async function initialize(onUser){if(isDemo){onUser(sessionStorage.getItem('socialapp-demo-user'));return;}
 const base='https://www.gstatic.com/firebasejs/11.10.0/';
 const app=await import(base+'firebase-app.js');
 [fs,sdkAuth,sdkStorage]=await Promise.all([import(base+'firebase-firestore.js'),import(base+'firebase-auth.js'),import(base+'firebase-storage.js')]);
 const instance=app.initializeApp(firebaseConfig);db=fs.getFirestore(instance);auth=sdkAuth.getAuth(instance);storage=sdkStorage.getStorage(instance);
 sdkAuth.onAuthStateChanged(auth,user=>onUser(user?.uid||null));
}
export async function login(email,password){return sdkAuth.signInWithEmailAndPassword(auth,email,password);}
export async function register(email,password,name){const credential=await sdkAuth.createUserWithEmailAndPassword(auth,email,password);await put('users',credential.user.uid,{name,handle:credential.user.uid.slice(0,12).toLowerCase(),bio:'',avatar:'',createdAt:Date.now()});return credential;}
export async function resetPassword(email){return sdkAuth.sendPasswordResetEmail(auth,email);}
export async function demoLogin(id='demo-dipak'){sessionStorage.setItem('socialapp-demo-user',id);location.reload();}
export async function logout(){if(isDemo){sessionStorage.removeItem('socialapp-demo-user');location.reload();}else await sdkAuth.signOut(auth);}
export function watch(name,callback,filters=[],onError=console.error){if(isDemo){const run=()=>callback(state[name].filter(row=>filters.every(([key,op,value])=>op==='array-contains'?row[key]?.includes(value):row[key]===value)));run();return subscribe(run);}
 const q=fs.query(fs.collection(db,name),...filters.map(f=>fs.where(...f)));
 return fs.onSnapshot(q,snapshot=>callback(snapshot.docs.map(d=>({...d.data(),id:d.id}))),onError);
}
export async function put(name,id,data){if(isDemo){const next={...data,id};const i=state[name].findIndex(v=>v.id===id);const previous=structuredClone(state);if(i<0)state[name].push(next);else state[name][i]=next;try{save();}catch(e){state=previous;throw Error('Demo storage is full. Use smaller media or delete some posts.');}return id;}await fs.setDoc(fs.doc(db,name,id),data);return id;}
export async function add(name,data){const id=crypto.randomUUID();await put(name,id,data);return id;}
export async function remove(name,id){if(isDemo){state[name]=state[name].filter(x=>x.id!==id);save();}else await fs.deleteDoc(fs.doc(db,name,id));}
export async function upload(file,uid){validateMedia(file);if(isDemo){if(file.size>2*1024*1024)throw Error('Demo media limit is 2 MB per file. Firebase mode supports 20 MB.');return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});}const reference=sdkStorage.ref(storage,`media/${uid}/${crypto.randomUUID()}`);await sdkStorage.uploadBytes(reference,file);return sdkStorage.getDownloadURL(reference);}
