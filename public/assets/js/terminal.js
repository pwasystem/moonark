import { subscribeToAuthChanges, logout } from './firebase/auth.js';
import { db } from './firebase/config.js';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp, getCountFromServer } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

let currentUser = null;
let metricsChartInstance = null;

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
    
    // Initial Load
    await loadMetrics();
    await loadUsers();
    await loadDashboard();
    await loadForumPosts();
  });

  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await logout();
  });

  // Setup Tabs Navigation
  setupTabs();

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
      await loadMetrics(); // update post count
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

function setupTabs() {
  const tabs = ['metrics', 'users', 'dashboard', 'forum'];
  
  tabs.forEach(tab => {
    const tabEl = document.getElementById(`tab-${tab}`);
    if(!tabEl) return;
    
    tabEl.addEventListener('click', () => {
      // Reset all
      tabs.forEach(t => {
        document.getElementById(`tab-${t}`).className = 'w-full text-left px-4 py-3 bg-[#0d1322] hover:bg-[#191f2f] border border-white/5 rounded-xl text-secondary transition-all flex items-center gap-2';
        document.getElementById(`view-${t}`).classList.add('hidden');
        document.getElementById(`view-${t}`).classList.remove('block');
      });

      // Active
      tabEl.className = 'w-full text-left px-4 py-3 bg-[#0d1322] border border-[#acdfff]/30 rounded-xl text-[#acdfff] font-bold transition-all flex items-center gap-2';
      const view = document.getElementById(`view-${tab}`);
      view.classList.remove('hidden');
      view.classList.add('block');
    });
  });
}

async function loadMetrics() {
  try {
    const usersSnap = await getCountFromServer(collection(db, "users"));
    const subsSnap = await getCountFromServer(collection(db, "newsletter"));
    const postsSnap = await getCountFromServer(collection(db, "forum_posts"));

    const usersCount = usersSnap.data().count;
    const subsCount = subsSnap.data().count;
    const postsCount = postsSnap.data().count;

    document.getElementById('metric-users').innerText = usersCount;
    document.getElementById('metric-subs').innerText = subsCount;
    document.getElementById('metric-posts').innerText = postsCount;

    renderChart(usersCount, subsCount, postsCount);
  } catch (error) {
    console.error("Erro nas métricas:", error);
  }
}

function renderChart(users, subs, posts) {
  const ctx = document.getElementById('metricsChart');
  if(!ctx) return;

  if (metricsChartInstance) {
    metricsChartInstance.destroy();
  }

  metricsChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Guardiões', 'Inscritos', 'Transmissões'],
      datasets: [{
        label: 'Registros',
        data: [users, subs, posts],
        backgroundColor: [
          'rgba(172, 223, 255, 0.6)',
          'rgba(120, 197, 241, 0.6)',
          'rgba(193, 198, 219, 0.6)'
        ],
        borderColor: [
          '#acdfff',
          '#78c5f1',
          '#c1c6db'
        ],
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#899299', stepSize: 1 }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#899299' }
        }
      }
    }
  });
}

async function loadUsers() {
  const listEl = document.getElementById('usersList');
  if (!listEl) return;

  try {
    const q = query(collection(db, "users"), orderBy("lastLogin", "desc"));
    const snapshot = await getDocs(q);
    
    listEl.innerHTML = ''; 

    if (snapshot.empty) {
      listEl.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-secondary">Nenhum guardião detectado.</td></tr>';
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const tr = document.createElement('tr');
      const date = data.lastLogin ? data.lastLogin.toDate().toLocaleDateString('pt-BR') : 'N/A';
      tr.innerHTML = `
        <td class="p-3 border-b border-white/5 text-[#c1c6db] font-bold">${data.displayName}</td>
        <td class="p-3 border-b border-white/5 text-[#c1c6db]">${data.email}</td>
        <td class="p-3 border-b border-white/5 text-xs font-mono">${date}</td>
      `;
      listEl.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    listEl.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-red-400">Falha ao acessar registros.</td></tr>';
  }
}

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
