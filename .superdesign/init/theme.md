# Theme — Desert Dance

## Part 1 — Compact token summary

### Colors
| Token | Value |
|---|---|
| brand-dark | `#231f20` |
| brand-dark-elevated | `#2a2627` |
| brand-lime | `#d8e723` |
| brand-lime-hover | `#bcc91b` |
| brand-lime-dim | `rgba(216,231,35,0.12)` |
| brand-white | `#ffffff` |
| brand-white-muted | `rgba(255,255,255,0.55)` |
| brand-white-faint | `rgba(255,255,255,0.08)` |

Body background: `#231f20`. Text: `#ffffff`. Selection: `rgba(216,231,35,0.25)` on white.

### Fonts
- Titles / stats: `'Jost'` (`font-title`), weights 300/400/600/900
- Italic display accents: `'Cormorant Garamond'` (`italic-display`), italic 300/600
- Body: `'DM Sans'` (`font-body`), 300/400/500

### Type patterns
- Eyebrow: 10–11px, extrabold, uppercase, tracking 0.25–0.3em, lime
- H1/section titles: Jost black, 4xl–7xl, tight tracking
- Italic lime accent word inside titles via Cormorant
- Body: sm, muted white 40–70% opacity, relaxed leading
- CTA: xs–sm, extrabold, uppercase, tracking 0.1–0.12em

### Radius / shadows
- Pills: `rounded-full`
- Cards: `rounded-2xl`
- Large panels: `rounded-[2rem]` / `rounded-[2.5rem]`
- Lime CTA glow: `shadow-[0_8px_30px_rgba(216,231,35,0.3)]`
- Dark panels: `shadow-[0_0_80px_rgba(0,0,0,0.35)]`

### Layout
- Nav: fixed, `backdrop-blur-xl`, `bg-brand-dark/60`, bottom border faint
- Page padding: `px-6 md:px-16`
- Content max: `max-w-4xl` to `max-w-7xl`
- Breakpoints: Tailwind default (sm 640, md 768, lg 1024)

### Motion
- `revealUp`: opacity 0 + translateY(28px) → rest, 1s ease-out
- Stagger delays: 0.08s increments
- CTA hover: `-translate-y-0.5`, lime-hover fill

## Part 2 — Raw source

CDN Tailwind config (inline in `index.html`, `login.html`, `admin.html`):

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'brand-dark': '#231f20',
        'brand-dark-elevated': '#2a2627',
        'brand-lime': '#d8e723',
        'brand-lime-hover': '#bcc91b',
        'brand-lime-dim': 'rgba(216,231,35,0.12)',
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

Inline CSS from `index.html`:

```css
::selection { background: rgba(216,231,35,0.25); color: #ffffff; }
html { scroll-behavior: smooth; }
body { font-family: 'DM Sans', sans-serif; background: #231f20; color: #ffffff; }
@keyframes revealUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
.reveal { animation: revealUp 1s ease-out both; }
.reveal-d1 { animation-delay: 0.08s; }
.reveal-d2 { animation-delay: 0.16s; }
.reveal-d3 { animation-delay: 0.24s; }
.reveal-d4 { animation-delay: 0.32s; }
@media (max-width: 640px) {
  input, select, textarea { font-size: 16px !important; }
}
```
