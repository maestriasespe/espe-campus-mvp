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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const identifier = String(body?.identifier ?? "").trim().toLowerCase();

    if (!identifier) {
      return NextResponse.json(
        { error: "Debes ingresar tu matrícula o correo." },
        { status: 400 }
      );
    }

    let query = supabaseServer
      .from("users")
      .select("id, matricula, recovery_email");

    const isEmail = identifier.includes("@");

    if (isEmail) {
      query = query.eq("recovery_email", identifier);
    } else {
      query = query.eq("matricula", identifier);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error("Error consultando recovery status:", error);
      return NextResponse.json(
        { error: "No se pudo validar la recuperación." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No se encontró una cuenta con ese dato." },
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

