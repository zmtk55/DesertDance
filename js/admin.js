(function () {
  'use strict';

  const BUCKET = 'team-files';

  const STATUS_LABELS = {
    pending: { label: 'Pendiente', dot: '#e8ab4a' },
    confirmed: { label: 'Confirmado', dot: '#d8e723' },
    rejected: { label: 'Rechazado', dot: '#ef4444' },
    waitlist: { label: 'Lista de espera', dot: '#7fb3d8' }
  };

  const state = {
    teams: [],
    dancersByTeam: {},
    filtered: [],
    page: 1,
    perPage: 12,
    search: '',
    city: '',
    status: '',
    expanded: new Set()
  };

  // ---- Element helpers ----
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function toast(msg, ok = true) {
    const t = $('toast');
    t.textContent = msg;
    t.className = `toast fixed bottom-6 right-6 z-[70] px-5 py-3 rounded-xl text-sm font-semibold border ${ok ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-red-500/15 border-red-500/30 text-red-400'} shadow-[0_0_30px_rgba(0,0,0,0.4)]`;
    t.classList.remove('hidden');
    setTimeout(() => { t.classList.add('hidden'); }, 3000);
  }

  // ---- Auth guard ----
  async function guard() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = 'login.html';
      return null;
    }
    return session;
  }

  // ---- Data ----
  async function fetchTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select('*, participants(id, full_name, technique, division, status)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  function fetchDancers(teamId) {
    return supabase
      .from('participants')
      .select('id, full_name, technique, division, status')
      .eq('team_id', teamId)
      .then(({ data, error }) => { if (error) throw error; return data || []; });
  }

  // ---- Rendering ----
  function applyFilters() {
    const q = state.search.toLowerCase();
    state.filtered = state.teams.filter(t => {
      const matchSearch = !q
        || t.name.toLowerCase().includes(q)
        || t.origin_city.toLowerCase().includes(q)
        || t.contact_name.toLowerCase().includes(q)
        || t.contact_email.toLowerCase().includes(q);
      const matchCity = !state.city || (t.origin_city || '').toLowerCase() === state.city.toLowerCase();
      const matchStatus = !state.status || t.status === state.status;
      return matchSearch && matchCity && matchStatus;
    });
    state.page = 1;
    renderTable();
    renderCount();
  }

  function renderCount() {
    const total = state.teams.length;
    const shown = state.filtered.length;
    $('count-label').textContent = shown === total
      ? `${total} equipo${total === 1 ? '' : 's'}`
      : `${shown} de ${total} equipos`;
  }

  function renderTable() {
    const tbody = $('table-body');
    const start = (state.page - 1) * state.perPage;
    const pageItems = state.filtered.slice(start, start + state.perPage);

    if (state.filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="px-5 py-16 text-center text-brand-white-muted/30 text-sm">Sin equipos encontrados.</td></tr>`;
      return;
    }

    tbody.innerHTML = pageItems.map(team => {
      const st = STATUS_LABELS[team.status] || STATUS_LABELS.pending;
      const open = state.expanded.has(team.id);
      const date = new Date(team.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      const sched = team.scheduled_time
        ? new Date(team.scheduled_time).toLocaleString('es-MX', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        : '—';
      const dancers = state.dancersByTeam[team.id] || [];
      const dancersCount = dancers.length;

      return `
        <tr class="border-b border-brand-white-faint/40 hover:bg-brand-white-faint/5 transition-colors cursor-pointer team-main-row" data-team="${team.id}">
          <td class="px-5 py-4">
            <div class="flex items-center gap-3">
              ${team.logo_url
                ? `<img src="${esc(team.logo_url)}" alt="" class="w-10 h-10 rounded-lg object-contain bg-brand-dark/60 border border-brand-white-faint p-1">`
                : `<div class="w-10 h-10 rounded-lg bg-brand-white-faint flex items-center justify-center text-brand-white-muted/40"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/></svg></div>`}
              <div>
                <span class="font-semibold text-brand-white">${esc(team.name)}</span>
                <span class="block text-xs text-brand-white-muted/40">${esc(team.origin_city || 'Sin ciudad')} · ${dancersCount} bailarín${dancersCount === 1 ? '' : 'es'}</span>
              </div>
            </div>
          </td>
          <td class="px-5 py-4 text-brand-white-muted/70">
            <span class="block">${esc(team.contact_name || '—')}</span>
            <span class="block text-xs text-brand-white-muted/40">${esc(team.contact_phone || '')}</span>
          </td>
          <td class="px-5 py-4">
            ${team.music_url
              ? `<button class="inline-flex items-center gap-2 text-xs font-bold text-brand-lime hover:text-brand-lime-hover transition-colors" data-music="${team.id}"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg> Escuchar</button>`
              : '<span class="text-brand-white-muted/30 text-xs">Sin música</span>'}
          </td>
          <td class="px-5 py-4 text-brand-white-muted/70 text-xs">${sched}</td>
          <td class="px-5 py-4">
            <button class="badge text-xs font-bold rounded-full px-3 py-1.5 border transition-colors hover:border-brand-lime/30" style="border-color:${st.dot}40;color:${st.dot};background:${st.dot}12" data-status-change="${team.id}">
              <span class="badge-dot" style="background:${st.dot}"></span>${st.label}
            </button>
          </td>
          <td class="px-5 py-4 text-brand-white-muted/50 text-xs">${date}</td>
          <td class="px-5 py-4">
            <div class="flex justify-end gap-2" onclick="event.stopPropagation()">
              <button title="Editar" data-edit="${team.id}" class="p-2 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-brand-lime hover:border-brand-lime/40 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              </button>
              <button title="Eliminar" data-delete="${team.id}" class="p-2 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-red-400 hover:border-red-500/40 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
              </button>
            </div>
          </td>
        </tr>
        ${open ? `
        <tr class="border-b border-brand-white-faint/40 bg-brand-dark-elevated/30">
          <td colspan="7" class="px-5 py-5">
            <div class="pl-14">
              <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.2em] font-extrabold mb-3">Bailarines · ${esc(team.name)}</p>
              ${dancers.length === 0
                ? '<p class="text-brand-white-muted/30 text-xs py-2">Sin bailarines registrados.</p>'
                : `<div class="grid md:grid-cols-2 gap-2">
                    ${dancers.map(d => `
                      <div class="flex items-center justify-between bg-brand-dark/40 rounded-xl px-4 py-2.5 border border-brand-white-faint/30">
                        <div>
                          <span class="text-sm text-brand-white">${esc(d.full_name)}</span>
                          <span class="block text-xs text-brand-white-muted/40">${esc(d.technique || '—')} · ${esc(d.division || '—')}</span>
                        </div>
                        <button class="text-brand-white-muted/40 hover:text-red-400 transition-colors" data-remove-dancer="${d.id}" data-team="${team.id}" title="Quitar bailarín">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                      </div>`).join('')}
                  </div>`}
            </div>
          </td>
        </tr>` : ''}
      `;
    }).join('');

    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.perPage));
    $('page-prev').disabled = state.page <= 1;
    $('page-next').disabled = state.page >= totalPages;
    $('page-info').textContent = state.filtered.length === 0
      ? '—'
      : `Página ${state.page} de ${totalPages}`;
  }

  async function toggleTeam(id, rowEls) {
    if (state.expanded.has(id)) {
      state.expanded.delete(id);
      renderTable();
      return;
    }
    state.expanded.add(id);
    // Cargar bailarines si aún no los tenemos
    if (!state.dancersByTeam[id]) {
      try {
        state.dancersByTeam[id] = await fetchDancers(id);
      } catch (e) {
        console.error(e);
        state.dancersByTeam[id] = [];
      }
    }
    renderTable();
  }

  function renderDashboard() {
    const total = state.teams.length;
    const count = (s) => state.teams.filter(t => t.status === s).length;
    const totalDancers = Object.values(state.dancersByTeam).reduce((acc, d) => acc + d.length, 0);
    $('stat-total').textContent = total;
    $('stat-pending').textContent = count('pending');
    $('stat-confirmed').textContent = count('confirmed');
    $('stat-waitlist').textContent = count('waitlist');
    $('stat-dancers').textContent = totalDancers;

    // Por ciudad
    const cityCounts = {};
    state.teams.forEach(t => {
      const c = t.origin_city || 'Sin ciudad';
      cityCounts[c] = (cityCounts[c] || 0) + 1;
    });
    const max = Math.max(1, ...Object.values(cityCounts));
    const barContainer = $('city-bars');
    barContainer.innerHTML = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([city, n]) => {
        const pct = Math.round((n / max) * 100);
        return `
          <div>
            <div class="flex justify-between items-baseline mb-1.5 text-xs">
              <span class="text-brand-white-muted/60">${esc(city)}</span>
              <span class="font-bold text-brand-lime">${n}</span>
            </div>
            <div class="h-1.5 rounded-full bg-brand-white-faint/40 overflow-hidden">
              <div class="h-full rounded-full bg-gradient-to-r from-brand-lime to-brand-lime-hover transition-all duration-700" style="width:${pct}%"></div>
            </div>
          </div>`;
      }).join('') || '<p class="text-brand-white-muted/30 text-sm">Sin datos todavía.</p>';
  }

  function populateCityFilter() {
    const sel = $('filter-city');
    const cities = [...new Set(state.teams.map(t => t.origin_city).filter(Boolean))].sort();
    sel.innerHTML = '<option value="">Todas las ciudades</option>' + cities.map(c => `<option>${esc(c)}</option>`).join('');
  }

  // ---- Actions ----
  function playMusic(teamId) {
    const team = state.teams.find(t => t.id === teamId);
    if (!team || !team.music_url) return;
    const audio = new Audio(team.music_url);
    audio.play().catch(() => toast('No se pudo reproducir', false));
  }

  async function changeStatus(id, status) {
    const { error } = await supabase.from('teams').update({ status }).eq('id', id);
    if (error) throw error;
  }

  async function saveEdit(id, fields) {
    const { error } = await supabase.from('teams').update(fields).eq('id', id);
    if (error) throw error;
  }

  async function removeTeam(id) {
    const { error } = await supabase.from('teams').delete().eq('id', id);
    if (error) throw error;
  }

  async function removeDancer(id) {
    const { error } = await supabase.from('participants').delete().eq('id', id);
    if (error) throw error;
  }

  function exportCSV() {
    const data = state.filtered;
    if (data.length === 0) { toast('No hay datos para exportar', false); return; }
    const headers = ['Equipo', 'Ciudad', 'Contacto', 'Teléfono', 'Email', 'Estatus', 'Horario', 'Logo', 'Música', 'Bailarines'];
    const rows = data.map(t => {
      const dancers = (state.dancersByTeam[t.id] || []).map(d => d.full_name).join('; ');
      return [
        t.name, t.origin_city || '', t.contact_name || '', t.contact_phone || '', t.contact_email || '',
        STATUS_LABELS[t.status]?.label || t.status,
        t.scheduled_time ? new Date(t.scheduled_time).toISOString() : '',
        t.logo_url || '', t.music_url || '', dancers
      ];
    });
    const csv = [headers, ...rows]
      .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `desert-dance-equipos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('CSV exportado');
  }

  // ---- Modals ----
  function openModal(name) {
    $('edit-modal').classList.toggle('hidden', name !== 'edit');
    $('delete-modal').classList.toggle('hidden', name !== 'delete');
  }

  function openEdit(team) {
    $('edit-id').value = team.id;
    $('edit-team-name').value = team.name;
    $('edit-city').value = team.origin_city || '';
    $('edit-contact-name').value = team.contact_name || '';
    $('edit-contact-phone').value = team.contact_phone || '';
    $('edit-contact-email').value = team.contact_email || '';
    $('edit-schedule').value = team.scheduled_time ? team.scheduled_time.slice(0, 16) : '';
    $('edit-status').value = team.status;
    $('edit-notes').value = team.notes || '';
    openModal('edit');
  }

  function openDelete(id) {
    const team = state.teams.find(x => x.id === id);
    $('delete-name').textContent = team ? `Vas a eliminar a ${team.name} y todos sus bailarines.` : 'Esta acción no se puede deshacer.';
    $('delete-modal').dataset.target = id;
    openModal('delete');
  }

  // ---- Events ----
  document.addEventListener('click', async (e) => {
    const closeBtn = e.target.closest('[data-close-modal]');
    if (closeBtn) { openModal(null); return; }

    const musicBtn = e.target.closest('[data-music]');
    if (musicBtn) { playMusic(musicBtn.getAttribute('data-music')); return; }

    const statusBtn = e.target.closest('[data-status-change]');
    if (statusBtn) {
      const id = statusBtn.getAttribute('data-status-change');
      const team = state.teams.find(x => x.id === id);
      if (!team) return;
      const next = team.status === 'pending' ? 'confirmed' : (team.status === 'confirmed' ? 'rejected' : (team.status === 'rejected' ? 'waitlist' : 'pending'));
      try {
        await changeStatus(id, next);
        team.status = next;
        applyFilters();
        renderDashboard();
        toast(`Estatus → ${STATUS_LABELS[next].label}`);
      } catch (err) {
        console.error(err);
        toast('Error al cambiar estatus', false);
      }
      return;
    }

    const mainRow = e.target.closest('.team-main-row');
    if (mainRow) {
      await toggleTeam(mainRow.getAttribute('data-team'), mainRow);
      return;
    }

    const removeDancerBtn = e.target.closest('[data-remove-dancer]');
    if (removeDancerBtn) {
      const did = removeDancerBtn.getAttribute('data-remove-dancer');
      const tid = removeDancerBtn.getAttribute('data-team');
      try {
        await removeDancer(did);
        state.dancersByTeam[tid] = (state.dancersByTeam[tid] || []).filter(d => d.id !== did);
        renderTable();
        renderDashboard();
        toast('Bailarín eliminado');
      } catch (err) {
        console.error(err);
        toast('Error al eliminar bailarín', false);
      }
      return;
    }

    const editBtn = e.target.closest('[data-edit]');
    if (editBtn) {
      const team = state.teams.find(x => x.id === editBtn.getAttribute('data-edit'));
      if (team) openEdit(team);
      return;
    }

    const delBtn = e.target.closest('[data-delete]');
    if (delBtn) { openDelete(delBtn.getAttribute('data-delete')); return; }

    if (e.target.id === 'btn-confirm-delete') {
      const id = $('delete-modal').dataset.target;
      try {
        await removeTeam(id);
        state.teams = state.teams.filter(x => x.id !== id);
        delete state.dancersByTeam[id];
        state.expanded.delete(id);
        applyFilters();
        renderDashboard();
        openModal(null);
        toast('Equipo eliminado');
      } catch (err) {
        console.error(err);
        toast('Error al eliminar', false);
      }
      return;
    }
  });

  $('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('edit-id').value;
    const fields = {
      name: $('edit-team-name').value.trim(),
      origin_city: $('edit-city').value.trim(),
      contact_name: $('edit-contact-name').value.trim(),
      contact_phone: $('edit-contact-phone').value.trim(),
      contact_email: $('edit-contact-email').value.trim(),
      scheduled_time: $('edit-schedule').value ? new Date($('edit-schedule').value).toISOString() : null,
      status: $('edit-status').value,
      notes: $('edit-notes').value.trim()
    };
    try {
      await saveEdit(id, fields);
      const team = state.teams.find(x => x.id === id);
      Object.assign(team, fields);
      applyFilters();
      renderDashboard();
      openModal(null);
      toast('Cambios guardados');
    } catch (err) {
      console.error(err);
      toast('Error al guardar', false);
    }
  });

  ['search-input', 'filter-city', 'filter-status'].forEach(id => {
    $(id).addEventListener('input', (e) => {
      if (id === 'search-input') state.search = e.target.value;
      if (id === 'filter-city') state.city = e.target.value;
      if (id === 'filter-status') state.status = e.target.value;
      applyFilters();
    });
  });

  $('page-prev').addEventListener('click', () => { if (state.page > 1) { state.page--; renderTable(); } });
  $('page-next').addEventListener('click', () => {
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.perPage));
    if (state.page < totalPages) { state.page++; renderTable(); }
  });

  $('btn-export').addEventListener('click', exportCSV);

  $('btn-logout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
  });

  // ---- Init ----
  (async function init() {
    try {
      await guard();
      state.teams = await fetchTeams();
      // Pre-cargar bailarines de todos los equipos
      for (const t of state.teams) {
        state.dancersByTeam[t.id] = t.participants || [];
      }
      populateCityFilter();
      applyFilters();
      renderDashboard();
      $('auth-loading').classList.add('hidden');
    } catch (err) {
      console.error(err);
      $('auth-loading').innerHTML = `<div class="text-center space-y-3"><p class="text-red-400 text-sm">No se pudo cargar el panel.</p><p class="text-brand-white-muted/40 text-xs">${esc(err.message)}</p></div>`;
    }
  })();

})();