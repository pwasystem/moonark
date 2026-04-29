import { subscribeToAuthChanges, logout } from './firebase/auth.js';
import { db } from './firebase/config.js';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  subscribeToAuthChanges(async (user) => {
    if (!user) {
      window.location.replace('/');
      return;
    }

    currentUser = user;
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
      userNameElement.innerText = user.displayName || user.email.split('@')[0];
    }
    
    await loadDashboard();
    await loadForumPosts();
  });

  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await logout();
  });

  // Tabs Logic
  const tabDashboard = document.getElementById('tab-dashboard');
  const tabForum = document.getElementById('tab-forum');
  const viewDashboard = document.getElementById('view-dashboard');
  const viewForum = document.getElementById('view-forum');

  tabDashboard?.addEventListener('click', () => {
    tabDashboard.classList.add('border-[#acdfff]/30', 'text-[#acdfff]');
    tabDashboard.classList.remove('border-white/5', 'text-secondary');
    tabForum.classList.remove('border-[#acdfff]/30', 'text-[#acdfff]');
    tabForum.classList.add('border-white/5', 'text-secondary');
    
    viewDashboard.classList.remove('hidden');
    viewForum.classList.add('hidden');
  });

  tabForum?.addEventListener('click', () => {
    tabForum.classList.add('border-[#acdfff]/30', 'text-[#acdfff]');
    tabForum.classList.remove('border-white/5', 'text-secondary');
    tabDashboard.classList.remove('border-[#acdfff]/30', 'text-[#acdfff]');
    tabDashboard.classList.add('border-white/5', 'text-secondary');
    
    viewForum.classList.remove('hidden');
    viewDashboard.classList.add('hidden');
  });

  // Forum Submit Logic
  document.getElementById('forumSubmit')?.addEventListener('click', async () => {
    const title = document.getElementById('forumTitle').value;
    const content = document.getElementById('forumContent').value;
    const msgEl = document.getElementById('forumMsg');
    const btn = document.getElementById('forumSubmit');

    if (!title || !content) {
      msgEl.innerText = "Preencha todos os campos.";
      msgEl.classList.add('text-red-400');
      return;
    }

    btn.disabled = true;
    btn.innerText = "Enviando...";
    msgEl.innerText = "";

    try {
      await addDoc(collection(db, "forum_posts"), {
        title,
        content,
        author: currentUser.displayName || currentUser.email.split('@')[0],
        authorEmail: currentUser.email,
        timestamp: serverTimestamp()
      });
      document.getElementById('forumTitle').value = '';
      document.getElementById('forumContent').value = '';
      msgEl.innerText = "Transmissão enviada!";
      msgEl.classList.remove('text-red-400');
      msgEl.classList.add('text-[#acdfff]');
      
      await loadForumPosts();
    } catch (e) {
      msgEl.innerText = "Falha ao transmitir.";
      msgEl.classList.add('text-red-400');
      console.error(e);
    } finally {
      btn.disabled = false;
      btn.innerText = "Transmitir";
    }
  });
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

async function loadForumPosts() {
  const listEl = document.getElementById('forumPosts');
  if (!listEl) return;

  try {
    const q = query(collection(db, "forum_posts"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    
    listEl.innerHTML = ''; 

    if (snapshot.empty) {
      listEl.innerHTML = '<div class="text-center py-4 text-secondary text-sm">O silêncio ecoa. Nenhuma transmissão encontrada.</div>';
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const date = data.timestamp ? data.timestamp.toDate().toLocaleDateString('pt-BR') : 'N/A';
      
      const postDiv = document.createElement('div');
      postDiv.className = 'bg-[#151b2a] p-4 rounded-xl border border-white/5';
      postDiv.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <h4 class="font-bold text-[#acdfff]">${data.title}</h4>
          <span class="text-[10px] text-secondary font-mono bg-[#0d1322] px-2 py-1 rounded border border-white/5">${date}</span>
        </div>
        <p class="text-sm text-[#dde2f7] mb-3 whitespace-pre-wrap">${data.content}</p>
        <div class="flex items-center gap-2 text-xs text-secondary border-t border-white/5 pt-2 mt-2">
          <span class="material-symbols-outlined text-[14px]">person</span> ${data.author}
        </div>
      `;
      listEl.appendChild(postDiv);
    });
  } catch (error) {
    console.error("Erro ao buscar forum:", error);
    listEl.innerHTML = '<div class="text-center py-4 text-red-400 text-sm">Falha ao decodificar transmissões do Fórum.</div>';
  }
}
