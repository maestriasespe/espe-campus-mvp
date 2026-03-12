"use client";

import { useState } from "react";

type Kind = "students" | "modules" | "grades" | "payments";

export default function ImportPage() {
  const [kind, setKind] = useState<Kind>("students");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string>("");

  async function submit() {
    if (!file) return;
    setMsg("Subiendo...");
    const fd = new FormData();
    fd.append("kind", kind);
    fd.append("file", file);

    const res = await fetch("/api/admin/import", { method: "POST", body: fd });
    const text = await res.text();
    setMsg(text);
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
      <h1 className="text-xl font-semibold">Importar CSV</h1>
      <p className="text-sm text-slate-600 mt-1">
        Sube archivos CSV desde Excel. (MVP) Validación básica.
      </p>

      <div className="mt-5 grid gap-3">
        <label className="text-sm font-medium">Tipo</label>
        <select className="rounded-xl border border-slate-300 px-3 py-2" value={kind} onChange={e => setKind(e.target.value as Kind)}>
          <option value="students">Alumnos</option>
          <option value="modules">Módulos</option>
          <option value="grades">Calificaciones</option>
          <option value="payments">Pagos</option>
        </select>

        <label className="text-sm font-medium mt-2">Archivo CSV</label>
        <input type="file" accept=".csv,text/csv" onChange={e => setFile(e.target.files?.[0] ?? null)} />

        <button
          onClick={submit}
          className="mt-3 rounded-xl bg-navy text-white py-2 font-semibold disabled:opacity-50"
          disabled={!file}
        >
          Importar
        </button>

        {msg && <div className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{msg}</div>}
      </div>

      <div className="mt-6 text-sm text-slate-600">
        Plantillas en <code className="bg-slate-100 px-2 py-1 rounded">/templates</code>.
      </div>
    </div>
  );
}

