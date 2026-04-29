import { subscribeToAuthChanges, logout } from './firebase/auth.js';
import { db } from './firebase/config.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  // Apenas a página do terminal deve carregar e rodar isso
  subscribeToAuthChanges(async (user) => {
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
    
    await loadDashboard();
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await logout();
      // O listener acima detectará a mudança e fará o redirecionamento
    });
  }
});

async function loadDashboard() {
  const listEl = document.getElementById('subscribersList');
  if (!listEl) return;

  try {
    const q = query(collection(db, "newsletter"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    
    listEl.innerHTML = ''; 

    if (snapshot.empty) {
      listEl.innerHTML = '<tr><td colspan="2" class="text-center py-4 text-secondary">Nenhum registro encontrado.</td></tr>';
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const tr = document.createElement('tr');
      const date = data.timestamp ? data.timestamp.toDate().toLocaleDateString('pt-BR') : 'N/A';
      tr.innerHTML = `
        <td class="p-3 border-b border-white/5 text-[#c1c6db]">${data.email}</td>
        <td class="p-3 border-b border-white/5 text-xs font-mono">${date}</td>
      `;
      listEl.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao buscar inscritos:", error);
    listEl.innerHTML = '<tr><td colspan="2" class="text-center py-4 text-red-400">Falha ao acessar registros. Verifique suas permissões.</td></tr>';
  }
}
