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
        {/* min-w para que en m�vil se pueda deslizar horizontal */}
        <table className="min-w-[780px] w-full text-sm">
          <thead className="text-left text-espe-muted">
            <tr>
              <th className="py-3 pr-4">Concepto</th>
              <th className="py-3 pr-4">Monto</th>
              <th className="py-3 pr-4">Vence</th>
              <th className="py-3 pr-4">Estatus</th>
              <th className="py-3 pr-4">Comprobante</th>
            </tr>
          </thead>

          <tbody>
            {(rows ?? []).map((r: any) => (
              <tr key={r.id} className="border-t border-espe-line">
                <td className="py-3 pr-4 text-espe-text">{r.concept}</td>

                <td className="py-3 pr-4 text-espe-text">
                  {Number(r.amount).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </td>

                <td className="py-3 pr-4 text-espe-text">
                  {r.due_date ? new Date(r.due_date).toLocaleDateString("es-MX") : "�"}
                </td>

                <td className="py-3 pr-4">
                  <span
                    className={
                      "inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold " +
                      (r.status === "paid"
                        ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-200"
                        : r.status === "overdue"
                        ? "border-rose-300/40 bg-rose-500/10 text-rose-200"
                        : "border-amber-300/40 bg-amber-500/10 text-amber-200")
                    }
                  >
                    {r.status === "paid"
                      ? "Pagado"
                      : r.status === "overdue"
                      ? "Vencido"
                      : "Pendiente"}
                  </span>
                </td>

                <td className="py-3 pr-4">
                  {r.proof_url ? (
                    <a
                      className="inline-flex items-center rounded-lg border border-espe-gold/40 px-3 py-1.5 text-xs font-semibold text-espe-text hover:bg-espe-gold/10"
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
              </tr>
            ))}

            {(!rows || rows.length === 0) && (
              <tr>
                <td className="py-4 text-espe-muted" colSpan={5}>
                  No hay pagos cargados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

