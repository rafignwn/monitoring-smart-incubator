import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAbJuAUCi1cY7vg3zH_7O6vTkw-R06vIcs",
  authDomain: "inkubator-ayam-97391.firebaseapp.com",
  projectId: "inkubator-ayam-97391",
  storageBucket: "inkubator-ayam-97391.appspot.com",
  databaseURL:
    "https://inkubator-ayam-97391-default-rtdb.asia-southeast1.firebasedatabase.app",
  messagingSenderId: "955565294100",
  appId: "1:955565294100:web:1c102234ff1a1178705d01",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const store = getFirestore(app);
