document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registration-form');
  if (!form) return;

  // ---- Dinámica de bailarines (lista reutilizable) ----
  const dancersList = document.getElementById('dancers-list');
  const addDancerBtn = document.getElementById('add-dancer');

  function addDancerRow(name = '', technique = '', division = '') {
    const row = document.createElement('div');
    row.className = 'dancer-row grid grid-cols-1 sm:grid-cols-3 gap-3';
    row.innerHTML = `
      <input type="text" class="dancer-name bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white placeholder:text-brand-white-muted/30 focus:outline-none focus:border-brand-lime/40 transition-colors" placeholder="Nombre completo" value="${escapeHtml(name)}">
      <input type="text" class="dancer-technique bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white placeholder:text-brand-white-muted/30 focus:outline-none focus:border-brand-lime/40 transition-colors" placeholder="Técnica" value="${escapeHtml(technique)}">
      <div class="flex gap-2">
        <input type="text" class="dancer-division bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white placeholder:text-brand-white-muted/30 focus:outline-none focus:border-brand-lime/40 transition-colors flex-1" placeholder="División / edad" value="${escapeHtml(division)}">
        <button type="button" class="remove-dancer text-brand-white-muted/40 hover:text-red-400 transition-colors px-2" title="Quitar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    `;
    dancersList.appendChild(row);
    const rm = row.querySelector('.remove-dancer');
    rm.addEventListener('click', () => row.remove());
  }

  if (addDancerBtn) addDancerBtn.addEventListener('click', () => addDancerRow());
  if (dancersList && dancersList.querySelectorAll('.dancer-row').length === 0) addDancerRow();

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---- Subida a Storage ----
  const BUCKET = 'team-files';
  const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

  async function uploadFile(file, prefix, folder) {
    if (!file) return { path: '', url: '' };
    const path = `${folder}/${uid()}_${file.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
    if (error) throw error;
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { path, url: pub.publicUrl };
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    const btnInner = btn.innerHTML;

    const errEl = document.getElementById('reg-error');
    if (errEl) errEl.classList.add('hidden');

    const teamName = form.querySelector('#team-name').value.trim();
    const originCity = form.querySelector('#origin-city').value.trim();
    const contactName = form.querySelector('#contact-name').value.trim();
    const contactPhone = form.querySelector('#contact-phone').value.trim();
    const contactEmail = form.querySelector('#contact-email').value.trim();

    if (!teamName || !contactName || !contactEmail) {
      alert('Por favor completa el nombre del equipo, el contacto y el correo.');
      return;
    }

    // Archivos
    const logoFile = form.querySelector('#team-logo').files[0];
    const musicFile = form.querySelector('#team-music').files[0];

    if (!logoFile || !musicFile) {
      alert('Por favor sube el logo del estudio y la música de tu rutina.');
      return;
    }

    // Bailarines
    const dancerRows = Array.from(dancersList.querySelectorAll('.dancer-row'));
    const dancers = dancerRows.map(r => ({
      full_name: r.querySelector('.dancer-name').value.trim(),
      technique: r.querySelector('.dancer-technique').value.trim(),
      division: r.querySelector('.dancer-division').value.trim()
    })).filter(d => d.full_name);

    btn.textContent = 'Subiendo...';
    btn.disabled = true;

    try {
      // 1) Subir archivos primero
      const [logo, music] = await Promise.all([
        uploadFile(logoFile, 'logo', 'logos'),
        uploadFile(musicFile, 'music', 'music')
      ]);

      // 2) Insertar equipo
      const { data: team, error: teamErr } = await supabase
        .from('teams')
        .insert([{
          name: teamName,
          origin_city: originCity,
          contact_name: contactName,
          contact_phone: contactPhone,
          contact_email: contactEmail,
          logo_path: logo.path,
          logo_url: logo.url,
          music_path: music.path,
          music_url: music.url,
          status: 'pending'
        }])
        .select('id')
        .single();

      if (teamErr) throw teamErr;

      // 3) Insertar bailarines vinculados al equipo
      if (dancers.length) {
        const { error: dancersErr } = await supabase
          .from('participants')
          .insert(dancers.map(d => ({ ...d, team_id: team.id, school_name: teamName, status: 'pending' })));
        if (dancersErr) throw dancersErr;
      }

      form.innerHTML = `
        <div class="text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center mx-auto">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h3 class="font-title text-2xl font-black text-brand-white">Registro recibido</h3>
          <p class="text-brand-white-muted/60">Nos pondremos en contacto vía WhatsApp. ¡Gracias <span class="text-brand-lime">${escapeHtml(teamName)}</span>!</p>
        </div>`;
    } catch (err) {
      console.error(err);
      btn.textContent = originalText;
      btn.innerHTML = btnInner;
      btn.disabled = false;
      if (errEl) {
        errEl.textContent = 'Ocurrió un error al enviar tu registro. Revisa que la música y el logo sean válidos e inténtalo de nuevo, o contáctanos por WhatsApp.';
        errEl.classList.remove('hidden');
      } else {
        alert('Error al enviar. Intenta de nuevo o contáctanos por WhatsApp.');
      }
    }
  });
});
