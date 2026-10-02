-- Desert Dance: seed modalidades (categories) con los nombres correctos y precios
-- Ejecutar después de 20260908000600_category_fk.sql (que crea la tabla categories)

-- Agregar columna para categoría por edad si no existe
ALTER TABLE categories ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

INSERT INTO categories (id, name, description, max_participants, sort_order, is_active, metadata)
VALUES
  ('a1b2c3d4-e101-4001-8001-000000000001', 'Solista', 'Una sola bailarina/o', 1, 1, true, '{"price": 800, "min_routine": 1.5, "max_routine": 2.5}'),
  ('a1b2c3d4-e102-4001-8001-000000000002', 'Dúo', 'Dos bailarines', 2, 2, true, '{"price": 500, "min_routine": 1.5, "max_routine": 2.5}'),
  ('a1b2c3d4-e103-4001-8001-000000000003', 'Tríos', 'Tres bailarines', 3, 3, true, '{"price": 500, "min_routine": 1.5, "max_routine": 2.5}'),
  ('a1b2c3d4-e104-4001-8001-000000000004', 'Grupo Pequeño', '4 a 9 bailarines', 9, 4, true, '{"price": 300, "min_routine": 2, "max_routine": 3}'),
  ('a1b2c3d4-e105-4001-8001-000000000005', 'Grupo Grande', '10 o más bailarines', 99, 5, true, '{"price": 300, "min_routine": 3, "max_routine": 4}'),
  ('a1b2c3d4-e106-4001-8001-000000000006', 'Colegial', 'Equipo escolar/estudiantes', 99, 6, true, '{"price": 200, "min_routine": 3, "max_routine": 4}')
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name,
      description = EXCLUDED.description,
      max_participants = EXCLUDED.max_participants,
      sort_order = EXCLUDED.sort_order,
      is_active = EXCLUDED.is_active,
      metadata = EXCLUDED.metadata;
