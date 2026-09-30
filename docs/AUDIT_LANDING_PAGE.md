# Audit: Landing Page Desert Dance

**Fecha:** Septiembre 2026  
**URL:** index.html  
**Objetivo:** Competencia de Danza y Expresión Corporal en Caborca, Sonora

---

## 1. IDENTIDAD VISUAL & BRANDING

### Paleta de Colores
| Color | Hex | Uso |
|-------|-----|-----|
| Brand Dark | `#231f20` | Fondo principal |
| Brand Lime | `#d8e723` | Acento principal, CTAs |
| Brand White | `#ffffff` | Texto principal |
| White Muted | `rgba(255,255,255,0.55)` | Texto secundario |

**Hallazgo:** La paleta es coherente y funcional. El lime sobre oscuro crea buen contraste. Sin embargo, el lime es un color "agresivo" que puede no evocar la elegancia de la danza contemporánea. La paleta se siente más "festival de música electrónica" que "competencia de danza".

### Tipografía
- **Display/Títulos:** Jost (sans-serif, bold/black)
- **Itálicas decorativas:** Cormorant Garamond (serif, italic)
- **Body:** DM Sans

**Hallazgo:** La combinación es sólida. Cormorant Garamond aporta elegancia al itálico de "Dance". Jost es limpia y moderna. Sin embargo, la jerarquía tipográfica podría ser más dramática — los títulos son grandes pero no memorables.

### Logos
- `horizontal_compact.svg` — Logo principal en nav y footer
- `vertical_primary.svg` — Versión vertical (no usada en landing)
- `d_mark.svg` — Marca "D" (no usada)

**Hallazgo:** Solo se usa el logo horizontal. El logo "D" podría usarse como favicon o elemento decorativo.

---

## 2. HERO SECTION

### Estructura
```
┌─────────────────────────────────────────┐
│  [Imagen de fondo Unsplash - opacity 25%] │
│  [Gradient overlay oscuro]              │
│                                         │
│  COMPETENCIA · 2026                     │
│  Desert                                 │
│  Dance (lime italic)                    │
│  [Descripción]                          │
│  [Fechas]                               │
│  [CTA Registro] [CTA Fechas]           │
│                                         │
│  14 Categorías | 3 Días | 2 Eventos    │
└─────────────────────────────────────────┘
```

### Problemas Identificados

1. **Imagen genérica de Unsplash:** La foto `photo-1518837695005-2083093ee35b` es una imagen stock de "danza contemporánea" que no representa el evento real. Se siente impersonal.

2. **Estadísticas ambigüas:** "14 Categorías", "3 Días", "2 Eventos" — no está claro qué significan estas categorías. ¿Son categorías de danza? ¿Edades? El usuario no puede interpretar esto sin contexto.

3. **Fechas confusas:** El hero dice "17, 18 y 19 de abril" pero la sección de fechas también incluye "1-3 de mayo". ¿Son dos eventos separados? La narrativa no es clara.

4. **CTA secundario décil:** "Fechas" como CTA no tiene suficiente valor percibido. El usuario no sabe qué obtendrá al hacer clic.

5. **Sin prueba social:** No hay testimonios, logros pasados, ni elementos que generen confianza.

---

## 3. SECCIÓN DE FECHAS

### Estructura
```
┌─────────────────────────────────────────┐
│  [Card elevada con blur]                │
│                                         │
│  COMPETENCIA & WORKSHOP    COMPETENCIA & CONVENCIÓN
│  17-19 abr 2026            1-3 may 2026
│  [Descripción]             [Descripción]
│                                         │
│  Ubicación: Caborca, Sonora             │
│  Contacto: WhatsApp (662) 222 4220      │
│  Social: @desertdance                   │
└─────────────────────────────────────────┘
```

### Problemas Identificados

1. **Nomenclatura confusa:** "Competencia & Workshop" vs "Competencia & Convención" — ¿Cuál es la diferencia? El usuario no entiende por qué hay dos eventos.

2. **Sin distinción visual clara:** Ambas tarjetas se ven idénticas. No hay indicación de cuál es "más importante" o cuál debería elegir el usuario.

3. **Información de contacto mínima:** Solo un número de WhatsApp. No hay email, no hay formulario de contacto, no hay dirección física.

4. **Social media incompleto:** "@desertdance" sin especificar la plataforma. ¿Es Instagram? ¿TikTok? ¿Facebook?

---

## 4. FORMULARIO DE REGISTRO

### Estructura (3 pasos)
1. **Paso 1 - Equipo:** Nombre del estudio, ciudad, contacto, teléfono, email
2. **Paso 2 - Logo:** Subida de archivo
3. **Paso 3 - Bailarines:** Lista dinámica de participantes

### Problemas Identificados

1. **Validación en paso 2 problemática:** Si el usuario no tiene logo, no puede continuar. Esto es un blocker innecesario. Solución: hacer el logo opcional o permitir envío posterior.

2. **Sin indicador de progreso claro:** Las barras de progreso se muestran pero no hay feedback visual de completado vs pendiente.

3. **Paso 3 innecesario para algunos:** No todos los equipos tienen la lista de bailarines al momento del registro. Esto debería ser opcional desde el inicio.

4. **Sin preview del logo:** El usuario sube un archivo pero no ve una preview antes de enviar.

5. **Mensaje de éxito genérico:** "Registro recibido" — no hay información sobre tiempos de respuesta, qué sigue, ni contacto de emergencia.

6. **Sin validación de teléfono:** El campo de teléfono no valida formato mexicano.

---

## 5. GALERÍA

### Estructura
```
┌─────────────────────────────────────────┐
│  EL ESCENARIO                           │
│  Caborca — abril y mayo, 2026           │
│                                         │
│  [Img 1] [Img 2] [Img 3]              │
│  (todas de Unsplash)                    │
└─────────────────────────────────────────┘
```

### Problemas Identificados

1. **Imágenes stock genéricas:** Las 3 fotos son de Unsplash y no representan el evento real. Se siente como un template.

2. **Título "El escenario" engañoso:** Las imágenes muestran danza, no el escenario físico del evento.

3. **Sinlightbox o zoom:** Las imágenes no son clickeables para ver en grande.

4. **Alt texts genéricos:** No describen contenido específico.

---

## 6. FOOTER

### Estructura
```
┌─────────────────────────────────────────┐
│  [Logo]                                 │
│  Competencia de Baile y Expresión       │
│  Corporal — Caborca, Sonora             │
│                                         │
│  Fechas | Registro | Contacto           │
│                                         │
│  © Desert Dance 2026                    │
│  Brand kit Desert Dance Collective.     │
└─────────────────────────────────────────┘
```

### Problemas Identificados

1. **"Brand kit Desert Dance Collective"** — esto es información interna que no debería verse en el footer público.

2. **Sin links a redes sociales:** No hay iconos de Instagram, TikTok, Facebook, etc.

3. **"Contacto" no lleva a ningún lado:** El link de contacto es `href="#"`.

---

## 7. PERFORMANCE & ACCESIBILIDAD

### Aspectos Positivos
- ✅ Tailwind CSS via CDN (rápido para prototipo)
- ✅ Google Fonts con preconnect
- ✅ Lazy loading en imágenes de galería
- ✅ `loading="lazy"` implementado
- ✅ Viewport meta tag correcto
- ✅ iOS zoom prevention en inputs

### Problemas

1. **Imágenes de Unsplash sin optimización:** Las URLs usan `w=1920` y `w=800` pero no hay srcset ni art-directed crops.

2. **Sin sistema de diseño:** Los colores y espaciados están hardcodeados en clases de Tailwind, no en variables CSS custom.

3. **Sin reduced-motion:** Las animaciones `revealUp` no respetan `prefers-reduced-motion`.

4. **Contraste insuficiente:** `text-brand-white-muted/40` sobre fondo oscuro puede no cumplir WCAG AA.

5. **Sin skip navigation:** No hay forma de saltar al contenido principal.

6. **Formulario sin aria labels:** Los campos no tienen aria-describedby para errores.

---

## 8. MOBILE EXPERIENCE

### Aspectos Positivos
- ✅ Responsive grid en formularios
- ✅ Touch targets mínimos de 44px
- ✅ Font size 16px en inputs (previene zoom iOS)

### Problemas

1. **Hero demasiado grande:** En mobile, el título de 7rem puede ser excesivo.

2. **Galería sin scroll horizontal:** Las 3 imágenes apiladas hacen mucho scroll.

3. **Nav sticky sin hamburger:** En pantallas muy pequeñas, los links pueden solaparse.

---

## 9. CONTENIDO & COPY

### Problemas

1. **Tono inconsistente:** Mezcla formal ("Competencia de Danza y Expresión Corporal") con informal ("Toca para elegir tu logo").

2. **CTA débiles:** "Registro abierto" y "Fechas" no generan urgencia ni emoción.

3. **Sin storytelling:** No hay narrativa sobre por qué este evento es especial, quién lo organiza, o qué lo hace único.

4. **Datos faltantes:**
   - ¿Quién es el jurado?
   - ¿Cuáles son los premios?
   - ¿Cuánto cuesta?
   - ¿Hay requisitos de participación?

---

## 10. RESUMEN EJECUTIVO

### Fortalezas
1. Paleta de color coherente y con buen contraste
2. Tipografía moderna con buen pairing
3. Formulario multi-paso bien estructurado
4. Responsive design funcional
5. Integración con Supabase para backend

### Críticas Principales
1. **Identidad genérica:** Se siente como un template de festival, no como un evento de danza exclusivo
2. **Contenido insuficiente:** Falta información crítica (precios, jurado, premios, requisitos)
3. **Imágenes stock:** Resta autenticidad y conexión emocional
4. **CTAs sin urgencia:** No motivan la acción inmediata
5. **Error de messaging:** "Brand kit" visible en footer es un error de producción

### Prioridades de Mejora
1. 🔴 **Alta:** Reemplazar imágenes stock con fotos reales del evento o de danza
2. 🔴 **Alta:** Agregar información de precios, jurado y premios
3. 🟡 **Media:** Revisar el copy para crear storytelling más convincente
4. 🟡 **Media:** Hacer el logo opcional en el registro
5. 🟢 **Baja:** Agregar reduced-motion, skip navigation, aria labels

---

## RECOMENDACIONES INMEDIATAS

### 1. Agregar Sección de "Por qué participar"
```html
<section class="py-20">
  <h2>¿Por qué Desert Dance?</h2>
  <div class="grid md:grid-cols-3">
    <div>Jurado Internacional</div>
    <div>Premios en Efectivo</div>
    <div>Networking con Compañías</div>
  </div>
</section>
```

### 2. Agregar Sección de Precios
```html
<section class="py-20">
  <h2>Inversión</h2>
  <div class="grid md:grid-cols-2">
    <div>Equipo (4 bailarines) — $X,XXX MXN</div>
    <div>Bailarín adicional — $XXX MXN</div>
  </div>
</section>
```

### 3. Corregir Footer
- Eliminar "Brand kit Desert Dance Collective"
- Agregar iconos de redes sociales
- Hacer que "Contacto" lleve a WhatsApp o email

### 4. Mejorar CTA Hero
- Cambiar "Registro abierto" por "Inscribirme ahora — Plazas limitadas"
- Cambiar "Fechas" por "Ver detalles del evento"

### 5. Agregar Prueba Social
- Testimonios de participantes anteriores (si existe edición pasada)
- Logos de patrocinadores
- Contador de equipos registrados

---

*Audit generado por Frontend Design Skill — Desert Dance Landing Page*
