import { API, showMessage, redirectIfLoggedIn } from './api.js';

redirectIfLoggedIn();

const form = document.getElementById('register-form');
const msg  = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showMessage(msg, '');
  try {
    await API.post('/api/auth/register', {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
    });
    showMessage(msg, 'Account created! Redirecting to login…', 'success');
    setTimeout(() => (window.location.href = '/index.html'), 1200);
  } catch (err) {
    showMessage(msg, err.message, 'error');
  }
});