"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  label?: string;
};

export default function BackButton({ label = "Regresar" }: BackButtonProps) {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/login");
    }
  }

return (
  <button
    onClick={handleBack}
    className="rounded bg-red-600 px-4 py-2 text-white"
  >
    ← Regresar
  </button>
);
}