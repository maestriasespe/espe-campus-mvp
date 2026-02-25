import Link from "next/link";
import { Card } from "@/components/Card";
import { requireRole } from "@/lib/require-session";
import { supabaseServer } from "@/lib/supabase-server";

export default async function StudentDashboard() {
  const user = await requireRole("student");
  const studentId = user.studentId!;

  const [{ count: pendingPayments }, { count: pendingTasks }] = await Promise.all([
    supabaseServer
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("student_id", studentId)
      .in("status", ["pending", "overdue"]),
    supabaseServer
      .from("assignments")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  const { data: avgRow } = await supabaseServer
    .from("grades")
    .select("grade")
    .eq("student_id", studentId);

  const avg =
    avgRow && avgRow.length
      ? avgRow.reduce((a: any, b: any) => a + (b.grade ?? 0), 0) / avgRow.length
      : null;

  return (
    <div className="grid gap-5">
      {/* Encabezado */}
      <div className="rounded-xl2 border border-espe-line bg-espe-surface shadow-soft p-5 md:p-6">
        <p className="text-xs font-semibold tracking-wide text-espe-muted">
          ESPE CAMPUS • ALUMNO
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-espe-navy">
          Panel del estudiante
        </h1>
        <p className="mt-2 text-sm md:text-base text-espe-muted">
          Accesos rápidos y resumen de tu progreso.
        </p>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Promedio aproximado">
          <div className="text-4xl font-extrabold tracking-tight text-espe-navy">
            {avg ? avg.toFixed(1) : "—"}
          </div>
          <div className="text-sm text-espe-muted mt-2">
            Basado en calificaciones capturadas.
          </div>
        </Card>

        <Card title="Pagos pendientes">
          <div className="text-4xl font-extrabold tracking-tight text-espe-navy">
            {pendingPayments ?? 0}
          </div>
          <div className="text-sm text-espe-muted mt-2">
            Revisa en la sección Pagos.
          </div>
        </Card>

        <Card title="Tareas activas">
          <div className="text-4xl font-extrabold tracking-tight text-espe-navy">
            {pendingTasks ?? 0}
          </div>
          <div className="text-sm text-espe-muted mt-2">
            Consulta tareas activas.
          </div>
        </Card>
      </div>

      {/* Accesos rápidos */}
      <Card title="Accesos rápidos">
        <div className="grid gap-3 md:grid-cols-3">
          <Link
            className="w-full rounded-xl2 border border-espe-gold bg-espe-surface px-4 py-3 text-center text-sm font-semibold text-espe-navy hover:bg-espe-gold/10 transition"
            href="/student/grades"
          >
            Ver calificaciones
          </Link>

          <Link
            className="w-full rounded-xl2 border border-espe-gold bg-espe-surface px-4 py-3 text-center text-sm font-semibold text-espe-navy hover:bg-espe-gold/10 transition"
            href="/student/tasks"
          >
            Ver tareas
          </Link>

          <Link
            className="w-full rounded-xl2 border border-espe-gold bg-espe-gold px-4 py-3 text-center text-sm font-semibold text-espe-navy hover:brightness-95 transition"
            href="/student/payments"
          >
            Ver pagos
          </Link>
        </div>
      </Card>
    </div>
  );
}
