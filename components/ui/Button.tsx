"use client";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "goldOutline" | "goldSolid" | "ghost";
  full?: boolean;
};

const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

export function Button({ variant="goldOutline", full, className, ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[color:var(--espe-gold)]/40";

  const styles = {
    goldOutline:
      "border border-[color:var(--espe-gold)] bg-transparent text-white hover:bg-[color:var(--espe-gold)]/10",
    goldSolid:
      "border border-[color:var(--espe-gold)] bg-[color:var(--espe-gold)] text-black hover:brightness-95",
    ghost:
      "border border-[color:var(--espe-border)] bg-white/5 text-white hover:bg-white/10",
  } as const;

  return (
    <button className={cn(base, styles[variant], full && "w-full", className)} {...props} />
  );
}