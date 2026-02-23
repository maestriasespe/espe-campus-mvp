import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function HomePage() {
  const session = await getSession();

  // 🔒 Si no hay sesión → login
  if (!session?.user) {
    redirect("/login");
  }

  // 🔀 Redirige según rol
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  // student
  redirect("/student");
}

