-- Desert Dance: esquema inicial
-- Tabla de participantes
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Competencia Danza Contemporánea',
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.participants
  ADD CONSTRAINT participants_status_check
  CHECK (status IN ('pending', 'confirmed', 'rejected', 'waitlist'));

-- RLS: todos pueden insertar (formulario), solo autenticados leen/modifican
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON public.participants;
CREATE POLICY "Allow public insert" ON public.participants
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read" ON public.participants;
CREATE POLICY "Allow authenticated read" ON public.participants
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated update" ON public.participants;
CREATE POLICY "Allow authenticated update" ON public.participants
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete" ON public.participants;
CREATE POLICY "Allow authenticated delete" ON public.participants
  FOR DELETE USING (auth.role() = 'authenticated');

-- Índices para búsqueda y filtros
CREATE INDEX IF NOT EXISTS idx_participants_status ON public.participants(status);
CREATE INDEX IF NOT EXISTS idx_participants_category ON public.participants(category);
CREATE INDEX IF NOT EXISTS idx_participants_email ON public.participants(email);
CREATE INDEX IF NOT EXISTS idx_participants_created ON public.participants(created_at DESC);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_participants ON public.participants;
CREATE TRIGGER trigger_update_participants
  BEFORE UPDATE ON public.participants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Tabla de perfiles de admin
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'editor'));

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read profiles" ON public.profiles;
CREATE POLICY "Allow authenticated read profiles" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');