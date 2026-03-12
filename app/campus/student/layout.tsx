import { BrandBar } from "@/components/BrandBar";
import { Nav } from "@/components/Nav";
import { requireRole } from "@/lib/require-session";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("student");

  return (
    <div className="min-h-screen bg-espe-bg text-espe-text antialiased">
      <BrandBar title={`Alumno ${user.matricula}`} />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <div className="rounded-xl2 border border-espe-line bg-espe-surface shadow-soft p-4 md:p-6">
          <Nav role="student" />
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

