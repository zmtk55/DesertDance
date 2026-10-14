-- Desert Dance: backfill de teams.total_price.
--
-- Los equipos registrados antes de que existiera el catalogo de precios quedaron
-- con total_price = 0, y como el saldo pendiente se deriva de ahi, el reporte de
-- cobros mostraba "ningun equipo tiene saldo pendiente" con equipos registrados.
-- Se recalcula precio (pricing por modalidad y edad, si existe; si no el precio de
-- la modalidad) por la cantidad de bailarines. Solo toca los que estan en 0 para
-- no pisar los que ya tienen un total correcto.
UPDATE public.teams t
SET total_price = sub.total
FROM (
  SELECT
    t2.id,
    COALESCE(
      (SELECT p.price FROM public.pricing p
        WHERE p.category_id = t2.category_id AND p.age_category = t2.age_category
        LIMIT 1),
      c.price,
      0
    ) * (SELECT count(*) FROM public.participants pa WHERE pa.team_id = t2.id) AS total
  FROM public.teams t2
  LEFT JOIN public.categories c ON c.id = t2.category_id
) sub
WHERE t.id = sub.id
  AND COALESCE(t.total_price, 0) = 0
  AND sub.total > 0;