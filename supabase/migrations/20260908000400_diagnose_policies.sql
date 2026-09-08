-- Desert Dance: diagnóstico temporal de políticas (se elimina después)
CREATE OR REPLACE FUNCTION public.diagnose_policies()
RETURNS TABLE (
  tablename name, policyname name, permissive text, roles name[],
  polcmd text, with_check text,
  anon_insert boolean, anon_select boolean, anon_update boolean, anon_delete boolean
)
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT
    c.relname,
    p.polname,
    p.polpermissive::text,
    p.polroles,
    p.polcmd::text,
    p.polwithcheck::text,
    has_table_privilege('anon', n.nspname || '.' || c.relname, 'INSERT'),
    has_table_privilege('anon', n.nspname || '.' || c.relname, 'SELECT'),
    has_table_privilege('anon', n.nspname || '.' || c.relname, 'UPDATE'),
    has_table_privilege('anon', n.nspname || '.' || c.relname, 'DELETE')
  FROM pg_policy p
  JOIN pg_class c ON c.oid = p.polrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relname IN ('teams')
  ORDER BY c.relname, p.polname
$$;

ALTER FUNCTION public.diagnose_policies() SET search_path = pg_catalog, public;
GRANT EXECUTE ON FUNCTION public.diagnose_policies() TO anon, authenticated;