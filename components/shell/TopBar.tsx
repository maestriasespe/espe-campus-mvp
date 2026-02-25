"use client";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--espe-border)] bg-black/30 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[980px] items-center justify-between px-4 py-4 md:px-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--espe-muted)]">
            ESPE CAMPUS
          </p>
          <h1 className="mt-1 text-xl font-extrabold md:text-2xl">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-[color:var(--espe-muted)]">{subtitle}</p>
          ) : null}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="h-9 w-9 rounded-full border border-[color:var(--espe-border)] bg-white/5" />
        </div>
      </div>
    </header>
  );
}