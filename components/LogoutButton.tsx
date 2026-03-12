"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl border border-espe-gold/40 bg-white px-4 py-2 text-sm font-semibold text-espe-navy shadow-sm transition hover:bg-espe-gold/10 hover:shadow-md active:scale-[0.98]"
    >
      Cerrar sesión
    </button>
  );
}