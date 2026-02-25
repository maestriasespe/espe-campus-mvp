"use client";

import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "goldOutline" | "goldSolid" | "ghost";
  full?: boolean;
};

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  variant = "goldOutline",
  full,
  className,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-yellow-500/40";

  const styles: Record<NonNullable<Props["variant"]>, string> = {
    goldOutline:
      "bg-white text-slate-900 border border-yellow-600 hover:bg-yellow-50",
    goldSolid:
      "bg-yellow-600 text-slate-900 border border-yellow-600 hover:brightness-95",
    ghost:
      "bg-transparent text-slate-900 border border-slate-200 hover:bg-slate-100",
  };

  return (
    <button
      className={cn(base, styles[variant], full && "w-full", className)}
      {...props}
    />
  );
}