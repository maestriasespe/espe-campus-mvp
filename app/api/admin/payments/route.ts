import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { env } from "@/lib/env";

// ✅ AJUSTA AQUÍ los status reales de tu DB (según lo que ya viste)
const STATUS = {
  due: ["pending"],       // Adeudos (pero ojo: sin comprobante)
  paid: ["approved"],     // Cobrados / Aprobados
  rejected: ["rejected"], // Si no lo usas, no pasa nada (quedará vacío)
};

function monthRange(month: string) {
  // month = "2026-02"
  const [y, m] = month.split("-").map((x) => Number(x));
  const start = new Date(Date.UTC(y, m - 1, 1));
  const next = new Date(Date.UTC(y, m, 1));
  return {
    startISO: start.toISOString().slice(0, 10), // YYYY-MM-DD
    nextISO: next.toISOString().slice(0, 10),
  };
}

function sumAmounts(rows: Array<{ amount: number | null }>) {
  return (rows || []).reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
}

function hasProof(v: any) {
  // proof_url puede ser null, "", o una ruta
  if (typeof v === "string") return v.trim().length > 0;
  return !!v;
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session?.user?.role || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);

  // view: due|paid|submitted|rejected|all
  const view = (url.searchParams.get("view") || "due").toLowerCase();
  const month = url.searchParams.get("month"); // "YYYY-MM"
  const q = (url.searchParams.get("q") || "").trim();
  const summaryOnly = url.searchParams.get("summary") === "1";

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const range = month ? monthRange(month) : null;

  function applyCommonFilters(builder: any) {
    let b = builder;

    if (range) b = b.gte("due_date", range.startISO).lt("due_date", range.nextISO);

    if (q) {
      const safe = q.replace(/,/g, " ");
      // OJO: esto depende de que el join a students funcione como lo tienes hoy
      b = b.or(
        `concept.ilike.%${safe}%,students.full_name.ilike.%${safe}%,students.matricula.ilike.%${safe}%`
      );
    }

    return b;
  }

  // -------------------------
  // DASHBOARD SUMMARY
  // -------------------------
  if (summaryOnly) {
    try {
      // 1) pending rows (traemos amount y proof_url)
      let pendingQ = supabase
        .from("payments")
        .select("amount, proof_url, status", { count: "exact" })
        .in("status", STATUS.due);

      pendingQ = applyCommonFilters(pendingQ);

      const pendingRes = await pendingQ;
      if (pendingRes.error) throw pendingRes.error;

      const pendingRows = (pendingRes.data || []) as any[];

      // Adeudos = pending SIN proof
      const dueRows = pendingRows.filter((r) => !hasProof(r.proof_url));
      const due = { count: dueRows.length, sum: sumAmounts(dueRows) };

      // En revisión = pending CON proof
      const submittedRows = pendingRows.filter((r) => hasProof(r.proof_url));
      const submitted = { count: submittedRows.length };

      // 2) paid = approved
      let paidQ = supabase
        .from("payments")
        .select("amount", { count: "exact" })
        .in("status", STATUS.paid);

      paidQ = applyCommonFilters(paidQ);

      const paidRes = await paidQ;
      if (paidRes.error) throw paidRes.error;

      const paid = {
        count: paidRes.count ?? (paidRes.data || []).length,
        sum: sumAmounts((paidRes.data || []) as any[]),
      };

      // 3) rejected
      let rejQ = supabase.from("payments").select("id", { count: "exact" }).in("status", STATUS.rejected);
      rejQ = applyCommonFilters(rejQ);

      const rejRes = await rejQ;
      if (rejRes.error) throw rejRes.error;

      const rejected = { count: rejRes.count ?? (rejRes.data || []).length };

      return NextResponse.json({ summary: { due, paid, submitted, rejected } });
    } catch (e: any) {
      return NextResponse.json({ error: "Summary failed", details: e }, { status: 500 });
    }
  }

  // -------------------------
  // ROWS (TABLA)
  // -------------------------
  let query = supabase
    .from("payments")
    .select("id, concept, amount, due_date, status, proof_url, student_id, students(full_name, matricula)")
    .order("due_date", { ascending: true })
    .order("created_at", { ascending: false });

  query = applyCommonFilters(query);

  if (view === "all") {
    // no filtro
  } else if (view === "paid") {
    query = query.in("status", STATUS.paid);
  } else if (view === "rejected") {
    query = query.in("status", STATUS.rejected);
  } else {
    // Tanto due como submitted salen de pending, filtramos después por proof_url
    query = query.in("status", STATUS.due);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Query failed", details: error }, { status: 500 });
  }

  let filtered = (data || []) as any[];

  if (view === "due") filtered = filtered.filter((p) => !hasProof(p.proof_url));
  if (view === "submitted") filtered = filtered.filter((p) => hasProof(p.proof_url));

  const rows =
    filtered.map((p: any) => {
      const proof_public_url = hasProof(p.proof_url)
        ? `${env.SUPABASE_URL}/storage/v1/object/public/payment-proofs/${p.proof_url}`
        : null;

      return {
        id: p.id,
        concept: p.concept,
        amount: p.amount,
        due_date: p.due_date,
        status: p.status,
        proof_public_url,
        student_name: p.students?.full_name ?? null,
        matricula: p.students?.matricula ?? null,
      };
    }) ?? [];

  return NextResponse.json({ rows });
}


