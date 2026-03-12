import Image from "next/image";

const events = [
  {
    id: 1,
    title: 'Conferencia Reforma Electoral "Plan B"',
    speaker: "Dr. Leonardo Valdés Zurita",
    subtitle: "Ex Consejero Presidente del IFE (2008 - 2013)",
    date: "18 de marzo",
    time: "7:00 PM",
    location: "Virtual vía Zoom",
    meetingId: "704 856 7572",
    password: "606645",
    note: "Evento será grabado",
    capacity: "Cupo limitado",
    flyer: "/flyers/evento-1.jpeg",
  },
];

export default function EventsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <header className="mb-6 rounded-xl2 border border-espe-line bg-espe-surface p-6 shadow-soft">
        <p className="text-xs font-semibold tracking-wide text-espe-muted">
          ESPE CAMPUS
        </p>

        <h1 className="mt-1 text-2xl font-extrabold text-espe-navy md:text-3xl">
          Eventos
        </h1>

        <p className="mt-2 text-sm text-espe-muted md:text-base">
          Consulta conferencias, actividades académicas y eventos institucionales.
        </p>
      </header>

      <div className="max-h-[75vh] space-y-6 overflow-y-auto pr-2">
        {events.map((event) => (
          <article
            key={event.id}
            className="overflow-hidden rounded-xl2 border border-espe-line bg-espe-surface shadow-soft"
          >
            <div className="relative w-full bg-black">
              <Image
                src={event.flyer}
                alt={event.title}
                width={1000}
                height={1500}
                className="h-auto w-full object-contain"
                priority={event.id === 1}
              />
            </div>

            <div className="p-5 md:p-6">
              <h2 className="text-xl font-extrabold text-espe-navy md:text-2xl">
                {event.title}
              </h2>

              <p className="mt-2 text-base font-semibold text-espe-navy">
                {event.speaker}
              </p>

              <p className="mt-1 text-sm text-espe-muted">
                {event.subtitle}
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-espe-line bg-white/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-espe-muted">
                    Fecha
                  </p>
                  <p className="mt-1 text-sm font-semibold text-espe-navy">
                    {event.date}
                  </p>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-espe-muted">
                    Hora
                  </p>
                  <p className="mt-1 text-sm font-semibold text-espe-navy">
                    {event.time}
                  </p>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-espe-muted">
                    Modalidad
                  </p>
                  <p className="mt-1 text-sm font-semibold text-espe-navy">
                    {event.location}
                  </p>
                </div>

                <div className="rounded-xl border border-espe-line bg-white/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-espe-muted">
                    ID de la reunión
                  </p>
                  <p className="mt-1 text-sm font-semibold text-espe-navy">
                    {event.meetingId}
                  </p>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-espe-muted">
                    Contraseña
                  </p>
                  <p className="mt-1 text-sm font-semibold text-espe-navy">
                    {event.password}
                  </p>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-espe-muted">
                    Nota
                  </p>
                  <p className="mt-1 text-sm text-espe-muted">
                    {event.note}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold px-4 py-2 text-sm font-semibold text-white shadow-md">
                  {event.capacity}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}