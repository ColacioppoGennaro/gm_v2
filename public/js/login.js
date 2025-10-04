// Gestione Login e Registrazione con toggle (robusto)
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');
  const loginBox = document.querySelector('.login-container');
  const registerBox = document.getElementById('registerBox');
  const loginError = document.getElementById('loginError');
  const registerError = document.getElementById('registerError');

  // API path
  const API_PATH = '/gm_v2/api/auth.php';

  // Helper per mostrare/nascondere errori (gestisce display)
  function showError(el, msg) {
    if (!el) return;
    if (!msg) { el.style.display = 'none'; el.textContent = ''; return; }
    el.style.display = 'block';
    el.textContent = msg;
  }

  // Toggle handlers (solo se esistono gli elementi)
  if (showRegister && loginBox && registerBox) {
    showRegister.addEventListener('click', () => {
      loginBox.style.display = 'none';
      registerBox.style.display = 'block';
      showError(loginError, '');
    });
  }
  if (showLogin && loginBox && registerBox) {
    showLogin.addEventListener('click', () => {
      loginBox.style.display = 'block';
      registerBox.style.display = 'none';
      showError(registerError, '');
    });
  }

  // Login submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      showError(loginError, '');
      try {
        const email = (loginForm.email && loginForm.email.value) || document.getElementById('email')?.value;
        const password = (loginForm.password && loginForm.password.value) || document.getElementById('password')?.value;
        const res = await fetch(API_PATH, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ action: 'login', email, password })
        });
        const data = await res.json();
        if (data && data.success) {
          window.location.href = 'dashboard.html';
        } else {
          showError(loginError, data && data.error ? data.error : 'Login fallito');
        }
      } catch (err) {
        showError(loginError, 'Errore di rete');
      }
    });
  }

  // Register submit
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      showError(registerError, '');
      try {
        const email = (registerForm.regEmail && registerForm.regEmail.value) || document.getElementById('regEmail')?.value;
        const password = (registerForm.regPassword && registerForm.regPassword.value) || document.getElementById('regPassword')?.value;
        const nickname = (registerForm.regNickname && registerForm.regNickname.value) || document.getElementById('regNickname')?.value;
        const res = await fetch(API_PATH, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ action: 'register', email, password, nickname })
        });
        const data = await res.json();
        if (data && data.success) {
          window.location.href = 'dashboard.html';
        } else {
          showError(registerError, data && data.error ? data.error : 'Registrazione fallita');
        }
      } catch (err) {
        showError(registerError, 'Errore di rete');
      }
    });
  }
});
