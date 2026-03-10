"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { BrandBar } from "@/components/BrandBar";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    if (!token) {
      setErrorMsg("El enlace de recuperación no es válido.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "No se pudo restablecer la contraseña.");
      } else {
        setMessage("Tu contraseña fue actualizada correctamente. Ya puedes iniciar sesión.");
        setPassword("");
        setConfirmPassword("");
      }
    } catch {
      setErrorMsg("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-espe-bg text-espe-text">
      <BrandBar title="Restablecer contraseña" />

      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="rounded-3xl border border-espe-gold/30 bg-espe-bg2/50 shadow-2xl backdrop-blur-md p-7">
          <div className="text-center">
            <div className="text-espe-gold text-[11px] tracking-[0.28em] uppercase">
              Escuela Superior de Procesos Electorales
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-wide text-espe-gold">
              Restablecer contraseña
            </h1>

            <p className="mt-2 text-sm text-espe-muted">
              Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
            </p>
          </div>

          {!token && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              El enlace de recuperación no contiene un token válido.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-espe-gold mb-1">
                Nueva contraseña
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-espe-gold/25 bg-black/25 px-4 py-3 text-espe-text placeholder-espe-muted/70
                           outline-none focus:border-espe-gold focus:ring-2 focus:ring-espe-gold/25"
                placeholder="********"
                disabled={!token || loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-espe-gold mb-1">
                Confirmar nueva contraseña
              </label>

              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-espe-gold/25 bg-black/25 px-4 py-3 text-espe-text placeholder-espe-muted/70
                           outline-none focus:border-espe-gold focus:ring-2 focus:ring-espe-gold/25"
                placeholder="********"
                disabled={!token || loading}
              />
            </div>

            <button
              type="submit"
              disabled={!token || loading}
              className="rounded-xl px-4 py-2 font-semibold text-espe-bg2
                         bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold
                         shadow-lg hover:opacity-95 active:scale-[0.99] transition disabled:opacity-50"
            >
              {loading ? "Actualizando..." : "Guardar nueva contraseña"}
            </button>
          </form>

          {message && (
            <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
              <p>{message}</p>
              <Link href="/login" className="mt-2 inline-block font-semibold underline">
                Ir a iniciar sesión
              </Link>
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}