"use client";

import React from "react";
import { TopBar } from "./TopBar";
import { BottomNav, NavItem } from "./BottomNav";

export function AppShell({
  title,
  subtitle,
  nav,
  children,
}: {
  title: string;
  subtitle?: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_500px_at_20%_-10%,rgba(200,162,74,0.18),transparent_55%),radial-gradient(900px_450px_at_90%_0%,rgba(255,255,255,0.08),transparent_60%),linear-gradient(180deg,var(--espe-bg),#070709)] text-[color:var(--espe-text)]">
      <TopBar title={title} subtitle={subtitle} />

      {/* Contenido centrado */}
      <main className="mx-auto w-full max-w-[980px] px-4 pb-24 pt-5 md:px-6">
        {children}
      </main>

      {/* Nav inferior móvil */}
      <BottomNav items={nav} />
    </div>
  );
}

