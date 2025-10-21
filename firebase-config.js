
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
// import { apps } from "firebase-admin";

const firebaseConfig = {
  apiKey: "AIzaSyBNb8ROVYEg6DRs8cVqeWDp3tssD_C-jM8",
  authDomain: "orderbyus-8449b.firebaseapp.com",
  databaseURL: "https://orderbyus-8449b-default-rtdb.firebaseio.com",
  projectId: "orderbyus-8449b",
  storageBucket: "orderbyus-8449b.appspot.com",
  messagingSenderId: "995565405926",
  appId: "1:995565405926:web:c35ec26d6ae621f1ff9d27",
  measurementId: "G-2VLL6Y8PPD"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const database = getFirestore(firebaseApp);


//for mobile

export const authentication = getAuth(firebaseApp);


// export const firebaseApp = ()=>{
//     if(!apps.length)
//     {
//         initializeApp(firebaseConfig);
//     }
// }

// if (!firebase.apps.length) {
//     firebase.initializeApp(clientCredentials);
// }
