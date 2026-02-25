import Link from "next/link";
import { BrandBar } from "@/components/BrandBar";

export default function ForgotPage() {
  return (
    <div className="min-h-screen bg-espe-bg text-espe-text">
      <BrandBar title="Recuperar acceso" />

      <div className="mx-auto max-w-md px-5 py-14">
        <div className="rounded-3xl border border-espe-gold/30 bg-espe-bg2/50 shadow-2xl backdrop-blur-md p-7">
          <div className="text-center">
            <div className="text-espe-gold text-[11px] tracking-[0.28em] uppercase">
              ESPE Campus
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-wide text-espe-gold">
              Recuperar contraseña
            </h1>
            <p className="mt-2 text-sm text-espe-muted">
              Esta función se habilitará cuando el alumno tenga email registrado.
            </p>
          </div>

          <div className="mt-7 space-y-3">
            <div className="rounded-xl border border-espe-gold/20 bg-black/20 p-4 text-sm text-espe-muted">
              Por ahora, solicita tu cambio de contraseña con control escolar.
            </div>

            <Link
              href="/login"
              className="block w-full text-center rounded-xl py-3 font-semibold tracking-wide text-espe-bg2
                         bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold
                         shadow-lg hover:opacity-95 active:scale-[0.99] transition"
            >
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}