import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-session";
import { supabaseServer } from "@/lib/supabase-server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  try {
    const user = await requireRole("student");

    const { data, error } = await supabaseServer
      .from("users")
      .select("recovery_email")
      .eq("id", user.userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: "No se pudo cargar el correo." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      recovery_email: data?.recovery_email ?? "",
    });
  } catch {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireRole("student");
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Correo inválido." },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from("users")
      .update({ recovery_email: email })
      .eq("id", user.userId);

    if (error) {
      return NextResponse.json(
        { error: "No se pudo guardar el correo." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Correo guardado correctamente.",
    });
  } catch {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 401 }
    );
  }
}