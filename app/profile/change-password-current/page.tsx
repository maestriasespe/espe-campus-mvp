"use client";

import { useState } from "react";
import { BrandBar } from "@/components/BrandBar";

export default function ChangePasswordCurrentPage() {
  const [currentPassword, setCurrentPassword] = useState("");
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

    if (!currentPassword) {
      setErrorMsg("Debes ingresar tu contraseña actual.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas nuevas no coinciden.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg("La nueva contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/student/change-password-with-current", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "No se pudo actualizar la contraseña.");
      } else {
        setMessage("Contraseña actualizada correctamente.");
        setCurrentPassword("");
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
      <BrandBar title="Cambiar contraseña" />

      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="rounded-3xl border border-espe-gold/30 bg-espe-bg2/50 shadow-2xl backdrop-blur-md p-7">
          <div className="text-center">
            <div className="text-espe-gold text-[11px] tracking-[0.28em] uppercase">
              Escuela Superior de Procesos Electorales
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-wide text-espe-gold">
              Cambiar contraseña
            </h1>

            <p className="mt-2 text-sm text-espe-muted">
              Ingresa tu contraseña actual para actualizarla.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-espe-gold mb-1">
                Contraseña actual
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-espe-gold/25 bg-black/25 px-4 py-3 text-espe-text placeholder-espe-muted/70
                           outline-none focus:border-espe-gold focus:ring-2 focus:ring-espe-gold/25"
                placeholder="********"
              />
            </div>

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
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl px-4 py-2 font-semibold text-espe-bg2
                         bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold
                         shadow-lg hover:opacity-95 active:scale-[0.99] transition disabled:opacity-50"
            >
              {loading ? "Actualizando..." : "Guardar nueva contraseña"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-green-400">{message}</p>
          )}

          {errorMsg && (
            <p className="mt-4 text-sm text-red-400">{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}