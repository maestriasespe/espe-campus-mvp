import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { verifyLogin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const matricula = String(form.get("matricula") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!matricula || !password) {
      return NextResponse.redirect(new URL("/login?e=1", req.url));
    }

    const user = await verifyLogin(matricula, password);

    if (!user) {
      return NextResponse.redirect(new URL("/login?e=1", req.url));
    }

    const session = await getSession();

    session.user = {
      userId: user.userId,
      matricula: user.matricula,
      role: user.role,
      studentId: user.studentId,
    };

    await session.save();

    const dest = user.role === "admin" ? "/admin" : "/campus/student";
    return NextResponse.redirect(new URL(dest, req.url));
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.redirect(new URL("/login?e=1", req.url));
  }
}

