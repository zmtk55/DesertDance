-- Desert Dance: Agregar image_url a categories para soportar imágenes de categoría
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
