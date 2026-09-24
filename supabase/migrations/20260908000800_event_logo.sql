-- Desert Dance: logo del evento (hero del landing)
-- El admin sube el logotipo del evento al bucket 'event-assets' y el
-- landing lo muestra en el hero.

-- 1. Tabla de assets del evento (logo + datos del evento)
CREATE TABLE IF NOT EXISTS public.event_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,          -- ej. 'event_logo', 'event_logo_alt'
  label TEXT DEFAULT '',             -- nombre para mostrar en el admin
  image_path TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.event_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read event_assets" ON public.event_assets;
CREATE POLICY "Allow public read event_assets" ON public.event_assets
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated full event_assets" ON public.event_assets;
CREATE POLICY "Allow authenticated full event_assets" ON public.event_assets
  FOR ALL USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS trigger_update_event_assets ON public.event_assets;
CREATE TRIGGER trigger_update_event_assets
  BEFORE UPDATE ON public.event_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Datos iniciales (el logo por defecto apunta al repositorio)
INSERT INTO public.event_assets (key, label, image_path, image_url)
VALUES ('event_logo', 'Logo del evento', 'logos/vertical_primary.svg', 'assets/logos/vertical_primary.svg')
ON CONFLICT (key) DO NOTHING;

-- 2. Bucket de storage para los assets del evento
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-assets', 'event-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public read event-assets storage" ON storage.objects;
CREATE POLICY "Allow public read event-assets storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-assets');

DROP POLICY IF EXISTS "Allow authenticated insert event-assets storage" ON storage.objects;
CREATE POLICY "Allow authenticated insert event-assets storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'event-assets' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated update event-assets storage" ON storage.objects;
CREATE POLICY "Allow authenticated update event-assets storage" ON storage.objects
  FOR UPDATE USING (bucket_id = 'event-assets' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete event-assets storage" ON storage.objects;
CREATE POLICY "Allow authenticated delete event-assets storage" ON storage.objects
  FOR DELETE USING (bucket_id = 'event-assets' AND auth.role() = 'authenticated');