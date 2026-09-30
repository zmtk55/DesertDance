# Pages — dependency trees

Vanilla HTML (no component imports). Each page is a single file plus shared logos and scripts.

## / (Home / Landing)
Entry: `index.html`
Dependencies:
- `assets/logos/horizontal_compact.svg` (nav + footer)
- `assets/logos/vertical_primary.svg` (hero)
- `assets/logos/favicon-32.png`
- `js/supabase-config.js`
- `js/app.js`
- External: Google Fonts, Tailwind CDN, Unsplash hero + gallery photos, Supabase JS

Sections in render order: Nav, Hero, Fechas, Por qué, Categorías, Premios, Bases, Jurado, Precios, Hoteles, Cómo llegar, FAQ, Registro, Galería, Patrocinadores, Footer.

## /login.html
Entry: `login.html`
Dependencies:
- `assets/logos/vertical_primary.svg`
- `js/supabase-config.js`
- Inline login script

## /admin.html
Entry: `admin.html`
Dependencies:
- `assets/logos/d_mark.svg` (header)
- `js/supabase-config.js`
- `js/admin.js`
