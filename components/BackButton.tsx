"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/campus");
    }
  }

  return (
    <button
      onClick={handleBack}
      className="rounded-xl bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-95 hover:shadow-lg active:scale-[0.98]"
    >
      ← Regresar
    </button>
  );
}