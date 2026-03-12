import { Card } from "@/components/Card";
import { requireRole } from "@/lib/require-session";
import { supabaseServer } from "@/lib/supabase-server";

export default async function StudentTasks() {
  await requireRole("student");

  const { data: tasks } = await supabaseServer
    .from("assignments")
    .select("id,title,description,due_date,is_active")
    .eq("is_active", true)
    .order("due_date", { ascending: true });

  return (
    <Card title="Tareas activas">
      <div className="space-y-4">
        {(tasks ?? []).map((t: any) => (
          <div key={t.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{t.description}</div>
              </div>
              <div className="text-xs text-slate-600 shrink-0">
                {t.due_date ? <>Entrega: <b>{new Date(t.due_date).toLocaleDateString("es-MX")}</b></> : "Sin fecha"}
              </div>
            </div>
            <div className="mt-3 text-sm text-slate-600">
              (MVP) Entregas por archivo se habilitan en fase 2.
            </div>
          </div>
        ))}
        {(!tasks || tasks.length === 0) && <div className="text-slate-500">No hay tareas activas.</div>}
      </div>
    </Card>
  );
}
