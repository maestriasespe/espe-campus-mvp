import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-session";
import { supabaseServer } from "@/lib/supabase-server";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await requireRole("student");
    const userId = user.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Usuario no identificado." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const password = body?.password;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Contraseña inválida." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const { error } = await supabaseServer
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("id", userId);

    if (error) {
      console.error("Error actualizando contraseña:", error);

      return NextResponse.json(
        {
          error: "No se pudo actualizar la contraseña.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error: any) {
    console.error("Error en change-password:", error);

    return NextResponse.json(
      {
        error: "No autorizado.",
        details: error?.message || "Error desconocido",
      },
      { status: 401 }
    );
  }
}