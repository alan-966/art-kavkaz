export function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center bg-surface p-[clamp(34px,3.4vw,48px)] text-center">
      <div className="font-display text-[clamp(48px,6vw,80px)] font-normal leading-none text-accent">
        {value}
      </div>
      <div className="mt-4 text-[15px] uppercase tracking-[0.16em] text-muted-2">{label}</div>
    </div>
  );
}
