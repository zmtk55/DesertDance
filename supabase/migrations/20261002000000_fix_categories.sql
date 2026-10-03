-- Desert Dance: Fix categories - ensure only the 6 correct modalidades exist with proper UUIDs and prices
-- This migration handles cases where stale categories with different IDs exist
-- Also ensures the price and metadata columns exist (added in a later migration)

-- 1. Add missing columns if they don't exist
ALTER TABLE public.categories 
  ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS max_participants INTEGER DEFAULT 8,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2. Delete stale categories with canonical names but wrong UUIDs
DELETE FROM public.categories
WHERE name IN ('Solista', 'Dúo', 'Tríos', 'Grupo Pequeño', 'Grupo Grande', 'Colegial')
  AND id NOT IN (
    'a1b2c3d4-e101-4001-8001-000000000001',
    'a1b2c3d4-e102-4001-8001-000000000002',
    'a1b2c3d4-e103-4001-8001-000000000003',
    'a1b2c3d4-e104-4001-8001-000000000004',
    'a1b2c3d4-e105-4001-8001-000000000005',
    'a1b2c3d4-e106-4001-8001-000000000006'
  );

-- 3. Delete any other stale categories (placeholder names from 20260908000500)
DELETE FROM public.categories
WHERE name LIKE 'Competencia %' OR name = 'Workshop General';

-- Re-insert the 6 correct modalidades (in case they were deleted by the previous step)
INSERT INTO public.categories (id, name, description, max_participants, price, sort_order, is_active, metadata) VALUES
  ('a1b2c3d4-e101-4001-8001-000000000001', 'Solista', 'Una sola bailarina/o', 1, 800, 1, true, '{"min_routine": 1.5, "max_routine": 2.5}'),
  ('a1b2c3d4-e102-4001-8001-000000000002', 'Dúo', 'Dos bailarines', 2, 500, 2, true, '{"min_routine": 1.5, "max_routine": 2.5}'),
  ('a1b2c3d4-e103-4001-8001-000000000003', 'Tríos', 'Tres bailarines', 3, 500, 3, true, '{"min_routine": 1.5, "max_routine": 2.5}'),
  ('a1b2c3d4-e104-4001-8001-000000000004', 'Grupo Pequeño', '4 a 9 bailarines', 9, 300, 4, true, '{"min_routine": 2, "max_routine": 3}'),
  ('a1b2c3d4-e105-4001-8001-000000000005', 'Grupo Grande', '10 o más bailarines', 99, 300, 5, true, '{"min_routine": 3, "max_routine": 4}'),
  ('a1b2c3d4-e106-4001-8001-000000000006', 'Colegial', 'Equipo escolar/estudiantes', 99, 200, 6, true, '{"min_routine": 3, "max_routine": 4}')
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name,
      description = EXCLUDED.description,
      max_participants = EXCLUDED.max_participants,
      price = EXCLUDED.price,
      sort_order = EXCLUDED.sort_order,
      is_active = EXCLUDED.is_active,
      metadata = EXCLUDED.metadata;
