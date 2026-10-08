-- add-fields-to-teams.sql
-- Desert Dance — agrega total_price y modalidad a teams.
-- total_price = precio total (precio por persona × bailarines). Fue omitida al desplegar el registro;
-- la app dejó de usarla hasta aplicar esta migración.
-- modalidad = nivel de competencia del equipo (principiante / medio / avanzado) seleccionado en el formulario.
-- Aplicar en Supabase (SQL Editor o `supabase db push`):
--   ALTER TABLE public.teams ADD COLUMN total_price NUMERIC(10,2) DEFAULT 0;
--   ALTER TABLE public.teams ADD COLUMN modalidad TEXT DEFAULT 'medio';
-- Ponytail: columnas simples, sin triggers ni índices; agregar índices si se usan para reportes.

ALTER TABLE public.teams
ADD COLUMN total_price NUMERIC(10,2) DEFAULT 0;

ALTER TABLE public.teams
ADD COLUMN modalidad TEXT DEFAULT 'medio';
