import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBO2oatMglT5KDFDZ4RqYO4mAdE8Zqru6M",
  authDomain: "auth-flipbook.firebaseapp.com",
  projectId: "auth-flipbook",
  storageBucket: "auth-flipbook.appspot.com",
  messagingSenderId: "679487923819",
  appId: "1:679487923819:web:a49c5ea29ec82f6c15732e",
  measurementId: "G-807G5NZRKM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };