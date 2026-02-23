import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { env } from "@/lib/env";

export async function GET() {
  // 1) Validar sesión
  const session = await getSession();
  const studentId = session?.user?.studentId;

  if (!studentId) {
    return NextResponse.json({ error: "Unauthorized - no studentId in session" }, { status: 401 });
  }

  // 2) Cliente supabase (service role)
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // 3) Traer TODAS las materias (modules)
  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("id, code, name")
    .order("code", { ascending: true });

  if (modulesError) {
    return NextResponse.json(
      { error: "Modules query failed", details: modulesError },
      { status: 500 }
    );
  }

  // 4) Traer calificaciones del alumno (grades)
  // Nota: grades tiene student_id, module_id, assessment, grade
  const { data: grades, error: gradesError } = await supabase
    .from("grades")
    .select("id, module_id, assessment, grade, graded_at, created_at")
    .eq("student_id", studentId);

  if (gradesError) {
    return NextResponse.json(
      { error: "Grades query failed", details: gradesError },
      { status: 500 }
    );
  }

  // 5) Mapear grades por module_id para lookup rápido
  const gradesByModule = new Map<string, any[]>();
  for (const g of grades || []) {
    const key = g.module_id;
    if (!gradesByModule.has(key)) gradesByModule.set(key, []);
    gradesByModule.get(key)!.push(g);
  }

  // 6) Construir tabla: cada module con su calificación (si no hay = 0)
  // Si tienes varias evaluaciones (assessment), aquí puedes:
  // - tomar la última
  // - promediar
  // Por ahora: TOMAMOS la última por graded_at/created_at.
  const rows = (modules || []).map((m: any) => {
    const list = gradesByModule.get(m.id) || [];

    // ordenar para tomar la más reciente
    list.sort((a, b) => {
      const da = new Date(a.graded_at || a.created_at).getTime();
      const db = new Date(b.graded_at || b.created_at).getTime();
      return db - da;
    });

    const latest = list[0];
    const value = latest?.grade ?? 0;

    return {
      module_id: m.id,
      code: m.code,
      name: m.name,
      grade: Number(value) || 0,
      assessment: latest?.assessment ?? null,
      graded_at: latest?.graded_at ?? null,
    };
  });

  return NextResponse.json({ rows });
}
