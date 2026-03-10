"use client";

import { BrandBar } from "@/components/BrandBar";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-espe-bg text-espe-text">
      <BrandBar title="Acceso alumnos" />

      <div className="mx-auto max-w-md px-5 py-14">
        <div className="rounded-3xl border border-espe-gold/30 bg-espe-bg2/50 shadow-2xl backdrop-blur-md p-7">

          {/* HEADER */}
          <div className="text-center">
            <div className="text-espe-gold text-[11px] tracking-[0.28em] uppercase">
              Escuela Superior de Procesos Electorales
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-wide text-espe-gold">
              ESPE Campus
            </h1>

            <p className="mt-2 text-sm text-espe-muted">
              Ingresa con tu matrícula y contraseña
            </p>
          </div>

          {/* LOGIN FORM */}
          <form
            className="mt-8 space-y-5"
            method="post"
            action="/api/auth/login"
          >
            {/* MATRÍCULA */}
            <div>
              <label className="text-sm font-medium text-espe-gold">
                Matrícula
              </label>

              <input
                type="text"
                name="matricula"
                inputMode="text"
                autoCapitalize="none"
                autoCorrect="off"
                className="mt-2 w-full rounded-xl border border-espe-gold/25 bg-black/25 px-4 py-3 text-espe-text placeholder-espe-muted/70
                           outline-none focus:border-espe-gold focus:ring-2 focus:ring-espe-gold/25"
                placeholder="Ej. 800123 o ALU8001"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-espe-gold">
                Contraseña
              </label>

              <input
                name="password"
                type="password"
                className="mt-2 w-full rounded-xl border border-espe-gold/25 bg-black/25 px-4 py-3 text-espe-text placeholder-espe-muted/70
                           outline-none focus:border-espe-gold focus:ring-2 focus:ring-espe-gold/25"
                placeholder="********"
                required
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full rounded-xl py-3 font-semibold tracking-wide text-espe-bg2
                         bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold
                         shadow-lg hover:opacity-95 active:scale-[0.99] transition"
            >
              Entrar
            </button>
          </form>

          {/* FOOTER LINKS */}
          <div className="mt-6 flex items-center justify-between text-xs text-espe-muted">

            <span>
              ¿No tienes contraseña? Solicítala a control escolar
            </span>

            <Link
              className="text-espe-gold font-semibold hover:underline"
              href="/forgot"
            >
              ¿Olvidaste tu contraseña?
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}