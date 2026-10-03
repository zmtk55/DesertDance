-- Desert Dance: tabla de precios por modalidad x categoría de edad (por persona)
-- Crear tabla pricing con FK a categories

CREATE TABLE IF NOT EXISTS pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  age_category TEXT NOT NULL,  -- Mini, Junior, Teens, Senior
  price NUMERIC(10,2) NOT NULL DEFAULT 0, -- precio por PERSONA
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS pricing_category_age_unique ON pricing(category_id, age_category);

-- Sembrar precios según convocatoria (por participante)
-- Precios base: Solista $800, Dúo $500, Tríos $500, Grupo Pequeño $300, Grupo Grande $300, Colegial $200

DO $$
DECLARE
  cat_rec RECORD;
  age_cats TEXT[] := ARRAY['Mini', 'Junior', 'Teens', 'Senior'];
  price_map JSONB := '{"Solista": 800, "Dúo": 500, "Tríos": 500, "Grupo Pequeño": 300, "Grupo Grande": 300, "Colegial": 200}'::JSONB;
  base_price NUMERIC;
  age_cat TEXT;
BEGIN
  FOR cat_rec IN 
    SELECT id, name FROM categories 
    WHERE name IN ('Solista', 'Dúo', 'Tríos', 'Grupo Pequeño', 'Grupo Grande', 'Colegial')
  LOOP
    base_price := (price_map -> cat_rec.name)::NUMERIC;
    
    FOR age_cat IN SELECT UNNEST(age_cats)
    LOOP
      INSERT INTO pricing (category_id, age_category, price)
      VALUES (cat_rec.id, age_cat, base_price)
      ON CONFLICT (category_id, age_category) DO UPDATE
        SET price = EXCLUDED.price;
    END LOOP;
  END LOOP;
END $$;
