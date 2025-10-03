// Dashboard: mostra info base e gestisce logout
document.addEventListener('DOMContentLoaded', function() {
  const welcomeText = document.getElementById('welcomeText');
  const logoutBtn = document.getElementById('logoutBtn');

  // Mostra messaggio di benvenuto generico
  if (welcomeText) welcomeText.textContent = 'Benvenuto in GM v2';

  // Logout: chiamo l'API che hai già (usiamo percorso assoluto relativo al deploy)
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function() {
      try {
        const res = await fetch('/gm_v2/api/auth.php', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ action: 'logout' })
        });
        const data = await res.json();
        if (data.success) {
          window.location.href = '/gm_v2/public/login.html';
        } else {
          alert('Logout fallito');
        }
      } catch (err) {
        alert('Errore di rete durante logout');
      }
    });
  }
});