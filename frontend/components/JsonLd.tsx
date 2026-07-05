export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd(input: {
  name: string;
  url: string;
  logoUrl?: string | null;
  phone: string;
  address: string;
  email: string;
  sameAs: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: input.name,
    url: input.url,
    ...(input.logoUrl ? { logo: input.logoUrl } : {}),
    email: input.email,
    telephone: input.phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: "RU",
      addressLocality: input.address,
    },
    ...(input.sameAs.length ? { sameAs: input.sameAs } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function eventJsonLd(input: {
  name: string;
  description: string;
  url: string;
  startDate: string;
  endDate?: string | null;
  imageUrl?: string | null;
  locationName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    description: input.description,
    url: input.url,
    startDate: input.startDate,
    ...(input.endDate ? { endDate: input.endDate } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    ...(input.imageUrl ? { image: [input.imageUrl] } : {}),
    location: {
      "@type": "Place",
      name: input.locationName,
      address: input.locationName,
    },
  };
}
