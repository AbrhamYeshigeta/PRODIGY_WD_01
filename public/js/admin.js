import { API, requireAuth } from './api.js';

const user = await requireAuth('admin');

if (user) {
  document.getElementById('load-users').addEventListener('click', async () => {
    const out = document.getElementById('out');
    try {
      const data = await API.get('/api/admin/users');
      out.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      out.textContent = `❌ ${err.message}`;
    }
  });
}