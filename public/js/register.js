import { API, showMessage, redirectIfLoggedIn } from './api.js';

redirectIfLoggedIn();

const form      = document.getElementById('register-form');
const msg       = document.getElementById('msg');
const password  = document.getElementById('password');
const hint      = document.getElementById('pw-hint');
const parts     = hint.querySelectorAll('span[data-rule]');
const submitBtn = document.getElementById('submit-btn');

const RULES = {
  length: (v) => v.length >= 8,
  upper:  (v) => /[A-Z]/.test(v),
  lower:  (v) => /[a-z]/.test(v),
  number: (v) => /\d/.test(v),
};

password.addEventListener('input', () => {
  let passed = 0;
  parts.forEach((s) => {
    const ok = RULES[s.dataset.rule](password.value);
    s.classList.toggle('ok', ok);
    if (ok) passed++;
  });

  const hasTyped = password.value.length > 0;
  submitBtn.disabled = hasTyped && passed < parts.length;

  // Mark the whole hint green when complete
  hint.classList.toggle('complete', passed === parts.length);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showMessage(msg, '');

  try {
    await API.post('/api/auth/register', {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
    });
    showMessage(msg, 'Account created! Redirecting to sign in…', 'success');
    setTimeout(() => (window.location.href = '/index.html'), 1200);
  } catch (err) {
    showMessage(msg, err.message, 'error');
  }
});
