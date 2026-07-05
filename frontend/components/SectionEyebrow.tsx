export function SectionEyebrow({ children }: { children: string }) {
  return (
    <div className="mb-5 flex items-center gap-3.5">
      <span className="h-[3px] w-12 bg-accent" />
      <span className="text-sm font-semibold uppercase tracking-[0.32em] text-blue">{children}</span>
    </div>
  );
}
