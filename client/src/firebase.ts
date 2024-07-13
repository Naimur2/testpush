// Import the functions you need from the SDKs you need

import { getFirestore } from "@firebase/firestore";

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBxuIGJClpDh6hQvjXArRiXc_Nj90A_M3Q",
    authDomain: "easyresult-cda44.firebaseapp.com",
    projectId: "easyresult-cda44",
    storageBucket: "easyresult-cda44.appspot.com",
    messagingSenderId: "122474233674",
    appId: "1:122474233674:web:bd130339e12196f32a0bb3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app;
