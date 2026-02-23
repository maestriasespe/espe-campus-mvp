import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/session";
import { env } from "@/lib/env";

export async function GET(
  req: Request,
  { params }: { params: { paymentId: string } }
) {
  const session = await getSession();

  // ✅ Admin check correcto
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paymentId = params.paymentId;

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from("payments")
    .select("proof_url")
    .eq("id", paymentId)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Query failed", details: error },
      { status: 500 }
    );
  }

  const proof_url = data?.proof_url as string | null;

  const proof_public_url = proof_url
    ? `${env.SUPABASE_URL}/storage/v1/object/public/payment-proofs/${proof_url}`
    : null;

  return NextResponse.json({ proof_public_url });
}
