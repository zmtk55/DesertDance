-- Desert Dance: limpieza de arranque.
--
-- 1) audit_log: el usuario quiere empezar el registro de cero, sin el historial
--    de pruebas (borrados, ediciones de desarrollo). TRUNCATE reinicia la tabla y
--    no queda rastro; a partir de aqui el log solo acumula operacion real.
TRUNCATE TABLE public.audit_log;

-- 2) scores: la calificacion la hacen los jueces a mano, la captura en el panel
--    se elimino. La tabla se creo hoy y esta vacia, asi que se borra para no
--    dejar un artefacto muerto en el esquema.
DROP TABLE IF EXISTS public.scores;