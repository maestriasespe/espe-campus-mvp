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
      className="inline-flex items-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
    >
      ← {label}
    </button>
  );
}