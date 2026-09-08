# Desert Dance — Plan de Implementación Completo

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan.

**Goal:** Completar la landing page de Desert Dance con brand kit oficial, conectar formulario a Supabase, construir panel CRM/admin con auth, y desplegar a Vercel.

**Architecture:** Landing page estática (HTML + Tailwind CDN) + CRM como página separada protegida con Supabase Auth. Toda la lógica via Supabase JS SDK v2 (CDN). Sin framework, sin build step — despliegue directo a Vercel como sitio estático.

**Tech Stack:** HTML5, Tailwind CSS (CDN), Supabase JS SDK v2 (CDN), Supabase Auth, Supabase Postgres, Supabase CLI, Vercel Static Hosting

**Supabase Project:**
- URL: `https://stvzqomqqkascrgxujmb.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- DB Connection: `postgresql://postgres:[YOUR-PASSWORD]@db.stvzqomqqkascrgxujmb.supabase.co:5432/postgres`
- Project Ref: `stvzqomqqkascrgxujmb`

---

## Brand Kit Oficial (extraído de SVGs)

| Token | Valor | Uso |
|-------|-------|-----|
| `brand-dark` | `#231f20` | Fondo principal, cajas |
| `brand-lime` | `#d8e723` | Acento primario, CTAs, links |
| `brand-white` | `#ffffff` | Texto principal |
| `brand-dark-muted` | `#2a2627` | Superficies elevadas |
| `brand-lime-dim` | `rgba(216,231,35,0.12)` | Fondos sutiles de acento |

---

## Estructura de Archivos Final

```
DesertDance/
├── index.html                    ← Landing page (modificar)
├── admin.html                    ← Panel CRM/Admin (crear)
├── login.html                    ← Login page (crear)
├── preview.html                  ← Vista previa (modificar)
├── assets/
│   ├── logos/                    ← Copiar desde brand kit
│   │   ├── horizontal_compact.svg
│   │   ├── vertical_primary.svg
│   │   ├── d_mark.svg
│   │   └── favicon.ico
│   └── images/                   ← Imágenes del sitio
├── js/
│   ├── supabase-config.js        ← Config compartida (crear)
│   ├── app.js                    ← Lógica landing form (crear)
│   └── admin.js                  ← Lógica CRM (crear)
├── .vercel/project.json          ← Ya existe
└── docs/plan-desert-dance.md     ← Este archivo
```

---

## Chunk 1: Brand Kit + Assets + Config Supabase

### Task 1: Copiar logos al proyecto

**Files:**
- Create: `assets/logos/` directory
- Copy from: `Desert Dance/DDC-logo-assets-web/svg/horizontal/horizontal_04_compact.svg` → `assets/logos/horizontal_compact.svg`
- Copy from: `Desert Dance/DDC-logo-assets-web/svg/vertical/vertical_01_primary.svg` → `assets/logos/vertical_primary.svg`
- Copy from: `Desert Dance/DDC-logo-assets-web/svg/secundario/secundario_01_d_mark.svg` → `assets/logos/d_mark.svg`
- Copy from: `Desert Dance/DDC-logo-assets-web/favicon/favicon-dmark-192.png` → `assets/logos/favicon-192.png`
- Copy from: `Desert Dance/DDC-logo-assets-web/favicon/favicon-dmark-32.png` → `assets/logos/favicon-32.png`
- Copy from: `Desert Dance/DDC-logo-assets-web/favicon/favicon-square-180.png` → `assets/logos/apple-touch-icon.png`

- [ ] Create `assets/logos/` directory
- [ ] Copy all logo files listed above
- [ ] Verify files exist

### Task 2: Crear supabase-config.js

**Files:**
- Create: `js/supabase-config.js`

- [ ] Create shared config file

```js
const SUPABASE_URL = 'https://stvzqomqqkascrgxujmb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0dnpxb21xcWthc2NyZ3h1am1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4ODc3MjEsImV4cCI6MjEwNDQ2MzcyMX0.RjNEvcCfzg0qVxx0NwTINdomFPYIcRi_PpmNFsotgSg';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### Task 3: Crear Supabase schema (SQL)

**Files:**
- Create: `docs/supabase-schema.sql`

- [ ] Create SQL schema file

```sql
-- Tabla de participantes
CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Competencia Danza Contemporánea',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'waitlist')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: anyone can insert (registration form)
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON participants
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON participants
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON participants
  FOR DELETE USING (auth.role() = 'authenticated');

-- Tabla de admins (profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE POLICY "Allow authenticated read profiles" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Index para búsquedas
CREATE INDEX idx_participants_status ON participants(status);
CREATE INDEX idx_participants_category ON participants(category);
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_participants_created ON participants(created_at DESC);

-- Función para auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_participants
  BEFORE UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

- [ ] User must run this SQL in Supabase SQL Editor before proceeding
- [ ] User must create first admin user in Supabase Auth dashboard

---

## Chunk 2: Landing Page — Brand Kit Update

### Task 4: Actualizar index.html — Head + Tailwind Config

**Files:**
- Modify: `index.html:1-55`

- [ ] Replace tailwind config colors with brand kit colors:

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'brand-dark': '#231f20',
        'brand-dark-elevated': '#2a2627',
        'brand-lime': '#d8e723',
        'brand-lime-dim': 'rgba(216,231,35,0.12)',
        'brand-lime-hover': '#c4d41f',
        'brand-white': '#ffffff',
        'brand-white-muted': 'rgba(255,255,255,0.55)',
        'brand-white-faint': 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        'title': ["'Jost'", 'sans-serif'],
        'italic-display': ["'Cormorant Garamond'", 'serif'],
        'body': ["'DM Sans'", 'sans-serif'],
      }
    }
  }
}
```

- [ ] Update `<title>` to "Desert Dance — Competencia de Danza 2026"
- [ ] Update favicon to `assets/logos/favicon-32.png`
- [ ] Update `::selection` color to lime-based

### Task 5: Actualizar index.html — Body + Nav

**Files:**
- Modify: `index.html:56-66`

- [ ] Replace `body` background from `#0d0d0f` to `#231f20`
- [ ] Replace nav background classes from `bg-[#0d0d0f]/40` to `bg-brand-dark/60`
- [ ] Replace nav border from `border-[#f3efe9]/[0.05]` to `border-brand-white-faint`
- [ ] Replace logo `<img>` src with `assets/logos/horizontal_compact.svg`
- [ ] Remove the `onerror` fallback — logo must exist
- [ ] Replace "Desert Dance" text logo with SVG inline or keep img-based
- [ ] Replace nav CTA button: `bg-[#c8a65a]` → `bg-brand-lime`, text color → `brand-dark`
- [ ] Replace hover state: `hover:bg-[#c4938a]` → `hover:bg-brand-lime-hover`

### Task 6: Actualizar index.html — Hero Section

**Files:**
- Modify: `index.html:69-97`

- [ ] Replace all `#c8a65a` references with `brand-lime`
- [ ] Replace all `#c4938a` references with `brand-lime` (accent)
- [ ] Replace all `#0d0d0f` references with `brand-dark`
- [ ] Replace all `#f3efe9` references with `brand-white`
- [ ] Replace all `#9a9485` references with `brand-white-muted`
- [ ] Update gradient overlays to use brand-dark
- [ ] Update CTA button colors to lime-based
- [ ] Update stats section colors

### Task 7: Actualizar index.html — Dates Section

**Files:**
- Modify: `index.html:99-122`

- [ ] Replace card background `bg-[#181820]/70` → `bg-brand-dark-elevated/80`
- [ ] Replace border colors to use `brand-white-faint`
- [ ] Replace accent colors: `#c8a65a` → `brand-lime`
- [ ] Replace secondary accent: `#8a5a50` → `brand-lime` (or keep as secondary)
- [ ] Replace text colors to use brand palette

### Task 8: Actualizar index.html — Registration Form

**Files:**
- Modify: `index.html:124-160`

- [ ] Replace all color references with brand palette
- [ ] Update form card background to `bg-brand-dark-elevated/60`
- [ ] Update input borders to `border-brand-white-faint`
- [ ] Update focus states to `focus:border-brand-lime/40`
- [ ] Update submit button to lime gradient
- [ ] Remove inline `onsubmit` handler (will use app.js)

### Task 9: Actualizar index.html — Gallery + Footer

**Files:**
- Modify: `index.html:162-193`

- [ ] Replace all color references with brand palette
- [ ] Update footer border colors
- [ ] Update link hover colors to `brand-lime`
- [ ] Update copyright text colors

### Task 10: Crear app.js — Formulario con Supabase

**Files:**
- Create: `js/app.js`

- [ ] Create form submission logic:

```js
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registration-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    const { data, error } = await supabase
      .from('participants')
      .insert([{
        full_name: form.nombre.value.trim(),
        email: form.email.value.trim(),
        phone: form.telefono.value.trim(),
        category: form.categoria.value,
        status: 'pending'
      }]);

    if (error) {
      console.error(error);
      btn.textContent = originalText;
      btn.disabled = false;
      alert('Error al enviar. Intenta de nuevo o contacta por WhatsApp.');
      return;
    }

    form.innerHTML = `
      <div class="text-center space-y-4">
        <div class="w-16 h-16 rounded-full bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center mx-auto">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h3 class="font-title text-2xl font-black text-brand-white">Registro recibido</h3>
        <p class="text-brand-white-muted">Nos pondremos en contacto vía WhatsApp.</p>
      </div>`;
  });
});
```

### Task 11: Actualizar index.html — Script tags

**Files:**
- Modify: `index.html` (bottom, before `</body>`)

- [ ] Add Supabase SDK CDN script:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```
- [ ] Add config script: `<script src="js/supabase-config.js"></script>`
- [ ] Add app script: `<script src="js/app.js"></script>`
- [ ] Remove the old inline `<script>` block (lines 195-250)

---

## Chunk 3: Login Page

### Task 12: Crear login.html

**Files:**
- Create: `login.html`

- [ ] Create login page with brand styling:
  - Same fonts + Tailwind CDN as index.html
  - Brand colors applied
  - Email + password fields
  - "Iniciar sesión" button with lime accent
  - Link to landing page
  - Error handling
  - Redirect to admin.html on success

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Desert Dance — Admin Login</title>
  <!-- Same fonts + tailwind as index.html -->
  <!-- Brand colors in tailwind config -->
</head>
<body class="bg-brand-dark min-h-screen flex items-center justify-center">
  <div class="w-full max-w-md px-6">
    <div class="text-center mb-8">
      <img src="assets/logos/vertical_primary.svg" alt="Desert Dance" class="h-16 mx-auto mb-4">
      <h1 class="font-title text-2xl font-black text-brand-white">Panel de Administración</h1>
    </div>
    <form id="login-form" class="bg-brand-dark-elevated/80 backdrop-blur-xl rounded-2xl p-8 border border-brand-white-faint space-y-5">
      <div>
        <label class="block text-[10px] font-extrabold text-brand-white-muted uppercase tracking-[0.2em] mb-2">Correo</label>
        <input type="email" id="email" required class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-5 py-3.5 text-sm text-brand-white placeholder:text-brand-white-muted/30 focus:outline-none focus:border-brand-lime/40 transition-colors">
      </div>
      <div>
        <label class="block text-[10px] font-extrabold text-brand-white-muted uppercase tracking-[0.2em] mb-2">Contraseña</label>
        <input type="password" id="password" required class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-5 py-3.5 text-sm text-brand-white placeholder:text-brand-white-muted/30 focus:outline-none focus:border-brand-lime/40 transition-colors">
      </div>
      <button type="submit" class="w-full bg-brand-lime text-brand-dark font-extrabold text-sm tracking-[0.1em] uppercase py-4 rounded-xl hover:bg-brand-lime-hover transition-colors">
        Iniciar Sesión
      </button>
      <p id="error-msg" class="text-red-400 text-sm text-center hidden"></p>
    </form>
    <a href="index.html" class="block text-center mt-6 text-brand-white-muted text-xs hover:text-brand-lime transition-colors">← Volver al sitio</a>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-config.js"></script>
  <script>
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const errorMsg = document.getElementById('error-msg');
      errorMsg.classList.add('hidden');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      });
      if (error) {
        errorMsg.textContent = 'Credenciales incorrectas';
        errorMsg.classList.remove('hidden');
        return;
      }
      window.location.href = 'admin.html';
    });
    // Redirect if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.href = 'admin.html';
    });
  </script>
</body>
</html>
```

---

## Chunk 4: Admin CRM Panel

### Task 13: Crear admin.html — Estructura base

**Files:**
- Create: `admin.html`

- [ ] Create admin page with:
  - Auth guard (redirect to login.html if not authenticated)
  - Same brand styling (fonts, Tailwind, colors)
  - Sidebar or top nav with: Dashboard, Participantes, Cerrar Sesión
  - Responsive layout

### Task 14: Crear admin.html — Dashboard Section

**Files:**
- Modify: `admin.html`

- [ ] Add dashboard with stats cards:
  - Total registros
  - Pendientes / Confirmados / Rechazados
  - Registros por categoría (chart or bar)
  - Registros recientes (últimos 5)
- [ ] Use simple CSS bars or a lightweight chart (no heavy libs)

### Task 15: Crear admin.html — Participants Table

**Files:**
- Modify: `admin.html`

- [ ] Add participants table with columns:
  - Nombre
  - Email
  - Teléfono
  - Categoría
  - Estatus (colored badge)
  - Fecha registro
  - Acciones (editar, cambiar estatus, eliminar)
- [ ] Add search/filter bar:
  - Búsqueda por nombre/email
  - Filtro por categoría (dropdown)
  - Filtro por estatus (dropdown)
- [ ] Add pagination (client-side, 20 per page)
- [ ] Add "Exportar CSV" button

### Task 16: Crear admin.js — Lógica completa

**Files:**
- Create: `js/admin.js`

- [ ] Auth guard: check session, redirect to login if none
- [ ] Fetch participants from Supabase
- [ ] Render table with data
- [ ] Search/filter functionality
- [ ] Status change (dropdown inline or modal)
- [ ] Edit participant (modal with form)
- [ ] Delete participant (confirmation dialog)
- [ ] Export to CSV function
- [ ] Dashboard stats calculation
- [ ] Logout function
- [ ] Real-time updates (Supabase realtime subscription)

### Task 17: Crear admin.html — Modales

**Files:**
- Modify: `admin.html`

- [ ] Edit modal: form with all participant fields, save button
- [ ] Delete confirmation modal
- [ ] Status change dropdown with options: Pendiente, Confirmado, Rechazado, Lista de espera

### Task 18: Exportar CSV

**Files:**
- Modify: `js/admin.js`

- [ ] Implement CSV export:
```js
function exportCSV(data) {
  const headers = ['Nombre', 'Email', 'Teléfono', 'Categoría', 'Estatus', 'Fecha'];
  const rows = data.map(p => [p.full_name, p.email, p.phone, p.category, p.status, new Date(p.created_at).toLocaleDateString('es-MX')]);
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `desert-dance-participantes-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
}
```

---

## Chunk 5: Vercel Deploy + Git

### Task 19: Crear .gitignore

**Files:**
- Create: `.gitignore`

- [ ] Create gitignore:
```
.vercel/
node_modules/
.DS_Store
```

### Task 20: Git commit + push

**Files:**
- All files

- [ ] `git add .`
- [ ] `git commit -m "feat: complete landing page with brand kit, supabase integration, and admin CRM"`
- [ ] `git push origin main`

### Task 21: Vercel deploy

**Files:**
- `.vercel/project.json` (already exists)

- [ ] Verify Vercel project config is correct
- [ ] Trigger deploy via `vercel --prod` or git push auto-deploy
- [ ] Verify site is live and working

---

## Checklist Final

- [ ] Landing page usa brand kit oficial (colores, logos)
- [ ] Formulario conecta a Supabase y guarda registros
- [ ] Login page funciona con Supabase Auth
- [ ] Admin panel muestra tabla de participantes
- [ ] Búsqueda y filtros funcionan
- [ ] Cambio de estatus funciona
- [ ] Edición de participantes funciona
- [ ] Eliminación funciona (con confirmación)
- [ ] Exportar CSV funciona
- [ ] Dashboard muestra estadísticas
- [ ] Cierre de sesión funciona
- [ ] Sitio desplegado en Vercel
- [ ] Responsive en móvil
