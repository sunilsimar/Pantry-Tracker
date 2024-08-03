import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCavi5kJH1TP-YPUWZd83JGxxuJlAlXxSo",
  authDomain: "inventory-management-dfa12.firebaseapp.com",
  projectId: "inventory-management-dfa12",
  storageBucket: "inventory-management-dfa12.appspot.com",
  messagingSenderId: "485546582517",
  appId: "1:485546582517:web:21093f2abdb478f40a00bc",
  measurementId: "G-014N4XG6XZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);;
const firestore = getFirestore(app);

export {firestore}