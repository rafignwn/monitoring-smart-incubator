import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig: FirebaseOptions = {
//   apiKey: "AIzaSyAbJuAUCi1cY7vg3zH_7O6vTkw-R06vIcs",
//   authDomain: "inkubator-ayam-97391.firebaseapp.com",
//   projectId: "inkubator-ayam-97391",
//   storageBucket: "inkubator-ayam-97391.appspot.com",
//   databaseURL:
//     "https://inkubator-ayam-97391-default-rtdb.asia-southeast1.firebasedatabase.app",
//   messagingSenderId: "955565294100",
//   appId: "1:955565294100:web:1c102234ff1a1178705d01",
// };

const firebaseConfig: FirebaseOptions = {
  databaseURL:
    "https://smart-inkubator-default-rtdb.asia-southeast1.firebasedatabase.app/",
  apiKey: "AIzaSyAOioZEd1Ib6yIYkdKqaJszw51dJKaJhHE",
  authDomain: "smart-inkubator.firebaseapp.com",
  projectId: "smart-inkubator",
  storageBucket: "smart-inkubator.appspot.com",
  messagingSenderId: "766232858893",
  appId: "1:766232858893:web:47d2d3eb7b366343f12044",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const store = getFirestore(app);
