import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BackButton from "@/components/BackButton";
import LogoutButton from "@/components/LogoutButton";

export default async function CampusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;

  try {
    const supabase = await createClient();

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    user = currentUser;
  } catch (error) {
    console.error("Error en CampusLayout:", error);
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <BackButton />
          </div>

          <div className="flex items-center justify-center">
            <Image
              src="/logo-espe.svg"
              alt="ESPE Campus"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </div>

          <div className="flex items-center">
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}