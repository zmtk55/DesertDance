import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Método no permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Body inválido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { email, name, role } = body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'Email inválido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  if (!name || !name.trim()) {
    return new Response(JSON.stringify({ ok: false, error: 'Nombre requerido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const tempPassword = crypto.randomUUID().slice(0, 16);

  // 1. Crear usuario en auth
  const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
    email: email.trim(),
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: name.trim() },
  });

  if (authErr || !authUser?.user) {
    console.error('Auth create error:', authErr);
    return new Response(JSON.stringify({ ok: false, error: 'No se pudo crear el usuario auth' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  const userId = authUser.user.id;

  // 2. Crear registro en admin_users
  const { error: adminErr } = await supabase.from('admin_users').insert([{
    id: userId,
    email: email.trim(),
    name: name.trim(),
    role: role || 'admin',
    is_active: true,
  }]);

  if (adminErr) {
    console.error('Admin insert error:', adminErr);
    return new Response(JSON.stringify({ ok: false, error: 'No se pudo registrar el administrador' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ ok: true, userId, email: email.trim(), tempPassword }), { status: 200, headers: { 'Content-Type': 'application/json' } });
});
