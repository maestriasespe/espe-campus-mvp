import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    "https://ftnbkfeqkxcnclsazjpc.supabase.co",
    "sb_publishable_fabv1L2fQuDfJpxPMSDhlQ_F6FDBv3H"
  );
}

