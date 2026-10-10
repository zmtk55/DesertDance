// Fuente única de las fechas/edición del evento. Ajusta aquí y el landing lo refleja.
window.DD_EVENT = {
  edition: 'Primera Edición · 2026',
  datesTagline: '27 y 28 de noviembre · Caborca, Sonora · Registro abierto',
  day1: '27 nov',
  day2: '28 nov',
  year: '2026',
  startDate: '2026-11-27',
  endDate: '2026-11-28',
  metaDescription: 'Desert Dance Competition — Primera Edición. 27 y 28 de noviembre de 2026. Auditorio Cívico Municipal, H. Caborca, Sonora. Registro abierto.',
};

(function () {
  const E = window.DD_EVENT;
  function set(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  function apply() {
    set('hero-edition', E.edition);
    set('hero-dateline', E.datesTagline);
    set('fecha-day1', E.day1);
    set('fecha-day2', E.day2);
    set('fecha-year1', E.year);
    set('fecha-year2', E.year);

    document.title = 'Desert Dance Competition — ' + E.edition.replace(' · ', ' ');
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', E.metaDescription);

    const ld = document.querySelector('script[type="application/ld+json"]');
    if (ld) {
      try {
        const j = JSON.parse(ld.textContent);
        j.startDate = E.startDate;
        j.endDate = E.endDate;
        ld.textContent = JSON.stringify(j, null, 2);
      } catch (e) { /* JSON-LD inválido: se deja como está */ }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();