import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { Resend } from "resend";
import crypto from "crypto";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(req: Request) {
  try {
    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Falta configurar RESEND_API_KEY en Vercel." },
        { status: 500 }
      );
    }

    const fromEmail =
      process.env.RECOVERY_FROM_EMAIL || "ESPE Campus <soporte@espe.edu.mx>";

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const body = await req.json();
    const matricula = String(body?.matricula ?? "").trim();

    if (!matricula) {
      return NextResponse.json(
        { error: "Debes ingresar una matrícula." },
        { status: 400 }
      );
    }

    const { data: user, error: userError } = await supabaseServer
      .from("users")
      .select("id, recovery_email")
      .eq("matricula", matricula)
      .maybeSingle();

    if (userError) {
      console.error(userError);
      return NextResponse.json(
        { error: "No se pudo buscar el usuario." },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    const recoveryEmail = String(user.recovery_email ?? "").trim().toLowerCase();

    if (!recoveryEmail) {
      return NextResponse.json(
        { error: "La cuenta no tiene correo de recuperación." },
        { status: 400 }
      );
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(rawToken);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const { error: insertError } = await supabaseServer
      .from("password_resets")
      .insert({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error(insertError);
      return NextResponse.json(
        { error: "No se pudo guardar el token de recuperación." },
        { status: 500 }
      );
    }

    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recoveryEmail,
      subject: "Recuperación de contraseña - ESPE Campus",
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Haz clic aquí para cambiar tu contraseña:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
      `,
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Error enviando correo." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      emailId: data?.id,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error interno." },
      { status: 500 }
    );
  }
}