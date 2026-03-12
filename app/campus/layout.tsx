import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import BackButton from "@/components/BackButton";
import LogoutButton from "@/components/LogoutButton";

export default async function CampusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-50 border-b border-espe-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 md:py-5">
          <div className="flex items-center">
            <BackButton />
          </div>

          <div className="flex items-center justify-center">
            <Image
              src="/logo-espe.svg"
              alt="ESPE Campus"
              width={220}
              height={64}
              className="h-12 w-auto md:h-16"
              priority
            />
          </div>

          <div className="flex items-center">
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
