"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
  id: string;
  concept: string;
  amount: number;
  due_date: string;
  status: string;
  proof_public_url?: string | null;
  student_name?: string | null;
  matricula?: string | null;
};

type Summary = {
  due: { count: number; sum?: number };
  paid: { count: number; sum?: number };
  submitted: { count: number };
  rejected: { count: number };
};

const TABS = [
  { key: "due", label: "Adeudos" },
  { key: "submitted", label: "En revisión" },
  { key: "paid", label: "Cobrados" },
  { key: "rejected", label: "Rechazados" },
  { key: "all", label: "Todos" },
] as const;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function currentYYYYMM() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}
function money(n?: number) {
  const v = Number(n || 0);
  return v.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

export default function AdminPaymentsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("due");
  const [month, setMonth] = useState<string>(currentYYYYMM());
  const [q, setQ] = useState<string>("");

  const [rows, setRows] = useState<Row[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loadingRows, setLoadingRows] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const title = useMemo(() => {
    const t = TABS.find((x) => x.key === tab);
    return t?.label ?? "Pagos";
  }, [tab]);

  async function loadSummary() {
    setLoadingSummary(true);
    const res = await fetch(
      `/api/admin/payments?summary=1&month=${encodeURIComponent(month)}`,
      { cache: "no-store" }
    );
    const j = await res.json();
    setSummary(j.summary || null);
    setLoadingSummary(false);
  }

  async function loadRows() {
    setLoadingRows(true);

    const url = `/api/admin/payments?view=${encodeURIComponent(tab)}&month=${encodeURIComponent(
      month
    )}&q=${encodeURIComponent(q)}`;

    const res = await fetch(url, { cache: "no-store" });
    const j = await res.json();

    setRows(j.rows || []);
    setLoadingRows(false);
  }

  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  useEffect(() => {
    loadRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, month]);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    await loadRows();
  }

  async function setStatus(paymentId: string, status: "approved" | "rejected") {
    const res = await fetch(`/api/admin/payments/${paymentId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const j = await res.json();
    if (!res.ok) {
      alert(`Error: ${j?.error || "No se pudo actualizar"}`);
      return;
    }

    await Promise.all([loadRows(), loadSummary()]);
  }

  const showActions = tab === "submitted"; // Solo acciones en revisión
  const colSpanNoRows = showActions ? 8 : 7;

  return (
    <div className="p-6 space-y-4">
      {/* Dashboard */}
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl2 border border-espe-line bg-espe-surface shadow-soft p-4">
          <div className="text-sm text-espe-muted">Adeudos (mes)</div>
          <div className="text-2xl font-semibold text-espe-text">
            {loadingSummary ? "…" : summary?.due?.count ?? 0}
          </div>
          <div className="text-sm text-espe-muted">
            {loadingSummary ? "…" : money(summary?.due?.sum)}
          </div>
        </div>

        <div className="rounded-xl2 border border-espe-line bg-espe-surface shadow-soft p-4">
          <div className="text-sm text-espe-muted">Cobrados (mes)</div>
          <div className="text-2xl font-semibold text-espe-text">
            {loadingSummary ? "…" : summary?.paid?.count ?? 0}
          </div>
          <div className="text-sm text-espe-muted">
            {loadingSummary ? "…" : money(summary?.paid?.sum)}
          </div>
        </div>

        <div className="rounded-xl2 border border-espe-line bg-espe-surface shadow-soft p-4">
          <div className="text-sm text-espe-muted">En revisión (mes)</div>
          <div className="text-2xl font-semibold text-espe-text">
            {loadingSummary ? "…" : summary?.submitted?.count ?? 0}
          </div>
          <div className="text-xs text-espe-muted mt-1">Pendientes con comprobante</div>
        </div>

        <div className="rounded-xl2 border border-espe-line bg-espe-surface shadow-soft p-4">
          <div className="text-sm text-espe-muted">Rechazados (mes)</div>
          <div className="text-2xl font-semibold text-espe-text">
            {loadingSummary ? "…" : summary?.rejected?.count ?? 0}
          </div>
          <div className="text-xs text-espe-muted mt-1">Comprobantes rechazados</div>
        </div>
      </div>

      {/* Header + filtros */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-espe-text">{title}</h1>
          <div className="text-sm text-espe-muted">
            Filtro mensual + búsqueda por alumno / matrícula / concepto
          </div>
        </div>

        <form onSubmit={onSearch} className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-espe-muted">Mes</label>
            <input
              type="month"
              className="border border-espe-line rounded-lg px-3 py-2 bg-espe-surface text-espe-text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>

          <input
            className="border border-espe-line rounded-lg px-3 py-2 w-full md:w-80 bg-espe-surface text-espe-text"
            placeholder="Buscar (alumno, matrícula, concepto)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <button
            className="px-4 py-2 rounded-lg border border-espe-gold bg-espe-gold text-espe-navy font-semibold hover:brightness-95"
            type="submit"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              "px-4 py-2 rounded-xl border font-semibold",
              tab === t.key
                ? "bg-espe-navy text-white border-espe-navy"
                : "bg-espe-surface text-espe-text border-espe-line hover:bg-espe-surface2",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tabla (responsive móvil + tema) */}
      <div className="rounded-xl2 border border-espe-line bg-espe-surface shadow-soft overflow-hidden">
        {loadingRows ? (
          <div className="p-6 text-espe-muted">Cargando…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-sm">
              <thead className="bg-espe-surface2 text-espe-muted">
                <tr>
                  <th className="text-left px-3 py-3 text-xs font-semibold">Alumno</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold">Matrícula</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold">Concepto</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold">Monto</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold">Vence</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold">Estatus</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold">Comprobante</th>
                  {showActions && <th className="text-left px-3 py-3 text-xs font-semibold">Acciones</th>}
                </tr>
              </thead>

              <tbody className="text-espe-text">
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-espe-line">
                    <td className="px-3 py-3 align-top">{r.student_name ?? "-"}</td>
                    <td className="px-3 py-3 align-top">{r.matricula ?? "-"}</td>
                    <td className="px-3 py-3 align-top">{r.concept}</td>
                    <td className="px-3 py-3 align-top">{money(r.amount)}</td>
                    <td className="px-3 py-3 align-top">{r.due_date}</td>

                    <td className="px-3 py-3 align-top">
                      <span className="inline-flex items-center rounded-full border border-espe-line bg-espe-surface2 px-2 py-1 text-xs font-semibold">
                        {r.status}
                      </span>
                    </td>

                    <td className="px-3 py-3 align-top">
                      {r.proof_public_url ? (
                        <a
                          className="inline-flex items-center rounded-lg border border-espe-gold/40 px-3 py-1.5 text-xs font-semibold text-espe-text hover:bg-espe-gold/10"
                          href={r.proof_public_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver
                        </a>
                      ) : (
                        <span className="text-espe-muted">—</span>
                      )}
                    </td>

                    {showActions && (
                      <td className="px-3 py-3 align-top">
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1.5 rounded-lg border border-espe-gold bg-espe-gold text-espe-navy font-semibold hover:brightness-95 disabled:opacity-50"
                            disabled={!r.proof_public_url}
                            onClick={() => setStatus(r.id, "approved")}
                            title={!r.proof_public_url ? "No hay comprobante" : "Aprobar"}
                          >
                            Aprobar
                          </button>
                          <button
                            className="px-3 py-1.5 rounded-lg border border-espe-line bg-espe-surface2 text-espe-text font-semibold hover:bg-espe-surface disabled:opacity-50"
                            disabled={!r.proof_public_url}
                            onClick={() => setStatus(r.id, "rejected")}
                            title={!r.proof_public_url ? "No hay comprobante" : "Rechazar"}
                          >
                            Rechazar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-espe-muted" colSpan={colSpanNoRows}>
                      No hay resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}