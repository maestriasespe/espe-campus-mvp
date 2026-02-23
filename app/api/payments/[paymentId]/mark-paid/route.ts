import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession } from "@/lib/session";
import { env } from "@/lib/env";

export async function POST(
  req: Request,
  { params }: { params: { paymentId: string } }
) {
  const session = await getSession();

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { error } = await supabase
    .from("payments")
    .update({ status: "approved" })
    .eq("id", params.paymentId);

  if (error) {
    return NextResponse.json({ error: "Update failed", details: error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
