// Pagina Pro: mostra stato is_pro e simula il pagamento (per sviluppo)
document.addEventListener('DOMContentLoaded', async function() {
  const statusEl = document.getElementById('pro-current');
  const payBtn = document.getElementById('payBtn');

  try {
    const res = await fetch('/gm_v2/api/me.php');
    const data = await res.json();
    if (data && data.success && data.user) {
      statusEl.textContent = data.user.is_pro ? 'Sei PRO' : 'Free';
      if (data.user.is_pro) payBtn.disabled = true;
    } else {
      statusEl.textContent = 'Non autenticato';
      payBtn.disabled = true;
    }
  } catch (err) {
    statusEl.textContent = 'Errore';
    payBtn.disabled = true;
  }

  payBtn.addEventListener('click', async () => {
    payBtn.disabled = true;
    payBtn.textContent = 'Simulazione in corso...';
    try {
      const r = await fetch('/gm_v2/api/subscription.php', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ action: 'toggle_demo' })
      });
      const j = await r.json();
      if (j.success) {
        statusEl.textContent = j.is_pro ? 'Sei PRO' : 'Free';
        alert(j.message || 'Aggiornato (demo)');
      } else {
        alert('Errore: ' + (j.error || ''));
      }
    } catch (e) {
      alert('Errore di rete');
    } finally {
      payBtn.disabled = false;
      payBtn.textContent = 'Paga (simula)';
    }
  });
});
