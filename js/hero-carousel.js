// Hero carousel — lee las imágenes activas de la BD (public.carousel_images)
// y reproduce el hero del landing. Si la BD está vacía, cae a la imagen estática.
(function () {
  const FALLBACK = 'assets/images/Backgroundimage.png';
  const track = document.getElementById('hero-track');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  const dotsWrap = document.getElementById('hero-dots');
  if (!track) return;

  let slides = [];
  let index = 0;
  let timer = null;

  function setSlide(i) {
    if (!slides.length) return;
    index = ((i % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    if (dotsWrap) {
      dotsWrap.querySelectorAll('.hero-dot').forEach((d, n) => {
        d.classList.toggle('active', n === index);
      });
    }
  }

  function next() { setSlide(index + 1); }
  function startAuto() {
    stopAuto();
    if (slides.length > 1) timer = setInterval(next, 5000);
  }
  function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

  async function load() {
    try {
      const { data, error } = await supabase
        .from('carousel_images')
        .select('image_url, title, caption, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error || !data || !data.length) {
        // Sin imágenes en BD: usar la estática.
        track.innerHTML = `<img src="${FALLBACK}" alt="Desert Dance" class="absolute inset-0 w-full h-full object-cover object-center scale-[1.05]">`;
        return;
      }
      slides = data;
      track.innerHTML = slides.map(s => `
        <div class="absolute inset-0 transition-opacity duration-700 ease-out">
          <img src="${s.image_url}" alt="${(s.title || 'Desert Dance').replace(/"/g, '&quot;')}" class="absolute inset-0 w-full h-full object-cover object-center scale-[1.05]">
          ${(s.title || s.caption) ? `
            <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/30 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-10 md:pb-16 max-w-6xl mx-auto w-full">
              ${s.title ? `<p class="font-title text-2xl md:text-4xl font-black text-brand-white">${s.title.replace(/</g, '&lt;')}</p>` : ''}
              ${s.caption ? `<p class="text-sm md:text-base text-brand-white-muted/70 mt-2">${s.caption.replace(/</g, '&lt;')}</p>` : ''}
            </div>` : `
            <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent"></div>`}
        </div>`).join('');
      if (dotsWrap && slides.length > 1) {
        dotsWrap.innerHTML = slides.map((_, i) =>
          `<button class="hero-dot w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-brand-lime w-6' : 'bg-brand-white-faint'}"></button>`).join('');
        dotsWrap.addEventListener('click', (e) => {
          const b = e.target.closest('.hero-dot');
          if (!b) return;
          setSlide([...dotsWrap.children].indexOf(b));
          startAuto();
        });
      }
      setSlide(0);
      startAuto();
    } catch (e) {
      track.innerHTML = `<img src="${FALLBACK}" alt="Desert Dance" class="absolute inset-0 w-full h-full object-cover object-center scale-[1.05]">`;
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { setSlide(index - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { setSlide(index + 1); startAuto(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopAuto(); else startAuto(); });

  load();
})();