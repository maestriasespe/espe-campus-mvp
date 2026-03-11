import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { Resend } from "resend";
import crypto from "crypto";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

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
    console.log("=== ENTRÓ A SEND-RECOVERY-EMAIL ===");

    if (!resendApiKey) {
      console.error("Falta RESEND_API_KEY");
      return NextResponse.json(
        { error: "Falta configurar RESEND_API_KEY en Vercel." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const matricula = String(body?.matricula ?? "").trim();

    console.log("Matrícula recibida:", matricula);

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
      console.error("Error buscando usuario:", JSON.stringify(userError, null, 2));
      return NextResponse.json(
        {
          error: "No se pudo procesar la solicitud.",
          details: userError,
        },
        { status: 500 }
      );
    }

    if (!user) {
      console.error("No se encontró usuario con matrícula:", matricula);
      return NextResponse.json(
        { error: "No se encontró una cuenta con esa matrícula." },
        { status: 404 }
      );
    }

    const recoveryEmail = String(user.recovery_email ?? "").trim().toLowerCase();

    console.log("Recovery email encontrado:", recoveryEmail || "(vacío)");

    if (!recoveryEmail) {
      return NextResponse.json(
        {
          error:
            "No hay correo de recuperación asignado a esta cuenta. Comunícate con control escolar para recuperar tu contraseña.",
        },
        { status: 400 }
      );
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(rawToken);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const { error: invalidateError } = await supabaseServer
      .from("password_resets")
      .update({ used_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("used_at", null);

    if (invalidateError) {
      console.error(
        "Error invalidando tokens previos:",
        JSON.stringify(invalidateError, null, 2)
      );
    }

    const { error: insertError } = await supabaseServer
      .from("password_resets")
      .insert({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error("Error guardando token:", JSON.stringify(insertError, null, 2));
      return NextResponse.json(
        {
          error: "No se pudo generar el enlace de recuperación.",
          details: insertError,
        },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

    const fromEmail =
      process.env.RECOVERY_FROM_EMAIL || "ESPE Campus <soporte@espe.edu.mx>";

    console.log("Intentando enviar correo real de recuperación a:", recoveryEmail);
    console.log("From:", fromEmail);
    console.log("Reset URL:", resetUrl);

    const subject = "RECOVERY REAL ESPE - LINK DE CAMBIO DE CONTRASEÑA";

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="margin-bottom: 8px;">RECOVERY REAL ESPE</h1>
        <p>Este es el correo real de recuperación de contraseña de <strong>ESPE Campus</strong>.</p>
        <p>Haz clic en este enlace para cambiar tu contraseña:</p>
        <p style="margin: 20px 0;">
          <a
            href="${resetUrl}"
            style="background: #c8a44d; color: #111827; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: bold; display: inline-block;"
          >
            CAMBIAR CONTRASEÑA
          </a>
        </p>
        <p>Si el botón no funciona, copia y pega este enlace:</p>
        <p style="word-break: break-all; font-size: 14px;">${resetUrl}</p>
        <p>Este enlace expirará en 30 minutos.</p>
        <p>Si no solicitaste este cambio, ignora este mensaje.</p>
        <br />
        <p>Atentamente,<br />ESPE Campus</p>
      </div>
    `;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: recoveryEmail,
      replyTo: "soporte@espe.edu.mx",
      subject,
      html,
    });

    if (emailError) {
      console.error("Error enviando correo:", JSON.stringify(emailError, null, 2));
      return NextResponse.json(
        {
          error: "No se pudo enviar el correo de recuperación.",
          details: emailError,
        },
        { status: 500 }
      );
    }

    console.log("Correo real enviado correctamente:", JSON.stringify(emailData, null, 2));

    if (!emailData?.id) {
      console.error("Resend no devolvió id de envío:", JSON.stringify(emailData, null, 2));
      return NextResponse.json(
        {
          error: "Resend no confirmó el envío del correo.",
          details: emailData,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Se envió el enlace de recuperación.",
      maskedEmail: maskEmail(recoveryEmail),
      emailId: emailData.id,
      subject,
      // útil para depurar; si luego quieres lo quitamos
      resetUrl,
    });
  } catch (error: any) {
    console.error("Error general send-recovery-email:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor.",
        details: error?.message || error,
      },
      { status: 500 }
    );
  }
}