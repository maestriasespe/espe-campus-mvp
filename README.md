# ESPE Campus (MVP WebApp / PWA)

MVP para alumnos:
- Calificaciones
- Tareas (vista)
- Pagos (vista)

Admin:
- Importar CSV (alumnos, módulos, calificaciones, pagos)
- Vistas admin de pagos/calificaciones

## 1) Requisitos
- Node.js 18+
- Cuenta en Supabase (gratis)

## 2) Crear proyecto en Supabase
1. Crea un proyecto.
2. Ve a **SQL Editor** y ejecuta: `db/schema.sql`
3. Ve a **Project Settings → API** y copia:
   - `SUPABASE_URL`
   - `service_role key` (solo servidor)

## 3) Variables de entorno
Crea `.env.local` en la raíz:

SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="xxxxx"
SESSION_PASSWORD="una_frase_larga_de_minimo_20_caracteres"

## 4) Crear usuario admin
Genera un hash bcrypt (rápido) con Node:

node -e "const b=require('bcryptjs'); b.hash('TuClaveAdmin',10).then(h=>console.log(h))"

Luego inserta en Supabase SQL:

insert into users (matricula, role, password_hash)
values ('ADMIN', 'admin', '<hash>');

## 5) Correr
npm install
npm run dev

Abre:
http://localhost:3000

Admin: matrícula `ADMIN`, contraseña la que pusiste en bcrypt.

## 6) Importar datos
Entra a `/admin/import` y sube CSV usando las plantillas de `/templates`.

- `students.csv`: si password está vacío, contraseña = últimos 4 dígitos de matrícula.
- `modules.csv`: code + name
- `grades.csv`: module_code debe existir
- `payments.csv`: status: pending/paid/overdue

## Publicar (sin dominio)
Recomendado: Vercel
1. Crea repo en GitHub con este proyecto.
2. Importa en Vercel.
3. Configura env vars en Vercel igual que `.env.local`.

Después tus alumnos entran con:
https://tu-proyecto.vercel.app

## Nota de seguridad (MVP)
Este MVP usa service_role key en servidor. Mantén la key SOLO en env vars del servidor (nunca en cliente).
Para producción avanzada: implementar RLS y Supabase Auth o sesiones firmadas + RBAC más estricto.
