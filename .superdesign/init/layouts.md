# Layouts — Desert Dance

## SiteNav — `index.html`

Fixed public navigation with compact logo, desktop links, Admin, Registro CTA, and mobile drawer.

```html
  <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-brand-dark/60 border-b border-brand-white-faint">
    <div class="px-6 md:px-16 py-4 flex items-center justify-between max-w-7xl mx-auto">
      <a href="#" class="flex items-center">
        <img src="assets/logos/horizontal_compact.svg" alt="Desert Dance" class="h-9 w-auto">
      </a>
      <div class="hidden lg:flex items-center gap-6">
        <a href="#por-que" class="text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors">Por qué</a>
        <a href="#categorias" class="text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors">Categorías</a>
        <a href="#premios" class="text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors">Premios</a>
        <a href="#bases" class="text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors">Bases</a>
        <a href="#precios" class="text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors">Precios</a>
        <a href="#hoteles" class="text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors">Hoteles</a>
        <a href="#faq" class="text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors">FAQ</a>
      </div>
      <div class="flex items-center gap-3">
        <a href="login.html" class="hidden md:inline-flex items-center gap-2 text-xs text-brand-white-muted/60 hover:text-brand-lime transition-colors font-medium">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          Admin
        </a>
        <a href="#registro" class="px-5 py-2.5 rounded-full bg-brand-lime text-brand-dark text-xs font-extrabold uppercase tracking-[0.12em] hover:bg-brand-lime-hover transition-colors duration-300">Registro</a>
        <button id="mobile-menu-btn" class="lg:hidden p-2 text-brand-white-muted/60 hover:text-brand-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>
    <div id="mobile-menu" class="hidden lg:hidden border-t border-brand-white-faint bg-brand-dark/95 backdrop-blur-xl">
      <div class="px-6 py-4 space-y-3">
        <a href="#por-que" class="block text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors py-2">Por qué participar</a>
        <a href="#categorias" class="block text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors py-2">Categorías</a>
        <a href="#premios" class="block text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors py-2">Premios</a>
        <a href="#bases" class="block text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors py-2">Bases</a>
        <a href="#precios" class="block text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors py-2">Precios</a>
        <a href="#hoteles" class="block text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors py-2">Hoteles</a>
        <a href="#como-llegar" class="block text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors py-2">Cómo llegar</a>
        <a href="#faq" class="block text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors py-2">FAQ</a>
        <a href="login.html" class="block text-brand-white-muted text-sm font-medium hover:text-brand-lime transition-colors py-2">Admin</a>
      </div>
    </div>
  </nav>
```

## SiteFooter — `index.html`

```html
  <footer class="border-t border-brand-white-faint px-6 md:px-16 py-12 md:py-16 max-w-7xl mx-auto mt-4">
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
      <div>
        <img src="assets/logos/horizontal_compact.svg" alt="Desert Dance" class="h-10 w-auto mb-4">
        <p class="text-xs text-brand-white-muted/40 leading-relaxed">Competencia de Danza y Expresión Corporal en Caborca, Sonora.</p>
      </div>
      <div>
        <h4 class="font-title font-bold text-brand-white text-sm mb-4">Evento</h4>
        <ul class="space-y-2 text-xs text-brand-white-muted/40">
          <li><a href="#por-que" class="hover:text-brand-lime transition-colors">Por qué participar</a></li>
          <li><a href="#categorias" class="hover:text-brand-lime transition-colors">Categorías</a></li>
          <li><a href="#premios" class="hover:text-brand-lime transition-colors">Premios</a></li>
          <li><a href="#bases" class="hover:text-brand-lime transition-colors">Bases del concurso</a></li>
          <li><a href="#jurado" class="hover:text-brand-lime transition-colors">Jurado</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-title font-bold text-brand-white text-sm mb-4">Información</h4>
        <ul class="space-y-2 text-xs text-brand-white-muted/40">
          <li><a href="#precios" class="hover:text-brand-lime transition-colors">Precios</a></li>
          <li><a href="#hoteles" class="hover:text-brand-lime transition-colors">Hoteles</a></li>
          <li><a href="#como-llegar" class="hover:text-brand-lime transition-colors">Cómo llegar</a></li>
          <li><a href="#faq" class="hover:text-brand-lime transition-colors">Preguntas frecuentes</a></li>
          <li><a href="#registro" class="hover:text-brand-lime transition-colors">Registro</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-title font-bold text-brand-white text-sm mb-4">Contacto</h4>
        <ul class="space-y-3 text-xs text-brand-white-muted/40">
          <li>WhatsApp: (662) 222 4220</li>
          <li>info@desertdance.mx</li>
          <li>Caborca, Sonora</li>
        </ul>
      </div>
    </div>
    <div class="pt-8 border-t border-brand-white-faint flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-brand-white-muted/25">
      <p>&copy; Desert Dance 2026. Todos los derechos reservados.</p>
      <div class="flex gap-4">
        <a href="#" class="hover:text-brand-lime transition-colors">Términos</a>
        <a href="#" class="hover:text-brand-lime transition-colors">Privacidad</a>
      </div>
    </div>
  </footer>
```

## AdminHeader — `admin.html`

```html
  <header class="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-brand-dark/70 border-b border-brand-white-faint">
    <div class="px-4 md:px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <img src="assets/logos/d_mark.svg" alt="" class="h-7 w-auto">
          <p class="font-title font-black text-brand-white text-sm tracking-tight hidden sm:block">Desert Dance</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <a href="index.html" class="hidden md:inline-flex items-center gap-2 text-xs text-brand-white-muted/60 hover:text-brand-lime transition-colors font-medium">Ver sitio</a>
        <span id="admin-email" class="text-xs text-brand-white-muted/40 hidden md:block"></span>
        <button id="btn-logout" class="text-xs font-bold uppercase tracking-[0.1em] px-4 py-2 rounded-lg border border-brand-white-faint text-brand-white-muted/70 hover:text-brand-lime hover:border-brand-lime/40 transition-all">Salir</button>
      </div>
    </div>
  </header>
```
