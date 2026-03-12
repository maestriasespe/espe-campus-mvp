import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(201,166,70,0.14),_transparent_28%),linear-gradient(to_bottom,_#f8f7f3,_#efede7)]">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 md:grid-cols-2 md:px-10">
        <section className="order-2 md:order-1">
          <div className="inline-flex items-center rounded-full border border-espe-gold/30 bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-espe-gold shadow-sm backdrop-blur">
            ESCUELA SUPERIOR DE PROCESOS ELECTORALES
          </div>

          <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight text-espe-navy md:text-6xl">
            Un campus digital
            <span className="block text-espe-gold">más claro, más vivo y más útil.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-espe-muted md:text-lg">
            Consulta calificaciones, tareas, pagos, calendario académico y eventos institucionales
            desde un solo lugar, con una experiencia mucho más moderna para alumnos ESPE.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="goldSolid" href="/login">
              Entrar al Campus
            </Button>

            <Button variant="goldOutline" href="/campus/calendar">
              Ver calendario
            </Button>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            <div className="rounded-2xl border border-espe-line bg-white/80 p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wide text-espe-muted">
                Eventos
              </p>
              <p className="mt-2 text-2xl font-extrabold text-espe-navy">+1</p>
            </div>

            <div className="rounded-2xl border border-espe-line bg-white/80 p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wide text-espe-muted">
                Campus
              </p>
              <p className="mt-2 text-2xl font-extrabold text-espe-navy">Activo</p>
            </div>

            <div className="rounded-2xl border border-espe-line bg-white/80 p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wide text-espe-muted">
                Soporte
              </p>
              <p className="mt-2 text-2xl font-extrabold text-espe-navy">24/7</p>
            </div>
          </div>
        </section>

        <section className="order-1 md:order-2">
          <div className="relative overflow-hidden rounded-[2rem] border border-espe-line bg-white/85 p-6 shadow-2xl backdrop-blur md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(201,166,70,0.16),_transparent_30%)]" />

            <div className="relative">
              <div className="rounded-2xl border border-espe-line bg-espe-surface p-5 shadow-soft">
                <p className="text-xs font-semibold tracking-wide text-espe-muted">
                  ESPE Campus
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-espe-navy">
                  Bienvenido
                </h2>
                <p className="mt-2 text-sm text-espe-muted md:text-base">
                  Accede rápido a tus módulos. Todo claro, todo en un solo lugar.
                </p>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-espe-line bg-white p-5 shadow-soft">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-espe-navy">Próximo evento</p>
                    <span className="rounded-full bg-espe-gold/15 px-3 py-1 text-xs font-semibold text-espe-gold">
                      Conferencia
                    </span>
                  </div>
                  <p className="mt-3 text-xl font-extrabold text-espe-navy">
                    Reforma Electoral “Plan B”
                  </p>
                  <p className="mt-1 text-sm text-espe-muted">
                    18 de marzo · 7:00 PM · Virtual vía Zoom
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-espe-line bg-white p-5 shadow-soft">
                    <p className="text-sm font-semibold text-espe-muted">Módulo destacado</p>
                    <p className="mt-2 text-lg font-bold text-espe-navy">Calendario académico</p>
                    <p className="mt-2 text-sm text-espe-muted">
                      Fechas clave, suspensiones y eventos institucionales.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-espe-line bg-white p-5 shadow-soft">
                    <p className="text-sm font-semibold text-espe-muted">Acceso rápido</p>
                    <p className="mt-2 text-lg font-bold text-espe-navy">Pagos y tareas</p>
                    <p className="mt-2 text-sm text-espe-muted">
                      Consulta tus pendientes desde un panel más claro.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
