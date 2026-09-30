# Components — Desert Dance

Vanilla HTML site. Shared primitives live inline in pages, not in a component library.

## LimeCta (primary button)

Used in nav (Registro) and hero (Registro abierto).

```html
<a href="#registro" class="px-5 py-2.5 rounded-full bg-brand-lime text-brand-dark text-xs font-extrabold uppercase tracking-[0.12em] hover:bg-brand-lime-hover transition-colors duration-300">Registro</a>
```

Hero variant:

```html
<a href="#registro" class="inline-block bg-brand-lime text-brand-dark px-8 py-4 rounded-full font-extrabold text-sm tracking-[0.1em] uppercase shadow-[0_8px_30px_rgba(216,231,35,0.3)] hover:bg-brand-lime-hover hover:shadow-[0_12px_40px_rgba(216,231,35,0.5)] hover:-translate-y-0.5 transition-all duration-400">Registro abierto</a>
```

## OutlineCta

```html
<a href="#fechas" class="inline-block border border-brand-white-muted text-brand-white text-sm font-bold uppercase tracking-[0.1em] px-8 py-4 rounded-full hover:bg-brand-white-muted/10 hover:border-brand-lime/40 transition-all duration-300">Fechas</a>
```

## BenefitCard

```html
<div class="reveal bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-colors">
  <div class="w-12 h-12 rounded-full bg-brand-lime/10 flex items-center justify-center mb-4">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
  </div>
  <h3 class="font-title text-lg font-bold text-brand-white mb-2">Jurado Internacional</h3>
  <p class="text-sm text-brand-white-muted/60 leading-relaxed">Coreógrafos y bailarines de renombre mundial evaluarán tu presentación.</p>
</div>
```

## FormField

```html
<input id="team-name" name="team-name" type="text" autocomplete="organization" placeholder="Ej. Academia Alzira" class="w-full bg-brand-dark/50 border border-brand-white-faint rounded-xl px-4 sm:px-5 py-4 text-base sm:text-sm text-brand-white placeholder:text-brand-white-muted/30 focus:outline-none focus:border-brand-lime/40 transition-colors">
```

## LoginCard — `login.html`

See `login.html` lines 44–71: centered max-w-md card, vertical logo, Jost title with italic lime “Administración”, lime submit.

Layout components (Nav, Footer, AdminHeader) are in `layouts.md`.
