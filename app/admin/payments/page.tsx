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
    const res = await fetch(`/api/admin/payments?summary=1&month=${encodeURIComponent(month)}`, {
      cache: "no-store",
    });
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

  // Columnas:
  // Base: Alumno, Matrícula, Concepto, Monto, Vence, Estatus, Comprobante = 7
  // + Acciones en revisión = 8
  const colSpanNoRows = showActions ? 8 : 7;

  return (
    <div className="p-6 space-y-4">
      {/* Dashboard */}
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-slate-500">Adeudos (mes)</div>
          <div className="text-2xl font-semibold">{loadingSummary ? "…" : summary?.due?.count ?? 0}</div>
          <div className="text-sm text-slate-600">{loadingSummary ? "…" : money(summary?.due?.sum)}</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-slate-500">Cobrados (mes)</div>
          <div className="text-2xl font-semibold">{loadingSummary ? "…" : summary?.paid?.count ?? 0}</div>
          <div className="text-sm text-slate-600">{loadingSummary ? "…" : money(summary?.paid?.sum)}</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-slate-500">En revisión (mes)</div>
          <div className="text-2xl font-semibold">{loadingSummary ? "…" : summary?.submitted?.count ?? 0}</div>
          <div className="text-xs text-slate-400 mt-1">Pendientes con comprobante</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-slate-500">Rechazados (mes)</div>
          <div className="text-2xl font-semibold">{loadingSummary ? "…" : summary?.rejected?.count ?? 0}</div>
          <div className="text-xs text-slate-400 mt-1">Comprobantes rechazados</div>
        </div>
      </div>

      {/* Header + filtros */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <div className="text-sm text-slate-500">Filtro mensual + búsqueda por alumno / matrícula / concepto</div>
        </div>

        <form onSubmit={onSearch} className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Mes</label>
            <input
              type="month"
              className="border rounded-lg px-3 py-2 bg-white"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>

          <input
            className="border rounded-lg px-3 py-2 w-full md:w-80 bg-white"
            placeholder="Buscar (alumno, matrícula, concepto)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <button className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800" type="submit">
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
              "px-4 py-2 rounded-xl border",
              tab === t.key ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="rounded-xl border bg-white overflow-hidden">
        {loadingRows ? (
          <div className="p-6">Cargando…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3">Alumno</th>
                <th className="text-left p-3">Matrícula</th>
                <th className="text-left p-3">Concepto</th>
                <th className="text-left p-3">Monto</th>
                <th className="text-left p-3">Vence</th>
                <th className="text-left p-3">Estatus</th>
                <th className="text-left p-3">Comprobante</th>
                {showActions && <th className="text-left p-3">Acciones</th>}
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.student_name ?? "-"}</td>
                  <td className="p-3">{r.matricula ?? "-"}</td>
                  <td className="p-3">{r.concept}</td>
                  <td className="p-3">{money(r.amount)}</td>
                  <td className="p-3">{r.due_date}</td>
                  <td className="p-3 capitalize">{r.status}</td>

                  <td className="p-3">
                    {r.proof_public_url ? (
                      <a className="text-blue-700 underline" href={r.proof_public_url} target="_blank" rel="noreferrer">
                        Ver
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {showActions && (
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                          disabled={!r.proof_public_url}
                          onClick={() => setStatus(r.id, "approved")}
                          title={!r.proof_public_url ? "No hay comprobante" : "Aprobar"}
                        >
                          Aprobar
                        </button>
                        <button
                          className="px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
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
                  <td className="p-4 text-slate-500" colSpan={colSpanNoRows}>
                    No hay resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
