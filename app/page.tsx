import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 md:py-14">
      <header className="mb-6 rounded-xl2 bg-espe-surface shadow-soft border border-espe-line p-6">
        <p className="text-xs font-semibold tracking-wide text-espe-muted">
          ESPE Campus
        </p>

        <h1 className="mt-1 text-3xl md:text-4xl font-extrabold text-espe-navy">
          Bienvenido
        </h1>

        <p className="mt-2 text-sm md:text-base text-espe-muted">
          Accede rápido a tus módulos. Todo claro, todo en un solo lugar.
        </p>
      </header>

      <section className="rounded-xl2 bg-espe-surface shadow-soft border border-espe-line p-6">
        <h2 className="text-sm font-bold text-espe-navy mb-4">
          Acciones
        </h2>

        <div className="flex flex-col gap-3">
          <Button variant="goldSolid" full href="/login">
            Entrar al Campus
          </Button>

          <Button variant="goldOutline" full href="/profile">
            Mi perfil
          </Button>

          <Button variant="ghost" full href="/calendar">
            Ver calendario
          </Button>

          <Button variant="ghost" full href="/support">
            Soporte
          </Button>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl2 bg-espe-surface border border-espe-line p-4">
          <p className="text-xs text-espe-muted font-semibold">
            Módulos
          </p>

          <p className="text-xl md:text-2xl font-extrabold text-espe-navy">
            8
          </p>
        </div>

        <div className="rounded-xl2 bg-espe-surface border border-espe-line p-4">
          <p className="text-xs text-espe-muted font-semibold">
            Avisos
          </p>

          <p className="text-xl md:text-2xl font-extrabold text-espe-navy">
            2
          </p>
        </div>
      </section>
    </main>
  );
}