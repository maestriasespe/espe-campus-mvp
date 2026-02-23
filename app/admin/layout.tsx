import { BrandBar } from "@/components/BrandBar";
import { Nav } from "@/components/Nav";
import { requireRole } from "@/lib/require-session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("admin");
  return (
    <div className="min-h-screen">
      <BrandBar title={`Administrador (${user.matricula})`} />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Nav role="admin" />
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
