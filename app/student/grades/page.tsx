"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
  module_id: string;
  code: string;
  name: string;
  grade: number;
  assessment?: string | null;
  graded_at?: string | null;
};

function avgIncludingZeros(rows: Row[]) {
  if (!rows.length) return 0;
  const sum = rows.reduce((acc, r) => acc + (Number(r.grade) || 0), 0);
  return sum / rows.length;
}

export default function StudentGradesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErrorMsg(null);

    const res = await fetch("/api/student/grades", { cache: "no-store" });

    // si NO es JSON, mostrar el html de error (404, etc.)
    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      setErrorMsg(`El API no devolvió JSON (status ${res.status}). Respuesta: ${text.slice(0, 200)}…`);
      setRows([]);
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setErrorMsg(json?.error || "No se pudo cargar");
      setRows([]);
      setLoading(false);
      return;
    }

    setRows(json.rows || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const promedio = useMemo(() => avgIncludingZeros(rows), [rows]);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-3xl font-semibold">Mis calificaciones</h1>
        <div className="text-slate-600 mt-1">
          Promedio (materias sin calificación = 0):{" "}
          <span className="font-semibold">{promedio.toFixed(2)}</span>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="font-semibold text-rose-800">No se pudo cargar</div>
          <div className="text-rose-700 text-sm mt-1">{errorMsg}</div>
          <button
            className="mt-3 px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
            onClick={load}
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="rounded-xl border bg-white overflow-hidden">
        {loading ? (
          <div className="p-6">Cargando…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3">Materia</th>
                <th className="text-right p-3">Calificación</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.module_id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.code}</div>
                  </td>
                  <td className="p-3 text-right font-semibold">{Number(r.grade || 0)}</td>
                </tr>
              ))}

              {rows.length === 0 && !loading && !errorMsg && (
                <tr>
                  <td className="p-4 text-slate-500" colSpan={2}>
                    No hay materias.
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
