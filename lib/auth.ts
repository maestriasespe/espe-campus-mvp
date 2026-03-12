import bcrypt from "bcryptjs";
import { supabaseServer } from "@/lib/supabase-server";

export async function verifyLogin(matricula: string, password: string) {
  const { data, error } = await supabaseServer
    .from("users")
    .select("id, matricula, role, password_hash, student_id")
    .eq("matricula", matricula)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const ok = await bcrypt.compare(password, data.password_hash);
  if (!ok) return null;

  return {
    userId: data.id as string,
    matricula: data.matricula as string,
    role: data.role as "student" | "admin",
    studentId: (data.student_id ?? undefined) as string | undefined,
  };
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

