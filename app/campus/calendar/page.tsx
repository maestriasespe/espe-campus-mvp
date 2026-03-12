import CampusCalendar from "@/components/CampusCalendar";

export default function CalendarPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-6 rounded-xl2 border border-espe-line bg-espe-surface p-6 shadow-soft">
        <p className="text-xs font-semibold tracking-wide text-espe-muted">
          ESPE CAMPUS
        </p>

        <h1 className="mt-1 text-2xl font-extrabold text-espe-navy md:text-3xl">
          Calendario
        </h1>

        <p className="mt-2 text-sm text-espe-muted md:text-base">
          Consulta días festivos, fechas académicas y eventos importantes.
        </p>
      </header>

      <CampusCalendar />
    </main>
  );
}