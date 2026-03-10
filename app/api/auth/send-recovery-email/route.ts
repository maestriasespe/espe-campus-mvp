import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

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
    const matricula = String(body?.matricula ?? "").trim();

    if (!matricula) {
      return NextResponse.json(
        { error: "Debes ingresar una matrícula." },
        { status: 400 }
      );
    }

    const { data: user, error: userError } = await supabaseServer
      .from("users")
      .select("id, matricula, recovery_email")
      .eq("matricula", matricula)
      .maybeSingle();

    if (userError) {
      console.error("Error buscando usuario:", userError);
      return NextResponse.json(
        { error: "No se pudo procesar la solicitud." },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "No se encontró una cuenta con esa matrícula." },
        { status: 404 }
      );
    }

    const recoveryEmail = String(user.recovery_email ?? "").trim().toLowerCase();

    if (!recoveryEmail) {
      return NextResponse.json(
        {
          error:
            "No hay correo de recuperación asignado a esta cuenta. Comunícate con control escolar para recuperar tu contraseña.",
        },
        { status: 400 }
      );
    }

    // Token seguro
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(rawToken);

    // Expira en 30 minutos
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    // Opcional: invalidar tokens previos sin usar
    await supabaseServer
      .from("password_resets")
      .update({ used_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("used_at", null);

    const { error: insertError } = await supabaseServer
      .from("password_resets")
      .insert({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error("Error guardando token:", insertError);
      return NextResponse.json(
        { error: "No se pudo generar el enlace de recuperación." },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

    const { error: emailError } = await resend.emails.send({
      from: process.env.RECOVERY_FROM_EMAIL || "ESPE Campus <onboarding@resend.dev>",
      to: recoveryEmail,
      subject: "Recuperación de contraseña - ESPE Campus",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2>Recuperación de contraseña</h2>
          <p>Hola,</p>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>ESPE Campus</strong>.</p>
          <p>
            Para continuar, haz clic en el siguiente botón:
          </p>
          <p style="margin: 24px 0;">
            <a
              href="${resetUrl}"
              style="background: #c8a44d; color: #111827; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: bold; display: inline-block;"
            >
              Restablecer contraseña
            </a>
          </p>
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all;">${resetUrl}</p>
          <p>Este enlace expirará en 30 minutos.</p>
          <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
          <br />
          <p>Atentamente,<br />ESPE Campus</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Error enviando correo:", emailError);
      return NextResponse.json(
        { error: "No se pudo enviar el correo de recuperación." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Se envió el enlace de recuperación.",
      maskedEmail: maskEmail(recoveryEmail),
    });
  } catch (error) {
    console.error("Error general send-recovery-email:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}