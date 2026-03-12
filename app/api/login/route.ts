import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/session";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  try {
    const { matricula, password } = await req.json();

    const supabase = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: student, error } = await supabase
      .from("students")
      .select("id, matricula, password, role")
      .eq("matricula", matricula)
      .maybeSingle();

    if (!student || error) {
      return NextResponse.json(
        { error: "Alumno no encontrado" },
        { status: 404 }
      );
    }

    if (student.password !== password) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    const session = await getSession();

    session.user = {
      userId: student.id,
      matricula: student.matricula,
      role: "student",
      studentId: student.id,
    };

    await session.save();

    return NextResponse.json({
      ok: true,
      redirectTo: "/campus/student",
    });
  } catch (error) {
    console.error("Error en login:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

