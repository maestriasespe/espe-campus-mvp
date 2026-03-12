"use client";

import { useEffect, useState } from "react";

type Row = {
  module_id: string;
  code: string;
  module_name: string;
  grade: number;
};

function moneyOrNumber(n: any) {
  const v = Number(n || 0);
  return Number.isFinite(v) ? v : 0;
}

export default function AdminStudentGradesPage({ params }: { params: { id: string } }) {
  const studentId = params.id;

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);

    const res = await fetch(`/api/admin/students/${studentId}/grades`, { cache: "no-store" });

    // si no es JSON, muestra texto
    const text = await res.text();
    let j: any = null;
    try {
      j = JSON.parse(text);
    } catch {
      setErr(`El API no devolvió JSON (status ${res.status}). Respuesta: ${text.slice(0, 200)}…`);
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setErr(j?.error || "No se pudo cargar");
      setLoading(false);
      return;
    }

    setRows(j.rows || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  if (loading) return <div className="p-6">Cargando…</div>;

  if (err) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-lg font-semibold text-rose-700">No se pudo cargar</div>
          <div className="text-sm text-slate-600 mt-2">{err}</div>
          <button
            onClick={load}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Calificaciones del alumno</h1>
        <a className="text-sm underline text-slate-700" href="/admin/grades">
          ← Volver
        </a>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3">Código</th>
              <th className="text-left p-3">Materia</th>
              <th className="text-left p-3">Calificación</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.module_id} className="border-t">
                <td className="p-3">{r.code}</td>
                <td className="p-3">{r.module_name}</td>
                <td className="p-3 font-semibold">{moneyOrNumber(r.grade)}</td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-slate-500">
                  No hay materias registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-500">
        * Si no existe calificación en la tabla <code>grades</code> para una materia, se muestra <b>0</b>.
      </div>
    </div>
  );
}

