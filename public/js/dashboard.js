import { API, requireAuth } from './api.js';

const user = await requireAuth();

if (user) {
  document.getElementById('uname').textContent  = user.username;
  document.getElementById('uemail').textContent = user.email;

  const roleEl = document.getElementById('urole');
  roleEl.textContent = user.role;
  if (user.role === 'admin') {
    roleEl.classList.add('admin');
    document.getElementById('admin-link').classList.remove('hidden');
  }
}

document.getElementById('logout').addEventListener('click', async () => {
  await API.post('/api/auth/logout', {});
  window.location.href = '/index.html';
});

document.getElementById('load').addEventListener('click', async () => {
  const out = document.getElementById('out');
  try {
    const data = await API.get('/api/auth/me');
    out.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    out.textContent = `❌ ${err.message}`;
  }
});