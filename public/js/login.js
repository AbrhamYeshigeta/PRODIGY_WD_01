import { API, showMessage, redirectIfLoggedIn } from './api.js';

redirectIfLoggedIn();

const form = document.getElementById('login-form');
const msg  = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showMessage(msg, '');
  try {
    await API.post('/api/auth/login', {
      email: form.email.value.trim(),
      password: form.password.value,
    });
    window.location.href = '/dashboard.html';
  } catch (err) {
    showMessage(msg, err.message, 'error');
  }
});