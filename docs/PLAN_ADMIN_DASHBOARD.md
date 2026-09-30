# Plan: Admin Dashboard Individual por Equipo

**Fecha:** Septiembre 2026  
**Objetivo:** Dashboard completo con CRUD, finanzas, calendario y comunicación  
**Archivos:** `admin.html`, `js/admin.js` (reestructurar)

---

## ESTRUCTURA ACTUAL

### Tablas Existentes (Supabase)

**`teams`:**
```
id, name, origin_city, contact_name, contact_phone, contact_email,
logo_path, logo_url, status, scheduled_time, notes, music_url, created_at
```

**`participants`:**
```
id, full_name, technique, division, status, email, team_id, school_name
```

---

## NUEVAS TABLAS NECESARIAS

### 1. `payments` — Pagos y finanzas
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'MXN',
  concept TEXT NOT NULL,           -- 'Inscripción', 'Bailarín adicional', 'Workshop extra'
  status TEXT DEFAULT 'pending',   -- 'pending', 'partial', 'completed', 'overdue', 'refunded'
  due_date DATE,
  paid_date DATE,
  payment_method TEXT,             -- 'transfer', 'cash', 'paypal', 'other'
  reference TEXT,                  -- Número de referencia/folio
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. `documents` — Documentos del equipo
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  type TEXT NOT NULL,              -- 'logo', 'music', 'choreography', 'other'
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);
```

### 3. `communication_log` — Log de comunicación
```sql
CREATE TABLE communication_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,           -- 'whatsapp', 'email', 'phone', 'other'
  direction TEXT NOT NULL,         -- 'inbound', 'outbound'
  subject TEXT,
  message TEXT,
  sent_at TIMESTAMPTZ DEFAULT now(),
  sent_by TEXT                     -- 'admin', 'system'
);
```

### 4. `reminders` — Recordatorios
```sql
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  type TEXT NOT NULL,              -- 'payment', 'document', 'general'
  message TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ,
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## NAVEGACIÓN

### Hash-based Routing
```
admin.html                    → Dashboard General
admin.html#team/{id}          → Dashboard Individual del Equipo
admin.html#team/{id}/payments → Sección de Pagos
admin.html#team/{id}/docs     → Sección de Documentos
```

### Layout con Sidebar
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (fijo)                                              │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│ SIDEBAR  │  CONTENIDO PRINCIPAL                             │
│ (280px)  │                                                  │
│          │  - Dashboard General: stats + tabla               │
│ - Logo   │  - Dashboard Individual: info equipo + tabs      │
│ - Buscar │    - Info General                                │
│ - Lista  │    - Bailarines (CRUD)                           │
│   equipos│    - Pagos/Finanzas                              │
│ - Filtros│    - Documentos                                  │
│          │    - Calendario                                  │
│          │    - Comunicación                                │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

---

## FASE 1: Estructura Base

### 1.1 Actualizar `admin.html`

**Cambios en el layout:**
```html
<body class="font-body antialiased">
  <!-- Auth guard (existente) -->
  
  <!-- Header (existente - minimizar) -->
  
  <!-- Layout principal -->
  <div class="flex pt-16 min-h-screen">
    
    <!-- SIDEBAR -->
    <aside id="sidebar" class="fixed left-0 top-16 bottom-0 w-[280px] bg-brand-dark-elevated/70 border-r border-brand-white-faint overflow-y-auto z-30">
      <!-- Logo en sidebar -->
      <div class="p-5 border-b border-brand-white-faint">
        <img src="assets/logos/d_mark.svg" alt="" class="h-8 w-auto mb-3">
        <p class="font-title font-black text-brand-white text-sm">Desert Dance</p>
        <p class="text-[9px] text-brand-white-muted/40 uppercase tracking-[0.15em]">Panel de Administración</p>
      </div>
      
      <!-- Búsqueda -->
      <div class="p-4">
        <div class="relative">
          <input id="sidebar-search" type="search" placeholder="Buscar equipo..."
            class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-2.5 pl-9 text-sm text-brand-white placeholder:text-brand-white-muted/25 focus:outline-none focus:border-brand-lime/40">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-white-muted/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </div>
      </div>
      
      <!-- Filtros rápidos -->
      <div class="px-4 pb-3 flex gap-2">
        <select id="sidebar-filter-status" class="flex-1 bg-brand-dark/50 border border-brand-white-faint rounded-lg px-3 py-2 text-xs text-brand-white focus:outline-none focus:border-brand-lime/40">
          <option value="">Todos</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmados</option>
          <option value="rejected">Rechazados</option>
        </select>
      </div>
      
      <!-- Lista de equipos -->
      <nav id="team-list" class="px-3 pb-4 space-y-1">
        <!-- Se llena dinámicamente -->
      </nav>
      
      <!-- Botón volver al general -->
      <div class="p-4 border-t border-brand-white-faint hidden" id="back-to-general">
        <button class="w-full text-left px-4 py-3 rounded-xl text-sm text-brand-white-muted/60 hover:text-brand-lime hover:bg-brand-white-faint/5 transition-colors flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          Volver al panel general
        </button>
      </div>
    </aside>
    
    <!-- CONTENIDO PRINCIPAL -->
    <main id="main-content" class="flex-1 ml-[280px] px-6 md:px-10 py-8 pb-24">
      <!-- Se llena dinámicamente según la ruta -->
    </main>
    
  </div>
</body>
```

### 1.2 Crear estructura de routing en `admin.js`

```javascript
// ---- Routing ----
const router = {
  routes: {
    '': 'dashboard',
    'team/:id': 'team-detail',
    'team/:id/payments': 'team-payments',
    'team/:id/documents': 'team-documents',
    'team/:id/calendar': 'team-calendar',
    'team/:id/comms': 'team-comms'
  },
  
  current: null,
  
  init() {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  },
  
  resolve() {
    const hash = window.location.hash.slice(1) || '';
    const parts = hash.split('/').filter(Boolean);
    
    if (parts[0] === 'team' && parts[1]) {
      this.current = {
        view: 'team-detail',
        teamId: parts[1],
        section: parts[2] || 'info'
      };
    } else {
      this.current = { view: 'dashboard' };
    }
    
    this.render();
  },
  
  render() {
    if (this.current.view === 'dashboard') {
      renderDashboardGeneral();
    } else if (this.current.view === 'team-detail') {
      renderTeamDetail(this.current.teamId, this.current.section);
    }
    updateSidebar();
  },
  
  navigate(hash) {
    window.location.hash = hash;
  }
};
```

---

## FASE 2: Sidebar con Lista de Equipos

### Renderizar lista en sidebar
```javascript
function renderSidebarTeams() {
  const container = $('team-list');
  const searchTerm = $('sidebar-search').value.toLowerCase();
  const statusFilter = $('sidebar-filter-status').value;
  
  const filtered = state.teams.filter(t => {
    const matchSearch = !searchTerm || 
      t.name.toLowerCase().includes(searchTerm) ||
      t.origin_city?.toLowerCase().includes(searchTerm);
    const matchStatus = !statusFilter || t.status === statusFilter;
    return matchSearch && matchStatus;
  });
  
  const currentTeamId = router.current?.teamId;
  
  container.innerHTML = filtered.map(team => {
    const isActive = team.id === currentTeamId;
    const st = STATUS_LABELS[team.status];
    const dancers = state.dancersByTeam[team.id]?.length || 0;
    
    return `
      <a href="#team/${team.id}" 
         class="block px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-brand-lime/10 border border-brand-lime/20' : 'hover:bg-brand-white-faint/5 border border-transparent'}">
        <div class="flex items-center gap-3">
          ${team.logo_url 
            ? `<img src="${esc(team.logo_url)}" class="w-9 h-9 rounded-lg object-contain bg-brand-dark/60 border border-brand-white-faint p-1">`
            : `<div class="w-9 h-9 rounded-lg bg-brand-white-faint flex items-center justify-center text-brand-white-muted/40">
                <span class="font-title font-bold text-sm">${esc(team.name.charAt(0))}</span>
              </div>`
          }
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-brand-white truncate ${isActive ? 'text-brand-lime' : ''}">${esc(team.name)}</p>
            <p class="text-[10px] text-brand-white-muted/40">${esc(team.origin_city || '—')} · ${dancers} bailarines</p>
          </div>
          <span class="badge-dot" style="background:${st.dot}"></span>
        </div>
      </a>
    `;
  }).join('');
}
```

---

## FASE 3: Dashboard Individual — Info del Equipo

### Layout del Dashboard Individual
```javascript
async function renderTeamDetail(teamId, section = 'info') {
  const team = state.teams.find(t => t.id === teamId);
  if (!team) { router.navigate(''); return; }
  
  // Cargar datos adicionales si no los tenemos
  await loadTeamData(teamId);
  
  const teamData = state.teamData[teamId];
  
  $('main-content').innerHTML = `
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-xs text-brand-white-muted/40 mb-6">
      <a href="#" class="hover:text-brand-lime transition-colors">Inicio</a>
      <span>/</span>
      <span class="text-brand-white">${esc(team.name)}</span>
    </div>
    
    <!-- Header del equipo -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div class="flex items-center gap-4">
        ${team.logo_url 
          ? `<img src="${esc(team.logo_url)}" class="w-16 h-16 rounded-2xl object-contain bg-brand-dark-elevated border border-brand-white-faint p-2">`
          : `<div class="w-16 h-16 rounded-2xl bg-brand-white-faint flex items-center justify-center text-brand-white-muted/40">
              <span class="font-title font-bold text-2xl">${esc(team.name.charAt(0))}</span>
            </div>`
        }
        <div>
          <h1 class="font-title text-2xl md:text-3xl font-black text-brand-white">${esc(team.name)}</h1>
          <p class="text-sm text-brand-white-muted/50">${esc(team.origin_city || 'Sin ciudad')} · ${esc(team.contact_name || 'Sin contacto')}</p>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <button data-status-change="${team.id}" class="badge text-xs font-bold rounded-full px-4 py-2 border transition-colors hover:border-brand-lime/30"
          style="border-color:${STATUS_LABELS[team.status].dot}40;color:${STATUS_LABELS[team.status].dot};background:${STATUS_LABELS[team.status].dot}12">
          <span class="badge-dot" style="background:${STATUS_LABELS[team.status].dot}"></span>
          ${STATUS_LABELS[team.status].label}
        </button>
        <button data-edit="${team.id}" class="px-4 py-2 rounded-xl border border-brand-white-faint text-xs font-bold text-brand-white-muted/70 hover:text-brand-lime hover:border-brand-lime/40 transition-colors">
          Editar
        </button>
      </div>
    </div>
    
    <!-- Stats rápidas -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Bailarines</p>
        <p class="font-title text-3xl font-black text-brand-white">${teamData.dancers.length}</p>
      </div>
      <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Pagado</p>
        <p class="font-title text-3xl font-black text-brand-lime">$${formatAmount(teamData.payments.paid)}</p>
      </div>
      <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Pendiente</p>
        <p class="font-title text-3xl font-black text-[#e8ab4a]">$${formatAmount(teamData.payments.pending)}</p>
      </div>
      <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Documentos</p>
        <p class="font-title text-3xl font-black text-brand-white">${teamData.documents.length}</p>
      </div>
    </div>
    
    <!-- Tabs de navegación -->
    <div class="flex gap-1 mb-6 border-b border-brand-white-faint overflow-x-auto">
      <button data-tab="info" class="tab-btn px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${section === 'info' ? 'text-brand-lime border-brand-lime' : 'text-brand-white-muted/40 border-transparent hover:text-brand-white'}">
        Información
      </button>
      <button data-tab="dancers" class="tab-btn px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${section === 'dancers' ? 'text-brand-lime border-brand-lime' : 'text-brand-white-muted/40 border-transparent hover:text-brand-white'}">
        Bailarines
      </button>
      <button data-tab="payments" class="tab-btn px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${section === 'payments' ? 'text-brand-lime border-brand-lime' : 'text-brand-white-muted/40 border-transparent hover:text-brand-white'}">
        Pagos
      </button>
      <button data-tab="documents" class="tab-btn px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${section === 'documents' ? 'text-brand-lime border-brand-lime' : 'text-brand-white-muted/40 border-transparent hover:text-brand-white'}">
        Documentos
      </button>
      <button data-tab="calendar" class="tab-btn px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${section === 'calendar' ? 'text-brand-lime border-brand-lime' : 'text-brand-white-muted/40 border-transparent hover:text-brand-white'}">
        Calendario
      </button>
      <button data-tab="comms" class="tab-btn px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${section === 'comms' ? 'text-brand-lime border-brand-lime' : 'text-brand-white-muted/40 border-transparent hover:text-brand-white'}">
        Comunicación
      </button>
    </div>
    
    <!-- Contenido del tab -->
    <div id="tab-content">
      ${renderTabContent(team, teamData, section)}
    </div>
  `;
  
  // Event listeners para tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      router.navigate(`team/${teamId}/${btn.dataset.tab}`);
    });
  });
}
```

---

## FASE 4: Tab — Bailarines (CRUD Completo)

```javascript
function renderDancersTab(team, dancers) {
  return `
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-title text-xl font-black text-brand-white">Bailarines</h3>
      <button data-add-dancer="${team.id}" class="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-[0.1em] hover:bg-brand-lime-hover transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Agregar bailarín
      </button>
    </div>
    
    ${dancers.length === 0 
      ? `<div class="text-center py-12 bg-brand-dark-elevated/30 rounded-2xl border border-brand-white-faint">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto mb-4 text-brand-white-muted/20">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <p class="text-brand-white-muted/40 text-sm mb-4">Sin bailarines registrados</p>
          <button data-add-dancer="${team.id}" class="text-brand-lime text-sm font-bold hover:underline">+ Agregar el primero</button>
        </div>`
      : `<div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-brand-white-faint text-left">
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Nombre</th>
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Técnica</th>
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">División</th>
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Estatus</th>
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${dancers.map(d => `
                <tr class="border-b border-brand-white-faint/40 hover:bg-brand-white-faint/5 transition-colors">
                  <td class="px-5 py-4">
                    <span class="font-semibold text-brand-white">${esc(d.full_name)}</span>
                  </td>
                  <td class="px-5 py-4 text-brand-white-muted/70">${esc(d.technique || '—')}</td>
                  <td class="px-5 py-4 text-brand-white-muted/70">${esc(d.division || '—')}</td>
                  <td class="px-5 py-4">
                    <span class="badge text-[10px] font-bold rounded-full px-2 py-1" 
                      style="color:${d.status === 'active' ? '#d8e723' : '#ef4444'};background:${d.status === 'active' ? 'rgba(216,231,35,0.12)' : 'rgba(239,68,68,0.12)'}">
                      ${d.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td class="px-5 py-4">
                    <div class="flex justify-end gap-2">
                      <button data-edit-dancer="${d.id}" title="Editar" class="p-2 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-brand-lime hover:border-brand-lime/40 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      </button>
                      <button data-remove-dancer="${d.id}" data-team="${team.id}" title="Eliminar" class="p-2 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-red-400 hover:border-red-500/40 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>`
    }
  `;
}
```

### Modal para agregar/editar bailarín
```html
<!-- Dancer modal -->
<div id="dancer-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" data-close-modal="dancer"></div>
  <div class="relative bg-brand-dark-elevated rounded-3xl border border-brand-white-faint p-7 w-full max-w-md shadow-[0_0_80px_rgba(0,0,0,0.6)]">
    <div class="flex items-center justify-between mb-6">
      <h3 id="dancer-modal-title" class="font-title text-xl font-black text-brand-white">Agregar bailarín</h3>
      <button data-close-modal="dancer" class="text-brand-white-muted/40 hover:text-brand-white transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <form id="dancer-form" class="space-y-4">
      <input type="hidden" id="dancer-id">
      <input type="hidden" id="dancer-team-id">
      <div>
        <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Nombre completo *</label>
        <input id="dancer-name" type="text" required class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Técnica</label>
          <input id="dancer-technique" type="text" placeholder="Contemporáneo, urbano..." class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
        </div>
        <div>
          <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">División</label>
          <input id="dancer-division" type="text" placeholder="Infantil, juvenil..." class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
        </div>
      </div>
      <div>
        <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Estatus</label>
        <select id="dancer-status" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="button" data-close-modal="dancer" class="flex-1 border border-brand-white-faint text-brand-white-muted/70 font-bold text-sm py-3 rounded-xl hover:text-brand-white transition-colors">Cancelar</button>
        <button type="submit" class="flex-1 bg-brand-lime text-brand-dark font-extrabold text-xs uppercase tracking-[0.12em] py-3 rounded-xl hover:bg-brand-lime-hover transition-colors">Guardar</button>
      </div>
    </form>
  </div>
</div>
```

---

## FASE 5: Tab — Pagos/Finanzas (Avanzado)

```javascript
function renderPaymentsTab(team, payments) {
  const totalDue = payments.filter(p => p.status !== 'refunded').reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = totalDue - totalPaid;
  const overdue = payments.filter(p => p.status === 'overdue');
  
  return `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <h3 class="font-title text-xl font-black text-brand-white">Pagos y Finanzas</h3>
      <div class="flex gap-3">
        <button data-add-payment="${team.id}" class="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-[0.1em] hover:bg-brand-lime-hover transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Registrar pago
        </button>
        <button data-send-reminder="${team.id}" class="inline-flex items-center gap-2 border border-brand-white-faint text-brand-white-muted/70 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.1em] hover:text-brand-lime hover:border-brand-lime/40 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>
          Enviar recordatorio
        </button>
      </div>
    </div>
    
    <!-- Resumen financiero -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-brand-dark-elevated/50 rounded-2xl p-5 border border-brand-white-faint">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Total a pagar</p>
        <p class="font-title text-2xl font-black text-brand-white">$${formatAmount(totalDue)}</p>
      </div>
      <div class="bg-brand-dark-elevated/50 rounded-2xl p-5 border border-brand-white-faint">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Pagado</p>
        <p class="font-title text-2xl font-black text-brand-lime">$${formatAmount(totalPaid)}</p>
      </div>
      <div class="bg-brand-dark-elevated/50 rounded-2xl p-5 border border-brand-white-faint">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Pendiente</p>
        <p class="font-title text-2xl font-black text-[#e8ab4a]">$${formatAmount(totalPending)}</p>
      </div>
      <div class="bg-brand-dark-elevated/50 rounded-2xl p-5 border ${overdue.length > 0 ? 'border-red-500/30' : 'border-brand-white-faint'}">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Vencidos</p>
        <p class="font-title text-2xl font-black ${overdue.length > 0 ? 'text-red-400' : 'text-brand-white'}">${overdue.length}</p>
      </div>
    </div>
    
    <!-- Barra de progreso -->
    <div class="mb-8">
      <div class="flex justify-between text-xs mb-2">
        <span class="text-brand-white-muted/50">Progreso de pago</span>
        <span class="font-bold text-brand-lime">${totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0}%</span>
      </div>
      <div class="h-3 rounded-full bg-brand-white-faint/40 overflow-hidden">
        <div class="h-full rounded-full bg-gradient-to-r from-brand-lime to-brand-lime-hover transition-all duration-500" 
          style="width:${totalDue > 0 ? (totalPaid / totalDue) * 100 : 0}%"></div>
      </div>
    </div>
    
    <!-- Tabla de pagos -->
    ${payments.length === 0
      ? `<div class="text-center py-12 bg-brand-dark-elevated/30 rounded-2xl border border-brand-white-faint">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto mb-4 text-brand-white-muted/20">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          <p class="text-brand-white-muted/40 text-sm mb-4">Sin pagos registrados</p>
          <button data-add-payment="${team.id}" class="text-brand-lime text-sm font-bold hover:underline">+ Registrar el primero</button>
        </div>`
      : `<div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-brand-white-faint text-left">
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Concepto</th>
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Monto</th>
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Estado</th>
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Vencimiento</th>
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Pago</th>
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${payments.map(p => {
                const statusConfig = {
                  pending: { label: 'Pendiente', color: '#e8ab4a', bg: 'rgba(232,171,74,0.12)' },
                  partial: { label: 'Parcial', color: '#7fb3d8', bg: 'rgba(127,179,216,0.12)' },
                  completed: { label: 'Pagado', color: '#d8e723', bg: 'rgba(216,231,35,0.12)' },
                  overdue: { label: 'Vencido', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
                  refunded: { label: 'Reembolsado', color: '#9ca3af', bg: 'rgba(156,163,175,0.12)' }
                }[p.status] || { label: p.status, color: '#9ca3af', bg: 'rgba(156,163,175,0.12)' };
                
                return `
                  <tr class="border-b border-brand-white-faint/40 hover:bg-brand-white-faint/5 transition-colors">
                    <td class="px-5 py-4">
                      <span class="font-semibold text-brand-white">${esc(p.concept)}</span>
                      ${p.reference ? `<span class="block text-xs text-brand-white-muted/40">Ref: ${esc(p.reference)}</span>` : ''}
                    </td>
                    <td class="px-5 py-4 font-title font-bold text-brand-white">$${formatAmount(p.amount)}</td>
                    <td class="px-5 py-4">
                      <span class="badge text-[10px] font-bold rounded-full px-2 py-1" style="color:${statusConfig.color};background:${statusConfig.bg}">
                        ${statusConfig.label}
                      </span>
                    </td>
                    <td class="px-5 py-4 text-brand-white-muted/70 text-xs">
                      ${p.due_date ? new Date(p.due_date).toLocaleDateString('es-MX') : '—'}
                    </td>
                    <td class="px-5 py-4 text-brand-white-muted/70 text-xs">
                      ${p.paid_date ? new Date(p.paid_date).toLocaleDateString('es-MX') : '—'}
                    </td>
                    <td class="px-5 py-4">
                      <div class="flex justify-end gap-2">
                        <button data-edit-payment="${p.id}" title="Editar" class="p-2 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-brand-lime hover:border-brand-lime/40 transition-colors">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                        </button>
                        <button data-delete-payment="${p.id}" title="Eliminar" class="p-2 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-red-400 hover:border-red-500/40 transition-colors">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>`
    }
  `;
}
```

### Modal para agregar/editar pago
```html
<!-- Payment modal -->
<div id="payment-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" data-close-modal="payment"></div>
  <div class="relative bg-brand-dark-elevated rounded-3xl border border-brand-white-faint p-7 w-full max-w-md shadow-[0_0_80px_rgba(0,0,0,0.6)]">
    <div class="flex items-center justify-between mb-6">
      <h3 id="payment-modal-title" class="font-title text-xl font-black text-brand-white">Registrar pago</h3>
      <button data-close-modal="payment" class="text-brand-white-muted/40 hover:text-brand-white transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <form id="payment-form" class="space-y-4">
      <input type="hidden" id="payment-id">
      <input type="hidden" id="payment-team-id">
      <div>
        <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Concepto *</label>
        <input id="payment-concept" type="text" required placeholder="Inscripción, bailarín adicional..." class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Monto *</label>
          <input id="payment-amount" type="number" step="0.01" required placeholder="0.00" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
        </div>
        <div>
          <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Estado</label>
          <select id="payment-status" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
            <option value="pending">Pendiente</option>
            <option value="partial">Parcial</option>
            <option value="completed">Pagado</option>
            <option value="overdue">Vencido</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Fecha de vencimiento</label>
          <input id="payment-due" type="date" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
        </div>
        <div>
          <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Fecha de pago</label>
          <input id="payment-paid" type="date" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Método de pago</label>
          <select id="payment-method" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
            <option value="">Seleccionar...</option>
            <option value="transfer">Transferencia</option>
            <option value="cash">Efectivo</option>
            <option value="paypal">PayPal</option>
            <option value="other">Otro</option>
          </select>
        </div>
        <div>
          <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Referencia</label>
          <input id="payment-reference" type="text" placeholder="Folio, número..." class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
        </div>
      </div>
      <div>
        <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Notas</label>
        <textarea id="payment-notes" rows="2" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40 resize-none"></textarea>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="button" data-close-modal="payment" class="flex-1 border border-brand-white-faint text-brand-white-muted/70 font-bold text-sm py-3 rounded-xl hover:text-brand-white transition-colors">Cancelar</button>
        <button type="submit" class="flex-1 bg-brand-lime text-brand-dark font-extrabold text-xs uppercase tracking-[0.12em] py-3 rounded-xl hover:bg-brand-lime-hover transition-colors">Guardar</button>
      </div>
    </form>
  </div>
</div>
```

---

## FASE 6: Tab — Documentos

```javascript
function renderDocumentsTab(team, documents) {
  const grouped = {
    logo: documents.filter(d => d.type === 'logo'),
    music: documents.filter(d => d.type === 'music'),
    other: documents.filter(d => d.type === 'other')
  };
  
  return `
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-title text-xl font-black text-brand-white">Documentos</h3>
      <label class="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-[0.1em] hover:bg-brand-lime-hover transition-colors cursor-pointer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Subir archivo
        <input type="file" id="upload-doc-input" class="hidden" accept="image/*,audio/*,.pdf,.doc,.docx">
      </label>
    </div>
    
    ${documents.length === 0
      ? `<div class="text-center py-12 bg-brand-dark-elevated/30 rounded-2xl border border-brand-white-faint">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto mb-4 text-brand-white-muted/20">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <p class="text-brand-white-muted/40 text-sm">Sin documentos subidos</p>
        </div>`
      : `<div class="space-y-6">
          ${renderDocGroup('Logos', grouped.logo)}
          ${renderDocGroup('Música', grouped.music)}
          ${renderDocGroup('Otros documentos', grouped.other)}
        </div>`
    }
  `;
}

function renderDocGroup(title, docs) {
  if (docs.length === 0) return '';
  return `
    <div>
      <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-3">${title}</p>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        ${docs.map(d => `
          <div class="bg-brand-dark-elevated/50 rounded-xl border border-brand-white-faint p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-brand-white-faint flex items-center justify-center text-brand-white-muted/40 flex-shrink-0">
              ${d.type === 'logo' ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/></svg>' :
                d.type === 'music' ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' :
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-brand-white truncate">${esc(d.name)}</p>
              <p class="text-[10px] text-brand-white-muted/40">${formatBytes(d.file_size || 0)}</p>
            </div>
            <div class="flex gap-1">
              <a href="${esc(d.file_url)}" target="_blank" class="p-2 rounded-lg text-brand-white-muted/50 hover:text-brand-lime transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
              <button data-delete-doc="${d.id}" class="p-2 rounded-lg text-brand-white-muted/50 hover:text-red-400 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
```

---

## FASE 7: Tab — Calendario

```javascript
function renderCalendarTab(team) {
  const scheduled = team.scheduled_time ? new Date(team.scheduled_time) : null;
  
  return `
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-title text-xl font-black text-brand-white">Calendario y Programación</h3>
      <button data-edit-schedule="${team.id}" class="inline-flex items-center gap-2 border border-brand-white-faint text-brand-white-muted/70 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.1em] hover:text-brand-lime hover:border-brand-lime/40 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Programar presentación
      </button>
    </div>
    
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Horario asignado -->
      <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-4">Presentación asignada</p>
        ${scheduled 
          ? `<div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center">
                <span class="font-title text-2xl font-black text-brand-lime">${scheduled.getDate()}</span>
              </div>
              <div>
                <p class="font-title text-xl font-bold text-brand-white">
                  ${scheduled.toLocaleDateString('es-MX', { weekday: 'long', month: 'long' })}
                </p>
                <p class="text-brand-white-muted/50 text-sm">
                  ${scheduled.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hrs
                </p>
              </div>
            </div>`
          : `<div class="text-center py-8">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto mb-4 text-brand-white-muted/20">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p class="text-brand-white-muted/40 text-sm">Sin horario asignado</p>
            </div>`
        }
      </div>
      
      <!-- Información del evento -->
      <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-4">Información del evento</p>
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-brand-white-faint flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-white-muted/40"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <p class="text-xs text-brand-white-muted/40">Fecha del evento</p>
              <p class="text-sm font-medium text-brand-white">17-19 abril / 1-3 mayo 2026</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-brand-white-faint flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-white-muted/40"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <p class="text-xs text-brand-white-muted/40">Ubicación</p>
              <p class="text-sm font-medium text-brand-white">Caborca, Sonora</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-brand-white-faint flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-white-muted/40"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div>
              <p class="text-xs text-brand-white-muted/40">Categoría</p>
              <p class="text-sm font-medium text-brand-white">${esc(team.category || 'Por asignar')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
```

---

## FASE 8: Tab — Comunicación

```javascript
function renderCommsTab(team, communications) {
  return `
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-title text-xl font-black text-brand-white">Comunicación</h3>
      <div class="flex gap-3">
        <button data-add-note="${team.id}" class="inline-flex items-center gap-2 border border-brand-white-faint text-brand-white-muted/70 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.1em] hover:text-brand-lime hover:border-brand-lime/40 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Agregar nota
        </button>
        <a href="https://wa.me/52${team.contact_phone?.replace(/\D/g, '') || ''}" target="_blank" class="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.1em] hover:bg-emerald-500/25 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>
      </div>
    </div>
    
    <!-- Timeline de comunicación -->
    ${communications.length === 0
      ? `<div class="text-center py-12 bg-brand-dark-elevated/30 rounded-2xl border border-brand-white-faint">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto mb-4 text-brand-white-muted/20">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <p class="text-brand-white-muted/40 text-sm">Sin registros de comunicación</p>
        </div>`
      : `<div class="space-y-4">
          ${communications.map(c => `
            <div class="bg-brand-dark-elevated/50 rounded-xl border border-brand-white-faint p-4 flex gap-4">
              <div class="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${c.direction === 'outbound' ? 'bg-brand-lime/10' : 'bg-brand-white-faint'}">
                ${c.direction === 'outbound' 
                  ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'
                  : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-white-muted/40"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>'}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-bold text-brand-white capitalize">${esc(c.channel)}</span>
                  <span class="text-[10px] text-brand-white-muted/30">•</span>
                  <span class="text-[10px] text-brand-white-muted/40">${new Date(c.sent_at).toLocaleString('es-MX')}</span>
                </div>
                ${c.subject ? `<p class="text-sm font-medium text-brand-white mb-1">${esc(c.subject)}</p>` : ''}
                <p class="text-sm text-brand-white-muted/60">${esc(c.message || '')}</p>
              </div>
            </div>
          `).join('')}
        </div>`
    }
  `;
}
```

---

## FASE 9: Funciones de Utilidad

```javascript
// Formatear montos
function formatAmount(amount) {
  return new Intl.NumberFormat('es-MX', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 2 
  }).format(amount || 0);
}

// Formatear bytes
function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return bytes + ' B';
}

// Cargar datos adicionales del equipo
async function loadTeamData(teamId) {
  if (state.teamData[teamId]) return state.teamData[teamId];
  
  const [dancers, payments, documents, comms] = await Promise.all([
    fetchDancers(teamId),
    fetchPayments(teamId),
    fetchDocuments(teamId),
    fetchCommunications(teamId)
  ]);
  
  state.teamData[teamId] = {
    dancers,
    payments: {
      all: payments,
      paid: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
      pending: payments.filter(p => p.status !== 'completed' && p.status !== 'refunded').reduce((sum, p) => sum + p.amount, 0)
    },
    documents,
    communications: comms
  };
  
  return state.teamData[teamId];
}

// Fetch functions para nuevas tablas
async function fetchPayments(teamId) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchDocuments(teamId) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('team_id', teamId)
    .order('uploaded_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchCommunications(teamId) {
  const { data, error } = await supabase
    .from('communication_log')
    .select('*')
    .eq('team_id', teamId)
    .order('sent_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
```

---

## FASE 10: State Actualizado

```javascript
const state = {
  // Existente
  teams: [],
  dancersByTeam: {},
  filtered: [],
  page: 1,
  perPage: 12,
  search: '',
  city: '',
  status: '',
  expanded: new Set(),
  
  // Nuevo
  teamData: {},           // Cache de datos por equipo
  currentTeam: null       // Equipo seleccionado
};
```

---

## ORDEN DE EJECUCIÓN

```
1.  FASE 1  → Crear tablas en Supabase (payments, documents, communication_log, reminders)
2.  FASE 2  → Reestructurar HTML con sidebar
3.  FASE 3  → Implementar routing hash-based
4.  FASE 4  → Dashboard General con sidebar funcional
5.  FASE 5  → Dashboard Individual — Info + Stats
6.  FASE 6  → Tab Bailarines CRUD
7.  FASE 7  → Tab Pagos/Finanzas
8.  FASE 8  → Tab Documentos
9.  FASE 9  → Tab Calendario
10. FASE 10 → Tab Comunicación
11. FASE 11 → Modales (dancer, payment, doc, etc.)
12. FASE 12 → Responsive + polish
```

**Tiempo estimado:** ~45-60 minutos

---

## VERIFICACIÓN

- [ ] Sidebar muestra todos los equipos
- [ ] Click en equipo navega a su dashboard
- [ ] Stats del equipo se actualizan correctamente
- [ ] CRUD Bailarines funciona (add, edit, delete)
- [ ] CRUD Pagos funciona con todos los estados
- [ ] Upload de documentos funciona
- [ ] Calendario muestra horario asignado
- [ ] Timeline de comunicación funciona
- [ ] WhatsApp link genera chat directo
- [ ] Responsive en mobile (sidebar se contrae)
- [ ] Loading states funcionan
- [ ] Toast messages aparecen

---

*Plan generado: Septiembre 2026*
