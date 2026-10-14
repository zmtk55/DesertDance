-- Desert Dance: captura de calificacion de cada equipo (sistema de 100 puntos de
-- puntos.html: 8 criterios tecnicos con sus pesos). Una fila por (equipo, juez).
-- El total y el ranking se calculan en la app: asi los 8 criterios quedan
-- consultables y el Comite puede reclasificar despues.
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  judge_name TEXT NOT NULL,
  tecnica NUMERIC(4,1) NOT NULL DEFAULT 0,        -- max 25
  ejecucion NUMERIC(4,1) NOT NULL DEFAULT 0,       -- max 15
  musicalidad NUMERIC(4,1) NOT NULL DEFAULT 0,     -- max 10
  interpretacion NUMERIC(4,1) NOT NULL DEFAULT 0,  -- max 10
  creatividad NUMERIC(4,1) NOT NULL DEFAULT 0,     -- max 10
  composicion NUMERIC(4,1) NOT NULL DEFAULT 0,     -- max 15
  espacio NUMERIC(4,1) NOT NULL DEFAULT 0,         -- max 5
  presencia NUMERIC(4,1) NOT NULL DEFAULT 0,      -- max 10
  notes TEXT DEFAULT '',
  scored_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS scores_team_judge_unique ON public.scores(team_id, judge_name);
CREATE INDEX IF NOT EXISTS scores_team_idx ON public.scores(team_id);

-- RLS: solo los autenticados (admins) leen y escriben; el publico no.
-- Mismo patron que payments/documents en 20260908000500.
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read scores" ON public.scores;
CREATE POLICY "Allow authenticated read scores" ON public.scores
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated manage scores" ON public.scores;
CREATE POLICY "Allow authenticated manage scores" ON public.scores
  FOR ALL TO authenticated USING (true) WITH CHECK (true);