# Design system — Desert Dance

## Product
Desert Dance is a dance competition and corporal-expression event in Caborca, Sonora (April 17–19 and May 1–3, 2026). The public site converts dance studios into registered teams. Admin is a separate dark dashboard for teams, payments, and categories.

## Brand
- Dark desert stage: charcoal `#231f20`, elevated `#2a2627`
- Accent: acid lime `#d8e723` / hover `#bcc91b` — the only saturated color
- Type: Jost black for titles and stats; Cormorant Garamond italic for poetic accents; DM Sans for UI copy
- Voice: Spanish, confident, editorial, competition-grade — not playful neon club

## Surfaces
- Page: solid brand-dark
- Cards: `bg-brand-dark-elevated/50` + `border-brand-white-faint` + hover `border-brand-lime/30`
- Nav: `backdrop-blur-xl bg-brand-dark/60`
- Hero: full-viewport photo with dual gradients (bottom + sides) + 3% noise overlay; copy sits at the bottom

## Components
- Primary CTA: pill `rounded-full`, lime fill, dark text, uppercase tracking, lime glow
- Secondary CTA: pill outline `border-brand-white-muted`
- Inputs: dark inset, faint border, lime focus border
- Eyebrow labels: 10px lime uppercase tracking
- Logo: always the real Desert Dance SVG (horizontal compact in nav/footer; vertical primary in hero/login). Never initials, emoji, or invented marks.

## Motion
Reveal-up on scroll (1s, staggered). CTA lift `-translate-y-0.5` on hover. Gallery images scale 1.015.

## Do not
- Do not introduce serif body fonts, purple/pink/orange palettes, or light mode
- Do not replace lime with generic gold
- Do not flatten the hero into a centered generic SaaS layout
