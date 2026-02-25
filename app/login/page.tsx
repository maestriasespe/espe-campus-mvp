import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  const formData = await req.formData();

  const matricula = String(formData.get("matricula") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!matricula || !password) {
    return NextResponse.redirect(new URL("/?error=Credenciales inválidas", req.url));
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name, options) => {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  // 🔥 CONVERSIÓN CLAVE
  const email = `${matricula.toLowerCase()}@espe-campus.local`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.redirect(
      new URL("/?error=Credenciales incorrectas", req.url)
    );
  }

  // Detectar rol
  const userId = data.user.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profile?.role === "admin") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.redirect(new URL("/student", req.url));
}
