import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAkjiV3_tZttHSBf5ld4OlOdfkh7x5rQoQ",
  authDomain: "moonark-project.firebaseapp.com",
  projectId: "moonark-project",
  storageBucket: "moonark-project.firebasestorage.app",
  messagingSenderId: "840317116694",
  appId: "1:840317116694:web:a5fa3f9e694ba86ed0b037",
  measurementId: "G-N11PH1EBSD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.log('Analytics could not be initialized.', e);
}

export { app, auth, db, analytics };
