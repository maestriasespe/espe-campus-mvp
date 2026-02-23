import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/session";
import { env } from "@/lib/env";

function isFileLike(file: unknown): file is {
  name: string;
  type?: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
} {
  return (
    !!file &&
    typeof file === "object" &&
    "arrayBuffer" in file &&
    typeof (file as any).arrayBuffer === "function" &&
    "name" in file &&
    typeof (file as any).name === "string"
  );
}

function isTruthyString(v: any) {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(req: Request, { params }: { params: { paymentId: string } }) {
  try {
    // 1) Sesión
    const session = await getSession();
    const matricula = session?.user?.matricula;

    if (!matricula) {
      return NextResponse.json(
        { error: "Unauthorized - no matricula in session" },
        { status: 401 }
      );
    }

    // 2) Validar env
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Misconfigured", details: "Supabase env missing" },
        { status: 500 }
      );
    }

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const paymentId = params.paymentId;

    // 3) Resolver studentId usando matricula (porque students NO tiene user_id)
    const stuRes = await supabase
      .from("students")
      .select("id, matricula")
      .eq("matricula", matricula)
      .maybeSingle();

    if (stuRes.error) {
      return NextResponse.json({ error: "Students lookup failed", details: stuRes.error }, { status: 500 });
    }
    if (!stuRes.data?.id) {
      return NextResponse.json({ error: "Unauthorized - student not found for session matricula" }, { status: 401 });
    }

    const studentId = stuRes.data.id;

    // 4) Leer form-data
    const form = await req.formData();
    const file = form.get("file");

    if (!isFileLike(file)) {
      return NextResponse.json({ error: "Missing file", details: "file not provided or invalid" }, { status: 400 });
    }

    // 5) Validar extensión
    const ext = String(file.name).split(".").pop()?.toLowerCase() || "bin";
    const allowed = ["pdf", "png", "jpg", "jpeg"];
    const safeExt = allowed.includes(ext) ? ext : "bin";

    // 6) Buscar pago y validar dueño
    const payRes = await supabase
      .from("payments")
      .select("id, student_id, status")
      .eq("id", paymentId)
      .maybeSingle();

    if (payRes.error) {
      return NextResponse.json({ error: "Payments lookup failed", details: payRes.error }, { status: 500 });
    }
    if (!payRes.data) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payRes.data.student_id !== studentId) {
      return NextResponse.json(
        {
          error: "Forbidden",
          details: "Payment not owned by this student",
          debug: { payment_student_id: payRes.data.student_id, session_student_id: studentId, matricula },
        },
        { status: 403 }
      );
    }

    // 7) Subir a Storage
    const path = `${studentId}/${paymentId}/${Date.now()}.${safeExt}`;
    const buf = new Uint8Array(await file.arrayBuffer());

    const upRes = await supabase.storage.from("payment-proofs").upload(path, buf, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

    if (upRes.error) {
      return NextResponse.json(
        {
          error: "Upload failed",
          details: upRes.error,
          hint: "Verifica que exista el bucket 'payment-proofs' en Storage.",
        },
        { status: 500 }
      );
    }

    // 8) Guardar proof_url en payments (esto es lo que dispara tu pestaña 'En revisión')
    const updateRes = await supabase
      .from("payments")
      .update({
        proof_url: path,
        // NO cambies status si tu lógica de revisión es: pending + proof_url != null
        // status: "submitted", // <- solo si decidieras usar un status real 'submitted'
      })
      .eq("id", paymentId);

    if (updateRes.error) {
      return NextResponse.json({ error: "Update failed", details: updateRes.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, path });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: String(e?.message || e), stack: e?.stack || null },
      { status: 500 }
    );
  }
}
