"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavProps = {
  role: "student" | "admin";
};

export function Nav({ role }: NavProps) {
  const pathname = usePathname();

  const items =
    role === "admin"
      ? [
          { href: "/admin", label: "Panel" },
          { href: "/admin/import", label: "Importar CSV" },
          { href: "/admin/payments", label: "Pagos" },
          { href: "/admin/grades", label: "Calificaciones" },
        ]
      : [
          { href: "/campus/student", label: "Inicio" },
          { href: "/campus/student/grades", label: "Calificaciones" },
          { href: "/campus/student/tasks", label: "Tareas" },
          { href: "/campus/payments", label: "Pagos" },
          { href: "/campus/events", label: "Eventos" },
          { href: "/campus/calendar", label: "Calendario" },
        ];

  function isActive(href: string) {
    if (href === "/campus/student") {
      return pathname === "/campus" || pathname === "/campus/student";
    }

    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="overflow-x-auto">
      <div className="flex min-w-max gap-2 rounded-2xl border border-espe-line bg-white/80 p-2 shadow-soft backdrop-blur">
        {items.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-espe-gold via-espe-gold2 to-espe-gold text-white shadow-md"
                  : "bg-espe-surface text-espe-navy hover:bg-espe-gold/10",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
