import Link from "next/link";

export function Nav({ role }: { role: "student" | "admin" }) {
  const items = role === "admin"
    ? [
        { href: "/admin", label: "Panel" },
        { href: "/admin/import", label: "Importar CSV" },
        { href: "/admin/payments", label: "Pagos" },
        { href: "/admin/grades", label: "Calificaciones" },
        { href: "/logout", label: "Salir" },
      ]
    : [
        { href: "/campus/student", label: "Inicio" },
        { href: "/campus/student/grades", label: "Calificaciones" },
        { href: "/campus/student/tasks", label: "Tareas" },
        { href: "/campus/student/payments", label: "Pagos" },
        { href: "/logout", label: "Salir" },
      ];
  return (
    <nav className="flex flex-wrap gap-2">
      {items.map(i => (
        <Link
          key={i.href}
          href={i.href}
          className="px-3 py-2 rounded-xl text-sm bg-slate-100 hover:bg-slate-200 transition"
        >
          {i.label}
        </Link>
      ))}
    </nav>
  );
}

