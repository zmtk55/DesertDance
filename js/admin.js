(function () {
  'use strict';

  // ============================================================
  // CONSTANTS
  // ============================================================
  const BUCKET = 'team-files';
  const BUCKET_DOCS = 'team-docs';
  
  const STATUS_LABELS = {
    pending: { label: 'Pendiente', dot: '#e8ab4a' },
    confirmed: { label: 'Confirmado', dot: '#d8e723' },
    rejected: { label: 'Rechazado', dot: '#ef4444' },
    waitlist: { label: 'Lista de espera', dot: '#7fb3d8' }
  };

  const PAYMENT_STATUS = {
    pending: { label: 'Pendiente', color: '#e8ab4a', bg: 'rgba(232,171,74,0.12)' },
    partial: { label: 'Parcial', color: '#7fb3d8', bg: 'rgba(127,179,216,0.12)' },
    completed: { label: 'Pagado', color: '#d8e723', bg: 'rgba(216,231,35,0.12)' },
    overdue: { label: 'Vencido', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    refunded: { label: 'Reembolsado', color: '#9ca3af', bg: 'rgba(156,163,175,0.12)' }
  };

  // ============================================================
  // STATE
  // ============================================================
  const state = {
    teams: [],
    dancersByTeam: {},
    teamData: {},
    categories: [],
    eventSettings: {},
    adminUsers: [],
    filtered: [],
    page: 1,
    perPage: 12,
    search: '',
    city: '',
    status: '',
    expanded: new Set(),
    currentView: localStorage.getItem('dd-admin-view') || 'table',
    recentTeams: JSON.parse(localStorage.getItem('dd-recent-teams') || '[]'),
    deleteTarget: null
  };

  const viewState = {
    get current() { return state.currentView; },
    set(view) {
      state.currentView = view;
      localStorage.setItem('dd-admin-view', view);
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  
  function formatAmount(n) {
    return new Intl.NumberFormat('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n || 0);
  }

  function formatBytes(bytes) {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
  }

  function toast(msg, ok = true) {
    const t = $('toast');
    t.textContent = msg;
    t.className = `toast fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 mx-auto w-fit max-w-full text-center z-[70] px-5 py-3 rounded-xl text-sm font-semibold border ${ok ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-red-500/15 border-red-500/30 text-red-400'} shadow-[0_0_30px_rgba(0,0,0,0.4)]`;
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 3000);
  }

  function addRecentTeam(team) {
    state.recentTeams = state.recentTeams.filter(t => t.id !== team.id);
    state.recentTeams.unshift({ id: team.id, name: team.name });
    state.recentTeams = state.recentTeams.slice(0, 5);
    localStorage.setItem('dd-recent-teams', JSON.stringify(state.recentTeams));
  }

  // ============================================================
  // AUTH
  // ============================================================
  async function guard() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.href = 'login.html'; return null; }
    $('admin-email').textContent = session.user.email;
    return session;
  }

  // ============================================================
  // DATA FETCHING
  // ============================================================
  async function fetchAll() {
    const [teams, categories, settings, admins] = await Promise.all([
      supabase.from('teams').select('*, participants(id, full_name, technique, division, routine_title, email, status)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('event_settings').select('*'),
      supabase.from('admin_users').select('*')
    ]);
    
    if (teams.error) throw teams.error;
    state.teams = teams.data || [];
    
    state.categories = (categories.data || []).sort((a, b) => a.sort_order - b.sort_order);
    
    state.eventSettings = {};
    (settings.data || []).forEach(s => { state.eventSettings[s.key] = s.value; });
    
    state.adminUsers = admins.data || [];
    
    for (const t of state.teams) {
      state.dancersByTeam[t.id] = t.participants || [];
    }
  }

  async function fetchTeamData(teamId) {
    if (state.teamData[teamId]) return state.teamData[teamId];
    
    const [payments, docs, comms] = await Promise.all([
      supabase.from('payments').select('*').eq('team_id', teamId).order('created_at', { ascending: false }),
      supabase.from('documents').select('*').eq('team_id', teamId).order('uploaded_at', { ascending: false }),
      supabase.from('communication_log').select('*').eq('team_id', teamId).order('sent_at', { ascending: false })
    ]);
    
    const paymentsData = payments.data || [];
    state.teamData[teamId] = {
      payments: {
        all: paymentsData,
        paid: paymentsData.filter(p => p.status === 'completed').reduce((s, p) => s + Number(p.amount), 0),
        pending: paymentsData.filter(p => !['completed', 'refunded'].includes(p.status)).reduce((s, p) => s + Number(p.amount), 0)
      },
      documents: docs.data || [],
      communications: comms.data || []
    };
    
    return state.teamData[teamId];
  }

  // ============================================================
  // CRUD OPERATIONS
  // ============================================================
  async function createTeam(data) {
    const id = crypto.randomUUID();
    const { error } = await supabase.from('teams').insert([{ id, ...data, status: data.status || 'pending' }]);
    if (error) throw error;
    return id;
  }

  async function updateTeam(id, data) {
    const { error } = await supabase.from('teams').update(data).eq('id', id);
    if (error) throw error;
  }

  async function deleteTeam(id) {
    const { error } = await supabase.from('teams').delete().eq('id', id);
    if (error) throw error;
  }

  async function createDancer(data) {
    const { error } = await supabase.from('participants').insert([data]);
    if (error) throw error;
  }

  async function updateDancer(id, data) {
    const { error } = await supabase.from('participants').update(data).eq('id', id);
    if (error) throw error;
  }

  async function deleteDancer(id) {
    const { error } = await supabase.from('participants').delete().eq('id', id);
    if (error) throw error;
  }

  async function createPayment(data) {
    const { error } = await supabase.from('payments').insert([data]);
    if (error) throw error;
  }

  async function updatePayment(id, data) {
    const { error } = await supabase.from('payments').update(data).eq('id', id);
    if (error) throw error;
  }

  async function deletePayment(id) {
    const { error } = await supabase.from('payments').delete().eq('id', id);
    if (error) throw error;
  }

  async function createCommLog(data) {
    const { error } = await supabase.from('communication_log').insert([data]);
    if (error) throw error;
  }

  async function updateSetting(key, value) {
    const { error } = await supabase.from('event_settings').upsert({ key, value }, { onConflict: 'key' });
    if (error) throw error;
  }

  async function createCategory(data) {
    const { data: created, error } = await supabase.from('categories').insert([data]).select('id').single();
    if (error) throw error;
    return created?.id;
  }

  async function updateCategory(id, data) {
    const { error } = await supabase.from('categories').update(data).eq('id', id);
    if (error) throw error;
  }

  async function deleteCategory(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  }

  async function createAdminUser(data) {
    const { data: created, error } = await supabase.from('admin_users').insert([data]).select('id').single();
    if (error) throw error;
    return created?.id;
  }

  async function updateAdminUser(id, data) {
    const { error } = await supabase.from('admin_users').update(data).eq('id', id);
    if (error) throw error;
  }

  async function deleteAdminUser(id) {
    const { error } = await supabase.from('admin_users').delete().eq('id', id);
    if (error) throw error;
  }

  // ============================================================
  // SIDEBAR
  // ============================================================
  function updateSidebar() {
    const hash = window.location.hash.slice(1) || '';
    const mainPart = hash.split('/')[0] || '';
    
    document.querySelectorAll('.nav-item').forEach(el => {
      const nav = el.dataset.nav;
      el.classList.toggle('active', nav === mainPart || (nav === 'dashboard' && !mainPart));
    });
    
    $('nav-count-teams').textContent = state.teams.length;
    
    const recent = $('recent-teams');
    recent.innerHTML = state.recentTeams.slice(0, 4).map(t => `
      <a href="#team/${t.id}" class="block px-3 py-2 rounded-lg text-xs text-brand-white-muted/50 hover:text-brand-lime hover:bg-brand-white-faint/5 transition-colors truncate">
        ${esc(t.name)}
      </a>
    `).join('');
  }

  function toggleSidebar() {
    const sb = $('sidebar');
    const ov = $('sidebar-overlay');
    const isOpen = sb.dataset.open === 'true';
    sb.dataset.open = isOpen ? 'false' : 'true';
    sb.classList.toggle('-translate-x-full', isOpen);
    ov.classList.toggle('hidden', isOpen);
  }

  // ============================================================
  // ROUTER
  // ============================================================
  function resolveRoute() {
    const hash = window.location.hash.slice(1) || '';
    const parts = hash.split('/').filter(Boolean);
    
    if (parts[0] === 'team' && parts[1]) {
      return { view: 'team', teamId: parts[1], section: parts[2] || 'info' };
    }
    if (parts[0] === 'teams') return { view: 'teams' };
    if (parts[0] === 'payments-global') return { view: 'payments-global' };
    if (parts[0] === 'categories') return { view: 'categories' };
    if (parts[0] === 'settings') return { view: 'settings' };
    if (parts[0] === 'admins') return { view: 'admins' };
    if (parts[0] === 'reports') return { view: 'reports' };
    return { view: 'dashboard' };
  }

  async function navigate() {
    const route = resolveRoute();
    updateSidebar();
    
    const main = $('main-content');
    main.innerHTML = '<div class="flex items-center justify-center py-20"><div class="w-8 h-8 border-2 border-brand-lime/30 border-t-brand-lime rounded-full animate-spin"></div></div>';
    
    try {
      switch (route.view) {
        case 'dashboard': renderDashboard(main); break;
        case 'teams': renderTeams(main); break;
        case 'team': await renderTeamDetail(route.teamId, route.section, main); break;
        case 'payments-global': await renderPaymentsGlobal(main); break;
        case 'categories': renderCategories(main); break;
        case 'settings': renderSettings(main); break;
        case 'admins': renderAdmins(main); break;
        case 'reports': renderReports(main); break;
      }
    } catch (err) {
      console.error(err);
      main.innerHTML = `<div class="text-center py-20"><p class="text-red-400">Error: ${esc(err.message)}</p></div>`;
    }
  }

  // ============================================================
  // RENDER: DASHBOARD
  // ============================================================
  function renderDashboard(container) {
    const total = state.teams.length;
    const count = (s) => state.teams.filter(t => t.status === s).length;
    const totalDancers = Object.values(state.dancersByTeam).reduce((a, d) => a + d.length, 0);
    
    container.innerHTML = `
      <div class="mb-8">
        <h2 class="font-title text-2xl md:text-3xl font-black text-brand-white mb-1">Panel <span class="italic-display italic text-brand-lime font-light">general</span></h2>
        <p class="text-brand-white-muted/40 text-sm">Resumen de Desert Dance 2026</p>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint">
          <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Equipos</p>
          <p class="font-title text-4xl font-black text-brand-white">${total}</p>
        </div>
        <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint">
          <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Bailarines</p>
          <p class="font-title text-4xl font-black text-brand-white">${totalDancers}</p>
        </div>
        <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint">
          <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Pendientes</p>
          <p class="font-title text-4xl font-black text-[#e8ab4a]">${count('pending')}</p>
        </div>
        <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint">
          <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Confirmados</p>
          <p class="font-title text-4xl font-black text-brand-lime">${count('confirmed')}</p>
        </div>
      </div>
      
      <div class="grid sm:grid-cols-3 gap-4 mb-8">
        <a href="#teams" class="bg-brand-dark-elevated/50 rounded-xl border border-brand-white-faint p-4 hover:border-brand-lime/30 transition-colors flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-brand-lime/10 flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
          <div><p class="font-bold text-brand-white text-sm">Ver equipos</p><p class="text-[10px] text-brand-white-muted/40">${total} registrados</p></div>
        </a>
        <button data-action="add-team" class="bg-brand-dark-elevated/50 rounded-xl border border-brand-white-faint p-4 hover:border-brand-lime/30 transition-colors flex items-center gap-3 text-left">
          <div class="w-10 h-10 rounded-lg bg-brand-lime/10 flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
          <div><p class="font-bold text-brand-white text-sm">Agregar equipo</p><p class="text-[10px] text-brand-white-muted/40">Registro manual</p></div>
        </button>
        <a href="#reports" class="bg-brand-dark-elevated/50 rounded-xl border border-brand-white-faint p-4 hover:border-brand-lime/30 transition-colors flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-brand-lime/10 flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div>
          <div><p class="font-bold text-brand-white text-sm">Reportes</p><p class="text-[10px] text-brand-white-muted/40">Exportar datos</p></div>
        </a>
      </div>
      
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-brand-white-muted/60 text-xs uppercase tracking-[0.2em] font-extrabold">Últimos registros</h3>
          <a href="#teams" class="text-brand-lime text-xs font-bold hover:underline">Ver todos</a>
        </div>
        <div class="space-y-2">
          ${state.teams.slice(0, 5).map(team => {
            const st = STATUS_LABELS[team.status] || STATUS_LABELS.pending;
            return `
              <a href="#team/${team.id}" class="flex items-center gap-3 bg-brand-dark-elevated/30 rounded-xl border border-brand-white-faint px-4 py-3 hover:border-brand-lime/30 transition-colors">
                ${team.logo_url ? `<img src="${esc(team.logo_url)}" class="w-8 h-8 rounded-lg object-contain bg-brand-dark/60 border border-brand-white-faint p-0.5">` : `<div class="w-8 h-8 rounded-lg bg-brand-white-faint flex items-center justify-center text-brand-white-muted/40 text-xs font-bold">${esc(team.name.charAt(0))}</div>`}
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-brand-white truncate">${esc(team.name)}</p>
                  <p class="text-[10px] text-brand-white-muted/40">${esc(team.origin_city || '—')}</p>
                </div>
                <span class="badge text-[10px] font-bold rounded-full px-2 py-0.5" style="color:${st.dot};background:${st.dot}12">${st.label}</span>
                <span class="text-[10px] text-brand-white-muted/30 hidden sm:block">${new Date(team.created_at).toLocaleDateString('es-MX')}</span>
              </a>`;
          }).join('') || '<p class="text-brand-white-muted/30 text-sm py-8 text-center">Sin equipos registrados</p>'}
        </div>
      </div>
    `;
  }

  // ============================================================
  // RENDER: TEAMS (con toggle de vistas)
  // ============================================================
  function applyFilters() {
    const q = state.search.toLowerCase();
    state.filtered = state.teams.filter(t => {
      const matchSearch = !q || t.name.toLowerCase().includes(q) || (t.origin_city || '').toLowerCase().includes(q) || (t.contact_name || '').toLowerCase().includes(q);
      const matchCity = !state.city || (t.origin_city || '').toLowerCase() === state.city.toLowerCase();
      const matchStatus = !state.status || t.status === state.status;
      return matchSearch && matchCity && matchStatus;
    });
    state.page = 1;
  }

  function renderTeams(container) {
    applyFilters();
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.perPage));
    const start = (state.page - 1) * state.perPage;
    const pageItems = state.filtered.slice(start, start + state.perPage);
    
    const cities = [...new Set(state.teams.map(t => t.origin_city).filter(Boolean))].sort();
    
    container.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 class="font-title text-2xl md:text-3xl font-black text-brand-white">Equipos</h2>
          <p class="text-brand-white-muted/40 text-xs mt-1">${state.filtered.length} de ${state.teams.length} equipos</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-1 bg-brand-dark-elevated/50 rounded-lg p-1 border border-brand-white-faint">
            <button data-view="table" class="view-toggle px-2.5 py-1.5 rounded-md text-xs font-bold transition-all ${viewState.current === 'table' ? 'active' : ''}" title="Tabla">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            </button>
            <button data-view="cards" class="view-toggle px-2.5 py-1.5 rounded-md text-xs font-bold transition-all ${viewState.current === 'cards' ? 'active' : ''}" title="Tarjetas">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </button>
            <button data-view="list" class="view-toggle px-2.5 py-1.5 rounded-md text-xs font-bold transition-all ${viewState.current === 'list' ? 'active' : ''}" title="Lista">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
          <button data-action="add-team" class="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-[0.1em] hover:bg-brand-lime-hover transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Agregar
          </button>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <div class="relative flex-1">
          <input id="teams-search" type="search" placeholder="Buscar equipo, ciudad, contacto..." value="${esc(state.search)}"
            class="w-full bg-brand-dark-elevated/70 border border-brand-white-faint rounded-xl px-4 py-2.5 pl-9 text-sm text-brand-white placeholder:text-brand-white-muted/25 focus:outline-none focus:border-brand-lime/40 transition-colors">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-white-muted/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </div>
        <select id="teams-filter-city" class="bg-brand-dark-elevated/70 border border-brand-white-faint rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40 transition-colors">
          <option value="">Todas las ciudades</option>
          ${cities.map(c => `<option ${state.city === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}
        </select>
        <select id="teams-filter-status" class="bg-brand-dark-elevated/70 border border-brand-white-faint rounded-xl px-4 py-2.5 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40 transition-colors">
          <option value="">Todos los estatus</option>
          ${Object.entries(STATUS_LABELS).map(([k, v]) => `<option value="${k}" ${state.status === k ? 'selected' : ''}>${v.label}</option>`).join('')}
        </select>
      </div>
      
      <div id="teams-view-container"></div>
      
      ${totalPages > 1 ? `
        <div class="flex items-center justify-between mt-6">
          <p class="text-xs text-brand-white-muted/40">Página ${state.page} de ${totalPages}</p>
          <div class="flex gap-2">
            <button id="page-prev" class="px-4 py-2 rounded-lg border border-brand-white-faint text-xs text-brand-white-muted/60 hover:text-brand-lime hover:border-brand-lime/40 disabled:opacity-30 disabled:pointer-events-none transition-colors" ${state.page <= 1 ? 'disabled' : ''}>‹ Anterior</button>
            <button id="page-next" class="px-4 py-2 rounded-lg border border-brand-white-faint text-xs text-brand-white-muted/60 hover:text-brand-lime hover:border-brand-lime/40 disabled:opacity-30 disabled:pointer-events-none transition-colors" ${state.page >= totalPages ? 'disabled' : ''}>Siguiente ›</button>
          </div>
        </div>
      ` : ''}
    `;
    
    renderTeamsView();
    bindTeamsEvents();
  }

  function renderTeamsView() {
    const container = $('teams-view-container');
    if (!container) return;
    
    const start = (state.page - 1) * state.perPage;
    const pageItems = state.filtered.slice(start, start + state.perPage);
    
    if (viewState.current === 'cards') {
      container.innerHTML = `<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">${pageItems.map(teamCard).join('')}</div>`;
    } else if (viewState.current === 'list') {
      container.innerHTML = `<div class="space-y-2">${pageItems.map(teamListItem).join('')}</div>`;
    } else {
      container.innerHTML = `
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm min-w-[800px]">
              <thead><tr class="border-b border-brand-white-faint text-left">
                <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Equipo</th>
                <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Contacto</th>
                <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Horario</th>
                <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Estatus</th>
                <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold text-right">Acciones</th>
              </tr></thead>
              <tbody>${pageItems.map(teamTableRow).join('')}</tbody>
            </table>
          </div>
        </div>`;
    }
  }

  function teamCard(team) {
    const st = STATUS_LABELS[team.status] || STATUS_LABELS.pending;
    const dancers = state.dancersByTeam[team.id]?.length || 0;
    return `
      <a href="#team/${team.id}" class="block bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-5 hover:border-brand-lime/30 hover:-translate-y-0.5 transition-all duration-300">
        <div class="flex items-center gap-3 mb-3">
          ${team.logo_url ? `<img src="${esc(team.logo_url)}" class="w-11 h-11 rounded-xl object-contain bg-brand-dark/60 border border-brand-white-faint p-1">` : `<div class="w-11 h-11 rounded-xl bg-brand-white-faint flex items-center justify-center text-brand-white-muted/40 font-title font-bold">${esc(team.name.charAt(0))}</div>`}
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-brand-white truncate text-sm">${esc(team.name)}</p>
            <p class="text-[10px] text-brand-white-muted/40">${esc(team.origin_city || '—')}</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="badge text-[10px] font-bold rounded-full px-2 py-0.5" style="color:${st.dot};background:${st.dot}12"><span class="badge-dot" style="background:${st.dot}"></span>${st.label}</span>
          <span class="text-[10px] text-brand-white-muted/40">${dancers} bailarines</span>
        </div>
      </a>`;
  }

  function teamListItem(team) {
    const st = STATUS_LABELS[team.status] || STATUS_LABELS.pending;
    const dancers = state.dancersByTeam[team.id]?.length || 0;
    return `
      <a href="#team/${team.id}" class="flex items-center gap-3 bg-brand-dark-elevated/30 rounded-xl border border-brand-white-faint px-4 py-3 hover:border-brand-lime/30 transition-colors">
        ${team.logo_url ? `<img src="${esc(team.logo_url)}" class="w-9 h-9 rounded-lg object-contain bg-brand-dark/60 border border-brand-white-faint p-0.5">` : `<div class="w-9 h-9 rounded-lg bg-brand-white-faint flex items-center justify-center text-brand-white-muted/40 text-xs font-bold">${esc(team.name.charAt(0))}</div>`}
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-brand-white truncate">${esc(team.name)}</p>
          <p class="text-[10px] text-brand-white-muted/40">${esc(team.origin_city || '—')} · ${esc(team.contact_name || '—')} · ${dancers} bailarines</p>
        </div>
        <span class="badge text-[10px] font-bold rounded-full px-2 py-0.5 hidden sm:flex" style="color:${st.dot};background:${st.dot}12">${st.label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-white-muted/30"><polyline points="9 18 15 12 9 6"/></svg>
      </a>`;
  }

  function teamTableRow(team) {
    const st = STATUS_LABELS[team.status] || STATUS_LABELS.pending;
    const dancers = state.dancersByTeam[team.id]?.length || 0;
    const sched = team.scheduled_time ? new Date(team.scheduled_time).toLocaleString('es-MX', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
    
    return `
      <tr class="border-b border-brand-white-faint/40 hover:bg-brand-white-faint/5 transition-colors">
        <td class="px-5 py-3">
          <div class="flex items-center gap-3">
            ${team.logo_url ? `<img src="${esc(team.logo_url)}" class="w-9 h-9 rounded-lg object-contain bg-brand-dark/60 border border-brand-white-faint p-1">` : `<div class="w-9 h-9 rounded-lg bg-brand-white-faint flex items-center justify-center text-brand-white-muted/40 text-xs font-bold">${esc(team.name.charAt(0))}</div>`}
            <div>
              <a href="#team/${team.id}" class="font-semibold text-brand-white hover:text-brand-lime transition-colors">${esc(team.name)}</a>
              <span class="block text-[10px] text-brand-white-muted/40">${esc(team.origin_city || '—')} · ${dancers} bailarines</span>
            </div>
          </div>
        </td>
        <td class="px-5 py-3 text-brand-white-muted/70 text-xs">
          <span class="block">${esc(team.contact_name || '—')}</span>
          <span class="block text-brand-white-muted/40">${esc(team.contact_phone || '')}</span>
        </td>
        <td class="px-5 py-3 text-brand-white-muted/70 text-xs">${sched}</td>
        <td class="px-5 py-3">
          <button data-action="cycle-status" data-id="${team.id}" class="badge text-[10px] font-bold rounded-full px-2.5 py-1 border transition-colors hover:border-brand-lime/30" style="border-color:${st.dot}40;color:${st.dot};background:${st.dot}12">
            <span class="badge-dot" style="background:${st.dot}"></span>${st.label}
          </button>
        </td>
        <td class="px-5 py-3">
          <div class="flex justify-end gap-1.5">
            <a href="#team/${team.id}" title="Ver" class="p-2 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-brand-lime hover:border-brand-lime/40 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </a>
            <button data-action="edit-team" data-id="${team.id}" title="Editar" class="p-2 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-brand-lime hover:border-brand-lime/40 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            </button>
            <button data-action="delete-team" data-id="${team.id}" title="Eliminar" class="p-2 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-red-400 hover:border-red-500/40 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
  }

  function bindTeamsEvents() {
    const search = $('teams-search');
    const filterCity = $('teams-filter-city');
    const filterStatus = $('teams-filter-status');
    
    if (search) search.addEventListener('input', (e) => { state.search = e.target.value; applyFilters(); renderTeamsView(); });
    if (filterCity) filterCity.addEventListener('change', (e) => { state.city = e.target.value; applyFilters(); renderTeamsView(); });
    if (filterStatus) filterStatus.addEventListener('change', (e) => { state.status = e.target.value; applyFilters(); renderTeamsView(); });
    
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        viewState.set(btn.dataset.view);
        document.querySelectorAll('.view-toggle').forEach(b => b.classList.toggle('active', b.dataset.view === viewState.current));
        renderTeamsView();
      });
    });
    
    $('page-prev')?.addEventListener('click', () => { if (state.page > 1) { state.page--; renderTeamsView(); } });
    $('page-next')?.addEventListener('click', () => { const tp = Math.ceil(state.filtered.length / state.perPage); if (state.page < tp) { state.page++; renderTeamsView(); } });
  }

  // ============================================================
  // RENDER: TEAM DETAIL
  // ============================================================
  async function renderTeamDetail(teamId, section, container) {
    const team = state.teams.find(t => t.id === teamId);
    if (!team) { container.innerHTML = '<p class="text-center py-20 text-brand-white-muted/40">Equipo no encontrado</p>'; return; }
    
    addRecentTeam(team);
    updateSidebar();
    
    const data = await fetchTeamData(teamId);
    const dancers = state.dancersByTeam[teamId] || [];
    const st = STATUS_LABELS[team.status] || STATUS_LABELS.pending;
    
    container.innerHTML = `
      <div class="flex items-center gap-2 text-xs text-brand-white-muted/40 mb-6">
        <a href="#teams" class="hover:text-brand-lime transition-colors">Equipos</a>
        <span>/</span>
        <span class="text-brand-white">${esc(team.name)}</span>
      </div>
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-4">
          ${team.logo_url ? `<img src="${esc(team.logo_url)}" class="w-14 h-14 rounded-2xl object-contain bg-brand-dark-elevated border border-brand-white-faint p-1.5">` : `<div class="w-14 h-14 rounded-2xl bg-brand-white-faint flex items-center justify-center text-brand-white-muted/40 font-title font-bold text-xl">${esc(team.name.charAt(0))}</div>`}
          <div>
            <h1 class="font-title text-xl md:text-2xl font-black text-brand-white">${esc(team.name)}</h1>
            <p class="text-sm text-brand-white-muted/50">${esc(team.origin_city || '—')} · ${esc(team.contact_name || '—')}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button data-action="cycle-status" data-id="${team.id}" class="badge text-xs font-bold rounded-full px-3 py-1.5 border" style="border-color:${st.dot}40;color:${st.dot};background:${st.dot}12"><span class="badge-dot" style="background:${st.dot}"></span>${st.label}</button>
          <button data-action="edit-team" data-id="${team.id}" class="px-3 py-1.5 rounded-lg border border-brand-white-faint text-xs font-bold text-brand-white-muted/70 hover:text-brand-lime hover:border-brand-lime/40 transition-colors">Editar</button>
        </div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div class="bg-brand-dark-elevated/50 rounded-xl p-4 border border-brand-white-faint">
          <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-wider font-extrabold mb-1">Bailarines</p>
          <p class="font-title text-2xl font-black text-brand-white">${dancers.length}</p>
        </div>
        <div class="bg-brand-dark-elevated/50 rounded-xl p-4 border border-brand-white-faint">
          <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-wider font-extrabold mb-1">Pagado</p>
          <p class="font-title text-2xl font-black text-brand-lime">$${formatAmount(data.payments.paid)}</p>
        </div>
        <div class="bg-brand-dark-elevated/50 rounded-xl p-4 border border-brand-white-faint">
          <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-wider font-extrabold mb-1">Pendiente</p>
          <p class="font-title text-2xl font-black text-[#e8ab4a]">$${formatAmount(data.payments.pending)}</p>
        </div>
        <div class="bg-brand-dark-elevated/50 rounded-xl p-4 border border-brand-white-faint">
          <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-wider font-extrabold mb-1">Docs</p>
          <p class="font-title text-2xl font-black text-brand-white">${data.documents.length}</p>
        </div>
      </div>
      
      <div class="flex gap-1 mb-6 border-b border-brand-white-faint overflow-x-auto">
        ${['info', 'dancers', 'payments', 'documents', 'calendar', 'comms'].map(s => `
          <button data-section="${s}" class="tab-btn px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${section === s ? 'text-brand-lime border-brand-lime' : 'text-brand-white-muted/40 border-transparent hover:text-brand-white'}">
            ${{ info: 'Info', dancers: 'Bailarines', payments: 'Pagos', documents: 'Docs', calendar: 'Calendario', comms: 'Comunicación' }[s]}
          </button>
        `).join('')}
      </div>
      
      <div id="tab-content"></div>
    `;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.hash = `team/${teamId}/${btn.dataset.section}`;
      });
    });
    
    renderTabContent(team, data, section);
  }

  function renderTabContent(team, data, section) {
    const container = $('tab-content');
    switch (section) {
      case 'dancers': renderDancersTab(team, container); break;
      case 'payments': renderPaymentsTab(team, data, container); break;
      case 'documents': renderDocumentsTab(team, data, container); break;
      case 'calendar': renderCalendarTab(team, container); break;
      case 'comms': renderCommsTab(team, data, container); break;
      default: renderInfoTab(team, container);
    }
  }

  // -- Tab: Info --
  function renderInfoTab(team, container) {
    container.innerHTML = `
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6">
          <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-4">Datos del equipo</p>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between"><span class="text-brand-white-muted/50">Nombre</span><span class="text-brand-white font-medium">${esc(team.name)}</span></div>
            <div class="flex justify-between"><span class="text-brand-white-muted/50">Ciudad</span><span class="text-brand-white font-medium">${esc(team.origin_city || '—')}</span></div>
            <div class="flex justify-between"><span class="text-brand-white-muted/50">Contacto</span><span class="text-brand-white font-medium">${esc(team.contact_name || '—')}</span></div>
            <div class="flex justify-between"><span class="text-brand-white-muted/50">Teléfono</span><span class="text-brand-white font-medium">${esc(team.contact_phone || '—')}</span></div>
            <div class="flex justify-between"><span class="text-brand-white-muted/50">Email</span><span class="text-brand-white font-medium">${esc(team.contact_email || '—')}</span></div>
            <div class="flex justify-between"><span class="text-brand-white-muted/50">Categoría</span><span class="text-brand-white font-medium">${esc(catById(team.category_id)?.name || '—')}</span></div>
          </div>
        </div>
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6">
          <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-4">Programación</p>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between"><span class="text-brand-white-muted/50">Horario</span><span class="text-brand-white font-medium">${team.scheduled_time ? new Date(team.scheduled_time).toLocaleString('es-MX') : '—'}</span></div>
            <div class="flex justify-between"><span class="text-brand-white-muted/50">Registro</span><span class="text-brand-white font-medium">${new Date(team.created_at).toLocaleDateString('es-MX')}</span></div>
            <div class="flex justify-between"><span class="text-brand-white-muted/50">Última actualización</span><span class="text-brand-white font-medium">${new Date(team.updated_at).toLocaleDateString('es-MX')}</span></div>
          </div>
          ${team.notes ? `<div class="mt-4 pt-4 border-t border-brand-white-faint"><p class="text-[10px] text-brand-white-muted/40 uppercase tracking-wider font-extrabold mb-2">Notas</p><p class="text-sm text-brand-white-muted/70">${esc(team.notes)}</p></div>` : ''}
        </div>
      </div>`;
  }

  // -- Tab: Dancers --
  function renderDancersTab(team, container) {
    const dancers = state.dancersByTeam[team.id] || [];
    container.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-title text-lg font-black text-brand-white">Bailarines (${dancers.length})</h3>
        <button data-action="add-dancer" data-team="${team.id}" class="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-[0.1em] hover:bg-brand-lime-hover transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar
        </button>
      </div>
      ${dancers.length === 0 ? '<p class="text-center py-12 text-brand-white-muted/30 text-sm">Sin bailarines registrados</p>' : `
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
          <table class="w-full text-sm"><thead><tr class="border-b border-brand-white-faint text-left">
            <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Nombre</th>
            <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Técnica</th>
            <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">División</th>
            <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold text-right">Acciones</th>
          </tr></thead><tbody>
            ${dancers.map(d => `
              <tr class="border-b border-brand-white-faint/40 hover:bg-brand-white-faint/5">
                <td class="px-5 py-3 font-semibold text-brand-white">${esc(d.full_name)}</td>
                <td class="px-5 py-3 text-brand-white-muted/70">${esc(d.technique || '—')}</td>
                <td class="px-5 py-3 text-brand-white-muted/70">${esc(d.division || '—')}</td>
                <td class="px-5 py-3">
                  <div class="flex justify-end gap-1.5">
                    <button data-action="edit-dancer" data-id="${d.id}" class="p-1.5 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-brand-lime hover:border-brand-lime/40 transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                    <button data-action="delete-dancer" data-id="${d.id}" data-team="${team.id}" class="p-1.5 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-red-400 hover:border-red-500/40 transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                  </div>
                </td>
              </tr>`).join('')}
          </tbody></table>
        </div>`}`;
  }

  // -- Tab: Payments --
  function renderPaymentsTab(team, data, container) {
    const payments = data.payments.all;
    container.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-title text-lg font-black text-brand-white">Pagos</h3>
        <button data-action="add-payment" data-team="${team.id}" class="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-[0.1em] hover:bg-brand-lime-hover transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Registrar pago
        </button>
      </div>
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="bg-brand-dark-elevated/50 rounded-xl p-3 border border-brand-white-faint text-center"><p class="text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Pagado</p><p class="font-title text-xl font-black text-brand-lime">$${formatAmount(data.payments.paid)}</p></div>
        <div class="bg-brand-dark-elevated/50 rounded-xl p-3 border border-brand-white-faint text-center"><p class="text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Pendiente</p><p class="font-title text-xl font-black text-[#e8ab4a]">$${formatAmount(data.payments.pending)}</p></div>
        <div class="bg-brand-dark-elevated/50 rounded-xl p-3 border border-brand-white-faint text-center"><p class="text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Total</p><p class="font-title text-xl font-black text-brand-white">${payments.length}</p></div>
      </div>
      ${payments.length === 0 ? '<p class="text-center py-12 text-brand-white-muted/30 text-sm">Sin pagos registrados</p>' : `
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
          <table class="w-full text-sm"><thead><tr class="border-b border-brand-white-faint text-left">
            <th class="px-4 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Concepto</th>
            <th class="px-4 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Monto</th>
            <th class="px-4 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Estado</th>
            <th class="px-4 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Vence</th>
            <th class="px-4 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold text-right">Acciones</th>
          </tr></thead><tbody>
            ${payments.map(p => {
              const ps = PAYMENT_STATUS[p.status] || PAYMENT_STATUS.pending;
              return `
                <tr class="border-b border-brand-white-faint/40 hover:bg-brand-white-faint/5">
                  <td class="px-4 py-3 text-brand-white font-medium">${esc(p.concept)}${p.reference ? `<span class="block text-[10px] text-brand-white-muted/40">Ref: ${esc(p.reference)}</span>` : ''}</td>
                  <td class="px-4 py-3 font-title font-bold text-brand-white">$${formatAmount(p.amount)}</td>
                  <td class="px-4 py-3"><span class="badge text-[10px] font-bold rounded-full px-2 py-0.5" style="color:${ps.color};background:${ps.bg}">${ps.label}</span></td>
                  <td class="px-4 py-3 text-brand-white-muted/70 text-xs">${p.due_date ? new Date(p.due_date).toLocaleDateString('es-MX') : '—'}</td>
                  <td class="px-4 py-3">
                    <div class="flex justify-end gap-1.5">
                      <button data-action="edit-payment" data-id="${p.id}" class="p-1.5 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-brand-lime hover:border-brand-lime/40 transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                      <button data-action="delete-payment" data-id="${p.id}" class="p-1.5 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-red-400 hover:border-red-500/40 transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                    </div>
                  </td>
                </tr>`;
            }).join('')}
          </tbody></table>
        </div>`}`;
  }

  // -- Tab: Documents --
  function renderDocumentsTab(team, data, container) {
    const docs = data.documents;
    container.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-title text-lg font-black text-brand-white">Documentos</h3>
        <label class="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-[0.1em] hover:bg-brand-lime-hover transition-colors cursor-pointer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Subir
          <input type="file" id="upload-doc-input" class="hidden" accept="image/*,audio/*,.pdf,.doc,.docx" data-team="${team.id}">
        </label>
      </div>
      ${docs.length === 0 ? '<p class="text-center py-12 text-brand-white-muted/30 text-sm">Sin documentos</p>' : `
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${docs.map(d => `
            <div class="bg-brand-dark-elevated/50 rounded-xl border border-brand-white-faint p-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-brand-white-faint flex items-center justify-center text-brand-white-muted/40 flex-shrink-0">
                ${d.type === 'logo' ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/></svg>' : d.type === 'music' ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>'}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-brand-white truncate">${esc(d.name)}</p>
                <p class="text-[10px] text-brand-white-muted/40">${formatBytes(d.file_size || 0)}</p>
              </div>
              <div class="flex gap-1">
                <a href="${esc(d.file_url)}" target="_blank" class="p-1.5 rounded-lg text-brand-white-muted/50 hover:text-brand-lime transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/></svg></a>
                <button data-action="delete-doc" data-id="${d.id}" class="p-1.5 rounded-lg text-brand-white-muted/50 hover:text-red-400 transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
              </div>
            </div>`).join('')}
        </div>`}`;
  }

  // -- Tab: Calendar --
  function renderCalendarTab(team, container) {
    const sched = team.scheduled_time ? new Date(team.scheduled_time) : null;
    const schedValue = team.scheduled_time ? team.scheduled_time.slice(0, 16) : '';
    container.innerHTML = `
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6">
          <div class="flex items-center justify-between mb-4">
            <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Presentación</p>
            <button data-action="edit-schedule" data-team="${team.id}" class="text-[10px] font-bold uppercase tracking-wider text-brand-lime hover:underline">Editar</button>
          </div>
          <div id="schedule-display">
            ${sched ? `<div class="flex items-center gap-4"><div class="w-14 h-14 rounded-xl bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center"><span class="font-title text-2xl font-black text-brand-lime">${sched.getDate()}</span></div><div><p class="font-title text-lg font-bold text-brand-white">${sched.toLocaleDateString('es-MX', { weekday: 'long', month: 'long', year: 'numeric' })}</p><p class="text-brand-white-muted/50 text-sm">${sched.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hrs</p></div></div>` : '<p class="text-brand-white-muted/30 text-sm text-center py-6">Sin horario asignado</p>'}
          </div>
          <div id="schedule-edit" class="hidden mt-4">
            <input id="inline-schedule" type="datetime-local" value="${schedValue}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40 transition-colors">
            <div class="flex gap-2 mt-3">
              <button id="save-schedule" data-team="${team.id}" class="flex-1 bg-brand-lime text-brand-dark font-extrabold text-xs uppercase tracking-[0.12em] py-2.5 rounded-xl hover:bg-brand-lime-hover transition-colors">Guardar</button>
              <button id="cancel-schedule" class="flex-1 border border-brand-white-faint text-brand-white-muted/70 font-bold text-xs py-2.5 rounded-xl hover:text-brand-white transition-colors">Cancelar</button>
            </div>
          </div>
        </div>
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6">
          <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-4">Evento</p>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between"><span class="text-brand-white-muted/50">Fechas F1</span><span class="text-brand-white">${esc(state.eventSettings.event_dates_phase1 || '—')}</span></div>
            <div class="flex justify-between"><span class="text-brand-white-muted/50">Fechas F2</span><span class="text-brand-white">${esc(state.eventSettings.event_dates_phase2 || '—')}</span></div>
            <div class="flex justify-between"><span class="text-brand-white-muted/50">Ubicación</span><span class="text-brand-white">${esc(state.eventSettings.event_location || '—')}</span></div>
          </div>
        </div>
      </div>`;
  }

  // -- Tab: Comms --
  function renderCommsTab(team, data, container) {
    const comms = data.communications;
    container.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-title text-lg font-black text-brand-white">Comunicación</h3>
        <div class="flex gap-2">
          <button data-action="add-comm" data-team="${team.id}" class="inline-flex items-center gap-2 border border-brand-white-faint text-brand-white-muted/70 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-[0.1em] hover:text-brand-lime hover:border-brand-lime/40 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Nota
          </button>
          ${team.contact_phone ? `<a href="https://wa.me/52${team.contact_phone.replace(/\D/g, '')}" target="_blank" class="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-[0.1em] hover:bg-emerald-500/25 transition-colors">WhatsApp</a>` : ''}
        </div>
      </div>
      ${comms.length === 0 ? '<p class="text-center py-12 text-brand-white-muted/30 text-sm">Sin registros</p>' : `
        <div class="space-y-3">
          ${comms.map(c => `
            <div class="bg-brand-dark-elevated/50 rounded-xl border border-brand-white-faint p-4 flex gap-3">
              <div class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${c.direction === 'outbound' ? 'bg-brand-lime/10' : 'bg-brand-white-faint'}">
                ${c.direction === 'outbound' ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-white-muted/40"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>'}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-bold text-brand-white capitalize">${esc(c.channel)}</span>
                  <span class="text-[10px] text-brand-white-muted/30">·</span>
                  <span class="text-[10px] text-brand-white-muted/40">${new Date(c.sent_at).toLocaleString('es-MX')}</span>
                </div>
                ${c.subject ? `<p class="text-sm font-medium text-brand-white mb-0.5">${esc(c.subject)}</p>` : ''}
                <p class="text-sm text-brand-white-muted/60">${esc(c.message || '')}</p>
              </div>
            </div>`).join('')}
        </div>`}`;
  }

  // ============================================================
  // RENDER: PAYMENTS GLOBAL
  // ============================================================
  async function renderPaymentsGlobal(container) {
    await Promise.all(state.teams.map(t => fetchTeamData(t.id)));
    const allPayments = Object.entries(state.teamData).flatMap(([tid, td]) => (td.payments?.all || []).map(p => ({ ...p, _teamName: state.teams.find(t => t.id === tid)?.name || '?' })));
    const totalPaid = allPayments.filter(p => p.status === 'completed').reduce((s, p) => s + Number(p.amount), 0);
    const totalPending = allPayments.filter(p => !['completed', 'refunded'].includes(p.status)).reduce((s, p) => s + Number(p.amount), 0);
    
    container.innerHTML = `
      <div class="mb-8">
        <h2 class="font-title text-2xl md:text-3xl font-black text-brand-white mb-1">Pagos <span class="italic-display italic text-brand-lime font-light">globales</span></h2>
        <p class="text-brand-white-muted/40 text-sm">Resumen financiero</p>
      </div>
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint"><p class="text-[10px] text-brand-white-muted/40 uppercase font-extrabold mb-1">Cobrado</p><p class="font-title text-3xl font-black text-brand-lime">$${formatAmount(totalPaid)}</p></div>
        <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint"><p class="text-[10px] text-brand-white-muted/40 uppercase font-extrabold mb-1">Pendiente</p><p class="font-title text-3xl font-black text-[#e8ab4a]">$${formatAmount(totalPending)}</p></div>
        <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint"><p class="text-[10px] text-brand-white-muted/40 uppercase font-extrabold mb-1">Transacciones</p><p class="font-title text-3xl font-black text-brand-white">${allPayments.length}</p></div>
      </div>
      ${allPayments.length === 0 ? '<p class="text-center py-12 text-brand-white-muted/30">Sin pagos registrados</p>' : `
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
          <table class="w-full text-sm"><thead><tr class="border-b border-brand-white-faint text-left">
            <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Equipo</th>
            <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Concepto</th>
            <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Monto</th>
            <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Estado</th>
            <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Vence</th>
          </tr></thead><tbody>
            ${allPayments.map(p => {
              const ps = PAYMENT_STATUS[p.status] || PAYMENT_STATUS.pending;
              return `<tr class="border-b border-brand-white-faint/40 hover:bg-brand-white-faint/5 cursor-pointer" onclick="location.hash='team/${p.team_id}/payments'">
                <td class="px-5 py-3 text-brand-white font-medium">${esc(p._teamName)}</td>
                <td class="px-5 py-3 text-brand-white-muted/70">${esc(p.concept)}</td>
                <td class="px-5 py-3 font-title font-bold text-brand-white">$${formatAmount(p.amount)}</td>
                <td class="px-5 py-3"><span class="badge text-[10px] font-bold rounded-full px-2 py-0.5" style="color:${ps.color};background:${ps.bg}">${ps.label}</span></td>
                <td class="px-5 py-3 text-brand-white-muted/70 text-xs">${p.due_date ? new Date(p.due_date).toLocaleDateString('es-MX') : '—'}</td>
              </tr>`;
            }).join('')}
          </tbody></table>
        </div>`}`;
  }

  // ============================================================
  // RENDER: CATEGORIES
  // ============================================================
  function renderCategories(container) {
    container.innerHTML = `
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-title text-2xl md:text-3xl font-black text-brand-white">Categorías</h2>
        <button data-action="add-category" class="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-[0.1em] hover:bg-brand-lime-hover transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar
        </button>
      </div>
      <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
        <table class="w-full text-sm"><thead><tr class="border-b border-brand-white-faint text-left">
          <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Nombre</th>
          <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Descripción</th>
          <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Máx.</th>
          <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Estado</th>
          <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold text-right">Acciones</th>
        </tr></thead><tbody>
          ${state.categories.map(c => `
            <tr class="border-b border-brand-white-faint/40 hover:bg-brand-white-faint/5">
              <td class="px-5 py-3 font-semibold text-brand-white">${esc(c.name)}</td>
              <td class="px-5 py-3 text-brand-white-muted/70 text-xs">${esc(c.description || '—')}</td>
              <td class="px-5 py-3 text-brand-white-muted/70">${c.max_participants}</td>
              <td class="px-5 py-3"><span class="badge text-[10px] font-bold rounded-full px-2 py-0.5" style="color:${c.is_active ? '#d8e723' : '#ef4444'};background:${c.is_active ? 'rgba(216,231,35,0.12)' : 'rgba(239,68,68,0.12)'}">${c.is_active ? 'Activa' : 'Inactiva'}</span></td>
              <td class="px-5 py-3">
                <div class="flex justify-end gap-1.5">
                  <button data-action="edit-category" data-id="${c.id}" class="p-1.5 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-brand-lime hover:border-brand-lime/40 transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                  <button data-action="delete-category" data-id="${c.id}" class="p-1.5 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-red-400 hover:border-red-500/40 transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody></table>
      </div>`;
  }

  // ============================================================
  // RENDER: SETTINGS
  // ============================================================
  function renderSettings(container) {
    const s = state.eventSettings;
    container.innerHTML = `
      <h2 class="font-title text-2xl md:text-3xl font-black text-brand-white mb-6">Configuración</h2>
      <form id="settings-form" class="space-y-6 max-w-3xl">
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6">
          <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-4">Evento</p>
          <div class="grid sm:grid-cols-2 gap-4">
            <div><label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-1.5">Nombre</label><input name="event_name" value="${esc(s.event_name || '')}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40"></div>
            <div><label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-1.5">Ubicación</label><input name="event_location" value="${esc(s.event_location || '')}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40"></div>
            <div><label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-1.5">Fechas Fase 1</label><input name="event_dates_phase1" value="${esc(s.event_dates_phase1 || '')}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40"></div>
            <div><label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-1.5">Fechas Fase 2</label><input name="event_dates_phase2" value="${esc(s.event_dates_phase2 || '')}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40"></div>
          </div>
        </div>
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6">
          <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-4">Precios</p>
          <div class="grid sm:grid-cols-2 gap-4">
            <div><label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-1.5">Early bird (equipo)</label><input name="early_bird_price_team" type="number" value="${s.early_bird_price_team || ''}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40"></div>
            <div><label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-1.5">Regular (equipo)</label><input name="regular_price_team" type="number" value="${s.regular_price_team || ''}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40"></div>
            <div><label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-1.5">Bailarín adicional</label><input name="price_extra_dancer" type="number" value="${s.price_extra_dancer || ''}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40"></div>
            <div><label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-1.5">Límite bailarines/equipo</label><input name="max_dancers_per_team" type="number" value="${s.max_dancers_per_team || ''}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40"></div>
          </div>
        </div>
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6">
          <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-4">Registro</p>
          <div class="grid sm:grid-cols-2 gap-4">
            <div><label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-1.5">Límite early bird</label><input name="early_bird_deadline" type="date" value="${s.early_bird_deadline || ''}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40"></div>
            <div><label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-1.5">Registro</label><select name="registration_open" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40"><option value="true" ${s.registration_open === 'true' ? 'selected' : ''}>Abierto</option><option value="false" ${s.registration_open === 'false' ? 'selected' : ''}>Cerrado</option></select></div>
            <div><label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-1.5">WhatsApp</label><input name="contact_whatsapp" value="${esc(s.contact_whatsapp || '')}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40"></div>
            <div><label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-1.5">Email</label><input name="contact_email" type="email" value="${esc(s.contact_email || '')}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40"></div>
          </div>
        </div>
        <div class="flex justify-end"><button type="submit" class="bg-brand-lime text-brand-dark font-extrabold text-xs uppercase tracking-[0.12em] px-8 py-3 rounded-xl hover:bg-brand-lime-hover transition-colors">Guardar</button></div>
      </form>`;
    
    $('settings-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      for (const [key, value] of fd.entries()) {
        await updateSetting(key, value);
        state.eventSettings[key] = value;
      }
      toast('Configuración guardada');
    });
  }

  // ============================================================
  // RENDER: ADMINS
  // ============================================================
  function renderAdmins(container) {
    container.innerHTML = `
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-title text-2xl md:text-3xl font-black text-brand-white">Administradores</h2>
        <button data-action="add-admin" class="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-[0.1em] hover:bg-brand-lime-hover transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar
        </button>
      </div>
      <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
        <table class="w-full text-sm"><thead><tr class="border-b border-brand-white-faint text-left">
          <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Email</th>
          <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Nombre</th>
          <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Rol</th>
          <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold">Estado</th>
          <th class="px-5 py-3 text-[10px] text-brand-white-muted/40 uppercase font-extrabold text-right">Acciones</th>
        </tr></thead><tbody>
          ${state.adminUsers.map(a => `
            <tr class="border-b border-brand-white-faint/40 hover:bg-brand-white-faint/5">
              <td class="px-5 py-3 text-brand-white">${esc(a.email)}</td>
              <td class="px-5 py-3 text-brand-white-muted/70">${esc(a.name || '—')}</td>
              <td class="px-5 py-3"><span class="badge text-[10px] font-bold rounded-full px-2 py-0.5 bg-brand-lime/10 text-brand-lime">${esc(a.role)}</span></td>
              <td class="px-5 py-3"><span class="badge text-[10px] font-bold rounded-full px-2 py-0.5" style="color:${a.is_active ? '#d8e723' : '#ef4444'};background:${a.is_active ? 'rgba(216,231,35,0.12)' : 'rgba(239,68,68,0.12)'}">${a.is_active ? 'Activo' : 'Inactivo'}</span></td>
              <td class="px-5 py-3">
                <div class="flex justify-end gap-1.5">
                  <button data-action="edit-admin" data-id="${a.id}" class="p-1.5 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-brand-lime hover:border-brand-lime/40 transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                  <button data-action="delete-admin" data-id="${a.id}" class="p-1.5 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-red-400 hover:border-red-500/40 transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody></table>
      </div>`;
  }

  // ============================================================
  // RENDER: REPORTS
  // ============================================================
  function renderReports(container) {
    container.innerHTML = `
      <h2 class="font-title text-2xl md:text-3xl font-black text-brand-white mb-6">Reportes</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button data-action="export-teams" class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-5 text-left hover:border-brand-lime/30 transition-colors">
          <div class="w-10 h-10 rounded-lg bg-brand-lime/10 flex items-center justify-center mb-3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
          <p class="font-bold text-brand-white text-sm mb-0.5">Exportar equipos</p>
          <p class="text-[10px] text-brand-white-muted/40">CSV con todos los equipos</p>
        </button>
        <button data-action="export-dancers" class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-5 text-left hover:border-brand-lime/30 transition-colors">
          <div class="w-10 h-10 rounded-lg bg-brand-lime/10 flex items-center justify-center mb-3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg></div>
          <p class="font-bold text-brand-white text-sm mb-0.5">Exportar bailarines</p>
          <p class="text-[10px] text-brand-white-muted/40">CSV con participantes</p>
        </button>
        <button data-action="export-payments" class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-5 text-left hover:border-brand-lime/30 transition-colors">
          <div class="w-10 h-10 rounded-lg bg-brand-lime/10 flex items-center justify-center mb-3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
          <p class="font-bold text-brand-white text-sm mb-0.5">Exportar pagos</p>
          <p class="text-[10px] text-brand-white-muted/40">CSV con transacciones</p>
        </button>
      </div>`;
  }

  // ============================================================
  // MODALS
  // ============================================================
  function openModal(name) {
    ['team', 'dancer', 'payment', 'delete'].forEach(n => {
      $(n + '-modal').classList.toggle('hidden', n !== name);
    });
  }

const catById = (id) => state.categories.find(c => c.id === id) || null;

  function openTeamModal(team = null) {
    $('team-modal-title').textContent = team ? 'Editar equipo' : ' agregar equipo';
    $('tf-id').value = team?.id || '';
    $('tf-name').value = team?.name || '';
    $('tf-city').value = team?.origin_city || '';
    $('tf-contact').value = team?.contact_name || '';
    $('tf-phone').value = team?.contact_phone || '';
    $('tf-email').value = team?.contact_email || '';
    $('tf-schedule').value = team?.scheduled_time ? team.scheduled_time.slice(0, 16) : '';
    $('tf-status').value = team?.status || 'pending';
    $('tf-notes').value = team?.notes || '';

    // Dropdown de categorías: opcional, con los valores del catálogo de la BD.
    const catSel = $('tf-category');
    catSel.innerHTML = '<option value="">— Sin categoría —</option>'
      + state.categories.map(c => `<option value="${esc(c.id)}" ${team?.category_id === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
    if (team?.category_id) catSel.value = team.category_id;

    openModal('team');
  }

function openDancerModal(teamId, dancer = null) {
    $('dancer-modal-title').textContent = dancer ? 'Editar bailarín' : ' agregar bailarín';
    $('df-id').value = dancer?.id || '';
    $('df-team-id').value = teamId;
    $('df-name').value = dancer?.full_name || '';
    $('df-technique').value = dancer?.technique || '';
    $('df-division').value = dancer?.division || '';
    $('df-routine').value = dancer?.routine_title || '';

    // Dropdown de categorías: opcional, con los valores del catálogo de la BD.
    const catSel = $('df-category');
    catSel.innerHTML = '<option value="">— Sin categoría —</option>'
      + state.categories.map(c => `<option value="${esc(c.id)}" ${dancer?.category_id === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
    if (dancer?.category_id) catSel.value = dancer.category_id;

    openModal('dancer');
  }

  function openPaymentModal(teamId, payment = null) {
    $('payment-modal-title').textContent = payment ? 'Editar pago' : 'Registrar pago';
    $('pf-id').value = payment?.id || '';
    $('pf-team-id').value = teamId;
    $('pf-concept').value = payment?.concept || '';
    $('pf-amount').value = payment?.amount || '';
    $('pf-status').value = payment?.status || 'pending';
    $('pf-due').value = payment?.due_date || '';
    $('pf-paid').value = payment?.paid_date || '';
    $('pf-method').value = payment?.payment_method || '';
    $('pf-reference').value = payment?.reference || '';
    $('pf-notes').value = payment?.notes || '';
    openModal('payment');
  }

  function openCategoryModal(cat = null) {
    $('category-modal-title').textContent = cat ? 'Editar categoría' : 'Agregar categoría';
    $('cf-id').value = cat?.id || '';
    $('cf-name').value = cat?.name || '';
    $('cf-description').value = cat?.description || '';
    $('cf-max').value = cat?.max_participants || 8;
    $('cf-sort').value = cat?.sort_order || 0;
    $('cf-active').value = cat?.is_active !== false ? 'true' : 'false';
    openModal('category');
  }

  function openAdminModal(admin = null) {
    $('admin-modal-title').textContent = admin ? 'Editar administrador' : 'Agregar administrador';
    $('af-id').value = admin?.id || '';
    $('af-email').value = admin?.email || '';
    $('af-name').value = admin?.name || '';
    $('af-role').value = admin?.role || 'admin';
    $('af-active').value = admin?.is_active !== false ? 'true' : 'false';
    openModal('admin');
  }

  function openDeleteModal(title, message, onConfirm) {
    $('delete-title').textContent = title;
    $('delete-message').textContent = message;
    state.deleteTarget = onConfirm;
    openModal('delete');
  }

  // ============================================================
  // EVENT HANDLERS (delegated)
  // ============================================================
  document.addEventListener('click', async (e) => {
    // Close modals
    if (e.target.closest('[data-close-modal]')) { openModal(null); return; }
    if (e.target.id === 'btn-confirm-delete' && state.deleteTarget) {
      try { await state.deleteTarget(); openModal(null); toast('Eliminado'); } catch (err) { toast(err.message, false); }
      return;
    }
    
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    const teamId = btn.dataset.team;
    
    try {
      switch (action) {
        case 'add-team': openTeamModal(); break;
        case 'edit-team': { const t = state.teams.find(x => x.id === id); if (t) openTeamModal(t); break; }
        case 'delete-team': { const t = state.teams.find(x => x.id === id); openDeleteModal('¿Eliminar equipo?', `Vas a eliminar a ${t?.name || 'este equipo'} y todos sus datos.`, async () => { await deleteTeam(id); state.teams = state.teams.filter(x => x.id !== id); delete state.dancersByTeam[id]; delete state.teamData[id]; navigate(); }); break; }
        case 'cycle-status': { const t = state.teams.find(x => x.id === id); if (!t) break; const order = ['pending', 'confirmed', 'rejected', 'waitlist']; const next = order[(order.indexOf(t.status) + 1) % order.length]; await updateTeam(id, { status: next }); t.status = next; navigate(); toast(`Estatus → ${STATUS_LABELS[next].label}`); break; }
        case 'add-dancer': openDancerModal(teamId); break;
        case 'edit-dancer': { const d = (state.dancersByTeam[resolveRoute().teamId] || []).find(x => x.id === id); if (d) openDancerModal(d.team_id, d); break; }
        case 'delete-dancer': openDeleteModal('¿Eliminar bailarín?', 'Esta acción no se puede deshacer.', async () => { await deleteDancer(id); const tid = resolveRoute().teamId; state.dancersByTeam[tid] = (state.dancersByTeam[tid] || []).filter(x => x.id !== id); delete state.teamData[tid]; navigate(); }); break;
        case 'add-payment': openPaymentModal(teamId); break;
        case 'edit-payment': { const tid = resolveRoute().teamId; const d = state.teamData[tid]; const p = d?.payments?.all?.find(x => x.id === id); if (p) openPaymentModal(tid, p); break; }
        case 'delete-payment': openDeleteModal('¿Eliminar pago?', 'Esta acción no se puede deshacer.', async () => { await deletePayment(id); const tid = resolveRoute().teamId; delete state.teamData[tid]; navigate(); }); break;
        case 'add-category': openCategoryModal(); break;
        case 'edit-category': { const c = state.categories.find(x => x.id === id); if (c) openCategoryModal(c); break; }
        case 'delete-category': openDeleteModal('¿Eliminar categoría?', 'Esta acción no se puede deshacer.', async () => { await deleteCategory(id); state.categories = state.categories.filter(x => x.id !== id); navigate(); toast('Categoría eliminada'); }); break;
        case 'add-admin': openAdminModal(); break;
        case 'edit-admin': { const a = state.adminUsers.find(x => x.id === id); if (a) openAdminModal(a); break; }
        case 'delete-admin': openDeleteModal('¿Eliminar administrador?', 'Esta acción no se puede deshacer.', async () => { await deleteAdminUser(id); state.adminUsers = state.adminUsers.filter(x => x.id !== id); navigate(); toast('Administrador eliminado'); }); break;
        case 'edit-schedule': { document.getElementById('schedule-display').classList.add('hidden'); document.getElementById('schedule-edit').classList.remove('hidden'); break; }
        case 'export-teams': exportCSV('teams'); break;
        case 'export-dancers': exportCSV('dancers'); break;
        case 'export-payments': exportCSV('payments'); break;
        case 'add-comm': { const msg = prompt('Nota de comunicación:'); if (msg) { await createCommLog({ team_id: teamId, channel: 'in_person', direction: 'outbound', subject: 'Nota manual', message: msg }); delete state.teamData[teamId]; navigate(); toast('Nota registrada'); } break; }
      }
    } catch (err) { console.error(err); toast(err.message, false); }
  });

  // Team form
  $('team-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('tf-id').value;
    const data = {
      name: $('tf-name').value.trim(),
      origin_city: $('tf-city').value.trim(),
      contact_name: $('tf-contact').value.trim(),
      contact_phone: $('tf-phone').value.trim(),
      contact_email: $('tf-email').value.trim(),
      category_id: $('tf-category').value || null,
      scheduled_time: $('tf-schedule').value ? new Date($('tf-schedule').value).toISOString() : null,
      status: $('tf-status').value,
      notes: $('tf-notes').value.trim()
    };
    try {
      if (id) {
        await updateTeam(id, data);
        const t = state.teams.find(x => x.id === id);
        Object.assign(t, data);
        toast('Equipo actualizado');
      } else {
        const newId = await createTeam(data);
        state.teams.unshift({ id: newId, ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
        state.dancersByTeam[newId] = [];
        toast('Equipo creado');
      }
      openModal(null);
      navigate();
    } catch (err) { toast(err.message, false); }
  });

  // Dancer form
  $('dancer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('df-id').value;
    const teamId = $('df-team-id').value;
    const team = state.teams.find(t => t.id === teamId);
    const data = {
      team_id: teamId,
      full_name: $('df-name').value.trim(),
      technique: $('df-technique').value.trim(),
      division: $('df-division').value.trim(),
      routine_title: $('df-routine').value.trim(),
      category_id: $('df-category').value || null,
      email: team?.contact_email || '',
      school_name: team?.name || '',
      status: 'pending'
    };
    try {
      if (id) {
        await updateDancer(id, data);
      } else {
        await createDancer(data);
      }
      delete state.teamData[teamId];
      const { data: dancers, error: dancersError } = await supabase
        .from('participants').select('*').eq('team_id', teamId).order('created_at', { ascending: true });
      if (dancersError) throw dancersError;
      state.dancersByTeam[teamId] = dancers || [];
      openModal(null);
      navigate();
      toast(id ? 'Bailarín actualizado' : 'Bailarín agregado');
    } catch (err) { toast(err.message, false); }
  });

  // Payment form
  $('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('pf-id').value;
    const teamId = $('pf-team-id').value;
    const data = {
      team_id: teamId,
      concept: $('pf-concept').value.trim(),
      amount: parseFloat($('pf-amount').value),
      status: $('pf-status').value,
      due_date: $('pf-due').value || null,
      paid_date: $('pf-paid').value || null,
      payment_method: $('pf-method').value,
      reference: $('pf-reference').value.trim(),
      notes: $('pf-notes').value.trim()
    };
    try {
      if (id) {
        await updatePayment(id, data);
      } else {
        await createPayment(data);
      }
      delete state.teamData[teamId];
      openModal(null);
      navigate();
      toast(id ? 'Pago actualizado' : 'Pago registrado');
    } catch (err) { toast(err.message, false); }
  });

  // Upload doc
  document.addEventListener('change', async (e) => {
    if (e.target.id === 'upload-doc-input') {
      const file = e.target.files[0];
      const teamId = e.target.dataset.team;
      if (!file || !teamId) return;
      try {
        const path = `docs/${teamId}_${Date.now()}_${file.name}`;
        const { error } = await supabase.storage.from(BUCKET_DOCS).upload(path, file);
        if (error) throw error;
        const { data } = supabase.storage.from(BUCKET_DOCS).getPublicUrl(path);
        await supabase.from('documents').insert([{
          team_id: teamId,
          type: file.type.startsWith('image') ? 'photo' : file.type.startsWith('audio') ? 'music' : 'other',
          name: file.name,
          file_path: path,
          file_url: data.publicUrl,
          file_size: file.size,
          mime_type: file.type
        }]);
        delete state.teamData[teamId];
        navigate();
        toast('Documento subido');
      } catch (err) { toast(err.message, false); }
      e.target.value = '';
    }
  });

  // Delete doc
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action="delete-doc"]');
    if (!btn) return;
    const id = btn.dataset.id;
    openDeleteModal('¿Eliminar documento?', 'Esta acción no se puede deshacer.', async () => {
      await supabase.from('documents').delete().eq('id', id);
      const tid = resolveRoute().teamId;
      if (tid) delete state.teamData[tid];
      navigate();
    });
  });

  // Category form
  $('category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('cf-id').value;
    const data = {
      name: $('cf-name').value.trim(),
      description: $('cf-description').value.trim(),
      max_participants: parseInt($('cf-max').value) || 8,
      sort_order: parseInt($('cf-sort').value) || 0,
      is_active: $('cf-active').value === 'true'
    };
    try {
      if (id) {
        await updateCategory(id, data);
        const c = state.categories.find(x => x.id === id);
        Object.assign(c, data);
        toast('Categoría actualizada');
      } else {
        const newId = await createCategory(data);
        state.categories.push({ id: newId, ...data });
        state.categories.sort((a, b) => a.sort_order - b.sort_order);
        toast('Categoría creada');
      }
      openModal(null);
      navigate();
    } catch (err) { toast(err.message, false); }
  });

  // Admin form
  $('admin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('af-id').value;
    const data = {
      email: $('af-email').value.trim(),
      name: $('af-name').value.trim(),
      role: $('af-role').value,
      is_active: $('af-active').value === 'true'
    };
    try {
      if (id) {
        await updateAdminUser(id, data);
        const a = state.adminUsers.find(x => x.id === id);
        Object.assign(a, data);
        toast('Administrador actualizado');
      } else {
        const newId = await createAdminUser(data);
        state.adminUsers.push({ id: newId, ...data });
        toast('Administrador creado');
      }
      openModal(null);
      navigate();
    } catch (err) { toast(err.message, false); }
  });

  // Inline schedule edit
  document.addEventListener('click', async (e) => {
    if (e.target.id === 'save-schedule') {
      const teamId = e.target.dataset.team;
      const val = document.getElementById('inline-schedule').value;
      const scheduled_time = val ? new Date(val).toISOString() : null;
      try {
        await updateTeam(teamId, { scheduled_time });
        const t = state.teams.find(x => x.id === teamId);
        if (t) t.scheduled_time = scheduled_time;
        delete state.teamData[teamId];
        navigate();
        toast('Horario actualizado');
      } catch (err) { toast(err.message, false); }
    }
    if (e.target.id === 'cancel-schedule') {
      document.getElementById('schedule-display').classList.remove('hidden');
      document.getElementById('schedule-edit').classList.add('hidden');
    }
  });

  // Sidebar toggle
  $('btn-toggle-sidebar').addEventListener('click', toggleSidebar);

  // Sidebar nav
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (window.innerWidth < 1024) toggleSidebar();
    });
  });

  // Logout
  $('btn-logout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
  });

  // Hash change
  window.addEventListener('hashchange', navigate);

  // ============================================================
  // EXPORT CSV
  // ============================================================
  function exportCSV(type) {
    let headers, rows;
    
    if (type === 'teams') {
      headers = ['Equipo', 'Ciudad', 'Contacto', 'Teléfono', 'Email', 'Categoría', 'Estatus', 'Horario', 'Registro'];
      rows = state.teams.map(t => [t.name, t.origin_city || '', t.contact_name || '', t.contact_phone || '', t.contact_email || '', t.category || '', STATUS_LABELS[t.status]?.label || t.status, t.scheduled_time || '', t.created_at]);
    } else if (type === 'dancers') {
      headers = ['Equipo', 'Nombre', 'Técnica', 'División', 'Rutina'];
      rows = state.teams.flatMap(t => (state.dancersByTeam[t.id] || []).map(d => [t.name, d.full_name, d.technique || '', d.division || '', d.routine_title || '']));
    } else if (type === 'payments') {
      headers = ['Equipo', 'Concepto', 'Monto', 'Estado', 'Vencimiento', 'Pago', 'Método', 'Referencia'];
      rows = Object.entries(state.teamData).flatMap(([tid, td]) => (td.payments?.all || []).map(p => [state.teams.find(t => t.id === tid)?.name || '', p.concept, p.amount, PAYMENT_STATUS[p.status]?.label || p.status, p.due_date || '', p.paid_date || '', p.payment_method || '', p.reference || '']));
    }
    
    if (!rows.length) { toast('Sin datos para exportar', false); return; }
    
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `desert-dance-${type}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('CSV exportado');
  }

  // ============================================================
  // INIT
  // ============================================================
  (async function init() {
    try {
      await guard();
      await fetchAll();
      navigate();
      $('auth-loading').classList.add('hidden');
    } catch (err) {
      console.error(err);
      $('auth-loading').innerHTML = `<div class="text-center space-y-3"><p class="text-red-400 text-sm">Error al cargar</p><p class="text-brand-white-muted/40 text-xs">${esc(err.message)}</p></div>`;
    }
  })();

})();
