import { BrandBar } from "@/components/BrandBar";
import BackButton from "@/components/BackButton";
import Link from "next/link";

type LoginPageProps = {
  searchParams?: {
    e?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const hasError = searchParams?.e === "1";

  return (
    <div className="min-h-screen bg-espe-bg text-espe-text">
      <BrandBar title="Acceso alumnos" />

      <div className="mx-auto max-w-md px-5 py-10">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="rounded-3xl border border-espe-gold/30 bg-espe-bg2/50 p-7 shadow-2xl backdrop-blur-md">
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.28em] text-espe-gold">
              Escuela Superior de Procesos Electorales
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-wide text-espe-gold">
              ESPE Campus
            </h1>

            <p className="mt-2 text-sm text-espe-muted">
              Ingresa con tu matrícula y contraseña
            </p>
          </div>

          {hasError && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              Matrícula o contraseña incorrecta. Verifica tus datos e inténtalo nuevamente.
            </div>
          )}

          <form
            className="mt-8 space-y-5"
            method="post"
            action="/api/auth/login"
          >
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
                className="mt-2 w-full rounded-xl border border-espe-gold/25 bg-black/25 px-4 py-3 text-espe-text outline-none placeholder-espe-muted/70 focus:border-espe-gold focus:ring-2 focus:ring-espe-gold/25"
                placeholder="Ej. 800123 o ALU8001"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-espe-gold">
                Contraseña
              </label>

              <input
                name="password"
                type="password"
                className="mt-2 w-full rounded-xl border border-espe-gold/25 bg-black/25 px-4 py-3 text-espe-text outline-none placeholder-espe-muted/70 focus:border-espe-gold focus:ring-2 focus:ring-espe-gold/25"
                placeholder="********"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold py-3 font-semibold tracking-wide text-espe-bg2 shadow-lg transition hover:opacity-95 active:scale-[0.99]"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-espe-muted">
            <span>¿No tienes contraseña? Solicítala a control escolar</span>

            <Link
              className="font-semibold text-espe-gold hover:underline"
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