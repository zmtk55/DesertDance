-- Desert Dance: Tablas para Admin Dashboard Completo
-- Migración: 20260908000500_admin_dashboard_tables.sql

-- ============================================================
-- 1. categories — Categorías de competencia
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  max_participants INTEGER DEFAULT 8,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
CREATE POLICY "Allow public read categories" ON public.categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated manage categories" ON public.categories;
CREATE POLICY "Allow authenticated manage categories" ON public.categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Categorías iniciales
INSERT INTO public.categories (name, description, sort_order) VALUES
  ('Competencia Danza Contemporánea', 'Danza contemporánea y expresión corporal', 1),
  ('Competencia Danza Urbana', 'Hip-hop, breakdance, street dance', 2),
  ('Competencia Ballet', 'Ballet clásico y neoclásico', 3),
  ('Competencia Danza Folklórica', 'Danzas tradicionales mexicanas', 4),
  ('Competencia Danza Aérea', 'Aéreo, telas, trapecio', 5),
  ('Workshop General', 'Talleres y masterclasses', 6)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 2. payments — Pagos y finanzas
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'MXN',
  concept TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  paid_date DATE,
  payment_method TEXT,
  reference TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.payments
  ADD CONSTRAINT payments_status_check
  CHECK (status IN ('pending', 'partial', 'completed', 'overdue', 'refunded'));

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read payments" ON public.payments;
CREATE POLICY "Allow authenticated read payments" ON public.payments
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated insert payments" ON public.payments;
CREATE POLICY "Allow authenticated insert payments" ON public.payments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated update payments" ON public.payments;
CREATE POLICY "Allow authenticated update payments" ON public.payments
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete payments" ON public.payments;
CREATE POLICY "Allow authenticated delete payments" ON public.payments
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_payments_team ON public.payments(team_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

DROP TRIGGER IF EXISTS trigger_update_payments ON public.payments;
CREATE TRIGGER trigger_update_payments
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 3. documents — Documentos del equipo
-- ============================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  mime_type TEXT DEFAULT '',
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.documents
  ADD CONSTRAINT documents_type_check
  CHECK (type IN ('logo', 'music', 'choreography', 'photo', 'other'));

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read documents" ON public.documents;
CREATE POLICY "Allow authenticated read documents" ON public.documents
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated insert documents" ON public.documents;
CREATE POLICY "Allow authenticated insert documents" ON public.documents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete documents" ON public.documents;
CREATE POLICY "Allow authenticated delete documents" ON public.documents
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_documents_team ON public.documents(team_id);

-- ============================================================
-- 4. communication_log — Log de comunicación
-- ============================================================
CREATE TABLE IF NOT EXISTS public.communication_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  direction TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT DEFAULT '',
  sent_by UUID REFERENCES auth.users(id),
  sent_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.communication_log
  ADD CONSTRAINT communication_log_channel_check
  CHECK (channel IN ('whatsapp', 'email', 'phone', 'in_person', 'other'));

ALTER TABLE public.communication_log
  ADD CONSTRAINT communication_log_direction_check
  CHECK (direction IN ('inbound', 'outbound'));

ALTER TABLE public.communication_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read comms" ON public.communication_log;
CREATE POLICY "Allow authenticated read comms" ON public.communication_log
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated insert comms" ON public.communication_log;
CREATE POLICY "Allow authenticated insert comms" ON public.communication_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_comms_team ON public.communication_log(team_id);

-- ============================================================
-- 5. reminders — Recordatorios
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ,
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.reminders
  ADD CONSTRAINT reminders_type_check
  CHECK (type IN ('payment', 'document', 'general', 'schedule'));

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read reminders" ON public.reminders;
CREATE POLICY "Allow authenticated read reminders" ON public.reminders
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated manage reminders" ON public.reminders;
CREATE POLICY "Allow authenticated manage reminders" ON public.reminders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_reminders_team ON public.reminders(team_id);

-- ============================================================
-- 6. event_settings — Configuración del evento
-- ============================================================
CREATE TABLE IF NOT EXISTS public.event_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT DEFAULT '',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read settings" ON public.event_settings;
CREATE POLICY "Allow public read settings" ON public.event_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated update settings" ON public.event_settings;
CREATE POLICY "Allow authenticated update settings" ON public.event_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated insert settings" ON public.event_settings;
CREATE POLICY "Allow authenticated insert settings" ON public.event_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Configuraciones iniciales
INSERT INTO public.event_settings (key, value) VALUES
  ('event_name', 'Desert Dance 2026'),
  ('event_dates_phase1', '17-19 abril 2026'),
  ('event_dates_phase2', '1-3 mayo 2026'),
  ('event_location', 'Caborca, Sonora'),
  ('registration_open', 'true'),
  ('early_bird_deadline', '2026-03-15'),
  ('early_bird_price_team', '4500'),
  ('regular_price_team', '5500'),
  ('price_extra_dancer', '800'),
  ('max_dancers_per_team', '12'),
  ('contact_whatsapp', '526622224220'),
  ('contact_email', 'info@desertdance.mx')
ON CONFLICT (key) DO NOTHING;

DROP TRIGGER IF EXISTS trigger_update_event_settings ON public.event_settings;
CREATE TRIGGER trigger_update_event_settings
  BEFORE UPDATE ON public.event_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 7. admin_users — Gestión de administradores
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT DEFAULT '',
  role TEXT DEFAULT 'editor',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users
  ADD CONSTRAINT admin_users_role_check
  CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer'));

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read admins" ON public.admin_users;
CREATE POLICY "Allow authenticated read admins" ON public.admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated manage admins" ON public.admin_users;
CREATE POLICY "Allow authenticated manage admins" ON public.admin_users
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- 8. Agregar columnas faltantes a teams
-- ============================================================
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS category TEXT DEFAULT '';
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS total_paid DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS total_due DECIMAL(10,2) DEFAULT 0;

-- ============================================================
-- 9. Storage: bucket para documentos adicionales
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-docs', 'team-docs', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public read team-docs" ON storage.objects;
CREATE POLICY "Allow public read team-docs" ON storage.objects
  FOR SELECT USING (bucket_id = 'team-docs');

DROP POLICY IF EXISTS "Allow authenticated upload team-docs" ON storage.objects;
CREATE POLICY "Allow authenticated upload team-docs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'team-docs' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete team-docs" ON storage.objects;
CREATE POLICY "Allow authenticated delete team-docs" ON storage.objects
  FOR DELETE USING (bucket_id = 'team-docs' AND auth.role() = 'authenticated');
