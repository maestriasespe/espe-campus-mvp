"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandBar } from "@/components/BrandBar";

export default function SupportPage() {
  const [matricula, setMatricula] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  async function handleRecoveryCheck(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");
    setMaskedEmail("");

    try {
      console.log("=== INICIANDO FLUJO DE RECUPERACIÓN ===");
      console.log("Matrícula enviada:", matricula);

      const statusRes = await fetch("/api/auth/recovery-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matricula }),
      });

      const statusData = await statusRes.json();
      console.log("recovery-status status:", statusRes.status);
      console.log("recovery-status data:", statusData);

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

      setMaskedEmail(statusData.maskedEmail || "");

      const sendRes = await fetch("/api/auth/send-recovery-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matricula }),
      });

      const sendData = await sendRes.json();
      console.log("send-recovery-email status:", sendRes.status);
      console.log("send-recovery-email data:", sendData);

      if (!sendRes.ok) {
        setErrorMsg(
          sendData.error || "No se pudo enviar el correo de recuperación."
        );
        return;
      }

      setMessage(
        `Se envió un enlace de recuperación al correo ${sendData.maskedEmail || statusData.maskedEmail}.`
      );
    } catch (error) {
      console.error("Error en support page:", error);
      setErrorMsg("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-espe-bg text-espe-text">
      <BrandBar title="Soporte" />

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="rounded-3xl border border-espe-gold/30 bg-espe-bg2/50 shadow-2xl backdrop-blur-md p-7">
          <div className="text-center">
            <div className="text-espe-gold text-[11px] tracking-[0.28em] uppercase">
              Escuela Superior de Procesos Electorales
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-wide text-espe-gold">
              Soporte de acceso
            </h1>

            <p className="mt-2 text-sm text-espe-muted">
              Elige la opción que corresponda para recuperar o actualizar tu acceso.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-espe-gold/20 bg-black/20 p-5">
              <h2 className="text-lg font-semibold text-espe-gold">
                Cambiar contraseña
              </h2>

              <p className="mt-2 text-sm text-espe-muted">
                Si todavía recuerdas tu contraseña actual, puedes cambiarla de forma segura.
              </p>

              <Link
                href="/profile/change-password-current"
                className="mt-4 inline-block rounded-xl px-4 py-2 font-semibold text-espe-bg2
                           bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold
                           shadow-lg hover:opacity-95 active:scale-[0.99] transition"
              >
                Cambiar con contraseña actual
              </Link>
            </div>

            <div className="rounded-2xl border border-espe-gold/20 bg-black/20 p-5">
              <h2 className="text-lg font-semibold text-espe-gold">
                Recuperar por correo
              </h2>

              <p className="mt-2 text-sm text-espe-muted">
                Ingresa tu matrícula para recuperar tu acceso.
              </p>

              <form onSubmit={handleRecoveryCheck} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-espe-gold mb-1">
                    Matrícula
                  </label>

                  <input
                    type="text"
                    required
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    className="w-full rounded-xl border border-espe-gold/25 bg-black/25 px-4 py-3 text-espe-text placeholder-espe-muted/70
                               outline-none focus:border-espe-gold focus:ring-2 focus:ring-espe-gold/25"
                    placeholder="Ej. 800123 o ALU8001"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl px-4 py-2 font-semibold text-espe-bg2
                             bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold
                             shadow-lg hover:opacity-95 active:scale-[0.99] transition disabled:opacity-50"
                >
                  {loading ? "Procesando..." : "Recuperar contraseña"}
                </button>
              </form>

              {message && (
                <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
                  <p>{message}</p>
                  {maskedEmail && (
                    <p className="mt-1">
                      Correo registrado: <span className="font-semibold">{maskedEmail}</span>
                    </p>
                  )}
                </div>
              )}

              {errorMsg && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  {errorMsg}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm text-espe-gold hover:underline">
              Volver a login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}