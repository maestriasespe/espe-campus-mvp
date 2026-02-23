export function BrandBar({ title }: { title: string }) {
  return (
    <div className="w-full bg-navy text-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gold/20 border border-gold/40 flex items-center justify-center">
            <span className="text-gold font-bold">E</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm text-white/80">ESPE</div>
            <div className="font-semibold">{title}</div>
          </div>
        </div>
        <div className="text-xs text-white/70">Campus</div>
      </div>
    </div>
  );
}
