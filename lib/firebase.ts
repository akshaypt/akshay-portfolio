import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZbHsXajtoCp8lYWTxVsdpGy6YJ_62WGU",
  authDomain: "akshay-portfolio-dc9a5.firebaseapp.com",
  projectId: "akshay-portfolio-dc9a5",
  storageBucket: "akshay-portfolio-dc9a5.firebasestorage.app",
  messagingSenderId: "700989302625",
  appId: "1:700989302625:web:3415d915d2be55ef550720"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
