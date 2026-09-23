-- Desert Dance: carrusel de fotos del landing (administrable)
-- El admin sube fotos al bucket 'carousel' y las muestra en el hero del sitio.

-- 1. Tabla de imágenes del carrusel
CREATE TABLE IF NOT EXISTS public.carousel_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT DEFAULT '',            -- leyenda opcional
  caption TEXT DEFAULT '',          -- texto pequeño debajo
  image_path TEXT NOT NULL,         -- ruta en storage bucket 'carousel'
  image_url TEXT NOT NULL,          -- URL pública
  sort_order INTEGER DEFAULT 0,    -- orden de visualización
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_carousel_images_active_sort
  ON public.carousel_images(is_active, sort_order);

ALTER TABLE public.carousel_images ENABLE ROW LEVEL SECURITY;

-- Lectura pública: el landing muestra las imágenes activas.
DROP POLICY IF EXISTS "Allow public read carousel" ON public.carousel_images;
CREATE POLICY "Allow public read carousel" ON public.carousel_images
  FOR SELECT USING (is_active = true);

-- Solo autenticados escriben.
DROP POLICY IF EXISTS "Allow authenticated full carousel" ON public.carousel_images;
CREATE POLICY "Allow authenticated full carousel" ON public.carousel_images
  FOR ALL USING (auth.role() = 'authenticated');

-- Trigger updated_at
DROP TRIGGER IF EXISTS trigger_update_carousel_images ON public.carousel_images;
CREATE TRIGGER trigger_update_carousel_images
  BEFORE UPDATE ON public.carousel_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 2. Bucket de storage para las fotos del carrusel
INSERT INTO storage.buckets (id, name, public)
VALUES ('carousel', 'carousel', true)
ON CONFLICT (id) DO NOTHING;

-- Cualquiera puede subir (el admin usa token autenticado; el registro público
-- no sube fotos al carrusel, así que dejamos solo lectura pública y
-- CRUD autenticado).
DROP POLICY IF EXISTS "Allow public read carousel storage" ON storage.objects;
CREATE POLICY "Allow public read carousel storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'carousel');

DROP POLICY IF EXISTS "Allow authenticated insert carousel storage" ON storage.objects;
CREATE POLICY "Allow authenticated insert carousel storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'carousel' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated update carousel storage" ON storage.objects;
CREATE POLICY "Allow authenticated update carousel storage" ON storage.objects
  FOR UPDATE USING (bucket_id = 'carousel' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete carousel storage" ON storage.objects;
CREATE POLICY "Allow authenticated delete carousel storage" ON storage.objects
  FOR DELETE USING (bucket_id = 'carousel' AND auth.role() = 'authenticated');