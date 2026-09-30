# Plan de Mejoras Sistemáticas — Desert Dance Landing Page

**Fecha:** Septiembre 2026  
**Estado:** Aprobado — Listo para ejecutar  
**Archivos principales:** `index.html`, `js/app.js`

---

## FASE 1: Sistema de Diseño (CSS Variables)

**Objetivo:** Centralizar tokens de diseño para consistencia y mantenimiento.

### Cambios en `<style>` de `index.html`:

```css
:root {
  /* Colores */
  --dd-dark: #231f20;
  --dd-dark-elevated: #2a2627;
  --dd-lime: #d8e723;
  --dd-lime-hover: #bcc91b;
  --dd-lime-dim: rgba(216,231,35,0.12);
  --dd-white: #ffffff;
  --dd-white-muted: rgba(255,255,255,0.55);
  --dd-white-faint: rgba(255,255,255,0.08);
  
  /* Espaciado */
  --dd-section-py: 6rem;
  --dd-section-py-mobile: 4rem;
  --dd-container-px: 1.5rem;
  --dd-container-px-md: 4rem;
  
  /* Bordes */
  --dd-radius-card: 2rem;
  --dd-radius-button: 9999px;
  --dd-radius-input: 0.75rem;
  
  /* Sombras */
  --dd-shadow-card: 0 0 80px rgba(0,0,0,0.35);
  --dd-shadow-lime: 0 8px 30px rgba(216,231,35,0.3);
}
```

### Acción:
1. Agregar variables al `<style>` existente
2. Mantener clases de Tailwind existentes (no romper nada)
3. Las variables servirán para futuras expansiones

---

## FASE 2: Footer Fix

**Objetivo:** Corregir errores visuales y agregar funcionalidad.

### Cambios en `<footer>`:

**Eliminar:**
```html
<!-- ELIMINAR esta línea -->
<p>Brand kit Desert Dance Collective.</p>
```

**Reemplazar sección de links:**
```html
<div class="flex gap-8 text-[11px] text-brand-white-muted/30 font-medium tracking-[0.06em] uppercase">
  <a href="#fechas" class="hover:text-brand-lime transition-colors">Fechas</a>
  <a href="#registro" class="hover:text-brand-lime transition-colors">Registro</a>
  <!-- CAMBIAR href="#" por href real -->
  <a href="https://wa.me/526622224220" target="_blank" rel="noopener" class="hover:text-brand-lime transition-colors">Contacto</a>
</div>
```

**Agregar redes sociales después del footer:**
```html
<!-- Después del cierre del footer existente, agregar: -->
<div class="border-t border-brand-white-faint px-6 md:px-16 py-6 max-w-7xl mx-auto">
  <div class="flex items-center justify-center gap-6">
    <!-- Instagram -->
    <a href="https://instagram.com/desertdance" target="_blank" rel="noopener" 
       class="text-brand-white-muted/30 hover:text-brand-lime transition-colors" aria-label="Instagram">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    </a>
    <!-- TikTok (placeholder - ajustar URL real) -->
    <a href="https://tiktok.com/@desertdance" target="_blank" rel="noopener"
       class="text-brand-white-muted/30 hover:text-brand-lime transition-colors" aria-label="TikTok">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 4.84 1.58V7.53a4.85 4.85 0 0 1-1-.84z"/>
      </svg>
    </a>
    <!-- Facebook -->
    <a href="https://facebook.com/desertdance" target="_blank" rel="noopener"
       class="text-brand-white-muted/30 hover:text-brand-lime transition-colors" aria-label="Facebook">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    </a>
  </div>
</div>
```

### Notas:
- Ajustar URLs reales de redes sociales antes de publicar
- Los iconos SVG son inline para evitar dependencias externas

---

## FASE 3: Sección "¿Por qué participar?"

**Objetivo:** Generar confianza y motivar la inscripción.

### Insertar después de la sección de Fechas (antes de Registro):

```html
<!-- Why Participate -->
<section class="py-20 md:py-28 px-6 md:px-16 max-w-7xl mx-auto">
  <div class="text-center mb-16">
    <p class="reveal text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">Beneficios</p>
    <h2 class="reveal reveal-d1 font-title text-4xl md:text-6xl font-black text-brand-white tracking-tight">¿Por qué <span class="italic-display italic text-brand-lime font-light">Desert Dance</span>?</h2>
  </div>
  
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Jurado Internacional -->
    <div class="reveal bg-brand-dark-elevated/50 backdrop-blur-sm rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-colors">
      <div class="w-12 h-12 rounded-full bg-brand-lime/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <h3 class="font-title text-lg font-bold text-brand-white mb-2">Jurado Internacional</h3>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed">Coreógrafos y bailarines de renombre mundial evaluarán tu presentación.</p>
    </div>

    <!-- Premios -->
    <div class="reveal reveal-d1 bg-brand-dark-elevated/50 backdrop-blur-sm rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-colors">
      <div class="w-12 h-12 rounded-full bg-brand-lime/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="7"/>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
        </svg>
      </div>
      <h3 class="font-title text-lg font-bold text-brand-white mb-2">Premios en Efectivo</h3>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed">Becas y premios monetarios para los mejores equipos y bailarines.</p>
    </div>

    <!-- Networking -->
    <div class="reveal reveal-d2 bg-brand-dark-elevated/50 backdrop-blur-sm rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-colors">
      <div class="w-12 h-12 rounded-full bg-brand-lime/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <h3 class="font-title text-lg font-bold text-brand-white mb-2">Networking</h3>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed">Conecta con compañías de danza, productores y agentes artísticos.</p>
    </div>

    <!-- Escenario -->
    <div class="reveal reveal-d3 bg-brand-dark-elevated/50 backdrop-blur-sm rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-colors">
      <div class="w-12 h-12 rounded-full bg-brand-lime/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      </div>
      <h3 class="font-title text-lg font-bold text-brand-white mb-2">Escenario al Aire Libre</h3>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed">Presenta tu arte en un escenario único en pleno desierto de Sonora.</p>
    </div>
  </div>
</section>
```

### Notas:
- La sección va entre Fechas y Registro
- Grid responsive: 4 cols en desktop, 2 en tablet, 1 en mobile
- Hover effect sutil en las cards
- Iconos inline SVG (sin dependencias)

---

## FASE 4: Sección de Precios

**Objetivo:** Mostrar inversión clara y crear urgencia con early bird.

### Insertar después de "¿Por qué participar?" (antes de Registro):

```html
<!-- Pricing -->
<section class="py-20 md:py-28 px-6 md:px-16 max-w-5xl mx-auto">
  <div class="text-center mb-16">
    <p class="reveal text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">Inversión</p>
    <h2 class="reveal reveal-d1 font-title text-4xl md:text-6xl font-black text-brand-white tracking-tight">Elige tu <span class="italic-display italic text-brand-lime font-light">plan</span></h2>
  </div>

  <div class="grid md:grid-cols-2 gap-6">
    <!-- Early Bird -->
    <div class="reveal bg-brand-dark-elevated/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-brand-lime/30 relative overflow-hidden">
      <div class="absolute top-4 right-4 bg-brand-lime text-brand-dark text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
        Early Bird
      </div>
      <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-2">Equipo Completo</p>
      <div class="flex items-baseline gap-2 mb-4">
        <span class="font-title text-5xl font-black text-brand-white">$4,500</span>
        <span class="text-brand-white-muted/50 text-sm">MXN</span>
      </div>
      <p class="text-xs text-brand-white-muted/40 mb-6">4 bailarines · Antes del 15 de marzo</p>
      <ul class="space-y-3 mb-8">
        <li class="flex items-center gap-3 text-sm text-brand-white-muted/70">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Acceso a todos los workshops
        </li>
        <li class="flex items-center gap-3 text-sm text-brand-white-muted/70">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Clases magistrales incluidas
        </li>
        <li class="flex items-center gap-3 text-sm text-brand-white-muted/70">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Certificado de participación
        </li>
      </ul>
      <a href="#registro" class="block w-full bg-brand-lime text-brand-dark text-center py-4 rounded-full font-extrabold text-sm tracking-[0.1em] uppercase hover:bg-brand-lime-hover transition-colors">
        Inscribirme
      </a>
    </div>

    <!-- Regular -->
    <div class="reveal reveal-d1 bg-brand-dark-elevated/50 backdrop-blur-sm rounded-2xl p-8 border border-brand-white-faint">
      <p class="text-[10px] text-brand-white-muted/40 font-extrabold uppercase tracking-[0.2em] mb-2">Regular</p>
      <div class="flex items-baseline gap-2 mb-4">
        <span class="font-title text-5xl font-black text-brand-white">$5,500</span>
        <span class="text-brand-white-muted/50 text-sm">MXN</span>
      </div>
      <p class="text-xs text-brand-white-muted/40 mb-6">4 bailarines · Después del 15 de marzo</p>
      <ul class="space-y-3 mb-8">
        <li class="flex items-center gap-3 text-sm text-brand-white-muted/70">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Acceso a todos los workshops
        </li>
        <li class="flex items-center gap-3 text-sm text-brand-white-muted/70">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Clases magistrales incluidas
        </li>
        <li class="flex items-center gap-3 text-sm text-brand-white-muted/70">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Certificado de participación
        </li>
      </ul>
      <a href="#registro" class="block w-full border border-brand-white-faint text-brand-white text-center py-4 rounded-full font-bold text-sm tracking-[0.1em] uppercase hover:bg-brand-white-muted/10 transition-colors">
        Inscribirme
      </a>
    </div>
  </div>

  <p class="reveal reveal-d2 text-center text-xs text-brand-white-muted/40 mt-8">
    Bailarín adicional: <span class="text-brand-white font-medium">$800 MXN</span> · 
    Pago por transferencia o PayPal · 
    <a href="https://wa.me/526622224220" class="text-brand-lime hover:underline">¿Dudas? Escríbenos</a>
  </p>
</section>
```

### Notas:
- Precios de ejemplo — ajustar valores reales
- Early bird crea urgencia
- Dos cards comparativas
- Incluye CTA a WhatsApp para dudas

---

## FASE 5: CTAs Hero Mejorados

**Objetivo:** Generar urgencia y claridad.

### Cambios en Hero:

**Cambiar botón primario:**
```html
<!-- ANTES -->
<a href="#registro" class="...">Registro abierto</a>

<!-- DESPUÉS -->
<a href="#registro" class="...">Inscribirme — Plazas limitadas</a>
```

**Cambiar botón secundario:**
```html
<!-- ANTES -->
<a href="#fechas" class="...">Fechas</a>

<!-- DESPUÉS -->
<a href="#fechas" class="...">Ver el programa</a>
```

**Agregar urgencia debajo de las estadísticas:**
```html
<!-- Después del div de estadísticas (14 Categorías, 3 Días, 2 Eventos) -->
<p class="reveal reveal-d4 text-[11px] text-brand-lime/60 mt-4 font-medium">
  <span class="inline-block w-1.5 h-1.5 bg-brand-lime rounded-full mr-2 animate-pulse"></span>
  Quedan pocas plazas — Cierre de inscripciones: 10 de abril
</p>
```

---

## FASE 6: Accesibilidad

**Objetivo:** Cumplir estándares WCAG y mejorar usabilidad.

### 6.1 Reduced Motion

**Agregar al `<style>`:**
```css
@media (prefers-reduced-motion: reduce) {
  .reveal {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  html {
    scroll-behavior: auto !important;
  }
}
```

### 6.2 Skip Navigation

**Agregar al inicio de `<body>`:**
```html
<a href="#registro" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand-lime focus:text-brand-dark focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm">
  Saltar al registro
</a>
```

### 6.3 Aria Labels en Formulario

**En cada input del formulario, agregar `aria-describedby`:**
```html
<!-- Ejemplo para team-name -->
<input id="team-name" ... aria-describedby="team-name-hint">
<span id="team-name-hint" class="sr-only">Nombre del estudio o equipo de danza</span>
```

**En el error message:**
```html
<p id="reg-error" class="hidden text-red-400 text-sm text-center pt-1" role="alert" aria-live="polite"></p>
```

---

## FASE 7: Gallery Mejorada

**Objetivo:** Mayor autenticidad y coherencia visual.

### Opción A: Agregar captions contextuales

```html
<!-- Gallery -->
<section class="py-20 md:py-28 px-6 md:px-16 max-w-7xl mx-auto">
  <div class="text-center mb-12">
    <p class="reveal text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">El Escenario</p>
    <h2 class="reveal reveal-d1 font-title text-4xl md:text-7xl font-black text-brand-white tracking-tight mb-3">Así se vive</h2>
    <p class="reveal reveal-d2 text-brand-white-muted/40 italic-display italic">Caborca — abril y mayo, 2026</p>
  </div>
  
  <div class="grid md:grid-cols-3 gap-5">
    <div class="reveal relative group">
      <img src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80&auto=format" 
           alt="Bailarina en ensayo general bajo luces de escenario" 
           class="rounded-2xl w-full h-[420px] md:h-[520px] object-cover shadow-2xl group-hover:scale-[1.015] transition-transform duration-700" 
           loading="lazy">
      <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p class="text-sm text-white font-medium">Ensayos y preparación</p>
      </div>
    </div>
    
    <div class="reveal reveal-d1 relative group">
      <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80&auto=format" 
           alt="Momento de la competencia con jurado observando" 
           class="rounded-2xl w-full h-[420px] md:h-[520px] object-cover shadow-2xl group-hover:scale-[1.015] transition-transform duration-700" 
           loading="lazy">
      <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p class="text-sm text-white font-medium">La competencia en vivo</p>
      </div>
    </div>
    
    <div class="reveal reveal-d2 relative group">
      <img src="https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=800&q=80&auto=format" 
           alt="Taller práctico con coreógrafo invitado" 
           class="rounded-2xl w-full h-[420px] md:h-[520px] object-cover shadow-2xl group-hover:scale-[1.015] transition-transform duration-700" 
           loading="lazy">
      <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p class="text-sm text-white font-medium">Workshops y masterclasses</p>
      </div>
    </div>
  </div>
</section>
```

### Notas:
- Agregué captions que aparecen en hover
- Mejoré los alt texts
- Agregué eyebrow "El Escenario"
- Cambié título a "Así se vive" (más emocional)

---

## FASE 8: Copy y Storytelling

**Objetivo:** Crear narrativa coherente y emocional.

### 8.1 Hero — Agregar línea de storytelling

**Cambiar descripción:**
```html
<!-- ANTES -->
<p class="reveal reveal-d3 text-base md:text-xl text-brand-white-muted/70 max-w-xl leading-relaxed mb-3">
  Una competencia de danza contemporánea y expresión corporal en pleno desierto de Sonora. Tu estudio compite por equipos. Regístrate antes del cierre de plazas.
</p>

<!-- DESPUÉS -->
<p class="reveal reveal-d3 text-base md:text-xl text-brand-white-muted/70 max-w-xl leading-relaxed mb-3">
  Donde el desierto se convierte en escenario. Una competencia de danza contemporánea y expresión corporal que reúne a los mejores estudios de México. Tu estudio compite por equipos — demuestra tu arte.
</p>
```

### 8.2 Fechas — Clarificar diferencia

**Cambiar títulos de las cards:**
```html
<!-- ANTES -->
<p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">Competencia & Workshop</p>

<!-- DESPUÉS -->
<p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">Fase 1 · Competencia & Workshop</p>
```

```html
<!-- ANTES -->
<p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">Competencia & Convención</p>

<!-- DESPUÉS -->
<p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">Fase 2 · Convención & Gala</p>
```

### 8.3 Registro — Agregar ayuda

**Agregar después del párrafo de "Toma menos de 2 minutos":**
```html
<p class="reveal reveal-d1 text-xs text-brand-white-muted/30 mt-2">
  ¿Tienes dudas? 
  <a href="https://wa.me/526622224220" class="text-brand-lime hover:underline" target="_blank" rel="noopener">Escríbenos al WhatsApp</a>
</p>
```

---

## ORDEN DE EJECUCIÓN

```
1. FASE 1 → Variables CSS (base)
2. FASE 2 → Footer fix (urgente)
3. FASE 5 → CTAs Hero (urgente)
4. FASE 6 → Accesibilidad (medium)
5. FASE 3 → ¿Por qué participar? (alto)
6. FASE 4 → Precios (alto)
7. FASE 7 → Gallery (low)
8. FASE 8 → Copy (low)
```

**Total estimado:** ~15-20 minutos de edición

---

## VERIFICACIÓN POST-IMPLEMENTACIÓN

- [ ] Responsive en mobile (375px)
- [ ] Responsive en tablet (768px)
- [ ] Responsive en desktop (1440px)
- [ ] Formulario funcional (paso 1 → 2 → 3 → submit)
- [ ] Animaciones con reduced-motion
- [ ] Links de redes sociales funcionales
- [ ] WhatsApp link correcto
- [ ] Sin errores en consola
- [ ] Contraste de colores WCAG AA

---

*Plan generado: Septiembre 2026*
