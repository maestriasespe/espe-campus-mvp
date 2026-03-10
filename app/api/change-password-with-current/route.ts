import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
    const currentPassword = String(body?.currentPassword ?? "");
    const password = String(body?.password ?? "");

    if (!currentPassword || !password) {
      return NextResponse.json(
        { error: "Debes completar todos los campos." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("users")
      .select("id, password_hash")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { error: "No se pudo validar el usuario." },
        { status: 500 }
      );
    }

    const ok = await bcrypt.compare(currentPassword, data.password_hash);

    if (!ok) {
      return NextResponse.json(
        { error: "La contraseña actual es incorrecta." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const { error: updateError } = await supabaseServer
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: "No se pudo actualizar la contraseña." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error("Error en change-password-with-current:", error);

    return NextResponse.json(
      { error: "No autorizado." },
      { status: 401 }
    );
  }
}