import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Optionally import the services that you want to use
import { getAuth } from "firebase/auth";
// import {...} from "firebase/database";
import { getFirestore, collection } from 'firebase/firestore';
// import {...} from "firebase/functions";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAF-yrJwpiodGLUsJX7x-3HwUN8R2-syCo",
    authDomain: "project-cd7e5.firebaseapp.com",
    projectId: "project-cd7e5",
    storageBucket: "project-cd7e5.appspot.com",
    messagingSenderId: "426126137112",
    appId: "1:426126137112:web:f3aa91a1434194f432b06d",
    storageBucket: "project-cd7e5.appspot.com"
  };
  

const app = initializeApp(firebaseConfig);
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


export const users = collection(db, 'users');
export const events = collection(db, 'events');

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
