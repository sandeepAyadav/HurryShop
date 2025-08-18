import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginhurryshop.firebaseapp.com",
  projectId: "loginhurryshop",
  storageBucket: "loginhurryshop.firebasestorage.app",
  messagingSenderId: "669085137790",
  appId: "1:669085137790:web:9e851d6d4deb351131112f",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
