// Hero logo — lee el logo del evento desde la BD (public.event_assets)
// y lo muestra en el hero del landing. Si la BD está vacía, cae al logo estático.
(function () {
  const FALLBACK = 'assets/logos/vertical_primary.svg';
  const img = document.getElementById('hero-logo');
  if (!img) return;

  async function load() {
    try {
      const { data, error } = await supabase
        .from('event_assets')
        .select('image_url, label')
        .eq('key', 'event_logo')
        .maybeSingle();
      if (error || !data || !data.image_url) return; // usar el HTML por defecto
      img.src = data.image_url;
      if (data.label) img.alt = data.label;
    } catch (e) {
      // Silencioso: usar el logo estático.
    }
  }

  load();
})();