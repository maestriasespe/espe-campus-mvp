import { ReactNode } from "react";

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-200">
      <div className="px-5 py-4 border-b border-slate-200">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}
