import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBkpgctBOnNbC17RZa41ulKjaaM2atRQSo",
  authDomain: "fluttercrud-dce2f.firebaseapp.com",
  projectId: "fluttercrud-dce2f",
  storageBucket: "fluttercrud-dce2f.appspot.com",
  messagingSenderId: "276144804049",
  appId: "1:276144804049:web:4c6107f9d10072f0d135f0",
  measurementId: "G-MMEC8LCSTH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, analytics };
