# Desert Dance Competition — Logo Assets para Web

Extraído en vector real del PDF original (no rasterizado), así que los SVG escalan sin perder calidad.

## Estructura de carpetas

```
logo-assets/
├── svg/                    → Vectores (mejor opción para web, escalan a cualquier tamaño)
│   ├── horizontal/          6 variantes del logo primario horizontal
│   ├── vertical/             2 variantes del logo primario vertical
│   └── secundario/           3 variantes del logo secundario (ícono "D.", círculo, cuadro)
├── png/                    → Fondo transparente, 3 tamaños por variante
│   ├── horizontal/           _sm (~600px ancho) · _md (~1200px) · _lg (~2400px, retina)
│   ├── vertical/
│   └── secundario/
└── favicon/                → Listo para <head> de la landing page
    ├── favicon-square-*     basado en el ícono cuadrado (mejor 32px+)
    ├── favicon-dmark-*      basado en el ícono "D." solo (mejor a 16px, más simple)
    ├── favicon-square.ico
    └── favicon-dmark.ico
```

## Recomendación de uso en la landing page

- **Header / nav:** `svg/horizontal/horizontal_02_black_ddc.svg` (o `horizontal_03` si el fondo es claro y quieres el acento a color al centro)
- **Sobre fondo oscuro:** `svg/horizontal/horizontal_05_boxed_stacked_wordmark.svg` (tiene partes en blanco, pensado para fondo negro/oscuro)
- **Hero / mobile compacto:** `svg/vertical/vertical_01_primary.svg`
- **Favicon:** usa el set `favicon-dmark-*` — a 16–32px se lee mejor que el cuadro con texto completo
- **Redes sociales / avatar:** `svg/secundario/secundario_02_circle.svg` o `secundario_03_square.svg`

## HTML sugerido para el favicon

```html
<link rel="icon" href="/favicon/favicon-dmark.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-dmark-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon/favicon-square-180.png">
```
