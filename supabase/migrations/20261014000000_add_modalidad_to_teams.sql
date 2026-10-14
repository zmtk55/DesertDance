-- Desert Dance — crea teams.modalidad.
-- La migracion 20261008000000 se marco como aplicada pero abortó en su primera
-- sentencia (total_price ya existia, usaba ADD COLUMN sin IF NOT EXISTS), asi que
-- `modalidad` nunca se creo. js/app.js la envia en el INSERT del registro y
-- PostgREST rechazaba el registro completo con "column teams.modalidad does not exist".
ALTER TABLE public.teams
ADD COLUMN IF NOT EXISTS modalidad TEXT DEFAULT 'medio';