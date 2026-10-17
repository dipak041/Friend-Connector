// Public Firebase Web app configuration. Access is enforced by Auth and server rules.
export const useEmulators = typeof location !== 'undefined'
  && ['localhost','127.0.0.1'].includes(location.hostname)
  && new URLSearchParams(location.search).get('backend') === 'emulator';
export const cloudConfig = {
  apiKey: 'AIzaSyDfimwWwKOGLUQACF9dkazL09F54mmPCYI',
  authDomain: 'ad-connector-40cd0.firebaseapp.com',
  projectId: 'ad-connector-40cd0',
  messagingSenderId: '1091640419960',
  appId: '1:1091640419960:web:7bbc6a2c91d0ff1845ef8d',
  measurementId: 'G-QGZP35TK2H'
};
const localTest = typeof location !== 'undefined'
  && ['localhost','127.0.0.1'].includes(location.hostname)
  && new URLSearchParams(location.search).get('backend') === 'local';
export const firebaseConfig = useEmulators
  ? {apiKey:'demo-socialapp-key',projectId:'demo-socialapp',authDomain:'localhost',appId:'1:123:web:socialapp'}
  : localTest ? null : cloudConfig;

// Add your own short-lived TURN configuration for reliable calls across networks.
// Never commit a long-lived TURN password. Fetch temporary credentials from a backend.
export const rtcConfig = {iceServers:[{urls:'stun:stun.l.google.com:19302'}]};
