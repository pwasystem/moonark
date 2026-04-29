import { db } from './firebase/config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import { 
  loginWithGoogle as firebaseLoginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  logout, 
  subscribeToAuthChanges 
} from './firebase/auth.js';

// ---- Autenticação UI ----
const authModal = document.getElementById('authModal');

window.openAuthModal = () => {
  if (authModal) authModal.classList.remove('hidden');
};

window.closeAuthModal = () => {
  if (authModal) authModal.classList.add('hidden');
};

const showError = (msg) => {
  const errEl = document.getElementById('authError');
  if (errEl) {
    errEl.innerText = msg;
    errEl.classList.remove('hidden');
  } else {
    alert(msg);
  }
};

window.loginWithGoogle = async () => {
  try {
    await firebaseLoginWithGoogle();
    window.closeAuthModal();
  } catch (error) {
    showError(error.message);
  }
};

window.handleAuth = async (type) => {
  const email = document.getElementById('authEmail')?.value;
  const password = document.getElementById('authPassword')?.value;
  if (!email || !password) return showError("Preencha todos os campos.");
  
  try {
    if (type === 'login') {
      await loginWithEmail(email, password);
    } else {
      await registerWithEmail(email, password);
    }
    window.closeAuthModal();
  } catch (error) {
    showError(error.message);
  }
};

// Listener global de Autenticação
subscribeToAuthChanges((user) => {
  const terminalBtn = document.getElementById('terminalBtn');
  if (!terminalBtn) return;
  
  if (user) {
    terminalBtn.innerHTML = `<span class="flex items-center gap-2">Terminal: ${user.displayName || user.email.split('@')[0]}</span>`;
    terminalBtn.onclick = () => {
      window.location.href = '/terminal.html';
    };
  } else {
    terminalBtn.innerText = 'Acessar Terminal';
    terminalBtn.onclick = window.openAuthModal;
  }
});

// ---- Newsletter Logic (Firestore) ----
window.handleFormSubmit = async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const msg = document.getElementById('form-msg');
  const btn = document.getElementById('submit-btn');

  btn.disabled = true;
  const originalText = btn.innerText;
  btn.innerText = 'Processando...';

  try {
    await addDoc(collection(db, "newsletter"), {
      email: email,
      sendEmail: true,
      timestamp: serverTimestamp()
    });
    msg.innerText = 'Inscrição realizada com sucesso!';
    const form = document.getElementById('newsletter-form');
    if (form) form.reset();
  } catch (error) {
    msg.innerText = 'Erro ao cadastrar. Tente novamente.';
    console.error(error);
  } finally {
    btn.disabled = false;
    btn.innerText = originalText;
  }
};

// ---- Contact Logic (Google Apps Script) ----
window.toggleContactForm = () => {
  const form = document.getElementById('contactForm');
  if (form) form.classList.toggle('hidden');
};

window.sendContact = async () => {
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const message = document.getElementById('contactMessage').value;
  const status = document.getElementById('contactStatus');
  const btn = document.getElementById('sendBtn');

  if (!name || !email || !message) {
    status.innerText = 'Preencha todos os campos.';
    return;
  }

  btn.disabled = true;
  status.innerText = 'Enviando...';

  try {
    await fetch('https://script.google.com/macros/s/AKfycbwr6WeTwBTyi9eV16Zfe3FTvhoE-p71K1b91GsGf4btWOR2PGxd3B2VrJBm8A9rD1Wo/exec', {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'contact', name, email, message })
    });
    status.innerText = 'Mensagem enviada com sucesso!';
    setTimeout(() => {
      window.toggleContactForm();
      status.innerText = '';
      document.getElementById('contactName').value = '';
      document.getElementById('contactEmail').value = '';
      document.getElementById('contactMessage').value = '';
    }, 2000);
  } catch (e) {
    status.innerText = 'Erro ao enviar.';
  } finally {
    btn.disabled = false;
  }
};
