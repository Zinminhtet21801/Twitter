import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCCNcOA6R46_3sRnq5D7DfhZhiMD-hKy3U",
  authDomain: "twitter-clone-81d02.firebaseapp.com",
  projectId: "twitter-clone-81d02",
  storageBucket: "twitter-clone-81d02.appspot.com",
  messagingSenderId: "934290099972",
  appId: "1:934290099972:web:48ec535f7cd2ab4a2b0a51",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
