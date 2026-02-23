import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/session";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  const { matricula, password } = await req.json();

  const supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  );

  // 1️⃣ Buscar alumno
  const { data: student, error } = await supabase
    .from("students")
    .select("id, matricula, password, role")
    .eq("matricula", matricula)
    .maybeSingle();

  if (!student || error) {
    return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
  }

  // 2️⃣ Validar contraseña
  if (student.password !== password) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  // 3️⃣ CREAR SESIÓN AQUÍ 👇
  const session = await getSession();

  session.user = {
    userId: student.id,
    matricula: student.matricula,
    role: "student",
    studentId: student.id, // 👈 MUY IMPORTANTE
  };

  await session.save();

  return NextResponse.json({ ok: true });
}
