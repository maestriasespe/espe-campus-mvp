import { NextResponse } from "next/server";
import Papa from "papaparse";
import { requireRole } from "@/lib/require-session";
import { supabaseServer } from "@/lib/supabase-server";
import { hashPassword } from "@/lib/auth";

type Kind = "students" | "modules" | "grades" | "payments";

function parseCSV(text: string) {
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  if (parsed.errors?.length) {
    throw new Error(parsed.errors.map(e => e.message).join("\n"));
  }
  return parsed.data as Record<string, string>[];
}

export async function POST(req: Request) {
  await requireRole("admin");

  const form = await req.formData();
  const kind = String(form.get("kind") ?? "") as Kind;
  const file = form.get("file") as File | null;

  if (!file || !kind) return new NextResponse("Falta archivo o tipo.", { status: 400 });

  const text = await file.text();
  const rows = parseCSV(text);

  if (kind === "students") {
    // expected: matricula,nombre,grupo,password(optional)
    // if password missing, default = last 4 digits of matricula
    const inserts: any[] = [];
    const userInserts: any[] = [];

    for (const r of rows) {
      const matricula = String(r.matricula ?? "").trim();
      const nombre = String(r.nombre ?? "").trim();
      const grupo = String(r.grupo ?? "").trim();
      if (!matricula || !nombre) continue;

      inserts.push({ matricula, full_name: nombre, group_name: grupo || null });
    }

    // upsert students
    const { data: students, error: sErr } = await supabaseServer
      .from("students")
      .upsert(inserts, { onConflict: "matricula" })
      .select("id, matricula");

    if (sErr) throw sErr;

    for (const st of students ?? []) {
      const pass = rows.find(x => String(x.matricula).trim() === st.matricula)?.password?.trim()
        || String(st.matricula).slice(-4);

      const password_hash = await hashPassword(pass);

      userInserts.push({
        matricula: st.matricula,
        role: "student",
        student_id: st.id,
        password_hash,
      });
    }

    // upsert users
    const { error: uErr } = await supabaseServer
      .from("users")
      .upsert(userInserts, { onConflict: "matricula" });

    if (uErr) throw uErr;

    return new NextResponse(`OK: ${students?.length ?? 0} alumnos importados.\nContraseña por defecto: últimos 4 dígitos de la matrícula (si no se especificó).`);
  }

  if (kind === "modules") {
    // expected: code,name
    const inserts = rows
      .map(r => ({
        code: String(r.code ?? "").trim(),
        name: String(r.name ?? "").trim(),
      }))
      .filter(r => r.code && r.name);

    const { error } = await supabaseServer.from("modules").upsert(inserts, { onConflict: "code" });
    if (error) throw error;
    return new NextResponse(`OK: ${inserts.length} módulos importados.`);
  }

  if (kind === "grades") {
    // expected: matricula,module_code,assessment,grade,graded_at(optional)
    // assessment examples: "Parcial 1", "Final"
    const inserts: any[] = [];
    for (const r of rows) {
      const matricula = String(r.matricula ?? "").trim();
      const module_code = String(r.module_code ?? "").trim();
      const assessment = String(r.assessment ?? "").trim() || "Final";
      const grade = Number(r.grade ?? "");
      const graded_at = (r.graded_at && String(r.graded_at).trim()) ? String(r.graded_at).trim() : null;
      if (!matricula || !module_code || Number.isNaN(grade)) continue;

      // find student id
      const { data: st } = await supabaseServer.from("students").select("id").eq("matricula", matricula).maybeSingle();
      const { data: mod } = await supabaseServer.from("modules").select("id").eq("code", module_code).maybeSingle();
      if (!st || !mod) continue;

      inserts.push({ student_id: st.id, module_id: mod.id, assessment, grade, graded_at });
    }

    const { error } = await supabaseServer.from("grades").insert(inserts);
    if (error) throw error;
    return new NextResponse(`OK: ${inserts.length} calificaciones importadas.`);
  }

  if (kind === "payments") {
    // expected: matricula,concept,amount,due_date(YYYY-MM-DD),status(optional)
    const inserts: any[] = [];
    for (const r of rows) {
      const matricula = String(r.matricula ?? "").trim();
      const concept = String(r.concept ?? "").trim() || "Mensualidad";
      const amount = Number(r.amount ?? "");
      const due_date = String(r.due_date ?? "").trim();
      const status = (String(r.status ?? "").trim() || "pending") as "pending"|"paid"|"overdue";
      if (!matricula || !due_date || Number.isNaN(amount)) continue;

      const { data: st } = await supabaseServer.from("students").select("id").eq("matricula", matricula).maybeSingle();
      if (!st) continue;

      inserts.push({ student_id: st.id, concept, amount, due_date, status });
    }

    const { error } = await supabaseServer.from("payments").insert(inserts);
    if (error) throw error;
    return new NextResponse(`OK: ${inserts.length} pagos importados.`);
  }

  return new NextResponse("Tipo no soportado.", { status: 400 });
}

