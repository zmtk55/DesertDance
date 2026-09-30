# Routes — Desert Dance

Static multi-page site (no SPA router). Each HTML file is a route.

| Path | File | Layout | Summary |
|---|---|---|---|
| `/` | `index.html` | Public nav + footer | Marketing landing: hero, fechas, por qué, categorías, premios, bases, jurado, precios, hoteles, cómo llegar, FAQ, registro 3 pasos, galería, patrocinadores |
| `/login.html` | `login.html` | Centered auth card, no public nav | Admin login (Supabase) |
| `/admin.html` | `admin.html` | Fixed header + sidebar | Admin dashboard: equipos, pagos, categorías, settings |
| `/preview.html` | `preview.html` | Standalone | Internal preview page |

No `package.json` frontend framework. Tailwind via CDN. JS: `js/app.js` (landing form), `js/admin.js`, `js/supabase-config.js`.
