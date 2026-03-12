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
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="
        rounded-xl px-4 py-2 text-sm font-semibold
        bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold
        text-espe-bg2
        shadow-md
        hover:opacity-95 hover:shadow-lg
        active:scale-[0.98]
        transition
      "
    >
      Salir
    </button>
  );
}