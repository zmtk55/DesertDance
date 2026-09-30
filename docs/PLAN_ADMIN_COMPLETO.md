# Plan: Admin Dashboard Completo — Desert Dance

**Fecha:** Septiembre 2026  
**Objetivo:** Panel de administración completo con CRUD total, vistas flexibles, y gestión integral  
**Archivos:** `admin.html`, `js/admin.js` (reestructurar completamente)

---

## ESTRUCTURA ACTUAL (Supabase)

### Tablas Existentes

**`teams`:**
```
id, name, origin_city, contact_name, contact_phone, contact_email,
logo_path, logo_url, music_path, music_url, scheduled_time,
status (pending/confirmed/rejected/waitlist), notes, created_at, updated_at
```

**`participants`:**
```
id, full_name, email, phone, category, status, notes,
team_id, technique, division, routine_title, school_name,
created_at, updated_at
```

**`profiles`:**
```
id (UUID auth.users), role (admin/editor), created_at
```

**Storage:** bucket `team-files` (logos, música)

---

## FUNCIONALIDADES ADMIN REQUERIDAS

### 1. GESTIÓN DE VISTAS (Toggle Manual)

```
┌─────────────────────────────────────────────────────────────┐
│  VISTA: [📊 Tabla] [🃏 Cards] [📋 Lista]                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TABLA: Vista clásica con columnas expandibles              │
│  ┌─────┬──────────┬──────────┬─────────┬──────────┐        │
│  │ Logo│ Equipo   │ Contacto │ Estatus │ Acciones │        │
│  ├─────┼──────────┼──────────┼─────────┼──────────┤        │
│  │     │          │          │         │          │        │
│  └─────┴──────────┴──────────┴─────────┴──────────┘        │
│                                                             │
│  CARDS: Grid visual con tarjetas                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │ [Logo]   │ │ [Logo]   │ │ [Logo]   │                    │
│  │ Equipo 1 │ │ Equipo 2 │ │ Equipo 3 │                    │
│  │ 5 bail.  │ │ 3 bail.  │ │ 8 bail.  │                    │
│  │ [Status] │ │ [Status] │ │ [Status] │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
│                                                             │
│  LISTA: Compacta, una línea por equipo                      │
│  • Equipo 1 — Ciudad — 5 bailarines — Confirmado           │
│  • Equipo 2 — Ciudad — 3 bailarines — Pendiente            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. AGREGAR EQUIPOS (Formulario Admin)

```
┌─────────────────────────────────────────────────────────────┐
│  + AGREGAR EQUIPO                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Nombre del equipo *        Ciudad de origen                │
│  [________________]         [________________]              │
│                                                             │
│  Contacto (capitán) *       Teléfono                        │
│  [________________]         [________________]              │
│                                                             │
│  Email del contacto *                                      │
│  [________________]                                        │
│                                                             │
│  Logo del equipo            Música de presentación         │
│  [📁 Subir logo]           [📁 Subir música]               │
│                                                             │
│  Categoría *                División                        │
│  [Competencia Danza    ▼]  [Infantil/Juvenil/Senior   ▼]  │
│                                                             │
│  Horario de presentación    Estatus inicial                 │
│  [📅 Seleccionar fecha]    [Pendiente                 ▼]  │
│                                                             │
│  Notas internas                                            │
│  [________________________________________________]        │
│                                                             │
│  [Cancelar]                          [Crear equipo]        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. DASHBOARD INDIVIDUAL POR EQUIPO

```
┌─────────────────────────────────────────────────────────────┐
│  ← Volver    Academia Alzira — Hermosillo                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Logo]  Academia Alzira                                    │
│          Hermosillo, Sonora                                 │
│          Contacto: Juan Pérez — +52 662 222 4220           │
│                                                             │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐       │
│  │Bailarines│ Pagado │Pendiente│ Docs    │ Días    │       │
│  │    5     │$4,500  │ $1,000  │    3    │   12    │       │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘       │
│                                                             │
│  [Info] [Bailarines] [Pagos] [Docs] [Calendario] [Comms]  │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  CONTENIDO DEL TAB SELECCIONADO                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## NUEVAS TABLAS NECESARIAS

### 1. `payments` — Pagos y finanzas
```sql
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'MXN',
  concept TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  paid_date DATE,
  payment_method TEXT,
  reference TEXT,
  notes TEXT DEFAULT '',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.payments
  ADD CONSTRAINT payments_status_check
  CHECK (status IN ('pending', 'partial', 'completed', 'overdue', 'refunded'));
```

### 2. `documents` — Documentos del equipo
```sql
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  mime_type TEXT DEFAULT '',
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.documents
  ADD CONSTRAINT documents_type_check
  CHECK (type IN ('logo', 'music', 'choreography', 'photo', 'other'));
```

### 3. `communication_log` — Log de comunicación
```sql
CREATE TABLE IF NOT EXISTS public.communication_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  direction TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT DEFAULT '',
  sent_by UUID REFERENCES auth.users(id),
  sent_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.communication_log
  ADD CONSTRAINT communication_log_channel_check
  CHECK (channel IN ('whatsapp', 'email', 'phone', 'in_person', 'other'));

ALTER TABLE public.communication_log
  ADD CONSTRAINT communication_log_direction_check
  CHECK (direction IN ('inbound', 'outbound'));
```

### 4. `reminders` — Recordatorios
```sql
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ,
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.reminders
  ADD CONSTRAINT reminders_type_check
  CHECK (type IN ('payment', 'document', 'general', 'schedule'));
```

### 5. `categories` — Categorías de competencia
```sql
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  max_participants INTEGER DEFAULT 8,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Categorías iniciales
INSERT INTO public.categories (name, description) VALUES
  ('Competencia Danza Contemporánea', 'Danza contemporánea y expresión corporal'),
  ('Competencia Danza Urbana', 'Hip-hop, breakdance, street dance'),
  ('Competencia Ballet', 'Ballet clásico y neoclásico'),
  ('Competencia Danza Folklórica', 'Danzas tradicionales mexicanas'),
  ('Competencia Danza Aérea', 'Aéreo, telas, trapecio'),
  ('Workshop General', 'Talleres y masterclasses')
ON CONFLICT (name) DO NOTHING;
```

### 6. `event_settings` — Configuración del evento
```sql
CREATE TABLE IF NOT EXISTS public.event_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT DEFAULT '',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Configuraciones iniciales
INSERT INTO public.event_settings (key, value) VALUES
  ('event_name', 'Desert Dance 2026'),
  ('event_dates_phase1', '17-19 abril 2026'),
  ('event_dates_phase2', '1-3 mayo 2026'),
  ('event_location', 'Caborca, Sonora'),
  ('registration_open', 'true'),
  ('early_bird_deadline', '2026-03-15'),
  ('early_bird_price_team', '4500'),
  ('regular_price_team', '5500'),
  ('price_extra_dancer', '800'),
  ('max_dancers_per_team', '12'),
  ('contact_whatsapp', '526622224220'),
  ('contact_email', 'info@desertdance.mx')
ON CONFLICT (key) DO NOTHING;
```

### 7. `admin_users` — Gestión de administradores
```sql
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT DEFAULT '',
  role TEXT DEFAULT 'editor',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users
  ADD CONSTRAINT admin_users_role_check
  CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer'));
```

---

## ESTRUCTURA DE NAVEGACIÓN

### Hash-based Routing Completo
```
admin.html                              → Dashboard General
admin.html#teams                        → Lista de equipos (vista actual)
admin.html#teams/view/table             → Forzar vista tabla
admin.html#teams/view/cards             → Forzar vista cards
admin.html#teams/view/list              → Forzar vista lista
admin.html#team/{id}                    → Dashboard Individual
admin.html#team/{id}/info               → Info del equipo
admin.html#team/{id}/dancers            → Bailarines
admin.html#team/{id}/payments           → Pagos
admin.html#team/{id}/documents          → Documentos
admin.html#team/{id}/calendar           → Calendario
admin.html#team/{id}/comms              → Comunicación
admin.html#payments                     → Vista global de pagos
admin.html#categories                   → Gestión de categorías
admin.html#settings                     → Configuración del evento
admin.html#admins                       → Gestión de administradores
admin.html#reports                      → Reportes y exportación
```

### Layout Completo
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (fijo)                                              │
│  [Logo] Desert Dance Panel    [Admin actual] [Cerrar sesión]│
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│ SIDEBAR  │  CONTENIDO PRINCIPAL                             │
│ (280px)  │                                                  │
│          │  Según la ruta hash:                             │
│ SECCIONES│  - Dashboard: Stats + gráficas                   │
│ ──────── │  - Equipos: Tabla/Cards/Lista + filtros          │
│ Dashboard│  - Equipo: Info + 6 tabs                         │
│ Equipos  │  - Pagos: Vista global                           │
│ ──────── │  - Categorías: CRUD                              │
│ FAVORITOS│  - Config: Settings del evento                   │
│ (equipos │  - Admins: Gestión de usuarios                   │
│  recientes)│ - Reportes: Exportación                        │
│ ──────── │                                                  │
│ CONFIG   │                                                  │
│ Categorías│                                                 │
│ Settings │                                                  │
│ Admins   │                                                  │
│ Reportes │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

---

## FASE 1: Estructura Base + Sidebar

### 1.1 Sidebar Actualizado

```html
<aside id="sidebar" class="fixed left-0 top-16 bottom-0 w-[280px] bg-brand-dark-elevated/70 border-r border-brand-white-faint overflow-y-auto z-30">
  
  <!-- Logo -->
  <div class="p-5 border-b border-brand-white-faint">
    <img src="assets/logos/d_mark.svg" alt="" class="h-8 w-auto mb-2">
    <p class="font-title font-black text-brand-white text-sm">Desert Dance</p>
    <p class="text-[9px] text-brand-white-muted/40 uppercase tracking-[0.15em]">Panel de Administración</p>
  </div>
  
  <!-- Navegación principal -->
  <nav class="p-4 space-y-1">
    <a href="#" data-nav="dashboard" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      Dashboard
    </a>
    <a href="#teams" data-nav="teams" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      Equipos
      <span id="nav-teams-count" class="ml-auto bg-brand-lime/20 text-brand-lime text-[10px] font-bold px-2 py-0.5 rounded-full">0</span>
    </a>
    <a href="#payments" data-nav="payments" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      Pagos globales
    </a>
  </nav>
  
  <!-- Separador -->
  <div class="px-5 py-2">
    <p class="text-[9px] text-brand-white-muted/30 uppercase tracking-[0.2em] font-extrabold">Configuración</p>
  </div>
  
  <!-- Configuración -->
  <nav class="px-4 space-y-1">
    <a href="#categories" data-nav="categories" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      Categorías
    </a>
    <a href="#settings" data-nav="settings" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      Configuración
    </a>
    <a href="#admins" data-nav="admins" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Administradores
    </a>
    <a href="#reports" data-nav="reports" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Reportes
    </a>
  </nav>
  
  <!-- Equipos recientes (favoritos) -->
  <div class="px-5 py-4 mt-4 border-t border-brand-white-faint">
    <p class="text-[9px] text-brand-white-muted/30 uppercase tracking-[0.2em] font-extrabold mb-3">Acceso rápido</p>
    <div id="recent-teams" class="space-y-1">
      <!-- Se llena dinámicamente con últimos 5 equipos visitados -->
    </div>
  </div>
  
</aside>
```

---

## FASE 2: Toggle de Vistas

### Componente de Toggle
```html
<div class="flex items-center gap-2 bg-brand-dark-elevated/50 rounded-xl p-1 border border-brand-white-faint">
  <button data-view="table" class="view-toggle px-3 py-2 rounded-lg text-xs font-bold transition-all" title="Vista tabla">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
  </button>
  <button data-view="cards" class="view-toggle px-3 py-2 rounded-lg text-xs font-bold transition-all" title="Vista tarjetas">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  </button>
  <button data-view="list" class="view-toggle px-3 py-2 rounded-lg text-xs font-bold transition-all" title="Vista lista">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
  </button>
</div>
```

### Lógica de Vistas
```javascript
const viewState = {
  currentView: localStorage.getItem('dd-admin-view') || 'table',
  
  setView(view) {
    this.currentView = view;
    localStorage.setItem('dd-admin-view', view);
    this.updateToggleUI();
    renderTeamsView();
  },
  
  updateToggleUI() {
    document.querySelectorAll('.view-toggle').forEach(btn => {
      const isActive = btn.dataset.view === this.currentView;
      btn.classList.toggle('bg-brand-lime', isActive);
      btn.classList.toggle('text-brand-dark', isActive);
      btn.classList.toggle('text-brand-white-muted/50', !isActive);
      btn.classList.toggle('hover:text-brand-white', !isActive);
    });
  }
};
```

### Renderizado según Vista
```javascript
function renderTeamsView() {
  const container = $('teams-container');
  
  switch (viewState.currentView) {
    case 'table':
      renderTeamsTable(container);
      break;
    case 'cards':
      renderTeamsCards(container);
      break;
    case 'list':
      renderTeamsList(container);
      break;
  }
}

function renderTeamsCards(container) {
  container.innerHTML = `
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      ${state.filtered.map(team => {
        const st = STATUS_LABELS[team.status];
        const dancers = state.dancersByTeam[team.id]?.length || 0;
        
        return `
          <a href="#team/${team.id}" class="block bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-5 hover:border-brand-lime/30 hover:-translate-y-1 transition-all duration-300">
            <div class="flex items-center gap-3 mb-4">
              ${team.logo_url
                ? `<img src="${esc(team.logo_url)}" class="w-12 h-12 rounded-xl object-contain bg-brand-dark/60 border border-brand-white-faint p-1">`
                : `<div class="w-12 h-12 rounded-xl bg-brand-white-faint flex items-center justify-center text-brand-white-muted/40">
                    <span class="font-title font-bold text-lg">${esc(team.name.charAt(0))}</span>
                  </div>`
              }
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-brand-white truncate">${esc(team.name)}</p>
                <p class="text-xs text-brand-white-muted/40">${esc(team.origin_city || '—')}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="bg-brand-dark/30 rounded-lg p-2 text-center">
                <p class="font-title text-lg font-bold text-brand-white">${dancers}</p>
                <p class="text-[9px] text-brand-white-muted/40 uppercase">Bailarines</p>
              </div>
              <div class="bg-brand-dark/30 rounded-lg p-2 text-center">
                <p class="font-title text-lg font-bold text-brand-white">${team.scheduled_time ? '✓' : '—'}</p>
                <p class="text-[9px] text-brand-white-muted/40 uppercase">Horario</p>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="badge text-[10px] font-bold rounded-full px-2 py-1" style="color:${st.dot};background:${st.dot}12">
                <span class="badge-dot" style="background:${st.dot}"></span>
                ${st.label}
              </span>
              <span class="text-[10px] text-brand-white-muted/30">${new Date(team.created_at).toLocaleDateString('es-MX')}</span>
            </div>
          </a>
        `;
      }).join('')}
    </div>
  `;
}

function renderTeamsList(container) {
  container.innerHTML = `
    <div class="space-y-2">
      ${state.filtered.map(team => {
        const st = STATUS_LABELS[team.status];
        const dancers = state.dancersByTeam[team.id]?.length || 0;
        
        return `
          <a href="#team/${team.id}" class="flex items-center gap-4 bg-brand-dark-elevated/30 rounded-xl border border-brand-white-faint px-5 py-4 hover:border-brand-lime/30 hover:bg-brand-white-faint/5 transition-all">
            ${team.logo_url
              ? `<img src="${esc(team.logo_url)}" class="w-10 h-10 rounded-lg object-contain bg-brand-dark/60 border border-brand-white-faint p-1">`
              : `<div class="w-10 h-10 rounded-lg bg-brand-white-faint flex items-center justify-center text-brand-white-muted/40">
                  <span class="font-title font-bold text-sm">${esc(team.name.charAt(0))}</span>
                </div>`
            }
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-brand-white">${esc(team.name)}</span>
                <span class="badge text-[10px] font-bold rounded-full px-2 py-0.5" style="color:${st.dot};background:${st.dot}12">
                  ${st.label}
                </span>
              </div>
              <p class="text-xs text-brand-white-muted/40">${esc(team.origin_city || '—')} · ${esc(team.contact_name || '—')} · ${dancers} bailarines</p>
            </div>
            
            <div class="text-right hidden sm:block">
              <p class="text-xs text-brand-white-muted/40">${new Date(team.created_at).toLocaleDateString('es-MX')}</p>
              ${team.scheduled_time ? `<p class="text-[10px] text-brand-lime">${new Date(team.scheduled_time).toLocaleDateString('es-MX', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</p>` : ''}
            </div>
            
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-white-muted/30"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
        `;
      }).join('')}
    </div>
  `;
}
```

---

## FASE 3: Formulario Agregar Equipo

### Modal
```html
<div id="add-team-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" data-close-modal="add-team"></div>
  <div class="relative bg-brand-dark-elevated rounded-3xl border border-brand-white-faint p-7 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_80px_rgba(0,0,0,0.6)]">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-title text-xl font-black text-brand-white">Agregar nuevo equipo</h3>
      <button data-close-modal="add-team" class="text-brand-white-muted/40 hover:text-brand-white transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    
    <form id="add-team-form" class="space-y-5">
      <!-- Información básica -->
      <div>
        <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-4">Información del equipo</p>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Nombre del equipo *</label>
            <input name="name" type="text" required placeholder="Ej. Academia Alzira" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white placeholder:text-brand-white-muted/25 focus:outline-none focus:border-brand-lime/40">
          </div>
          <div>
            <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Ciudad de origen</label>
            <input name="origin_city" type="text" placeholder="Ej. Hermosillo, Sonora" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white placeholder:text-brand-white-muted/25 focus:outline-none focus:border-brand-lime/40">
          </div>
        </div>
      </div>
      
      <!-- Contacto -->
      <div>
        <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-4">Contacto del capitán</p>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Nombre *</label>
            <input name="contact_name" type="text" required placeholder="Juan Pérez" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white placeholder:text-brand-white-muted/25 focus:outline-none focus:border-brand-lime/40">
          </div>
          <div>
            <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Teléfono</label>
            <input name="contact_phone" type="tel" placeholder="+52 662 222 4220" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white placeholder:text-brand-white-muted/25 focus:outline-none focus:border-brand-lime/40">
          </div>
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Email *</label>
            <input name="contact_email" type="email" required placeholder="estudio@ejemplo.com" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white placeholder:text-brand-white-muted/25 focus:outline-none focus:border-brand-lime/40">
          </div>
        </div>
      </div>
      
      <!-- Archivos -->
      <div>
        <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-4">Archivos</p>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Logo del equipo</label>
            <label class="flex flex-col items-center justify-center min-h-[100px] rounded-xl border-2 border-dashed border-brand-white-faint bg-brand-dark/30 cursor-pointer hover:border-brand-lime/40 transition-colors">
              <input name="logo" type="file" accept="image/*" class="hidden">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-brand-white-muted/30 mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span class="text-xs text-brand-white-muted/40">Seleccionar logo</span>
            </label>
          </div>
          <div>
            <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Música de presentación</label>
            <label class="flex flex-col items-center justify-center min-h-[100px] rounded-xl border-2 border-dashed border-brand-white-faint bg-brand-dark/30 cursor-pointer hover:border-brand-lime/40 transition-colors">
              <input name="music" type="file" accept="audio/*" class="hidden">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-brand-white-muted/30 mb-2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              <span class="text-xs text-brand-white-muted/40">Seleccionar música</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Configuración -->
      <div>
        <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-4">Configuración</p>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Categoría *</label>
            <select name="category" required class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
              <!-- Se llena dinámicamente desde categories table -->
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Horario de presentación</label>
            <input name="scheduled_time" type="datetime-local" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
          </div>
          <div>
            <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Estatus inicial</label>
            <select name="status" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmado</option>
              <option value="waitlist">Lista de espera</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Registro de pago</label>
            <select name="payment_status" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
              <option value="none">Sin registro</option>
              <option value="pending">Pendiente</option>
              <option value="completed">Pagado</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Notas -->
      <div>
        <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Notas internas</label>
        <textarea name="notes" rows="3" placeholder="Notas sobre el equipo..." class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white placeholder:text-brand-white-muted/25 focus:outline-none focus:border-brand-lime/40 resize-none"></textarea>
      </div>
      
      <!-- Botones -->
      <div class="flex gap-3 pt-4 border-t border-brand-white-faint">
        <button type="button" data-close-modal="add-team" class="flex-1 border border-brand-white-faint text-brand-white-muted/70 font-bold text-sm py-3 rounded-xl hover:text-brand-white transition-colors">
          Cancelar
        </button>
        <button type="submit" class="flex-1 bg-brand-lime text-brand-dark font-extrabold text-xs uppercase tracking-[0.12em] py-3 rounded-xl hover:bg-brand-lime-hover transition-colors">
          Crear equipo
        </button>
      </div>
    </form>
  </div>
</div>
```

### Lógica de Creación
```javascript
async function createTeam(formData, files) {
  const teamId = crypto.randomUUID();
  
  // Subir logo si existe
  let logoPath = '', logoUrl = '';
  if (files.logo) {
    const path = `logos/${teamId}_${files.logo.name}`;
    const { error } = await supabase.storage.from('team-files').upload(path, files.logo);
    if (error) throw error;
    const { data } = supabase.storage.from('team-files').getPublicUrl(path);
    logoPath = path;
    logoUrl = data.publicUrl;
  }
  
  // Subir música si existe
  let musicPath = '', musicUrl = '';
  if (files.music) {
    const path = `music/${teamId}_${files.music.name}`;
    const { error } = await supabase.storage.from('team-files').upload(path, files.music);
    if (error) throw error;
    const { data } = supabase.storage.from('team-files').getPublicUrl(path);
    musicPath = path;
    musicUrl = data.publicUrl;
  }
  
  // Crear equipo
  const { error: teamError } = await supabase.from('teams').insert([{
    id: teamId,
    name: formData.name,
    origin_city: formData.origin_city,
    contact_name: formData.contact_name,
    contact_phone: formData.contact_phone,
    contact_email: formData.contact_email,
    logo_path: logoPath,
    logo_url: logoUrl,
    music_path: musicPath,
    music_url: musicUrl,
    scheduled_time: formData.scheduled_time ? new Date(formData.scheduled_time).toISOString() : null,
    status: formData.status,
    notes: formData.notes
  }]);
  
  if (teamError) throw teamError;
  
  // Registrar pago si se seleccionó
  if (formData.payment_status && formData.payment_status !== 'none') {
    const price = formData.payment_status === 'completed' 
      ? parseFloat(eventSettings.early_bird_price_team) 
      : parseFloat(eventSettings.regular_price_team);
    
    await supabase.from('payments').insert([{
      team_id: teamId,
      amount: price,
      concept: 'Inscripción',
      status: formData.payment_status,
      payment_method: 'admin'
    }]);
  }
  
  // Registrar en log
  await supabase.from('communication_log').insert([{
    team_id: teamId,
    channel: 'in_person',
    direction: 'outbound',
    subject: 'Equipo creado por administrador',
    message: `Equipo registrado manualmente desde el panel de administración`
  }]);
  
  return teamId;
}
```

---

## FASE 4: Tab — Bailarines CRUD

```javascript
function renderDancersTab(team, dancers) {
  return `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h3 class="font-title text-xl font-black text-brand-white">Bailarines</h3>
        <p class="text-xs text-brand-white-muted/40 mt-1">${dancers.length} registrado${dancers.length === 1 ? '' : 's'}</p>
      </div>
      <button data-action="add-dancer" data-team="${team.id}" class="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-[0.1em] hover:bg-brand-lime-hover transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Agregar bailarín
      </button>
    </div>
    
    ${dancers.length === 0 
      ? renderEmptyState('Sin bailarines registrados', 'add-dancer', team.id)
      : `<div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-brand-white-faint text-left">
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Nombre</th>
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Técnica</th>
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">División</th>
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Rutina</th>
                <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${dancers.map(d => `
                <tr class="border-b border-brand-white-faint/40 hover:bg-brand-white-faint/5 transition-colors">
                  <td class="px-5 py-4">
                    <div>
                      <span class="font-semibold text-brand-white">${esc(d.full_name)}</span>
                      ${d.email ? `<span class="block text-xs text-brand-white-muted/40">${esc(d.email)}</span>` : ''}
                    </div>
                  </td>
                  <td class="px-5 py-4 text-brand-white-muted/70">${esc(d.technique || '—')}</td>
                  <td class="px-5 py-4 text-brand-white-muted/70">${esc(d.division || '—')}</td>
                  <td class="px-5 py-4 text-brand-white-muted/70">${esc(d.routine_title || '—')}</td>
                  <td class="px-5 py-4">
                    <div class="flex justify-end gap-2">
                      <button data-action="edit-dancer" data-id="${d.id}" title="Editar" class="p-2 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-brand-lime hover:border-brand-lime/40 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      </button>
                      <button data-action="delete-dancer" data-id="${d.id}" data-team="${team.id}" title="Eliminar" class="p-2 rounded-lg border border-brand-white-faint text-brand-white-muted/50 hover:text-red-400 hover:border-red-500/40 transition-colors">
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

function renderEmptyState(message, action, teamId) {
  return `
    <div class="text-center py-12 bg-brand-dark-elevated/30 rounded-2xl border border-brand-white-faint">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto mb-4 text-brand-white-muted/20">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      </svg>
      <p class="text-brand-white-muted/40 text-sm mb-4">${message}</p>
      <button data-action="${action}" data-team="${teamId}" class="text-brand-lime text-sm font-bold hover:underline">+ Agregar el primero</button>
    </div>
  `;
}
```

---

## FASE 5: Tab — Pagos Globales (Vista)

```javascript
function renderPaymentsGlobal() {
  const allPayments = Object.values(state.teamData).flatMap(td => td.payments?.all || []);
  const totalDue = allPayments.filter(p => p.status !== 'refunded').reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = allPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const overdue = allPayments.filter(p => p.status === 'overdue');
  
  return `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="font-title text-2xl md:text-3xl font-black text-brand-white">Pagos <span class="italic-display italic text-brand-lime font-light">globales</span></h2>
        <p class="text-brand-white-muted/40 text-xs mt-1">Resumen financiero de todos los equipos</p>
      </div>
      <div class="flex gap-3">
        <button data-action="export-payments" class="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-[0.1em] hover:bg-brand-lime-hover transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exportar
        </button>
      </div>
    </div>
    
    <!-- Stats globales -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Total facturado</p>
        <p class="font-title text-3xl font-black text-brand-white">$${formatAmount(totalDue)}</p>
      </div>
      <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Total cobrado</p>
        <p class="font-title text-3xl font-black text-brand-lime">$${formatAmount(totalPaid)}</p>
      </div>
      <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Pendiente</p>
        <p class="font-title text-3xl font-black text-[#e8ab4a]">$${formatAmount(totalDue - totalPaid)}</p>
      </div>
      <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border ${overdue.length > 0 ? 'border-red-500/30' : 'border-brand-white-faint'}">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Vencidos</p>
        <p class="font-title text-3xl font-black ${overdue.length > 0 ? 'text-red-400' : 'text-brand-white'}">${overdue.length}</p>
      </div>
    </div>
    
    <!-- Tabla de todos los pagos -->
    <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-brand-white-faint text-left">
            <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Equipo</th>
            <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Concepto</th>
            <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Monto</th>
            <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Estado</th>
            <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Vencimiento</th>
          </tr>
        </thead>
        <tbody>
          ${allPayments.map(p => {
            const team = state.teams.find(t => t.id === p.team_id);
            const statusConfig = getPaymentStatusConfig(p.status);
            
            return `
              <tr class="border-b border-brand-white-faint/40 hover:bg-brand-white-faint/5 transition-colors cursor-pointer" onclick="location.hash='team/${p.team_id}/payments'">
                <td class="px-5 py-4">
                  <span class="font-semibold text-brand-white">${esc(team?.name || 'Equipo eliminado')}</span>
                </td>
                <td class="px-5 py-4 text-brand-white-muted/70">${esc(p.concept)}</td>
                <td class="px-5 py-4 font-title font-bold text-brand-white">$${formatAmount(p.amount)}</td>
                <td class="px-5 py-4">
                  <span class="badge text-[10px] font-bold rounded-full px-2 py-1" style="color:${statusConfig.color};background:${statusConfig.bg}">
                    ${statusConfig.label}
                  </span>
                </td>
                <td class="px-5 py-4 text-brand-white-muted/70 text-xs">
                  ${p.due_date ? new Date(p.due_date).toLocaleDateString('es-MX') : '—'}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function getPaymentStatusConfig(status) {
  const configs = {
    pending: { label: 'Pendiente', color: '#e8ab4a', bg: 'rgba(232,171,74,0.12)' },
    partial: { label: 'Parcial', color: '#7fb3d8', bg: 'rgba(127,179,216,0.12)' },
    completed: { label: 'Pagado', color: '#d8e723', bg: 'rgba(216,231,35,0.12)' },
    overdue: { label: 'Vencido', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    refunded: { label: 'Reembolsado', color: '#9ca3af', bg: 'rgba(156,163,175,0.12)' }
  };
  return configs[status] || { label: status, color: '#9ca3af', bg: 'rgba(156,163,175,0.12)' };
}
```

---

## FASE 6: Configuración del Evento

```javascript
function renderSettings() {
  return `
    <div class="max-w-3xl">
      <h2 class="font-title text-2xl md:text-3xl font-black text-brand-white mb-6">Configuración <span class="italic-display italic text-brand-lime font-light">del evento</span></h2>
      
      <form id="settings-form" class="space-y-8">
        <!-- Información del evento -->
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6">
          <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-4">Información del evento</p>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Nombre del evento</label>
              <input name="event_name" type="text" value="${esc(eventSettings.event_name || '')}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
            </div>
            <div>
              <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Ubicación</label>
              <input name="event_location" type="text" value="${esc(eventSettings.event_location || '')}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
            </div>
            <div>
              <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Fechas Fase 1</label>
              <input name="event_dates_phase1" type="text" value="${esc(eventSettings.event_dates_phase1 || '')}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
            </div>
            <div>
              <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Fechas Fase 2</label>
              <input name="event_dates_phase2" type="text" value="${esc(eventSettings.event_dates_phase2 || '')}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
            </div>
          </div>
        </div>
        
        <!-- Precios -->
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6">
          <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-4">Precios</p>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Precio early bird (equipo)</label>
              <input name="early_bird_price_team" type="number" value="${eventSettings.early_bird_price_team || ''}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
            </div>
            <div>
              <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Precio regular (equipo)</label>
              <input name="regular_price_team" type="number" value="${eventSettings.regular_price_team || ''}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
            </div>
            <div>
              <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Precio bailarín adicional</label>
              <input name="price_extra_dancer" type="number" value="${eventSettings.price_extra_dancer || ''}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
            </div>
            <div>
              <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Límite de bailarines por equipo</label>
              <input name="max_dancers_per_team" type="number" value="${eventSettings.max_dancers_per_team || ''}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
            </div>
          </div>
        </div>
        
        <!-- Fechas límite -->
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6">
          <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-4">Fechas límite</p>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Fecha límite early bird</label>
              <input name="early_bird_deadline" type="date" value="${eventSettings.early_bird_deadline || ''}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
            </div>
            <div>
              <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Registro abierto</label>
              <select name="registration_open" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
                <option value="true" ${eventSettings.registration_open === 'true' ? 'selected' : ''}>Abierto</option>
                <option value="false" ${eventSettings.registration_open === 'false' ? 'selected' : ''}>Cerrado</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Contacto -->
        <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6">
          <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-4">Contacto</p>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">WhatsApp (con código de país)</label>
              <input name="contact_whatsapp" type="text" value="${esc(eventSettings.contact_whatsapp || '')}" placeholder="526622224220" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
            </div>
            <div>
              <label class="block text-[10px] font-extrabold text-brand-white-muted/40 uppercase tracking-[0.15em] mb-2">Email de contacto</label>
              <input name="contact_email" type="email" value="${esc(eventSettings.contact_email || '')}" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 py-3 text-sm text-brand-white focus:outline-none focus:border-brand-lime/40">
            </div>
          </div>
        </div>
        
        <!-- Guardar -->
        <div class="flex justify-end">
          <button type="submit" class="bg-brand-lime text-brand-dark font-extrabold text-xs uppercase tracking-[0.12em] px-8 py-3 rounded-xl hover:bg-brand-lime-hover transition-colors">
            Guardar configuración
          </button>
        </div>
      </form>
    </div>
  `;
}
```

---

## FASE 7: Gestión de Administradores

```javascript
function renderAdmins() {
  return `
    <div class="max-w-4xl">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="font-title text-2xl md:text-3xl font-black text-brand-white">Administradores</h2>
          <p class="text-brand-white-muted/40 text-xs mt-1">Gestiona quién tiene acceso al panel</p>
        </div>
        <button data-action="add-admin" class="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-[0.1em] hover:bg-brand-lime-hover transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar administrador
        </button>
      </div>
      
      <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-brand-white-faint text-left">
              <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Usuario</th>
              <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Rol</th>
              <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Último acceso</th>
              <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold">Estado</th>
              <th class="px-5 py-4 text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody id="admins-table-body">
            <!-- Se llena dinámicamente -->
          </tbody>
        </table>
      </div>
    </div>
  `;
}
```

---

## FASE 8: Reportes y Exportación

```javascript
function renderReports() {
  return `
    <div class="max-w-4xl">
      <h2 class="font-title text-2xl md:text-3xl font-black text-brand-white mb-8">Reportes <span class="italic-display italic text-brand-lime font-light">y exportación</span></h2>
      
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Exportar equipos -->
        <button data-action="export-teams" class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6 text-left hover:border-brand-lime/30 transition-colors">
          <div class="w-12 h-12 rounded-xl bg-brand-lime/10 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          </div>
          <p class="font-title font-bold text-brand-white mb-1">Exportar equipos</p>
          <p class="text-xs text-brand-white-muted/40">CSV con todos los equipos y su información</p>
        </button>
        
        <!-- Exportar pagos -->
        <button data-action="export-payments" class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6 text-left hover:border-brand-lime/30 transition-colors">
          <div class="w-12 h-12 rounded-xl bg-brand-lime/10 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <p class="font-title font-bold text-brand-white mb-1">Exportar pagos</p>
          <p class="text-xs text-brand-white-muted/40">CSV con todos los pagos registrados</p>
        </button>
        
        <!-- Exportar bailarines -->
        <button data-action="export-dancers" class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6 text-left hover:border-brand-lime/30 transition-colors">
          <div class="w-12 h-12 rounded-xl bg-brand-lime/10 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <p class="font-title font-bold text-brand-white mb-1">Exportar bailarines</p>
          <p class="text-xs text-brand-white-muted/40">CSV con todos los participantes</p>
        </button>
        
        <!-- Reporte financiero -->
        <button data-action="report-finance" class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6 text-left hover:border-brand-lime/30 transition-colors">
          <div class="w-12 h-12 rounded-xl bg-brand-lime/10 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <p class="font-title font-bold text-brand-white mb-1">Reporte financiero</p>
          <p class="text-xs text-brand-white-muted/40">Resumen de ingresos por estado</p>
        </button>
        
        <!-- Reporte por ciudad -->
        <button data-action="report-cities" class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6 text-left hover:border-brand-lime/30 transition-colors">
          <div class="w-12 h-12 rounded-xl bg-brand-lime/10 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <p class="font-title font-bold text-brand-white mb-1">Equipos por ciudad</p>
          <p class="text-xs text-brand-white-muted/40">Distribución geográfica</p>
        </button>
        
        <!-- Lista de asistencia -->
        <button data-action="report-attendance" class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint p-6 text-left hover:border-brand-lime/30 transition-colors">
          <div class="w-12 h-12 rounded-xl bg-brand-lime/10 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
          <p class="font-title font-bold text-brand-white mb-1">Lista de asistencia</p>
          <p class="text-xs text-brand-white-muted/40">PDF para impresión</p>
        </button>
      </div>
    </div>
  `;
}
```

---

## FASE 9: State Actualizado

```javascript
const state = {
  // Datos
  teams: [],
  dancersByTeam: {},
  teamData: {},           // Cache de datos completos por equipo
  categories: [],
  eventSettings: {},
  adminUsers: [],
  
  // UI
  filtered: [],
  page: 1,
  perPage: 12,
  search: '',
  city: '',
  status: '',
  category: '',
  expanded: new Set(),
  recentTeams: JSON.parse(localStorage.getItem('dd-recent-teams') || '[]'),
  
  // Navegación
  currentRoute: null,
  currentTeam: null
};
```

---

## FASE 10: Router Completo

```javascript
const router = {
  routes: {
    '': 'dashboard',
    'teams': 'teams',
    'teams/view/:view': 'teams',
    'team/:id': 'team-detail',
    'team/:id/:section': 'team-detail',
    'payments': 'payments-global',
    'categories': 'categories',
    'settings': 'settings',
    'admins': 'admins',
    'reports': 'reports'
  },
  
  current: null,
  
  init() {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  },
  
  resolve() {
    const hash = window.location.hash.slice(1) || '';
    const parts = hash.split('/').filter(Boolean);
    
    // Parse route
    if (parts[0] === 'team' && parts[1]) {
      this.current = {
        view: 'team-detail',
        teamId: parts[1],
        section: parts[2] || 'info'
      };
    } else if (parts[0] === 'teams' && parts[1] === 'view' && parts[2]) {
      viewState.setView(parts[2]);
      this.current = { view: 'teams' };
    } else if (parts[0] === 'teams') {
      this.current = { view: 'teams' };
    } else if (parts[0] === 'payments') {
      this.current = { view: 'payments-global' };
    } else if (parts[0] === 'categories') {
      this.current = { view: 'categories' };
    } else if (parts[0] === 'settings') {
      this.current = { view: 'settings' };
    } else if (parts[0] === 'admins') {
      this.current = { view: 'admins' };
    } else if (parts[0] === 'reports') {
      this.current = { view: 'reports' };
    } else {
      this.current = { view: 'dashboard' };
    }
    
    this.render();
    updateSidebar();
  },
  
  render() {
    const main = $('main-content');
    
    switch (this.current.view) {
      case 'dashboard':
        renderDashboardGeneral(main);
        break;
      case 'teams':
        renderTeamsPage(main);
        break;
      case 'team-detail':
        renderTeamDetail(this.current.teamId, this.current.section, main);
        break;
      case 'payments-global':
        renderPaymentsGlobal(main);
        break;
      case 'categories':
        renderCategories(main);
        break;
      case 'settings':
        renderSettings(main);
        break;
      case 'admins':
        renderAdmins(main);
        break;
      case 'reports':
        renderReports(main);
        break;
    }
  },
  
  navigate(hash) {
    window.location.hash = hash;
  }
};
```

---

## FASE 11: Dashboard General

```javascript
function renderDashboardGeneral(container) {
  const total = state.teams.length;
  const count = (s) => state.teams.filter(t => t.status === s).length;
  const totalDancers = Object.values(state.dancersByTeam).reduce((acc, d) => acc + d.length, 0);
  
  // Calcular pagos
  const allPayments = Object.values(state.teamData).flatMap(td => td.payments?.all || []);
  const totalPaid = allPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = allPayments.filter(p => p.status !== 'completed' && p.status !== 'refunded').reduce((sum, p) => sum + p.amount, 0);
  
  container.innerHTML = `
    <div class="mb-8">
      <h2 class="font-title text-2xl md:text-3xl font-black text-brand-white mb-2">Panel <span class="italic-display italic text-brand-lime font-light">general</span></h2>
      <p class="text-brand-white-muted/40 text-sm">Resumen de la competencia Desert Dance 2026</p>
    </div>
    
    <!-- Stats principales -->
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
    
    <!-- Stats financieras -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Cobrado</p>
        <p class="font-title text-3xl font-black text-brand-lime">$${formatAmount(totalPaid)}</p>
      </div>
      <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Pendiente</p>
        <p class="font-title text-3xl font-black text-[#e8ab4a]">$${formatAmount(totalPending)}</p>
      </div>
      <div class="stat-card bg-brand-dark-elevated/70 rounded-2xl p-5 border border-brand-white-faint">
        <p class="text-[10px] text-brand-white-muted/40 uppercase tracking-[0.15em] font-extrabold mb-1">Tasa de confirmación</p>
        <p class="font-title text-3xl font-black text-brand-white">${total > 0 ? Math.round((count('confirmed') / total) * 100) : 0}%</p>
      </div>
    </div>
    
    <!-- Accesos rápidos -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <a href="#teams" class="bg-brand-dark-elevated/50 rounded-xl border border-brand-white-faint p-4 hover:border-brand-lime/30 transition-colors flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-brand-lime/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        </div>
        <div>
          <p class="font-bold text-brand-white text-sm">Ver equipos</p>
          <p class="text-[10px] text-brand-white-muted/40">${total} registrados</p>
        </div>
      </a>
      
      <button data-action="add-team" class="bg-brand-dark-elevated/50 rounded-xl border border-brand-white-faint p-4 hover:border-brand-lime/30 transition-colors flex items-center gap-3 text-left">
        <div class="w-10 h-10 rounded-lg bg-brand-lime/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </div>
        <div>
          <p class="font-bold text-brand-white text-sm">Agregar equipo</p>
          <p class="text-[10px] text-brand-white-muted/40">Registro manual</p>
        </div>
      </button>
      
      <a href="#payments" class="bg-brand-dark-elevated/50 rounded-xl border border-brand-white-faint p-4 hover:border-brand-lime/30 transition-colors flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-brand-lime/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        </div>
        <div>
          <p class="font-bold text-brand-white text-sm">Ver pagos</p>
          <p class="text-[10px] text-brand-white-muted/40">$${formatAmount(totalPaid)} cobrados</p>
        </div>
      </a>
      
      <a href="#reports" class="bg-brand-dark-elevated/50 rounded-xl border border-brand-white-faint p-4 hover:border-brand-lime/30 transition-colors flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-brand-lime/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </div>
        <div>
          <p class="font-bold text-brand-white text-sm">Reportes</p>
          <p class="text-[10px] text-brand-white-muted/40">Exportar datos</p>
        </div>
      </a>
    </div>
    
    <!-- Últimos equipos registrados -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-brand-white-muted/60 text-xs uppercase tracking-[0.2em] font-extrabold">Últimos registros</h3>
        <a href="#teams" class="text-brand-lime text-xs font-bold hover:underline">Ver todos →</a>
      </div>
      <div class="space-y-2">
        ${state.teams.slice(0, 5).map(team => {
          const st = STATUS_LABELS[team.status];
          return `
            <a href="#team/${team.id}" class="flex items-center gap-3 bg-brand-dark-elevated/30 rounded-xl border border-brand-white-faint px-4 py-3 hover:border-brand-lime/30 transition-colors">
              ${team.logo_url
                ? `<img src="${esc(team.logo_url)}" class="w-8 h-8 rounded-lg object-contain bg-brand-dark/60 border border-brand-white-faint p-0.5">`
                : `<div class="w-8 h-8 rounded-lg bg-brand-white-faint flex items-center justify-center text-brand-white-muted/40 text-xs font-bold">${esc(team.name.charAt(0))}</div>`
              }
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-brand-white truncate">${esc(team.name)}</p>
                <p class="text-[10px] text-brand-white-muted/40">${esc(team.origin_city || '—')}</p>
              </div>
              <span class="badge text-[10px] font-bold rounded-full px-2 py-0.5" style="color:${st.dot};background:${st.dot}12">
                ${st.label}
              </span>
              <span class="text-[10px] text-brand-white-muted/30">${new Date(team.created_at).toLocaleDateString('es-MX')}</span>
            </a>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
```

---

## ORDEN DE EJECUCIÓN

```
1.  Crear tablas en Supabase (payments, documents, communication_log, reminders, categories, event_settings, admin_users)
2.  Migración SQL completa
3.  Reestructurar admin.html con sidebar completo
4.  Implementar router hash-based
5.  Dashboard General con stats y accesos rápidos
6.  Página de Equipos con toggle de vistas (tabla/cards/lista)
7.  Formulario "Agregar Equipo"
8.  Dashboard Individual — Info del equipo
9.  Tab Bailarines CRUD
10. Tab Pagos CRUD + estados
11. Tab Documentos (upload/manage)
12. Tab Calendario
13. Tab Comunicación
14. Página Pagos Globales
15. Página Categorías CRUD
16. Página Configuración del evento
17. Página Gestión de admins
18. Página Reportes
19. Modales (dancer, payment, doc, admin)
20. Responsive + polish
```

**Tiempo estimado:** ~60-90 minutos

---

## VERIFICACIÓN

- [ ] Sidebar muestra todas las secciones
- [ ] Navegación funciona con hash routes
- [ ] Toggle de vistas funciona (tabla/cards/lista)
- [ ] Guarda preferencia de vista en localStorage
- [ ] Agregar equipo funciona con archivos
- [ ] Dashboard individual muestra stats correctas
- [ ] CRUD Bailarines completo
- [ ] CRUD Pagos con todos los estados
- [ ] Upload de documentos funciona
- [ ] Calendario muestra horarios
- [ ] Timeline de comunicación funciona
- [ ] Pagos globales muestra resumen
- [ ] Categorías CRUD funciona
- [ ] Settings guarda correctamente
- [ ] Admins CRUD funciona
- [ ] Reportes exportan CSV
- [ ] Responsive en mobile
- [ ] Loading states funcionan
- [ ] Toast messages aparecen

---

*Plan generado: Septiembre 2026*
