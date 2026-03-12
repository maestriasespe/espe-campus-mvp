"use client";

import { useEffect, useState } from "react";
import { BrandBar } from "@/components/BrandBar";

export default function RecoveryEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadRecoveryEmail() {
      try {
        const res = await fetch("/api/profile/recovery-email", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.error || "No se pudo cargar el correo.");
        } else {
          setEmail(data.recovery_email ?? "");
        }
      } catch {
        setErrorMsg("Ocurrió un error al cargar la información.");
      } finally {
        setLoadingData(false);
      }
    }

    loadRecoveryEmail();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/profile/recovery-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "No se pudo guardar el correo.");
      } else {
        setMessage("Correo de recuperación guardado correctamente.");
      }
    } catch {
      setErrorMsg("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-espe-bg text-espe-text">
      <BrandBar title="Correo de recuperación" />

      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="rounded-3xl border border-espe-gold/30 bg-espe-bg2/50 shadow-2xl backdrop-blur-md p-7">
          <div className="text-center">
            <div className="text-espe-gold text-[11px] tracking-[0.28em] uppercase">
              Escuela Superior de Procesos Electorales
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-wide text-espe-gold">
              Correo de recuperación
            </h1>

            <p className="mt-2 text-sm text-espe-muted">
              Registra un correo para recuperar tu contraseña en caso de olvido.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-espe-gold/20 bg-black/20 p-5">
            {loadingData ? (
              <p className="text-sm text-espe-muted">Cargando información...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-espe-gold mb-1">
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-espe-gold/25 bg-black/25 px-4 py-3 text-espe-text placeholder-espe-muted/70
                               outline-none focus:border-espe-gold focus:ring-2 focus:ring-espe-gold/25"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl px-4 py-2 font-semibold text-espe-bg2
                             bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold
                             shadow-lg hover:opacity-95 active:scale-[0.99] transition disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Guardar correo"}
                </button>
              </form>
            )}

            {message && (
              <p className="mt-4 text-sm text-green-400">{message}</p>
            )}

            {errorMsg && (
              <p className="mt-4 text-sm text-red-400">{errorMsg}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}