# Extractable components

#### Layout Components (appear on most pages)

## SiteNav
- Source: `index.html` (nav block)
- Category: layout
- Description: Fixed public top nav with compact horizontal logo, section links, Admin, Registro CTA, mobile menu
- Extractable props: activeItem (string, default: "")
- Hardcoded: link labels, Registro button, Admin icon, hamburger SVG

## SiteFooter
- Source: `index.html` (footer block)
- Category: layout
- Description: Four-column footer with logo, event links, info links, contact, social icons
- Extractable props: none
- Hardcoded: all copy, WhatsApp, email, Caborca, copyright 2026

## AdminHeader
- Source: `admin.html` (header)
- Category: layout
- Description: Fixed admin top bar with d_mark logo, Ver sitio, email, Salir
- Extractable props: adminEmail (string, default: "")
- Hardcoded: d_mark logo, Salir label

## AdminSidebar
- Source: `admin.html` (aside#sidebar)
- Category: layout
- Description: Left nav: Dashboard, Equipos (badge), Pagos, Categorías, Settings
- Extractable props: activeItem (string, default: "dashboard"), teamsCount (string, default: "0")
- Hardcoded: icon SVGs, section labels

#### Basic Components

## LimeCta
- Source: `index.html`
- Category: basic
- Description: Pill lime CTA used for Registro / form continue
- Extractable props: label (string), href (string)
- Hardcoded: lime fill, uppercase tracking, glow shadow
