import { Card } from "@/components/Card";
import { requireRole } from "@/lib/require-session";
import { supabaseServer } from "@/lib/supabase-server";

export default async function StudentDashboard() {
  const user = await requireRole("student");
  const studentId = user.studentId!;

  const [{ count: pendingPayments }, { count: pendingTasks }] = await Promise.all([
    supabaseServer.from("payments").select("*", { count: "exact", head: true }).eq("student_id", studentId).in("status", ["pending","overdue"]),
    supabaseServer.from("assignments").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);

  const { data: avgRow } = await supabaseServer
    .from("grades")
    .select("grade")
    .eq("student_id", studentId);

  const avg = avgRow && avgRow.length ? (avgRow.reduce((a:any,b:any)=>a+(b.grade??0),0)/avgRow.length) : null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card title="Promedio aproximado">
        <div className="text-3xl font-bold">{avg ? avg.toFixed(1) : "—"}</div>
        <div className="text-sm text-slate-600 mt-1">Basado en calificaciones capturadas.</div>
      </Card>
      <Card title="Pagos pendientes">
        <div className="text-3xl font-bold">{pendingPayments ?? 0}</div>
        <div className="text-sm text-slate-600 mt-1">Revisa en la sección Pagos.</div>
      </Card>
      <Card title="Tareas">
        <div className="text-3xl font-bold">{pendingTasks ?? 0}</div>
        <div className="text-sm text-slate-600 mt-1">Consulta tareas activas.</div>
      </Card>

      <div className="md:col-span-3">
        <Card title="Accesos rápidos">
          <div className="flex flex-wrap gap-2">
            <a className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200" href="/student/grades">Ver calificaciones</a>
            <a className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200" href="/student/tasks">Ver tareas</a>
            <a className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200" href="/student/payments">Ver pagos</a>
          </div>
        </Card>
      </div>
    </div>
  );
}
