import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAOJ-WMPfuOcVJTxDh5S2FZpccrb74PdtE",
  authDomain: "expo23-1f526.firebaseapp.com",
  projectId: "expo23-1f526",
  storageBucket: "expo23-1f526.appspot.com",
  messagingSenderId: "706031052816",
  appId: "1:706031052816:web:45eb11a0009b77b2fc4295"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };