import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
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

    const { data: user } = await supabaseServer
      .from("users")
      .select("id, recovery_email")
      .eq("matricula", matricula)
      .maybeSingle();

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    if (!user.recovery_email) {
      return NextResponse.json(
        { error: "La cuenta no tiene correo de recuperación." },
        { status: 400 }
      );
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(rawToken);

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    await supabaseServer.from("password_resets").insert({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${rawToken}`;

    const { data, error } = await resend.emails.send({
      from: process.env.RECOVERY_FROM_EMAIL,
      to: user.recovery_email,
      subject: "Recuperación de contraseña - ESPE Campus",
      html: `
      <h2>Recuperación de contraseña</h2>
      <p>Haz clic aquí para cambiar tu contraseña:</p>
      <a href="${resetUrl}">${resetUrl}</a>
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