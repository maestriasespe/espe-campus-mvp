import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[color:var(--espe-border)] bg-[color:var(--espe-surface)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      {children}
    </div>
  );
}