const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatEventDate(dateStart: string, dateEnd?: string | null): string {
  const start = dateFormatter.format(new Date(dateStart));
  if (!dateEnd || dateEnd === dateStart) return start;
  const end = dateFormatter.format(new Date(dateEnd));
  return `${start} — ${end}`;
}
