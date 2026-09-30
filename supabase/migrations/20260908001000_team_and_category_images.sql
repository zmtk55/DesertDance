-- Desert Dance: permitir upload de logo del equipo y foto de categoría.

-- 1. teams: logo subido por el admin (el registro público ya sube logo/música)
ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS logo_image_url TEXT DEFAULT '';

-- 2. categories: foto ilustrativa de la categoría
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';

-- 3. Storage: bucket para logos de equipos y fotos de categorías
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-logos', 'team-logos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public read team-logos storage" ON storage.objects;
CREATE POLICY "Allow public read team-logos storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'team-logos');

DROP POLICY IF EXISTS "Allow authenticated upload team-logos storage" ON storage.objects;
CREATE POLICY "Allow authenticated upload team-logos storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'team-logos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated update team-logos storage" ON storage.objects;
CREATE POLICY "Allow authenticated update team-logos storage" ON storage.objects
  FOR UPDATE USING (bucket_id = 'team-logos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete team-logos storage" ON storage.objects;
CREATE POLICY "Allow authenticated delete team-logos storage" ON storage.objects
  FOR DELETE USING (bucket_id = 'team-logos' AND auth.role() = 'authenticated');