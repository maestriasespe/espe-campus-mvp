"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { label: string; href: string };

export function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[color:var(--espe-border)] bg-black/40 backdrop-blur md:hidden">
      <div className="mx-auto grid w-full max-w-[980px] grid-cols-5 gap-1 px-2 py-2">
        {items.slice(0, 5).map((it) => {
          const active = pathname?.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={[
                "rounded-2xl px-2 py-3 text-center text-[11px] font-semibold transition",
                active
                  ? "border border-[color:var(--espe-gold)] bg-[color:var(--espe-surface2)] text-white"
                  : "border border-transparent text-[color:var(--espe-muted)] hover:bg-white/5",
              ].join(" ")}
            >
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

