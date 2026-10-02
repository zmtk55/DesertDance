-- Desert Dance: renombrar columnas de participants de technique→genre, division→modality_level
-- y agregar age_category a teams

-- Primero, migrar datos de technique → genre si technique existe y genre no existe
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'technique') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'genre') THEN
    ALTER TABLE participants RENAME COLUMN technique TO genre;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'division') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'modality_level') THEN
    ALTER TABLE participants RENAME COLUMN division TO modality_level;
  END IF;
END $$;

-- Si technique o division no existen pero genre/modality_level tampoco existen, crearlos
ALTER TABLE participants ADD COLUMN IF NOT EXISTS genre TEXT DEFAULT '';
ALTER TABLE participants ADD COLUMN IF NOT EXISTS modality_level TEXT DEFAULT '';

-- Agregar age_category a teams si no existe
ALTER TABLE teams ADD COLUMN IF NOT EXISTS age_category TEXT DEFAULT '';

-- Asegurar que el teams tenga age_category
-- Nota: el valor se enviará desde el formulario de registro
