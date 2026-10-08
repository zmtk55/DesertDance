-- add-total-price-to-teams.sql
-- Desert Dance — agrega la columna total_price a teams (precio total = precio por persona × bailarines).
-- Fue omitida al desplegar el registro por equipos; la app ya no la usa en espera de esta migración.
-- Aplicar en Supabase (SQL Editor o `supabase db push`): ALTER TABLE public.teams ADD COLUMN total_price NUMERIC(10,2) DEFAULT 0;
-- Ponytail: columna simple, sin triggers ni índices; si se usa para reportes, agregar índice después.

ALTER TABLE public.teams
ADD COLUMN total_price NUMERIC(10,2) DEFAULT 0;
