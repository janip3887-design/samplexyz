import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBddTdGaUtrbIhdtJ8a8qDCc904UyUX1JA",
  authDomain: "velmora-grand--palace.firebaseapp.com",
  projectId: "velmora-grand--palace",
  storageBucket: "velmora-grand--palace.firebasestorage.app",
  messagingSenderId: "119591275262",
  appId: "1:119591275262:web:6dab8710f0622d1f5e33af",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
