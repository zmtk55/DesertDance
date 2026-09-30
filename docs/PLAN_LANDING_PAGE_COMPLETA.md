# Plan: Landing Page Completa — Desert Dance

**Fecha:** Septiembre 2026  
**Objetivo:** Landing page con TODA la información que un participante necesita  
**Archivo:** `index.html`

---

## ESTRUCTURA ACTUAL

```
1. Nav
2. Hero
3. Dates (Fechas)
4. Registration (Formulario)
5. Gallery
6. Footer
```

---

## SECCIONES A AGREGAR (en orden)

### 1. ¿Por qué participar? (Después de Hero)
Beneficios claros para motivar la inscripción.

### 2. Categorías (Después de Fechas)
Tipos de danza, divisiones por edad, requisitos.

### 3. Premios y Becas (Después de Categorías)
Montos, becas, beneficios adicionales.

### 4. Bases del Concurso (Después de Premios)
Reglas oficiales, proceso de selección, criterios de evaluación.

### 5. Jurado (Después de Bases)
Quiénes evalúan, experiencia, logros.

### 6. Precios/Inversión (Después de Jurado)
Costos por categoría, early bird, plazos de pago.

### 7. Hoteles/Alojamiento (Después de Precios)
Hoteles recomendados, precios, contacto, distancias.

### 8. Cómo Llegar (Después de Hoteles)
Transporte, aeropuerto, carreteras, mapa.

### 9. Preguntas Frecuentes (Después de Cómo Llegar)
FAQ completo para resolver dudas comunes.

### 10. Patrocinadores (Antes del Footer)
Logos de patrocinadores organizados por categoría.

### 11. Footer Mejorado
Links a todas las secciones, redes sociales, contacto completo.

---

## NAVEGACIÓN DEL NAV (Actualizar)

```html
<nav>
  <a href="#por-que">Por qué</a>
  <a href="#categorias">Categorías</a>
  <a href="#premios">Premios</a>
  <a href="#bases">Bases</a>
  <a href="#precios">Precios</a>
  <a href="#hoteles">Hoteles</a>
  <a href="#faq">FAQ</a>
  <a href="#registro">Registro</a>
</nav>
```

---

## DETALLE DE CADA SECCIÓN

### SECCIÓN 1: ¿Por qué participar?

```html
<section id="por-que" class="py-20 md:py-28 px-6 md:px-16 max-w-7xl mx-auto">
  <div class="text-center mb-16">
    <p class="reveal text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">Beneficios</p>
    <h2 class="reveal reveal-d1 font-title text-4xl md:text-6xl font-black text-brand-white tracking-tight">
      ¿Por qué <span class="italic-display italic text-brand-lime font-light">Desert Dance</span>?
    </h2>
  </div>
  
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Beneficio 1 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-colors">
      <div class="w-12 h-12 rounded-full bg-brand-lime/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      </div>
      <h3 class="font-title text-lg font-bold text-brand-white mb-2">Jurado Internacional</h3>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed">Coreógrafos y bailarines de renombre mundial evaluarán tu presentación.</p>
    </div>
    
    <!-- Beneficio 2 -->
    <div class="reveal reveal-d1 bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-colors">
      <div class="w-12 h-12 rounded-full bg-brand-lime/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <h3 class="font-title text-lg font-bold text-brand-white mb-2">Premios en Efectivo</h3>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed">Becas y premios monetarios para los mejores equipos y bailarines destacados.</p>
    </div>
    
    <!-- Beneficio 3 -->
    <div class="reveal reveal-d2 bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-colors">
      <div class="w-12 h-12 rounded-full bg-brand-lime/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <h3 class="font-title text-lg font-bold text-brand-white mb-2">Networking</h3>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed">Conecta con compañías de danza, productores y agentes artísticos de todo México.</p>
    </div>
    
    <!-- Beneficio 4 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-colors">
      <div class="w-12 h-12 rounded-full bg-brand-lime/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      </div>
      <h3 class="font-title text-lg font-bold text-brand-white mb-2">Escenario Único</h3>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed">Presenta tu arte en un escenario al aire libre en pleno desierto de Sonora.</p>
    </div>
    
    <!-- Beneficio 5 -->
    <div class="reveal reveal-d1 bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-colors">
      <div class="w-12 h-12 rounded-full bg-brand-lime/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
      </div>
      <h3 class="font-title text-lg font-bold text-brand-white mb-2">Experiencia Única</h3>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed">Vive una experiencia inmersiva combinando danza, naturaleza y cultura del desierto.</p>
    </div>
    
    <!-- Beneficio 6 -->
    <div class="reveal reveal-d2 bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-colors">
      <div class="w-12 h-12 rounded-full bg-brand-lime/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      </div>
      <h3 class="font-title text-lg font-bold text-brand-white mb-2">Talleres y Masterclasses</h3>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed">Aprende de los mejores en talleres prácticos durante los 3 días de competencia.</p>
    </div>
  </div>
</section>
```

---

### SECCIÓN 2: Categorías

```html
<section id="categorias" class="py-20 md:py-28 px-6 md:px-16 max-w-7xl mx-auto">
  <div class="text-center mb-16">
    <p class="reveal text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">Categorías</p>
    <h2 class="reveal reveal-d1 font-title text-4xl md:text-6xl font-black text-brand-white tracking-tight">
      Elige tu <span class="italic-display italic text-brand-lime font-light">categoría</span>
    </h2>
    <p class="reveal reveal-d2 text-brand-white-muted/50 text-base md:text-lg max-w-2xl mx-auto mt-4">
      Compite en la disciplina que mejor se adapte a tu estilo. Cada categoría tiene sus propias reglas y criterios de evaluación.
    </p>
  </div>
  
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
    <!-- Categoría 1 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-all group">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center">
          <span class="font-title font-black text-brand-lime text-lg">01</span>
        </div>
        <h3 class="font-title text-lg font-bold text-brand-white">Danza Contemporánea</h3>
      </div>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed mb-4">Expresión corporal, movimientos fluidos y narrativa a través del cuerpo.</p>
      <div class="flex flex-wrap gap-2">
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white-faint text-brand-white-muted/60">Infantil</span>
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white-faint text-brand-white-muted/60">Juvenil</span>
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white-faint text-brand-white-muted/60">Senior</span>
      </div>
    </div>
    
    <!-- Categoría 2 -->
    <div class="reveal reveal-d1 bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-all group">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center">
          <span class="font-title font-black text-brand-lime text-lg">02</span>
        </div>
        <h3 class="font-title text-lg font-bold text-brand-white">Danza Urbana</h3>
      </div>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed mb-4">Hip-hop, breakdance, street dance y todas las expresiones urbanas.</p>
      <div class="flex flex-wrap gap-2">
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white-faint text-brand-white-muted/60">Infantil</span>
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white-faint text-brand-white-muted/60">Juvenil</span>
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white-faint text-brand-white-muted/60">Senior</span>
      </div>
    </div>
    
    <!-- Categoría 3 -->
    <div class="reveal reveal-d2 bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-all group">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center">
          <span class="font-title font-black text-brand-lime text-lg">03</span>
        </div>
        <h3 class="font-title text-lg font-bold text-brand-white">Ballet</h3>
      </div>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed mb-4">Ballet clásico, neoclásico y contemporáneo con técnica profesional.</p>
      <div class="flex flex-wrap gap-2">
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white-faint text-brand-white-muted/60">Juvenil</span>
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white-faint text-brand-white-muted/60">Senior</span>
      </div>
    </div>
    
    <!-- Categoría 4 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-all group">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center">
          <span class="font-title font-black text-brand-lime text-lg">04</span>
        </div>
        <h3 class="font-title text-lg font-bold text-brand-white">Danza Folklórica</h3>
      </div>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed mb-4">Danzas tradicionales mexicanas, raíces culturales y expresión regional.</p>
      <div class="flex flex-wrap gap-2">
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white-faint text-brand-white-muted/60">Infantil</span>
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white-faint text-brand-white-muted/60">Juvenil</span>
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white-faint text-brand-white-muted/60">Senior</span>
      </div>
    </div>
    
    <!-- Categoría 5 -->
    <div class="reveal reveal-d1 bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-all group">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center">
          <span class="font-title font-black text-brand-lime text-lg">05</span>
        </div>
        <h3 class="font-title text-lg font-bold text-brand-white">Danza Aérea</h3>
      </div>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed mb-4">Aéreo, telas, trapecio y acrobacia aérea artística.</p>
      <div class="flex flex-wrap gap-2">
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white-faint text-brand-white-muted/60">Juvenil</span>
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white-faint text-brand-white-muted/60">Senior</span>
      </div>
    </div>
    
    <!-- Categoría 6 -->
    <div class="reveal reveal-d2 bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint hover:border-brand-lime/30 transition-all group">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center">
          <span class="font-title font-black text-brand-lime text-lg">06</span>
        </div>
        <h3 class="font-title text-lg font-bold text-brand-white">Workshop</h3>
      </div>
      <p class="text-sm text-brand-white-muted/60 leading-relaxed mb-4">Talleres abiertos para todos los niveles. Aprende sin competir.</p>
      <div class="flex flex-wrap gap-2">
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-white-faint text-brand-white-muted/60">Todos los niveles</span>
      </div>
    </div>
  </div>
  
  <!-- Divisiones por edad -->
  <div class="reveal mt-12 bg-brand-dark-elevated/30 rounded-2xl p-6 border border-brand-white-faint">
    <h4 class="font-title text-lg font-bold text-brand-white mb-4 text-center">Divisiones por edad</h4>
    <div class="grid sm:grid-cols-3 gap-4 text-center">
      <div>
        <p class="font-title text-2xl font-black text-brand-lime mb-1">Infantil</p>
        <p class="text-sm text-brand-white-muted/50">6 a 12 años</p>
      </div>
      <div>
        <p class="font-title text-2xl font-black text-brand-lime mb-1">Juvenil</p>
        <p class="text-sm text-brand-white-muted/50">13 a 17 años</p>
      </div>
      <div>
        <p class="font-title text-2xl font-black text-brand-lime mb-1">Senior</p>
        <p class="text-sm text-brand-white-muted/50">18 años en adelante</p>
      </div>
    </div>
  </div>
</section>
```

---

### SECCIÓN 3: Premios y Becas

```html
<section id="premios" class="py-20 md:py-28 px-6 md:px-16 max-w-6xl mx-auto">
  <div class="text-center mb-16">
    <p class="reveal text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">Premios</p>
    <h2 class="reveal reveal-d1 font-title text-4xl md:text-6xl font-black text-brand-white tracking-tight">
      Premios y <span class="italic-display italic text-brand-lime font-light">becas</span>
    </h2>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    <!-- Premios en efectivo -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl p-8 border border-brand-white-faint">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-full bg-brand-lime/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <h3 class="font-title text-xl font-bold text-brand-white">Premios en Efectivo</h3>
      </div>
      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b border-brand-white-faint">
          <span class="text-brand-white-muted/70">1er Lugar — Cada categoría</span>
          <span class="font-title font-black text-brand-lime">$15,000 MXN</span>
        </div>
        <div class="flex items-center justify-between py-3 border-b border-brand-white-faint">
          <span class="text-brand-white-muted/70">2do Lugar — Cada categoría</span>
          <span class="font-title font-black text-brand-white">$8,000 MXN</span>
        </div>
        <div class="flex items-center justify-between py-3 border-b border-brand-white-faint">
          <span class="text-brand-white-muted/70">3er Lugar — Cada categoría</span>
          <span class="font-title font-black text-brand-white">$5,000 MXN</span>
        </div>
        <div class="flex items-center justify-between py-3">
          <span class="text-brand-white-muted/70">Mejor Coreografía General</span>
          <span class="font-title font-black text-brand-lime">$20,000 MXN</span>
        </div>
      </div>
    </div>
    
    <!-- Becas -->
    <div class="reveal reveal-d1 bg-brand-dark-elevated/50 rounded-2xl p-8 border border-brand-white-faint">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-full bg-brand-lime/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        </div>
        <h3 class="font-title text-xl font-bold text-brand-white">Becas</h3>
      </div>
      <div class="space-y-4">
        <div class="bg-brand-lime/5 rounded-xl p-4 border border-brand-lime/20">
          <p class="font-bold text-brand-white mb-1">Beca de Participación</p>
          <p class="text-sm text-brand-white-muted/60">Los 3 primeros lugares de cada categoría reciben beca parcial para el siguiente año.</p>
        </div>
        <div class="bg-brand-lime/5 rounded-xl p-4 border border-brand-lime/20">
          <p class="font-bold text-brand-white mb-1">Beca Especial "Desert Star"</p>
          <p class="text-sm text-brand-white-muted/60">Bailarín destacado recibe beca completa para estudiar en una escuela de danza aliada.</p>
        </div>
        <div class="bg-brand-lime/5 rounded-xl p-4 border border-brand-lime/20">
          <p class="font-bold text-brand-white mb-1">Beca de Viaje</p>
          <p class="text-sm text-brand-white-muted/60">Equipos foráneos de más de 500 km reciben apoyo para transportación.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

### SECCIÓN 4: Bases del Concurso

```html
<section id="bases" class="py-20 md:py-28 px-6 md:px-16 max-w-5xl mx-auto">
  <div class="text-center mb-16">
    <p class="reveal text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">Bases del Concurso</p>
    <h2 class="reveal reveal-d1 font-title text-4xl md:text-6xl font-black text-brand-white tracking-tight">
      Reglas y <span class="italic-display italic text-brand-lime font-light">bases</span>
    </h2>
  </div>
  
  <div class="space-y-6">
    <!-- Base 1 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center flex-shrink-0">
          <span class="font-title font-black text-brand-lime">01</span>
        </div>
        <div>
          <h3 class="font-title text-lg font-bold text-brand-white mb-2">Requisitos de Participación</h3>
          <ul class="space-y-2 text-sm text-brand-white-muted/60">
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Los equipos deben estar integrados por 2 a 8 bailarines.</li>
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Cada bailarín puede participar en máximo 2 categorías.</li>
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Las rutinas deben tener una duración máxima de 5 minutos.</li>
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>La música debe enviarse en formato MP3, máximo 20 MB.</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Base 2 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center flex-shrink-0">
          <span class="font-title font-black text-brand-lime">02</span>
        </div>
        <div>
          <h3 class="font-title text-lg font-bold text-brand-white mb-2">Criterios de Evaluación</h3>
          <ul class="space-y-2 text-sm text-brand-white-muted/60">
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Técnica y dominio corporal (25%)</li>
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Creatividad y originalidad (25%)</li>
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Expresión artística y emotividad (20%)</li>
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Coordinación grupal (15%)</li>
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Presentación y escenografía (15%)</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Base 3 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center flex-shrink-0">
          <span class="font-title font-black text-brand-lime">03</span>
        </div>
        <div>
          <h3 class="font-title text-lg font-bold text-brand-white mb-2">Proceso de Selección</h3>
          <ul class="space-y-2 text-sm text-brand-white-muted/60">
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Fase 1: Registro y verificación de requisitos.</li>
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Fase 2: Audiciones en vivo (17-19 abril).</li>
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Fase 3: Final y premiación (1-3 mayo).</li>
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>El jurado tiene la palabra final en todas las decisiones.</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Base 4 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center flex-shrink-0">
          <span class="font-title font-black text-brand-lime">04</span>
        </div>
        <div>
          <h3 class="font-title text-lg font-bold text-brand-white mb-2">Consideraciones Generales</h3>
          <ul class="space-y-2 text-sm text-brand-white-muted/60">
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Los participantes menores de 18 años deben presentar carta de autorización paterna.</li>
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Los trajes y utilería corren por cuenta del participante.</li>
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>La organización se reserva el derecho de admitting o rechazar participaciones.</li>
            <li class="flex items-start gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2" class="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Las decisiones del jurado son inapelables.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  
  <div class="reveal mt-8 text-center">
    <a href="#" class="inline-flex items-center gap-2 text-brand-lime text-sm font-bold hover:underline">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Descargar bases completas (PDF)
    </a>
  </div>
</section>
```

---

### SECCIÓN 5: Jurado

```html
<section id="jurado" class="py-20 md:py-28 px-6 md:px-16 max-w-6xl mx-auto">
  <div class="text-center mb-16">
    <p class="reveal text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">Jurado</p>
    <h2 class="reveal reveal-d1 font-title text-4xl md:text-6xl font-black text-brand-white tracking-tight">
      Nuestro <span class="italic-display italic text-brand-lime font-light">jurado</span>
    </h2>
    <p class="reveal reveal-d2 text-brand-white-muted/50 text-base max-w-xl mx-auto mt-4">
      Profesionales de la danza de talla internacional evaluarán cada presentación.
    </p>
  </div>
  
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Jurado 1 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint text-center">
      <div class="w-24 h-24 rounded-full bg-brand-white-faint mx-auto mb-4 flex items-center justify-center">
        <span class="font-title text-3xl font-black text-brand-white-muted/30">MC</span>
      </div>
      <h3 class="font-title text-lg font-bold text-brand-white mb-1">María Contreras</h3>
      <p class="text-xs text-brand-lime font-bold uppercase tracking-wider mb-3">Coreógrafa</p>
      <p class="text-sm text-brand-white-muted/50 leading-relaxed">Directora de la Compañía Nacional de Danza. 20 años de experiencia en danza contemporánea.</p>
    </div>
    
    <!-- Jurado 2 -->
    <div class="reveal reveal-d1 bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint text-center">
      <div class="w-24 h-24 rounded-full bg-brand-white-faint mx-auto mb-4 flex items-center justify-center">
        <span class="font-title text-3xl font-black text-brand-white-muted/30">RM</span>
      </div>
      <h3 class="font-title text-lg font-bold text-brand-white mb-1">Roberto Martínez</h3>
      <p class="text-xs text-brand-lime font-bold uppercase tracking-wider mb-3">Bailarín Principal</p>
      <p class="text-sm text-brand-white-muted/50 leading-relaxed">Ex bailarín del Ballet Nacional. Premio Nacional de Danza 2024.</p>
    </div>
    
    <!-- Jurado 3 -->
    <div class="reveal reveal-d2 bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint text-center">
      <div class="w-24 h-24 rounded-full bg-brand-white-faint mx-auto mb-4 flex items-center justify-center">
        <span class="font-title text-3xl font-black text-brand-white-muted/30">AL</span>
      </div>
      <h3 class="font-title text-lg font-bold text-brand-white mb-1">Ana López</h3>
      <p class="text-xs text-brand-lime font-bold uppercase tracking-wider mb-3">Productora</p>
      <p class="text-sm text-brand-white-muted/50 leading-relaxed">Directora del Festival Internacional de Danza de Monterrey. Productora de espectáculos.</p>
    </div>
  </div>
  
  <p class="reveal text-center text-sm text-brand-white-muted/40 mt-8">* El jurado está sujeto a cambios sin previo aviso.</p>
</section>
```

---

### SECCIÓN 6: Precios/Inversión

```html
<section id="precios" class="py-20 md:py-28 px-6 md:px-16 max-w-5xl mx-auto">
  <div class="text-center mb-16">
    <p class="reveal text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">Inversión</p>
    <h2 class="reveal reveal-d1 font-title text-4xl md:text-6xl font-black text-brand-white tracking-tight">
      Elige tu <span class="italic-display italic text-brand-lime font-light">plan</span>
    </h2>
  </div>
  
  <div class="grid md:grid-cols-2 gap-6">
    <!-- Early Bird -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl p-8 border-2 border-brand-lime/30 relative">
      <div class="absolute top-4 right-4 bg-brand-lime text-brand-dark text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">Early Bird</div>
      <p class="text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.2em] mb-2">Equipo Completo</p>
      <div class="flex items-baseline gap-2 mb-4">
        <span class="font-title text-5xl font-black text-brand-white">$4,500</span>
        <span class="text-brand-white-muted/50 text-sm">MXN</span>
      </div>
      <p class="text-xs text-brand-white-muted/40 mb-6">4 bailarines · Antes del 15 de marzo</p>
      <ul class="space-y-3 mb-8">
        <li class="flex items-center gap-3 text-sm text-brand-white-muted/70"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Acceso a todos los workshops</li>
        <li class="flex items-center gap-3 text-sm text-brand-white-muted/70"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Clases magistrales incluidas</li>
        <li class="flex items-center gap-3 text-sm text-brand-white-muted/70"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Certificado de participación</li>
        <li class="flex items-center gap-3 text-sm text-brand-white-muted/70"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>1 bailarín adicional gratis</li>
      </ul>
      <a href="#registro" class="block w-full bg-brand-lime text-brand-dark text-center py-4 rounded-full font-extrabold text-sm tracking-[0.1em] uppercase hover:bg-brand-lime-hover transition-colors">Inscribirme</a>
    </div>
    
    <!-- Regular -->
    <div class="reveal reveal-d1 bg-brand-dark-elevated/50 rounded-2xl p-8 border border-brand-white-faint">
      <p class="text-[10px] text-brand-white-muted/40 font-extrabold uppercase tracking-[0.2em] mb-2">Regular</p>
      <div class="flex items-baseline gap-2 mb-4">
        <span class="font-title text-5xl font-black text-brand-white">$5,500</span>
        <span class="text-brand-white-muted/50 text-sm">MXN</span>
      </div>
      <p class="text-xs text-brand-white-muted/40 mb-6">4 bailarines · Después del 15 de marzo</p>
      <ul class="space-y-3 mb-8">
        <li class="flex items-center gap-3 text-sm text-brand-white-muted/70"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Acceso a todos los workshops</li>
        <li class="flex items-center gap-3 text-sm text-brand-white-muted/70"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Clases magistrales incluidas</li>
        <li class="flex items-center gap-3 text-sm text-brand-white-muted/70"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Certificado de participación</li>
      </ul>
      <a href="#registro" class="block w-full border border-brand-white-faint text-brand-white text-center py-4 rounded-full font-bold text-sm tracking-[0.1em] uppercase hover:bg-brand-white-muted/10 transition-colors">Inscribirme</a>
    </div>
  </div>
  
  <p class="reveal text-center text-xs text-brand-white-muted/40 mt-8">
    Bailarín adicional: <span class="text-brand-white font-medium">$800 MXN</span> · 
    Pago por transferencia o PayPal · 
    <a href="https://wa.me/526622224220" class="text-brand-lime hover:underline">¿Dudas? Escríbenos</a>
  </p>
</section>
```

---

### SECCIÓN 7: Hoteles/Alojamiento

```html
<section id="hoteles" class="py-20 md:py-28 px-6 md:px-16 max-w-6xl mx-auto">
  <div class="text-center mb-16">
    <p class="reveal text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">Alojamiento</p>
    <h2 class="reveal reveal-d1 font-title text-4xl md:text-6xl font-black text-brand-white tracking-tight">
      Hoteles <span class="italic-display italic text-brand-lime font-light">recomendados</span>
    </h2>
    <p class="reveal reveal-d2 text-brand-white-muted/50 text-base max-w-xl mx-auto mt-4">
      Acuerdos especiales para participantes de Desert Dance. Presenta tu credencial al hacer tu reservación.
    </p>
  </div>
  
  <div class="grid md:grid-cols-3 gap-6">
    <!-- Hotel 1 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl overflow-hidden border border-brand-white-faint hover:border-brand-lime/30 transition-colors">
      <div class="h-48 bg-brand-white-faint flex items-center justify-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-brand-white-muted/20"><path d="M3 21h18M3 7v14M21 7v14M6 11h4M14 11h4M6 15h4M14 15h4M10 3h4l2 4H8l2-4z"/></svg>
      </div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-title text-lg font-bold text-brand-white">Hotel Caborca</h3>
          <span class="text-[10px] font-bold text-brand-lime bg-brand-lime/10 px-2 py-1 rounded">10% dto.</span>
        </div>
        <p class="text-xs text-brand-white-muted/50 mb-3">Centro — A 5 min del venue</p>
        <div class="flex items-baseline gap-1 mb-4">
          <span class="font-title text-2xl font-black text-brand-white">$1,200</span>
          <span class="text-xs text-brand-white-muted/40">/noche</span>
        </div>
        <div class="space-y-2 text-sm text-brand-white-muted/60">
          <p class="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Desayuno incluido</p>
          <p class="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>WiFi gratuito</p>
          <p class="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Estacionamiento</p>
        </div>
        <p class="text-[10px] text-brand-white-muted/30 mt-4">Reservas: (662) 123 4567</p>
      </div>
    </div>
    
    <!-- Hotel 2 -->
    <div class="reveal reveal-d1 bg-brand-dark-elevated/50 rounded-2xl overflow-hidden border border-brand-white-faint hover:border-brand-lime/30 transition-colors">
      <div class="h-48 bg-brand-white-faint flex items-center justify-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-brand-white-muted/20"><path d="M3 21h18M3 7v14M21 7v14M6 11h4M14 11h4M6 15h4M14 15h4M10 3h4l2 4H8l2-4z"/></svg>
      </div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-title text-lg font-bold text-brand-white">Posada del Desierto</h3>
          <span class="text-[10px] font-bold text-brand-lime bg-brand-lime/10 px-2 py-1 rounded">15% dto.</span>
        </div>
        <p class="text-xs text-brand-white-muted/50 mb-3">Periférico — A 8 min del venue</p>
        <div class="flex items-baseline gap-1 mb-4">
          <span class="font-title text-2xl font-black text-brand-white">$950</span>
          <span class="text-xs text-brand-white-muted/40">/noche</span>
        </div>
        <div class="space-y-2 text-sm text-brand-white-muted/60">
          <p class="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Desayuno incluido</p>
          <p class="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Piscina</p>
          <p class="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>WiFi gratuito</p>
        </div>
        <p class="text-[10px] text-brand-white-muted/30 mt-4">Reservas: (662) 234 5678</p>
      </div>
    </div>
    
    <!-- Hotel 3 -->
    <div class="reveal reveal-d2 bg-brand-dark-elevated/50 rounded-2xl overflow-hidden border border-brand-white-faint hover:border-brand-lime/30 transition-colors">
      <div class="h-48 bg-brand-white-faint flex items-center justify-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-brand-white-muted/20"><path d="M3 21h18M3 7v14M21 7v14M6 11h4M14 11h4M6 15h4M14 15h4M10 3h4l2 4H8l2-4z"/></svg>
      </div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-title text-lg font-bold text-brand-white">Hospedaje Básico</h3>
          <span class="text-[10px] font-bold text-brand-lime bg-brand-lime/10 px-2 py-1 rounded">Económico</span>
        </div>
        <p class="text-xs text-brand-white-muted/50 mb-3">Centro — A 3 min del venue</p>
        <div class="flex items-baseline gap-1 mb-4">
          <span class="font-title text-2xl font-black text-brand-white">$550</span>
          <span class="text-xs text-brand-white-muted/40">/noche</span>
        </div>
        <div class="space-y-2 text-sm text-brand-white-muted/60">
          <p class="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Habitación privada</p>
          <p class="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>WiFi gratuito</p>
          <p class="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Baño compartido</p>
        </div>
        <p class="text-[10px] text-brand-white-muted/30 mt-4">Reservas: (662) 345 6789</p>
      </div>
    </div>
  </div>
  
  <div class="reveal mt-8 text-center">
    <p class="text-sm text-brand-white-muted/50">
      ¿Necesitas ayuda con tu hospedaje? 
      <a href="https://wa.me/526622224220" class="text-brand-lime hover:underline font-bold">Escríbenos al WhatsApp</a>
    </p>
  </div>
</section>
```

---

### SECCIÓN 8: Cómo Llegar

```html
<section id="como-llegar" class="py-20 md:py-28 px-6 md:px-16 max-w-6xl mx-auto">
  <div class="text-center mb-16">
    <p class="reveal text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">Transporte</p>
    <h2 class="reveal reveal-d1 font-title text-4xl md:text-6xl font-black text-brand-white tracking-tight">
      Cómo <span class="italic-display italic text-brand-lime font-light">llegar</span>
    </h2>
  </div>
  
  <div class="grid md:grid-cols-2 gap-8">
    <!-- Opciones de transporte -->
    <div class="reveal space-y-6">
      <div class="bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          </div>
          <h3 class="font-title text-lg font-bold text-brand-white">En Avión</h3>
        </div>
        <p class="text-sm text-brand-white-muted/60 leading-relaxed">
          Aeropuerto Internacional de Hermosillo (HMO). Desde ahí, transporte terrestre por carretera (3.5 horas). 
          Aeropuerto de Ciudad Obregón (CEN) a 2 horas.
        </p>
      </div>
      
      <div class="bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <h3 class="font-title text-lg font-bold text-brand-white">En Auto</h3>
        </div>
        <p class="text-sm text-brand-white-muted/60 leading-relaxed">
          Carretera Hermosillo-Caborca (280 km, ~3 hrs). Carretera General Ignacio Pesqueira. 
          Estacionamiento disponible en el venue.
        </p>
      </div>
      
      <div class="bg-brand-dark-elevated/50 rounded-2xl p-6 border border-brand-white-faint">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-brand-lime/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8e723" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
          </div>
          <h3 class="font-title text-lg font-bold text-brand-white">En Autobús</h3>
        </div>
        <p class="text-sm text-brand-white-muted/60 leading-relaxed">
          Líneas Estrella del Norte y TAP siguen la ruta Hermosillo-Caborca. 
          Salidas cada hora desde Terminal de Hermosillo.
        </p>
      </div>
    </div>
    
    <!-- Mapa/Info -->
    <div class="reveal reveal-d1">
      <div class="bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden h-full">
        <div class="h-64 bg-brand-white-faint flex items-center justify-center">
          <div class="text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-brand-white-muted/20 mx-auto mb-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <p class="text-sm text-brand-white-muted/40">Caborca, Sonora, México</p>
          </div>
        </div>
        <div class="p-6">
          <h4 class="font-title font-bold text-brand-white mb-3">Venue del Evento</h4>
          <p class="text-sm text-brand-white-muted/60 mb-4">Centro de Convenciones de Caborca<br>Paseo de las Culturas s/n, Centro</p>
          <a href="https://maps.google.com/?q=Centro+de+Convenciones+Caborca+Sonora" target="_blank" class="inline-flex items-center gap-2 text-brand-lime text-sm font-bold hover:underline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Abrir en Google Maps
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

### SECCIÓN 9: Preguntas Frecuentes (FAQ)

```html
<section id="faq" class="py-20 md:py-28 px-6 md:px-16 max-w-4xl mx-auto">
  <div class="text-center mb-16">
    <p class="reveal text-[10px] text-brand-lime font-extrabold uppercase tracking-[0.25em] mb-3">FAQ</p>
    <h2 class="reveal reveal-d1 font-title text-4xl md:text-6xl font-black text-brand-white tracking-tight">
      Preguntas <span class="italic-display italic text-brand-lime font-light">frecuentes</span>
    </h2>
  </div>
  
  <div class="space-y-4">
    <!-- FAQ 1 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
      <button class="faq-toggle w-full text-left px-6 py-5 flex items-center justify-between gap-4">
        <span class="font-title font-bold text-brand-white">¿Cuántos bailarines necesito para formar un equipo?</span>
        <svg class="faq-icon w-5 h-5 text-brand-white-muted/40 flex-shrink-0 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="faq-content hidden px-6 pb-5">
        <p class="text-sm text-brand-white-muted/60 leading-relaxed">Los equipos deben tener entre 2 y 8 bailarines. No hay límite máximo de bailarines por equipo, pero el registro base incluye 4. Bailarines adicionales tienen un costo extra de $800 MXN.</p>
      </div>
    </div>
    
    <!-- FAQ 2 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
      <button class="faq-toggle w-full text-left px-6 py-5 flex items-center justify-between gap-4">
        <span class="font-title font-bold text-brand-white">¿Puedo participar en más de una categoría?</span>
        <svg class="faq-icon w-5 h-5 text-brand-white-muted/40 flex-shrink-0 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="faq-content hidden px-6 pb-5">
        <p class="text-sm text-brand-white-muted/60 leading-relaxed">Sí, cada bailarín puede participar en máximo 2 categorías. El equipo puede inscribirse en todas las categorías que deseen, pagando la inscripción correspondiente por cada una.</p>
      </div>
    </div>
    
    <!-- FAQ 3 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
      <button class="faq-toggle w-full text-left px-6 py-5 flex items-center justify-between gap-4">
        <span class="font-title font-bold text-brand-white">¿Qué debo llevar para la competencia?</span>
        <svg class="faq-icon w-5 h-5 text-brand-white-muted/40 flex-shrink-0 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="faq-content hidden px-6 pb-5">
        <p class="text-sm text-brand-white-muted/60 leading-relaxed">Traje de práctica o vestuario de competencia, calzado adecuado para tu disciplina, música en USB y copia impresa, identificación oficial, y credencial de registro. Recomendamos traer ropa de abrigo para las noches del desierto.</p>
      </div>
    </div>
    
    <!-- FAQ 4 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
      <button class="faq-toggle w-full text-left px-6 py-5 flex items-center justify-between gap-4">
        <span class="font-title font-bold text-brand-white">¿Hay límite de participantes?</span>
        <svg class="faq-icon w-5 h-5 text-brand-white-muted/40 flex-shrink-0 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="faq-content hidden px-6 pb-5">
        <p class="text-sm text-brand-white-muted/60 leading-relaxed">Sí, hay un límite de 150 equipos en total. Las plazas se asignan por orden de registro y pago. Te recomendamos registrarte lo antes posible para asegurar tu lugar.</p>
      </div>
    </div>
    
    <!-- FAQ 5 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
      <button class="faq-toggle w-full text-left px-6 py-5 flex items-center justify-between gap-4">
        <span class="font-title font-bold text-brand-white">¿Puedo cancelar mi registro?</span>
        <svg class="faq-icon w-5 h-5 text-brand-white-muted/40 flex-shrink-0 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="faq-content hidden px-6 pb-5">
        <p class="text-sm text-brand-white-muted/60 leading-relaxed">Sí, puedes cancelar hasta 15 días antes del evento para recibir un reembolso del 50%. Cancelaciones después de esa fecha no son reembolsables. Contáctanos al WhatsApp para procesar tu cancelación.</p>
      </div>
    </div>
    
    <!-- FAQ 6 -->
    <div class="reveal bg-brand-dark-elevated/50 rounded-2xl border border-brand-white-faint overflow-hidden">
      <button class="faq-toggle w-full text-left px-6 py-5 flex items-center justify-between gap-4">
        <span class="font-title font-bold text-brand-white">¿Hay transporte del aeropuerto al venue?</span>
        <svg class="faq-icon w-5 h-5 text-brand-white-muted/40 flex-shrink-0 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="faq-content hidden px-6 pb-5">
        <p class="text-sm text-brand-white-muted/60 leading-relaxed">No contamos con transporte oficial, pero podemos ayudarte a coordinar un servicio de transporte privado. Escríbenos al WhatsApp con tu vuelo y te conectamos con opciones de traslado.</p>
      </div>
    </div>
  </div>
</section>
```

---

### SECCIÓN 10: Patrocinadores

```html
<section id="patrocinadores" class="py-16 px-6 md:px-16 max-w-6xl mx-auto border-t border-brand-white-faint">
  <div class="text-center mb-10">
    <p class="reveal text-[10px] text-brand-white-muted/30 font-extrabold uppercase tracking-[0.25em]">Patrocinadores</p>
  </div>
  
  <div class="reveal flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50">
    <!-- Logos de patrocinadores (placeholder) -->
    <div class="w-24 h-12 bg-brand-white-faint rounded-lg flex items-center justify-center">
      <span class="text-[10px] text-brand-white-muted/40 font-bold">PATROCINADOR</span>
    </div>
    <div class="w-24 h-12 bg-brand-white-faint rounded-lg flex items-center justify-center">
      <span class="text-[10px] text-brand-white-muted/40 font-bold">PATROCINADOR</span>
    </div>
    <div class="w-24 h-12 bg-brand-white-faint rounded-lg flex items-center justify-center">
      <span class="text-[10px] text-brand-white-muted/40 font-bold">PATROCINADOR</span>
    </div>
    <div class="w-24 h-12 bg-brand-white-faint rounded-lg flex items-center justify-center">
      <span class="text-[10px] text-brand-white-muted/40 font-bold">PATROCINADOR</span>
    </div>
    <div class="w-24 h-12 bg-brand-white-faint rounded-lg flex items-center justify-center">
      <span class="text-[10px] text-brand-white-muted/40 font-bold">PATROCINADOR</span>
    </div>
  </div>
  
  <div class="reveal mt-8 text-center">
    <p class="text-xs text-brand-white-muted/30">¿Quieres ser patrocinador? 
      <a href="https://wa.me/526622224220" class="text-brand-lime hover:underline">Contáctanos</a>
    </p>
  </div>
</section>
```

---

### FOOTER MEJORADO

```html
<footer class="border-t border-brand-white-faint px-6 md:px-16 py-12 md:py-16 max-w-7xl mx-auto mt-4">
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
    <!-- Columna 1: Logo -->
    <div>
      <img src="assets/logos/horizontal_compact.svg" alt="Desert Dance" class="h-10 w-auto mb-4">
      <p class="text-xs text-brand-white-muted/40 leading-relaxed">Competencia de Danza y Expresión Corporal en Caborca, Sonora.</p>
      <div class="flex gap-4 mt-4">
        <a href="#" class="text-brand-white-muted/30 hover:text-brand-lime transition-colors" aria-label="Instagram">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg>
        </a>
        <a href="#" class="text-brand-white-muted/30 hover:text-brand-lime transition-colors" aria-label="Facebook">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
        <a href="#" class="text-brand-white-muted/30 hover:text-brand-lime transition-colors" aria-label="TikTok">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 4.84 1.58V7.53a4.85 4.85 0 0 1-1-.84z"/></svg>
        </a>
      </div>
    </div>
    
    <!-- Columna 2: Evento -->
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
    
    <!-- Columna 3: Info -->
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
    
    <!-- Columna 4: Contacto -->
    <div>
      <h4 class="font-title font-bold text-brand-white text-sm mb-4">Contacto</h4>
      <ul class="space-y-3 text-xs text-brand-white-muted/40">
        <li class="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>
          WhatsApp: (662) 222 4220
        </li>
        <li class="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          info@desertdance.mx
        </li>
        <li class="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Caborca, Sonora
        </li>
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

---

### NAV MEJORADO

```html
<nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-brand-dark/60 border-b border-brand-white-faint">
  <div class="px-6 md:px-16 py-4 flex items-center justify-between max-w-7xl mx-auto">
    <a href="#" class="flex items-center">
      <img src="assets/logos/horizontal_compact.svg" alt="Desert Dance" class="h-9 w-auto">
    </a>
    
    <!-- Desktop nav -->
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
      
      <!-- Mobile menu button -->
      <button id="mobile-menu-btn" class="lg:hidden p-2 text-brand-white-muted/60 hover:text-brand-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>
  </div>
  
  <!-- Mobile menu -->
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

---

## JAVASCRIPT NECESARIO (FAQ accordion)

```javascript
// Agregar al final de app.js
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('.faq-toggle');
  if (!toggle) return;
  
  const item = toggle.closest('[class*="bg-brand-dark-elevated"]');
  const content = item.querySelector('.faq-content');
  const icon = toggle.querySelector('.faq-icon');
  
  content.classList.toggle('hidden');
  icon.style.transform = content.classList.contains('hidden') ? '' : 'rotate(180deg)';
});

// Mobile menu
document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

// Cerrar menú móvil al hacer clic en link
document.querySelectorAll('#mobile-menu a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.add('hidden');
  });
});
```

---

## ORDEN DE IMPLEMENTACIÓN

```
1.  Actualizar Nav (desktop + mobile + links)
2.  Agregar sección "¿Por qué participar?"
3.  Agregar sección "Categorías"
4.  Agregar sección "Premios y Becas"
5.  Agregar sección "Bases del Concurso"
6.  Agregar sección "Jurado"
7.  Agregar sección "Precios/Inversión"
8.  Agregar sección "Hoteles/Alojamiento"
9.  Agregar sección "Cómo Llegar"
10. Agregar sección "FAQ"
11. Agregar sección "Patrocinadores"
12. Actualizar Footer
13. Agregar JavaScript (FAQ, mobile menu)
14. Responsive + polish
```

**Tiempo estimado:** ~30-40 minutos

---

## SECCIONES FINALES DE LA LANDING

```
1.  Nav
2.  Hero
3.  Dates (Fechas)
4.  ¿Por qué participar?        ← NUEVO
5.  Categorías                   ← NUEVO
6.  Premios y Becas              ← NUEVO
7.  Bases del Concurso           ← NUEVO
8.  Jurado                       ← NUEVO
9.  Precios/Inversión            ← NUEVO
10. Hoteles/Alojamiento          ← NUEVO
11. Cómo Llegar                  ← NUEVO
12. FAQ                          ← NUEVO
13. Registro (Formulario)
14. Gallery
15. Patrocinadores               ← NUEVO
16. Footer mejorado              ← MEJORADO
```

---

*Plan generado: Septiembre 2026*
