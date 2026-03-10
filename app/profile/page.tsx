"use client";

import Link from "next/link";
import { BrandBar } from "@/components/BrandBar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-espe-bg text-espe-text">
      <BrandBar title="Mi perfil" />

      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="rounded-3xl border border-espe-gold/30 bg-espe-bg2/50 shadow-2xl backdrop-blur-md p-7">
          <div className="text-center">
            <div className="text-espe-gold text-[11px] tracking-[0.28em] uppercase">
              Escuela Superior de Procesos Electorales
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-wide text-espe-gold">
              Mi Perfil
            </h1>

            <p className="mt-2 text-sm text-espe-muted">
              Administra tu cuenta y seguridad de acceso.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {/* SEGURIDAD */}
            <div className="rounded-2xl border border-espe-gold/20 bg-black/20 p-5">
              <h2 className="text-lg font-semibold text-espe-gold">
                Seguridad
              </h2>

              <p className="mt-2 text-sm text-espe-muted">
                Cambia tu contraseña para mantener segura tu cuenta.
              </p>

              <Link
                href="/profile/change-password"
                className="mt-4 inline-block rounded-xl px-4 py-2 font-semibold text-espe-bg2
                           bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold
                           shadow-lg hover:opacity-95 active:scale-[0.99] transition"
              >
                Cambiar contraseña
              </Link>
            </div>

            {/* CORREO DE RECUPERACIÓN */}
            <div className="rounded-2xl border border-espe-gold/20 bg-black/20 p-5">
              <h2 className="text-lg font-semibold text-espe-gold">
                Correo de recuperación
              </h2>

              <p className="mt-2 text-sm text-espe-muted">
                Agrega o actualiza un correo para recuperar tu contraseña en caso de olvido.
              </p>

              <Link
                href="/profile/recovery-email"
                className="mt-4 inline-block rounded-xl px-4 py-2 font-semibold text-espe-bg2
                           bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold
                           shadow-lg hover:opacity-95 active:scale-[0.99] transition"
              >
                Agregar o actualizar correo
              </Link>
            </div>

            {/* ACCESO */}
            <div className="rounded-2xl border border-espe-gold/20 bg-black/20 p-5 sm:col-span-2">
              <h2 className="text-lg font-semibold text-espe-gold">
                Acceso
              </h2>

              <p className="mt-2 text-sm text-espe-muted">
                Desde aquí podrás administrar funciones de tu cuenta en ESPE Campus.
              </p>

              <Link
                href="/login"
                className="mt-4 inline-block text-sm text-espe-gold hover:underline"
              >
                Volver a login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}