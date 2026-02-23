"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Row = {
  subject_id: string;
  subject_name: string;
  grade: number | null;
};

export default function StudentGradesPage() {
  const params = useParams();
  const studentId = params.id as string;

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/admin/students/${studentId}/grades`,
        { cache: "no-store" }
      );

      const j = await res.json();
      setRows(j.rows || []);
      setLoading(false);
    }

    if (studentId) load();
  }, [studentId]);

  if (loading) return <div className="p-6">Cargando…</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Calificaciones del Alumno
      </h1>

      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3">Materia</th>
              <th className="text-left p-3">Calificación</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.subject_id} className="border-t">
                <td className="p-3">{r.subject_name}</td>
                <td className="p-3">
                  {r.grade !== null ? r.grade : "—"}
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={2} className="p-4 text-slate-500">
                  No hay materias registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
