import { auth, db } from './config.js';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  setPersistence, 
  browserLocalPersistence 
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const provider = new GoogleAuthProvider();

// Inicializa a persistência local (usuário continua logado)
setPersistence(auth, browserLocalPersistence).catch(console.error);

const syncUserToFirestore = async (user) => {
  if (!user) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Guardião',
      lastLogin: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Erro ao sincronizar usuário:", error);
  }
};

export const loginWithGoogle = async () => {
  return await signInWithPopup(auth, provider);
};

export const loginWithEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      await syncUserToFirestore(user);
    }
    callback(user);
  });
};
