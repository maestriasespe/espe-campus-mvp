import BackButton from "@/components/BackButton";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">

      {/* HEADER FIJO */}
      <div className="sticky top-0 z-50 bg-white border-b px-4 py-3">
        <BackButton />
      </div>

      {/* CONTENIDO */}
      <main className="mx-auto max-w-xl p-4">
        {children}
      </main>

    </div>
  );
}