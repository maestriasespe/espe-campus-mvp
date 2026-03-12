import CampusCalendar from "@/components/CampusCalendar";

export default function CalendarPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <header className="mb-6 rounded-[2rem] border border-espe-line bg-white p-6 shadow-soft">
        <p className="text-xs font-semibold tracking-wide text-espe-muted">
          ESPE CAMPUS
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-espe-navy">
          Calendario
        </h1>
        <p className="mt-2 text-sm text-espe-muted md:text-base">
          Revisa fechas festivas, eventos institucionales y actividades académicas.
        </p>
      </header>

      <CampusCalendar />
    </main>
  );
}