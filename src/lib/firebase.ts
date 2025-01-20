import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBN8evoBiYQDIZ5xV-zdzbbpkC3TsKL_3o1",
  authDomain: "edi-avocats-5df83.firebaseapp.com",
  projectId: "edi-avocats-5df83",
  storageBucket: "edi-avocats-5df83.appspot.com",
  messagingSenderId: "112685461479487248042",
  appId: "1:112685461479487248042:web:5df83"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);