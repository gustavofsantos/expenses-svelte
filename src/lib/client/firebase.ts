// Import the functions you need from the SDKs you need
import type { FirebaseApp } from "firebase/app"
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { PUBLIC_apiKey, PUBLIC_authDomain, PUBLIC_projectId, PUBLIC_storageBucket, PUBLIC_messagingSenderId, PUBLIC_appId, PUBLIC_measurementId } from "$env/static/public"

const firebaseConfig = {
  apiKey: PUBLIC_apiKey,
  authDomain: PUBLIC_authDomain,
  projectId: PUBLIC_projectId,
  storageBucket: PUBLIC_storageBucket,
  messagingSenderId: PUBLIC_messagingSenderId,
  appId: PUBLIC_appId,
  measurementId: PUBLIC_measurementId
};

let app: FirebaseApp | undefined

// Initialize Firebase
if (getApps().length === 0) { 
  app = initializeApp(firebaseConfig);
}
  
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app as FirebaseApp);

