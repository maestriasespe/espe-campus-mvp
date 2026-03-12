import Link from "next/link";
import React from "react";

type Variant = "goldSolid" | "goldOutline" | "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl2 font-semibold transition " +
  "focus:outline-none focus:ring-2 focus:ring-espe-gold/40 disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  goldSolid:
    "bg-espe-gold text-espe-navy hover:brightness-95 border border-espe-gold",
  goldOutline:
    "bg-espe-surface text-espe-navy border border-espe-gold hover:bg-espe-gold/10",

  // aliases (por si luego quieres usar nombres genéricos)
  solid:
    "bg-espe-gold text-espe-navy hover:brightness-95 border border-espe-gold",
  outline:
    "bg-espe-surface text-espe-navy border border-espe-gold hover:bg-espe-gold/10",

  ghost:
    "bg-transparent text-espe-navy hover:bg-espe-gold/10 border border-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  href?: string;
  full?: boolean;
};

export function Button({
  children,
  className = "",
  variant = "goldOutline",
  size = "md",
  href,
  full = false,
  ...props
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${
    full ? "w-full" : ""
  } ${className}`;

  if (href) {
    return (
      <Link className={cls} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

