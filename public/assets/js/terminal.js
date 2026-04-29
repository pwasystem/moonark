import { subscribeToAuthChanges, logout } from './firebase/auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // Apenas a página do terminal deve carregar e rodar isso
  subscribeToAuthChanges((user) => {
    if (!user) {
      // Usuário não autenticado, forçar retorno para a página inicial (Redirecionamento à força)
      window.location.replace('/');
      return;
    }

    // Caso autenticado, popular UI
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
      userNameElement.innerText = user.displayName || user.email.split('@')[0];
    }
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await logout();
      // O listener acima detectará a mudança e fará o redirecionamento
    });
  }
});
