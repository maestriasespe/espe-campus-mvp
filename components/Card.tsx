export function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl2 border border-espe-line bg-espe-surface shadow-soft p-5">
      <div className="text-sm font-bold text-espe-navy">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}