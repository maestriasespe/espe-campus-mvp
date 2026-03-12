export default function PaymentsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <header className="mb-6 rounded-xl2 border border-espe-line bg-espe-surface p-6 shadow-soft">
        <p className="text-xs font-semibold tracking-wide text-espe-muted">
          ESPE Campus
        </p>

        <h1 className="mt-1 text-2xl font-extrabold text-espe-navy md:text-3xl">
          Pagos
        </h1>

        <p className="mt-2 text-sm text-espe-muted">
          Consulta tu historial de pagos y estado de colegiaturas.
        </p>
      </header>

      <section className="rounded-xl2 border border-espe-line bg-espe-surface p-6 shadow-soft">
        <h2 className="mb-4 text-sm font-bold text-espe-navy">
          Historial de pagos
        </h2>

        <div className="text-sm text-espe-muted">
          No hay pagos registrados todavía.
        </div>
      </section>
    </main>
  );
}