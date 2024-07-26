// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCS5Eq3ePigNaIv3FhyR-b1yOfumAdItN0",
  authDomain: "random-31fd6.firebaseapp.com",
  projectId: "random-31fd6",
  storageBucket: "random-31fd6.appspot.com",
  messagingSenderId: "1035427563801",
  appId: "1:1035427563801:web:93eecf25f64a4148b1dd88",
  measurementId: "G-F3YNH0HF68"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);