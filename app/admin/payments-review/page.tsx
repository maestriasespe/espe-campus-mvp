import { Card } from "@/components/Card";
import { requireRole } from "@/lib/require-session";
import { supabaseServer } from "@/lib/supabase-server";

export default async function AdminHome() {
  await requireRole("admin");
  const [{ count: students }, { count: payments }, { count: grades }] = await Promise.all([
    supabaseServer.from("students").select("*", { count: "exact", head: true }),
    supabaseServer.from("payments").select("*", { count: "exact", head: true }),
    supabaseServer.from("grades").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card title="Alumnos">
        <div className="text-3xl font-bold">{students ?? 0}</div>
      </Card>
      <Card title="Registros de pagos">
        <div className="text-3xl font-bold">{payments ?? 0}</div>
      </Card>
      <Card title="Calificaciones">
        <div className="text-3xl font-bold">{grades ?? 0}</div>
      </Card>

      <div className="md:col-span-3">
        <Card title="Acciones rápidas">
          <div className="flex flex-wrap gap-2">
            <a className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200" href="/admin/import">Importar CSV</a>
            <a className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200" href="/admin/payments">Ver pagos</a>
            <a className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200" href="/admin/grades">Ver calificaciones</a>
          </div>
        </Card>
      </div>
    </div>
  );
}

