const TYPESAFE_API_KEY = 'apikey_215020fe017c2af04d90a09d1381a7c1f668_2531c07e79d4c4a4c79d0cb42a9123ca48ac30dbeedffbd93aa9ac89f231be69';
const TYPESAFE_API_URL = 'https://api.typesafe.ai/v1/systemone';

async function typeSafeEval(state, questions) {
  const res = await fetch(TYPESAFE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TYPESAFE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ state, model: 'jev-latest', questions }),
  });
  if (!res.ok) throw new Error(`TypeSafe API error: ${res.status}`);
  return res.json();
}

async function validateRegistration(data) {
  const result = await typeSafeEval(
    { team: data },
    {
      is_complete: {
        type: 'noul',
        instructions: '¿El formulario de registro tiene todos los campos obligatorios llenos (nombre del equipo, contacto, email)?',
      },
      category_suggestion: {
        type: 'choice',
        instructions: 'Basado en la descripción del equipo, ¿qué categoría de danza sugieres?',
        criteria: {
          contemporanea: 'Danza contemporánea, expresión corporal, movimientos fluidos',
          urbana: 'Hip-hop, breakdance, street dance, danza urbana',
          ballet: 'Ballet clásico, neoclásico, técnica profesional',
          folclorica: 'Danzas tradicionales mexicanas, raíces culturales',
          aerea: 'Aéreo, telas, trapecio, acrobacia aérea',
        },
      },
      name_appropriate: {
        type: 'noul',
        instructions: '¿El nombre del equipo es apropiado y no contiene ofensas?',
      },
    }
  );
  return result.answers;
}

async function classifyDanceStyle(description) {
  const result = await typeSafeEval(
    { description },
    {
      style: {
        type: 'choice',
        instructions: '¿Qué estilo de danza describe este texto?',
        criteria: {
          contemporanea: 'Danza contemporánea',
          urbana: 'Danza urbana, hip-hop, break',
          ballet: 'Ballet',
          folclorica: 'Folclórico mexicano',
          aerea: 'Danza aérea',
          otro: 'Otro estilo no listado',
        },
      },
      energy_level: {
        type: 'score',
        instructions: '¿Qué nivel de energía tiene esta rutina?',
        criteria: ['Bajo', 'Moderado', 'Alto', 'Muy alto'],
      },
    }
  );
  return result.answers;
}

window.TypeSafe = {
  eval: typeSafeEval,
  validateRegistration,
  classifyDanceStyle,
};
