// Upload client: valida estensione/size e invia a api/upload.php
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('uploadForm');
  const fileInput = document.getElementById('fileInput');
  const uploadBtn = document.getElementById('uploadBtn');
  const statusEl = document.getElementById('upload-status');
  const categoryInput = document.getElementById('category');

  const ALLOWED = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/png', 'image/jpeg'];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  function showStatus(msg, cls) {
    statusEl.classList.remove('hidden');
    statusEl.innerHTML = '<p class="'+(cls||'')+'">'+msg+'</p>';
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = fileInput.files[0];
    if (!f) { showStatus('Seleziona un file', 'message-error'); return; }
    if (!ALLOWED.includes(f.type)) { showStatus('Tipo file non consentito: ' + f.type, 'message-error'); return; }
    if (f.size > MAX_SIZE) { showStatus('File troppo grande (max 10MB)', 'message-error'); return; }

    uploadBtn.disabled = true;
    showStatus('Caricamento in corso...', '');

    const fd = new FormData();
    fd.append('file', f);
    fd.append('category', categoryInput.value || '');

    try {
      const res = await fetch('/gm_v2/api/upload.php', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        showStatus('Caricamento avvenuto con successo (label: ' + (data.label||'') + ')', 'message-success');
      } else {
        showStatus('Errore: ' + (data.error || 'unknown'), 'message-error');
      }
    } catch (err) {
      showStatus('Errore di rete durante upload', 'message-error');
    } finally {
      uploadBtn.disabled = false;
    }
  });
});