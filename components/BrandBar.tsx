export function BrandBar({ title }: { title: string }) {
  return (
    <div className="border-b border-espe-gold/20 bg-espe-bg2/60 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-espe-gold text-xs tracking-[0.28em] uppercase">
              ESPE
            </div>
            <div className="text-sm text-espe-muted -mt-0.5">{title}</div>
          </div>

          <div className="text-[11px] text-espe-muted/90 tracking-wide">
            Escuela Superior de Procesos Electorales
          </div>
        </div>
      </div>
    </div>
  );
}

