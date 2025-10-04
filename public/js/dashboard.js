// Aggiornamento benvenuto e gestione logout (non altera layout)
document.addEventListener('DOMContentLoaded', function() {
  const welcomeText = document.getElementById('welcomeText');
  const logoutBtn = document.getElementById('logoutBtn');
  const proBtn = document.getElementById('proBtn');

  if (welcomeText) welcomeText.textContent = 'Benvenuto in GM v2';

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

  // Handle Passa a Pro button: open pro page or toggle demo via API
  if (proBtn) {
    proBtn.addEventListener('click', async function() {
      try {
        // Try toggling demo subscription directly for quick test
        const res = await fetch('/gm_v2/api/subscription.php', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ action: 'toggle_demo' })
        });
        const data = await res.json();
        if (data.success) {
          if (data.is_pro) {
            alert('Sei diventato PRO (demo)');
            proBtn.disabled = true;
          } else {
            alert('Sei tornato Free (demo)');
            proBtn.disabled = false;
          }
        } else {
          // fallback to pro page
          window.location.href = '/gm_v2/public/pro.html';
        }
      } catch (err) {
        // fallback: open pro.html
        window.location.href = '/gm_v2/public/pro.html';
      }
    });
  }
});