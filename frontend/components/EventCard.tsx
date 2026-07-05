import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "@/lib/api";
import { formatEventDate } from "@/lib/format";
import type { EventSummary } from "@/lib/types";

export function EventCard({ event }: { event: EventSummary }) {
  const imageUrl = mediaUrl(event.cover_image?.url);

  return (
    <Link href={`/sobytiya/${event.meta.slug}`} className="group block">
      <div className="relative mb-[22px] h-[300px] overflow-hidden bg-gradient-to-br from-surface-mist to-[#b4cae3]">
        {imageUrl && (
          <Image src={imageUrl} alt={event.title} fill className="object-cover" />
        )}
      </div>
      <div className="mb-3.5 flex items-center gap-3.5 text-[11.5px] uppercase tracking-[0.14em]">
        {event.category_name && <span className="text-blue">{event.category_name}</span>}
        <span className="h-1 w-1 rotate-45 bg-[#c2d4e8]" />
        <span className="font-mono text-muted-3">{formatEventDate(event.date_start, event.date_end)}</span>
      </div>
      <h3 className="m-0 mb-2.5 font-display text-[23px] font-medium uppercase leading-[1.25] text-ink transition-colors group-hover:text-blue">
        {event.title}
      </h3>
      {event.excerpt && (
        <p className="m-0 text-[14.5px] font-light leading-[1.6] text-muted">{event.excerpt}</p>
      )}
    </Link>
  );
}
