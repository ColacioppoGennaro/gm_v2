// Gestione Login e Registrazione
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginBox = document.querySelector('.login-container');
    const registerBox = document.getElementById('registerBox');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');

    // API path: deploy under /gm_v2 on hosting
    const API_PATH = '/gm_v2/api/auth.php';

    showRegister.onclick = () => { loginBox.style.display = 'none'; registerBox.style.display = 'block'; };
    showLogin.onclick = () => { loginBox.style.display = 'block'; registerBox.style.display = 'none'; };

    loginForm.onsubmit = async e => {
        e.preventDefault();
        loginError.textContent = '';
        try {
            const res = await fetch(API_PATH, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    action: 'login',
                    email: loginForm.email.value,
                    password: loginForm.password.value
                })
            });
            const data = await res.json();
            if(data.success) {
                window.location.href = 'dashboard.html';
            } else {
                loginError.textContent = data.error || 'Login fallito';
            }
        } catch(err) {
            loginError.textContent = 'Errore di rete';
        }
    };

    registerForm.onsubmit = async e => {
        e.preventDefault();
        registerError.textContent = '';
        try {
            const res = await fetch(API_PATH, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    action: 'register',
                    email: registerForm.regEmail.value,
                    password: registerForm.regPassword.value,
                    nickname: registerForm.regNickname.value
                })
            });
            const data = await res.json();
            if(data.success) {
                window.location.href = 'dashboard.html';
            } else {
                registerError.textContent = data.error || 'Registrazione fallita';
            }
        } catch(err) {
            registerError.textContent = 'Errore di rete';
        }
    };
});