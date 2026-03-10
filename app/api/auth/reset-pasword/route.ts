import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseServer } from "@/lib/supabase-server";
import { hashPassword } from "@/lib/auth";

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = String(body?.token ?? "").trim();
    const password = String(body?.password ?? "");

    if (!token) {
      return NextResponse.json(
        { error: "Token inválido." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    const tokenHash = sha256(token);
    const nowIso = new Date().toISOString();

    const { data: resetRow, error: resetError } = await supabaseServer
      .from("password_resets")
      .select("id, user_id, expires_at, used_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (resetError) {
      console.error("Error consultando token:", resetError);
      return NextResponse.json(
        { error: "No se pudo validar el token." },
        { status: 500 }
      );
    }

    if (!resetRow) {
      return NextResponse.json(
        { error: "El enlace de recuperación no es válido." },
        { status: 400 }
      );
    }

    if (resetRow.used_at) {
      return NextResponse.json(
        { error: "Este enlace ya fue utilizado." },
        { status: 400 }
      );
    }

    if (new Date(resetRow.expires_at).getTime() < new Date(nowIso).getTime()) {
      return NextResponse.json(
        { error: "Este enlace ha expirado. Solicita uno nuevo." },
        { status: 400 }
      );
    }

    const newPasswordHash = await hashPassword(password);

    const { error: userUpdateError } = await supabaseServer
      .from("users")
      .update({ password_hash: newPasswordHash })
      .eq("id", resetRow.user_id);

    if (userUpdateError) {
      console.error("Error actualizando contraseña:", userUpdateError);
      return NextResponse.json(
        { error: "No se pudo actualizar la contraseña." },
        { status: 500 }
      );
    }

    const { error: markUsedError } = await supabaseServer
      .from("password_resets")
      .update({ used_at: nowIso })
      .eq("id", resetRow.id);

    if (markUsedError) {
      console.error("Error marcando token como usado:", markUsedError);
      return NextResponse.json(
        { error: "La contraseña cambió, pero no se pudo cerrar correctamente el proceso. Intenta iniciar sesión." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error("Error general reset-password:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}