-- Desert Dance: registro por equipo/estudio
-- Los equipos (escuelas, foráneas) se registran con: nombre, ciudad de origen,
-- contacto del capitán, logo, música y horario. participantes pasa a ser cada
-- bailarín que pertenece a un equipo.

-- ============================================================
-- 1. Tabla teams (equipos / estudios)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  origin_city TEXT DEFAULT '',             -- ciudad de origen (foráneos)
  contact_name TEXT DEFAULT '',            -- capitán / representante
  contact_phone TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  logo_path TEXT DEFAULT '',               -- ruta en storage (SVG/PNG)
  logo_url TEXT DEFAULT '',                -- URL pública del logo
  music_path TEXT DEFAULT '',              -- ruta en storage (MP3)
  music_url TEXT DEFAULT '',               -- URL pública de la música
  scheduled_time TIMESTAMPTZ,              -- horario de presentación
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.teams
  ADD CONSTRAINT teams_status_check
  CHECK (status IN ('pending', 'confirmed', 'rejected', 'waitlist'));

-- ============================================================
-- 2. participants: agregar team_id y campos de competencia
-- ============================================================
ALTER TABLE public.participants
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS technique TEXT DEFAULT '',     -- técnica (moderno, urbano, ballet, aéreo...)
  ADD COLUMN IF NOT EXISTS division TEXT DEFAULT '',      -- división / rango de edad
  ADD COLUMN IF NOT EXISTS routine_title TEXT DEFAULT '', -- título de la rutina
  ADD COLUMN IF NOT EXISTS school_name TEXT DEFAULT '';   -- nombre de la escuela (respaldo desnormalizado)

-- Índices
CREATE INDEX IF NOT EXISTS idx_teams_status ON public.teams(status);
CREATE INDEX IF NOT EXISTS idx_teams_origin_city ON public.teams(origin_city);
CREATE INDEX IF NOT EXISTS idx_teams_scheduled ON public.teams(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_participants_team ON public.participants(team_id);

-- Trigger updated_at para teams
DROP TRIGGER IF EXISTS trigger_update_teams ON public.teams;
CREATE TRIGGER trigger_update_teams
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 3. RLS: teams
--   - Público puede insertar (formulario de registro de equipo)
--   - Solo autenticados leen / modifican / borran
-- ============================================================
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert teams" ON public.teams;
CREATE POLICY "Allow public insert teams" ON public.teams
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read teams" ON public.teams;
CREATE POLICY "Allow authenticated read teams" ON public.teams
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated update teams" ON public.teams;
CREATE POLICY "Allow authenticated update teams" ON public.teams
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete teams" ON public.teams;
CREATE POLICY "Allow authenticated delete teams" ON public.teams
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- 4. Storage: buckets para logos y música
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-files', 'team-files', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas: cualquiera puede subir (formulario público) y leer; solo autenticados borran/modifican.
DROP POLICY IF EXISTS "Allow public upload team-files" ON storage.objects;
CREATE POLICY "Allow public upload team-files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'team-files');

DROP POLICY IF EXISTS "Allow public read team-files" ON storage.objects;
CREATE POLICY "Allow public read team-files" ON storage.objects
  FOR SELECT USING (bucket_id = 'team-files');

DROP POLICY IF EXISTS "Allow authenticated update team-files" ON storage.objects;
CREATE POLICY "Allow authenticated update team-files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'team-files' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete team-files" ON storage.objects;
CREATE POLICY "Allow authenticated delete team-files" ON storage.objects
  FOR DELETE USING (bucket_id = 'team-files' AND auth.role() = 'authenticated');
