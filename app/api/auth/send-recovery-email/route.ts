import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;

  const visible = name.slice(0, 2);
  const maskedName =
    name.length <= 2
      ? `${visible}***`
      : `${visible}${"*".repeat(Math.max(name.length - 2, 3))}`;

  return `${maskedName}@${domain}`;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "recovery-status alive",
    time: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const matricula = String(body?.matricula ?? "").trim();

    if (!matricula) {
      return NextResponse.json(
        { error: "Debes ingresar una matrícula." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("users")
      .select("id, matricula, recovery_email")
      .eq("matricula", matricula)
      .maybeSingle();

    if (error) {
      console.error("Error consultando recovery status:", error);
      return NextResponse.json(
        { error: "No se pudo validar la recuperación." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No se encontró una cuenta con esa matrícula." },
        { status: 404 }
      );
    }

    const recoveryEmail = data.recovery_email?.trim() || "";

    if (!recoveryEmail) {
      return NextResponse.json({
        hasRecoveryEmail: false,
      });
    }

    return NextResponse.json({
      hasRecoveryEmail: true,
      maskedEmail: maskEmail(recoveryEmail),
    });
  } catch (error) {
    console.error("Error general recovery-status:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}