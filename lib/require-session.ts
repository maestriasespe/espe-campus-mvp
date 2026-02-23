import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function requireUser() {
  const session = await getSession();
  if (!session.user) redirect("/login");
  return session.user;
}

export async function requireRole(role: "student" | "admin") {
  const user = await requireUser();
  if (user.role !== role) redirect("/login");
  return user;
}
