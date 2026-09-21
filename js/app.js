document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registration-form');
  if (!form) return;

  const STEP_LABELS = { 1: 'Paso 1 de 3', 2: 'Paso 2 de 3', 3: 'Paso 3 de 3' };
  const panels = Array.from(form.querySelectorAll('.step-panel'));
  const stepBack = document.getElementById('step-back');
  const stepNext = document.getElementById('step-next');
  const stepSubmit = document.getElementById('form-submit');
  const stepLabel = document.getElementById('form-step-label');
  const errEl = document.getElementById('reg-error');

  let currentStep = 1;

  function showError(msg) {
    if (!errEl) return;
    errEl.textContent = msg;
    errEl.classList.remove('hidden');
    errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function clearError() {
    if (errEl) errEl.classList.add('hidden');
  }

  function renderStep(step) {
    currentStep = step;
    panels.forEach(p => p.classList.toggle('hidden', +p.dataset.step !== step));
    stepLabel.textContent = STEP_LABELS[step] || '';
    stepLabel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    [1, 2, 3].forEach(n => {
      const fill = form.querySelector(`[data-step-fill="${n}"]`);
      if (fill) fill.style.width = n <= step ? '100%' : '0%';
      const dot = form.querySelector(`[data-step-dot="${n}"]`);
      if (dot) {
        dot.classList.toggle('text-brand-lime', n <= step);
        dot.classList.toggle('text-brand-white-muted/35', n > step);
      }
      const bar = form.querySelector(`[data-step-fill="${n}"]`)?.parentElement;
      if (bar) bar.classList.toggle('bg-brand-lime/20', n <= step);
    });

    stepBack.classList.toggle('hidden', step === 1);
    stepNext.classList.toggle('hidden', step === 3);
    stepSubmit.classList.toggle('hidden', step !== 3);
    clearError();
  }

  function validateStep(step) {
    if (step === 1) {
      const name = form.querySelector('#team-name').value.trim();
      const contact = form.querySelector('#contact-name').value.trim();
      const email = form.querySelector('#contact-email').value.trim();
      if (!name) { showError('Escribe el nombre del estudio o equipo.'); return false; }
      if (!contact) { showError('Escribe el nombre del capitán o representante.'); return false; }
      if (!email) { showError('Escribe el correo del contacto.'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('Revisa el correo: parece no ser válido.'); return false; }
      return true;
    }
    if (step === 2) {
      const logo = form.querySelector('#team-logo').files[0];
      const music = form.querySelector('#team-music').files[0];
      if (!logo) { showError('Sube el logo de tu estudio para continuar.'); return false; }
      if (!music) { showError('Sube la música de tu rutina para continuar.'); return false; }
      if (logo.size > 20 * 1024 * 1024) { showError('El archivo del logo supera los 20 MB. Compáctalo o envíanoslo por WhatsApp.'); return false; }
      if (music.size > 20 * 1024 * 1024) { showError('El archivo de música supera los 20 MB. Compáctalo o envíanoslo por WhatsApp.'); return false; }
      return true;
    }
    return true;
  }

  stepNext.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    renderStep(currentStep + 1);
  });

  stepBack.addEventListener('click', () => {
    if (currentStep > 1) renderStep(currentStep - 1);
  });

  // Mostrar nombre del archivo elegido
  const fileInputs = [
    { input: form.querySelector('#team-logo'), label: document.getElementById('logo-file-name') },
    { input: form.querySelector('#team-music'), label: document.getElementById('music-file-name') }
  ];
  fileInputs.forEach(({ input, label }) => {
    if (!input || !label) return;
    input.addEventListener('change', () => {
      const f = input.files[0];
      label.innerHTML = f
        ? `<span class="text-brand-lime font-bold break-all">${escapeHtml(f.name)}</span> <span class="block mt-1 text-brand-white-muted/40">${formatBytes(f.size)} · Toca para cambiar</span>`
        : 'Ningún archivo seleccionado';
      clearError();
    });
  });

  function formatBytes(bytes) {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
  }

  // ---- Dinámica de bailarines ----
  const dancersList = document.getElementById('dancers-list');
  const addDancerBtn = document.getElementById('add-dancer');

  function addDancerRow(name = '', technique = '', division = '') {
    const row = document.createElement('div');
    row.className = 'dancer-row bg-brand-dark/40 rounded-2xl border border-brand-white-faint p-4 space-y-3';
    row.innerHTML = `
      <div>
        <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-1.5">Nombre completo</label>
        <input type="text" class="dancer-name w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3.5 text-base sm:text-sm text-brand-white placeholder:text-brand-white-muted/30 focus:outline-none focus:border-brand-lime/40 transition-colors" placeholder="Nombre completo" value="${escapeHtml(name)}">
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
        <input type="text" class="dancer-technique bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3.5 text-base sm:text-sm text-brand-white placeholder:text-brand-white-muted/30 focus:outline-none focus:border-brand-lime/40 transition-colors" placeholder="Técnica" value="${escapeHtml(technique)}">
        <input type="text" class="dancer-division bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3.5 text-base sm:text-sm text-brand-white placeholder:text-brand-white-muted/30 focus:outline-none focus:border-brand-lime/40 transition-colors" placeholder="División / edad" value="${escapeHtml(division)}">
        <button type="button" class="remove-dancer min-h-[44px] sm:min-h-0 self-start sm:self-auto text-brand-white-muted/40 hover:text-red-400 transition-colors rounded-lg px-3" title="Quitar" aria-label="Quitar bailarín">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    `;
    dancersList.appendChild(row);
    row.querySelector('.remove-dancer').addEventListener('click', () => {
      row.remove();
      if (dancersList.querySelectorAll('.dancer-row').length === 0) addDancerRow();
    });
  }

  if (addDancerBtn) addDancerBtn.addEventListener('click', () => addDancerRow());
  if (dancersList && dancersList.querySelectorAll('.dancer-row').length === 0) addDancerRow();

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---- Subida a Storage ----
  const BUCKET = 'team-files';
  const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

  function newUuid() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    const b = new Uint8Array(16);
    window.crypto.getRandomValues(b);
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const hex = [...b].map(x => x.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  async function uploadFile(file, prefix, folder) {
    const path = `${folder}/${uid()}_${file.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
    if (error) throw error;
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { path, url: pub.publicUrl };
  }

  stepSubmit.addEventListener('click', () => {
    clearError();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(1)) { renderStep(1); return; }
    if (!validateStep(2)) { renderStep(2); return; }
    clearError();

    const btn = stepSubmit;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = 'Validando con IA…';
    btn.disabled = true;

    const teamName = form.querySelector('#team-name').value.trim();
    const originCity = form.querySelector('#origin-city').value.trim();
    const contactName = form.querySelector('#contact-name').value.trim();
    const contactPhone = form.querySelector('#contact-phone').value.trim();
    const contactEmail = form.querySelector('#contact-email').value.trim();

    try {
      if (window.TypeSafe) {
        const answers = await window.TypeSafe.validateRegistration({
          team_name: teamName,
          origin_city: originCity,
          contact_name: contactName,
          contact_email: contactEmail,
        });

        if (answers.name_appropriate && answers.name_appropriate.noul < 0.7) {
          showError('El nombre del equipo no es apropiado. Por favor, elige otro.');
          btn.innerHTML = originalHTML;
          btn.disabled = false;
          return;
        }

        if (answers.is_complete && answers.is_complete.noul < 0.8) {
          showError('Parece que faltan datos. Revisa que todos los campos obligatorios estén llenos.');
          btn.innerHTML = originalHTML;
          btn.disabled = false;
          return;
        }
      }
    } catch (err) {
      console.warn('TypeSafe validation skipped:', err);
    }

    btn.innerHTML = 'Subiendo, un momento…';

    const logoFile = form.querySelector('#team-logo').files[0];
    const musicFile = form.querySelector('#team-music').files[0];

    const dancerRows = Array.from(dancersList.querySelectorAll('.dancer-row'));
    const dancers = dancerRows.map(r => ({
      full_name: r.querySelector('.dancer-name').value.trim(),
      technique: r.querySelector('.dancer-technique').value.trim(),
      division: r.querySelector('.dancer-division').value.trim()
    })).filter(d => d.full_name);

    try {
      const [logo, music] = await Promise.all([
        uploadFile(logoFile, 'logo', 'logos'),
        uploadFile(musicFile, 'music', 'music')
      ]);

      const teamId = newUuid();
      const { error: teamErr } = await supabase
        .from('teams')
        .insert([{
          id: teamId,
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
        }]);

      if (teamErr) throw teamErr;

      if (dancers.length) {
        const { error: dancersErr } = await supabase
          .from('participants')
          .insert(dancers.map(d => ({ ...d, email: contactEmail, team_id: teamId, school_name: teamName, status: 'pending' })));
        if (dancersErr) throw dancersErr;
      }

      form.innerHTML = `
        <div class="text-center space-y-4 py-6">
          <div class="w-16 h-16 rounded-full bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center mx-auto">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h3 class="font-title text-2xl font-black text-brand-white">Registro recibido</h3>
          <p class="text-brand-white-muted/60">Nos pondremos en contacto vía WhatsApp. ¡Gracias <span class="text-brand-lime">${escapeHtml(teamName)}</span>!</p>
        </div>`;
    } catch (err) {
      console.error(err);
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      showError('Ocurrió un error al enviar tu registro. Revisa que el logo y la música sean válidos e inténtalo de nuevo, o contáctanos por WhatsApp.');
    }
  });

  renderStep(1);

  // ---- FAQ Accordion ----
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.faq-toggle');
    if (!toggle) return;
    const item = toggle.closest('.bg-brand-dark-elevated\\/50, [class*="bg-brand-dark-elevated"]');
    if (!item) return;
    const content = item.querySelector('.faq-content');
    const icon = toggle.querySelector('.faq-icon');
    if (!content) return;
    content.classList.toggle('hidden');
    if (icon) icon.style.transform = content.classList.contains('hidden') ? '' : 'rotate(180deg)';
  });

  // ---- Mobile Menu ----
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
});