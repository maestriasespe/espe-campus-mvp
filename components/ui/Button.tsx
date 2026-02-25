"use client";

import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "goldOutline" | "goldSolid" | "ghost";
  full?: boolean;
};

export function Button({
  variant = "goldOutline",
  full,
  className,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl2 px-4 py-3 text-sm font-semibold transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-espe-gold/40";

  const styles: Record<string, string> = {
    goldOutline:
      "bg-espe-surface text-espe-navy border border-espe-gold hover:bg-espe-gold/10",
    goldSolid:
      "bg-espe-gold text-espe-navy border border-espe-gold hover:brightness-95",
    ghost:
      "bg-transparent text-espe-navy border border-espe-line hover:bg-espe-line/40",
  };

  return (
    <button
      className={clsx(base, styles[variant], full && "w-full", className)}
      {...props}
    />
  );
}