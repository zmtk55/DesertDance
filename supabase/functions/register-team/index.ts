// Desert Dance — Edge Function: registro público con validación Turnstile.
// El navegador envía el token de Turnstile; esta función lo valida en
// Cloudflare y, si es correcta, crea el equipo + participantes.
// El secret de Turnstile vive aquí, en el server (nunca al navegador).
// Deno runtime (Supabase Edge Functions).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Método no permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Body inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { turnstile_token, team, dancers, logo_path, music_path, logo_url, music_url } = body || {};

  // 1. Validar Turnstile
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) {
    return new Response(JSON.stringify({ ok: false, error: 'Configuración del servidor incompleta' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!turnstile_token) {
    return new Response(JSON.stringify({ ok: false, error: 'Falta la verificación de seguridad' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const tf = await fetch('https://challenges.cloudflare.com/turnstile/v1/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: turnstile_token }),
  });
  const tfJson = await tf.json();
  if (!tfJson.success) {
    return new Response(JSON.stringify({ ok: false, error: 'Verificación de seguridad fallida. Recarga la página.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Validar datos básicos
  const name = String(team?.name || '').trim();
  const email = String(team?.contact_email || '').trim();
  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'Revisa los datos del equipo' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Rate limiting simple por email (máx 3 intentos en 24h)
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('teams')
    .select('id', { count: 'exact', head: true })
    .eq('contact_email', email)
    .gte('created_at', since);
  if ((count || 0) >= 3) {
    return new Response(JSON.stringify({ ok: false, error: 'Ya tienes un registro reciente. Contáctanos si necesitas cambiar algo.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. Crear equipo + participantes
  const teamId = crypto.randomUUID();
  const { error: teamErr } = await supabase.from('teams').insert([{
    id: teamId,
    name,
    origin_city: String(team?.origin_city || '').trim(),
    contact_name: String(team?.contact_name || '').trim(),
    contact_phone: String(team?.contact_phone || '').trim(),
    contact_email: email,
    category_id: team?.category_id || null,
    logo_path: logo_path || '',
    logo_url: logo_url || '',
    music_path: music_path || '',
    music_url: music_url || '',
    status: 'pending',
  }]);
  if (teamErr) {
    return new Response(JSON.stringify({ ok: false, error: 'Error al guardar el equipo' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (Array.isArray(dancers) && dancers.length) {
    await supabase.from('participants').insert(
      dancers.map(d => ({
        full_name: String(d?.full_name || '').trim(),
        technique: String(d?.technique || '').trim(),
        division: String(d?.division || '').trim(),
        category_id: team?.category_id || null,
        team_id: teamId,
        email,
        school_name: name,
        status: 'pending',
      })),
    );
  }

  return new Response(JSON.stringify({ ok: true, teamId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});