import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Método no permitido' }), {
      status: 405,
      headers,
    });
  }

  let body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Body inválido' }), { status: 400, headers });
  }

  const { admin_user_id, tempPassword } = body || {};
  if (!admin_user_id) {
    return new Response(JSON.stringify({ ok: false, error: 'Falta el ID de administrador' }), { status: 400, headers });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // 1. Verificar que el admin existe y obtener su email
  const { data: admin, error: adminErr } = await supabase
    .from('admin_users')
    .select('id, email, name')
    .eq('id', admin_user_id)
    .single();

  if (adminErr || !admin) {
    return new Response(JSON.stringify({ ok: false, error: 'Administrador no encontrado' }), { status: 404, headers });
  }

  // 2. Usar contraseña personalizada o generar una temporal
  const password = tempPassword || crypto.randomUUID().slice(0, 12);

  // 3. Resetear contraseña en auth
  const { error: resetErr } = await supabase.auth.admin.updateUserById(admin.id, {
    password: password,
  });

  if (resetErr) {
    console.error('Password reset error:', resetErr);
    return new Response(JSON.stringify({ ok: false, error: 'Error al resetear contraseña' }), { status: 500, headers });
  }

  return new Response(JSON.stringify({
    ok: true,
    email: admin.email,
    tempPassword: password,
  }), { status: 200, headers });
});