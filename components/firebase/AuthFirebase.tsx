import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'yourapp.firebaseapp.com',
  projectId: 'yourapp',
  storageBucket: 'yourapp.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abcdefg',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function AuthFirebase() {
  const login = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };
  return <button onClick={login}>Login with Google</button>;
}
