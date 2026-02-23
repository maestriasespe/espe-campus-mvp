import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { env } from "@/lib/env";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.user?.role || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const studentId = ctx.params.id;
  if (!studentId) {
    return NextResponse.json({ error: "Missing student id" }, { status: 400 });
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // ✅ Materias = modules (NO subjects)
  const { data: modules, error: modErr } = await supabase
    .from("modules")
    .select("id, code, name")
    .order("name", { ascending: true });

  if (modErr) {
    return NextResponse.json({ error: "Modules query failed", details: modErr }, { status: 500 });
  }

  // Calificaciones del alumno
  const { data: grades, error: gErr } = await supabase
    .from("grades")
    .select("module_id, grade, graded_at, created_at")
    .eq("student_id", studentId);

  if (gErr) {
    return NextResponse.json({ error: "Grades query failed", details: gErr }, { status: 500 });
  }

  // Última calificación por materia
  const latestByModule = new Map<string, { grade: number; t: number }>();

  for (const g of grades || []) {
    const mid = String(g.module_id);
    const t =
      (g.graded_at ? Date.parse(String(g.graded_at)) : NaN) ||
      (g.created_at ? Date.parse(String(g.created_at)) : NaN) ||
      0;

    const prev = latestByModule.get(mid);
    if (!prev || t >= prev.t) {
      latestByModule.set(mid, { grade: Number(g.grade) || 0, t });
    }
  }

  // Merge: todas las materias + grade (0 si no hay)
  const rows = (modules || []).map((m) => ({
    module_id: m.id,
    code: m.code,
    module_name: m.name,
    grade: latestByModule.get(String(m.id))?.grade ?? 0,
  }));

  return NextResponse.json({ rows });
}
