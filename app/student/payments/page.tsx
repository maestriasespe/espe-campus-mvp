import { Card } from "@/components/Card";
import { requireRole } from "@/lib/require-session";
import { supabaseServer } from "@/lib/supabase-server";
import UploadProof from "@/components/UploadProof";

export default async function StudentPayments() {
  const user = await requireRole("student");
  const studentId = user.studentId!;

  const { data: rows } = await supabaseServer
    .from("payments")
    .select("id,concept,amount,due_date,status,proof_url")
    .eq("student_id", studentId)
    .order("due_date", { ascending: true });

  return (
    <Card title="Pagos">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-600">
            <tr>
              <th className="py-2">Concepto</th>
              <th className="py-2">Monto</th>
              <th className="py-2">Vence</th>
              <th className="py-2">Estatus</th>
              <th className="py-2">Comprobante</th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="py-2">{r.concept}</td>
                <td className="py-2">${Number(r.amount).toFixed(2)}</td>
                <td className="py-2">{r.due_date ? new Date(r.due_date).toLocaleDateString("es-MX") : ""}</td>
                <td className="py-2">
                  <span className={
                    "px-2 py-1 rounded-lg text-xs " +
                    (r.status === "paid" ? "bg-emerald-100 text-emerald-800" :
                     r.status === "overdue" ? "bg-rose-100 text-rose-800" :
                     "bg-amber-100 text-amber-800")
                  }>
                    {r.status === "paid" ? "Pagado" : r.status === "overdue" ? "Vencido" : "Pendiente"}
                  </span>
                </td>
                <td className="py-2">
<td>
  {r.proof_url ? (
    <a
      className="text-navy underline"
      href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/payment-proofs/${r.proof_url}`}
      target="_blank"
      rel="noreferrer"
    >
      Ver
    </a>
  ) : (
    <UploadProof paymentId={r.id} />
  )}
</td>
                </td>
              </tr>
            ))}
            {(!rows || rows.length === 0) && (
              <tr><td className="py-3 text-slate-500" colSpan={5}>No hay pagos cargados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}


