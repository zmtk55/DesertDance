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

  try {
    let body;
  let body;
  try {
    body = await req.json();
    console.log('Parsed body:', body);
  } catch (e) {
    console.error('Body parse error:', e);
    return new Response(JSON.stringify({ ok: false, error: 'Body inválido', details: String(e) }), { status: 400, headers });
  }

    const { email, name, role, password } = body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: 'Email inválido' }), { status: 400, headers });
    }
    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ ok: false, error: 'Nombre requerido' }), { status: 400, headers });
    }
    if (!password || password.trim().length < 8) {
      return new Response(JSON.stringify({ ok: false, error: 'Contraseña requerida (mínimo 8 caracteres)' }), { status: 400, headers });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    console.log('Creating admin:', { email, name, role: role || 'admin' });

    // 1. Crear usuario en auth
    const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
      email: email.trim(),
      password: password.trim(),
      email_confirm: true,
      user_metadata: { full_name: name.trim() },
    });

    if (authErr || !authUser?.user) {
      console.error('Auth create error:', authErr);
      return new Response(JSON.stringify({ ok: false, error: 'No se pudo crear el usuario auth', details: authErr }), { status: 500, headers });
    }

    const userId = authUser.user.id;
    console.log('Auth user created:', userId);

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
      return new Response(JSON.stringify({ ok: false, error: 'No se pudo registrar el administrador', details: adminErr }), { status: 500, headers });
    }

    return new Response(JSON.stringify({ ok: true, userId, email: email.trim() }), { status: 200, headers });
  } catch (e) {
    console.error('Unhandled error:', e);
    return new Response(JSON.stringify({ ok: false, error: 'Error interno', details: String(e) }), { status: 500, headers });
  }
});
