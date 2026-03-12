"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandBar } from "@/components/BrandBar";

export default function ForgotPage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    try {
      const statusRes = await fetch("/api/auth/recovery-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier }),
      });

      const statusData = await statusRes.json();

      if (!statusRes.ok) {
        setErrorMsg(statusData.error || "No se pudo validar la recuperación.");
        return;
      }

      if (!statusData.hasRecoveryEmail) {
        setErrorMsg(
          "No hay correo de recuperación asignado a esta cuenta. Comunícate con control escolar para recuperar tu contraseña."
        );
        return;
      }

      const sendRes = await fetch("/api/auth/send-recovery-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier }),
      });

      const sendData = await sendRes.json();

      if (!sendRes.ok) {
        setErrorMsg(sendData.error || "No se pudo enviar el correo.");
        return;
      }

      setMessage(
        `Se envió un enlace para restablecer la contraseña a ${sendData.maskedEmail}.`
      );
      setIdentifier("");
    } catch (error) {
      console.error(error);
      setErrorMsg("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-espe-bg text-espe-text">
      <BrandBar title="Recuperar contraseña" />

      <div className="mx-auto max-w-md px-5 py-14">
        <div className="rounded-3xl border border-espe-gold/30 bg-espe-bg2/50 shadow-2xl backdrop-blur-md p-7">
          <div className="text-center">
            <div className="text-espe-gold text-[11px] tracking-[0.28em] uppercase">
              Escuela Superior de Procesos Electorales
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-wide text-espe-gold">
              Recuperar contraseña
            </h1>

            <p className="mt-2 text-sm text-espe-muted">
              Ingresa tu matrícula o correo de recuperación.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-espe-gold">
                Matrícula o correo
              </label>

              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="mt-2 w-full rounded-xl border border-espe-gold/25 bg-black/25 px-4 py-3 text-espe-text placeholder-espe-muted/70
                           outline-none focus:border-espe-gold focus:ring-2 focus:ring-espe-gold/25"
                placeholder="Ej. ALU8001 o correo@ejemplo.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 font-semibold tracking-wide text-espe-bg2
                         bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold
                         shadow-lg hover:opacity-95 active:scale-[0.99] transition disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>

          {message && (
            <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
              {message}
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {errorMsg}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-espe-gold hover:underline">
              Volver a login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

