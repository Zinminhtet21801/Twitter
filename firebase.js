import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA3cZEleiglcDJjNPc0LdwbYT5oZzZGacc",
  authDomain: "twitter-clone-a4fbc.firebaseapp.com",
  projectId: "twitter-clone-a4fbc",
  storageBucket: "twitter-clone-a4fbc.appspot.com",
  messagingSenderId: "816044662732",
  appId: "1:816044662732:web:65326c718516f677da8769",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
