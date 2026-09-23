// Carrusel de géneros
(function () {
  const GENRES = [
    { name: 'Ballet',     color: '#6b8e9b', icon: 'ballet' },
    { name: 'Contemporáneo', color: '#8b5cf6', icon: 'contemp' },
    { name: 'Jazz',        color: '#f59e0b', icon: 'jazz' },
    { name: 'Urbano',      color: '#ef4444', icon: 'urban' },
    { name: 'Poms',        color: '#ec4899', icon: 'poms' },
    { name: 'Open',        color: '#14b8a6', icon: 'open' },
    { name: 'Exhibición',  color: '#d8e723', icon: 'exhib' },
  ];

  const track = document.getElementById('genre-track');
  const dotsContainer = document.getElementById('genre-dots');
  if (!track) return;

  const SVG = {
    ballet: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 9 6 9zm0 0h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2zm0 0v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9"/>',
    contemp: '<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-2 15l-3-3 1.4-1.4L10 14.2l5.6-5.6L17 10l-7 7z"/>',
    jazz: '<circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><path d="M9 18V5l12-2v13"/>',
    urban: '<path d="M8 17l-2-4 3-2 2 4 3-6 2 6 3-4 2 4"/>',
    poms: '<circle cx="5" cy="6" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="9" cy="13" r="2"/><circle cx="16" cy="13" r="2"/><path d="M5 8v5M12 6v7M19 8v5M9 15l3 4h4l3-4"/>',
    open: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
    exhib: '<path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4L12 17l-6.3 4.4L8 14 2 9.4h7.6z"/>',
  };

  function cardHTML(g) {
    return `
      <div class="genre-card flex-shrink-0 w-64 sm:w-72 md:w-80 rounded-2xl overflow-hidden border border-brand-white-faint hover:border-brand-lime/50 transition-all duration-300 hover:shadow-[0_0_50px_rgba(216,231,35,0.15)]">
        <div class="relative h-56 overflow-hidden" style="background: linear-gradient(135deg, ${g.color}cc, ${g.color}40)">
          <div class="absolute inset-0 flex items-center justify-center">
            <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9">
              ${SVG[g.icon] || SVG.exhib}
            </svg>
          </div>
          <div class="absolute top-3 right-3 w-8 h-8 rounded-full" style="background:${g.color}"></div>
        </div>
        <div class="p-5 bg-brand-dark-elevated/80 backdrop-blur">
          <h5 class="font-title text-xl font-bold text-brand-white">${g.name}</h5>
          <p class="text-xs text-brand-white-muted/50 mt-1">Género del concurso · Desert Dance</p>
        </div>
      </div>`;
  }

  let index = 0;
  let autoTimer = null;
  let cardWidth = 0;
  const total = GENRES.length;

  function measure() {
    const cards = track.querySelectorAll('.genre-card');
    if (!cards.length) return 0;
    const rect = cards[0].getBoundingClientRect();
    const gap = total > 1 ? parseFloat(getComputedStyle(track).gap) || 0 : 0;
    return rect.width + gap;
  }

  function render() {
    track.innerHTML = GENRES.map(cardHTML).join('');
    cardWidth = measure();
    dotsContainer.innerHTML = Array.from({ length: total }, (_, i) =>
      `<button data-gidx="${i}" class="w-2 h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-brand-lime w-6' : 'bg-brand-white-faint'}"></button>`
    );
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  function go(n) {
    index = (n + total) % total;
    render();
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => go(index + 1), 4500);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  const prev = document.getElementById('genre-prev');
  const next = document.getElementById('genre-next');
  if (prev) prev.addEventListener('click', () => { go(index - 1); stopAuto(); startAuto(); });
  if (next) next.addEventListener('click', () => { go(index + 1); stopAuto(); startAuto(); });
  dotsContainer.addEventListener('click', (e) => {
    const b = e.target.closest('[data-gidx]');
    if (!b) return;
    index = parseInt(b.dataset.gidx, 10);
    render();
    stopAuto(); startAuto();
  });

  // Swipe móvil
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) { if (dx > 0) go(index + 1); else go(index - 1); }
    startAuto();
  });

  render();
  startAuto();
  track.addEventListener('mouseenter', stopAuto);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto(); else startAuto();
  });
  window.addEventListener('resize', () => { const w = measure(); if (w) { cardWidth = w; track.style.transform = `translateX(-${index * cardWidth}px)`; } });
})();