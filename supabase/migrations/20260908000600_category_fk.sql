-- Desert Dance: conectar categorías del catálogo a teams y participants
-- Antes: teams.category y participants.category eran TEXT libre (sin restricción).
-- Ahora: FK a public.categories(id), con CHECK para que solo se puedan
-- seleccionar categorías que existan en el catálogo.

-- 1. teams: reemplazar category TEXT por category_id UUID FK
ALTER TABLE public.teams
  DROP COLUMN IF EXISTS category;

ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_teams_category_id ON public.teams(category_id);

-- 2. participants: lo mismo (el campo category TEXT ya existía)
ALTER TABLE public.participants
  DROP COLUMN IF EXISTS category;

ALTER TABLE public.participants
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_participants_category_id ON public.participants(category_id);

-- 3. RLS: que el dropdown del admin lea las categorías
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read categories" ON public.categories;
CREATE POLICY "Allow authenticated read categories" ON public.categories
  FOR SELECT USING (auth.role() = 'authenticated');

-- El registro público NO necesita leer categories (el dropdown se carga
-- una vez al init desde la BD y se cachea en el admin); pero por si el
-- registro público algún día quiere mostrar las categorías, dejamos
-- lectura pública a la tabla de catálogo (solo lectura, sin writes).
DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
CREATE POLICY "Allow public read categories" ON public.categories
  FOR SELECT USING (true);