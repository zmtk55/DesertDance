# Desert Dance — Registro por Equipos

Resumen del cambio realizado al registro de participantes en Desert Dance (competencia de baile en **Caborca, Sonora**).

## Contexto

La competencia recibe ~300 participantes **foráneos** organizados en **equipos/estudios** (escuelas de baile que viajan de otras ciudades). Cada equipo necesita:

- Datos del estudio (nombre, ciudad de origen, contacto del capitán)
- **Logo** del estudio (se sube al registrarse)
- **Música** de su rutina (se sube al registrarse)
- Lista de **bailarines** con técnica y división
- **Horario** de presentación (lo asigna el admin)

## Nuevo modelo de datos

### Tabla `teams` (equipo / estudio)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID PK | |
| `name` | TEXT | Nombre del estudio/equipo |
| `origin_city` | TEXT | Ciudad de origen |
| `contact_name` | TEXT | Capitán / representante |
| `contact_phone` | TEXT | Teléfono del contacto |
| `contact_email` | TEXT | Correo del contacto |
| `logo_path` / `logo_url` | TEXT | Logo subido (Storage) |
| `music_path` / `music_url` | TEXT | Música de la rutina (Storage) |
| `scheduled_time` | TIMESTAMPTZ | Horario de presentación (lo asigna admin) |
| `status` | TEXT | pending / confirmed / rejected / waitlist |
| `notes` | TEXT | Notas internas |
| `created_at` / `updated_at` | TIMESTAMPTZ | |

### Tabla `participants` (bailarines) — campos agregados

- `team_id` UUID FK → `teams(id)` (ON DELETE CASCADE)
- `technique` TEXT — técnica (contemporáneo, urbano, ballet...)
- `division` TEXT — división / rango de edad
- `routine_title` TEXT — título de la rutina (opcional)
- `school_name` TEXT — nombre desnormalizado de la escuela (respaldo)

> Nota: la tabla conserva `full_name`, `email`, `phone`, `category` (default) para compatibilidad, pero el registro nuevo por equipos usa `technique`/`division` en su lugar.

### Storage — bucket `team-files` (público)

- Carpeta `logos/` → logos de estudios
- Carpeta `music/` → MP3 de rutinas

Políticas: cualquiera sube y lee (formulario público), solo autenticados modifican/borran.

## Archivos modificados

- `supabase/migrations/20260908000200_registration_by_team.sql` — nueva migración
- `index.html` — formulario de registro por equipo (3 pasos) + ubicación Caborca
- `js/app.js` — lógica: subir logo+música → crear equipo → guardar bailarines
- `admin.html` — panel de equipos (tabla + expandir bailarines + horario + modal editar equipo)
- `js/admin.js` — lógica del panel de equipos

## Migraciones

Para aplicar el esquema en un Supabase nuevo/local:

```bash
supabase db reset   # aplica todas las migraciones en orden
```

O ejecutar la migración `20260908000200_registration_by_team.sql` en el SQL Editor del proyecto remoto.

## Flujo del admin

1. Ver lista de **equipos** con logo, ciudad, contacto, música (botón escuchar), horario y estatus.
2. Expandir un equipo para ver/sus bailarines y poder quitarlos.
3. Editar equipo: cambiar datos de contacto, asignar **horario**, cambiar estatus, notas.
4. Clic en estatus → cicla pendiente → confirmado → rechazado → lista de espera.
5. Exportar CSV de equipos (incluye bailarines).

## Pendiente / próximos pasos

- Cifras exactas de categorías/técnicas/divisiones (aún por definir por el organizador)
- Si se cobra inscripción: agregar campo de pago y status de pago por equipo
- Horarios: posible vista de programación (grilla por día/hora)