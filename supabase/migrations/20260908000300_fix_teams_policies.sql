-- Desert Dance: políticas RLS de teams y participantes ampliadas
-- (la tabla teams ya existe pero sin políticas: el formulario anónimo fallaba)

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON public.teams;
DROP POLICY IF EXISTS "Allow public insert teams" ON public.teams;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.teams;
DROP POLICY IF EXISTS "Allow authenticated read teams" ON public.teams;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.teams;
DROP POLICY IF EXISTS "Allow authenticated update teams" ON public.teams;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.teams;
DROP POLICY IF EXISTS "Allow authenticated delete teams" ON public.teams;

CREATE POLICY "Allow public insert" ON public.teams
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON public.teams
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON public.teams
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON public.teams
  FOR DELETE USING (auth.role() = 'authenticated');

-- Bailarines: permitir insert con team_id (el formulario anónimo ya puede)
-- y restringir SELECT/UPDATE/DELETE a autenticados si falta.
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read" ON public.participants;
CREATE POLICY "Allow authenticated read" ON public.participants
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated update" ON public.participants;
CREATE POLICY "Allow authenticated update" ON public.participants
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete" ON public.participants;
CREATE POLICY "Allow authenticated delete" ON public.participants
  FOR DELETE USING (auth.role() = 'authenticated');