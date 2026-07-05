import type { Metadata } from "next";
import { getDocumentsPage, mediaUrl } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDocumentsPage();
  return buildMetadata(page, "/o-fonde/dokumenty", {
    description: "Устав, свидетельство о регистрации и другие документы фонда «АРТ-Кавказ».",
  });
}

export default async function DocumentsPage() {
  const page = await getDocumentsPage();

  return (
    <section className="mx-auto max-w-[1320px] px-[clamp(20px,4vw,48px)] py-[clamp(50px,6vw,80px)]">
      <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        {page.documents.map((doc) => {
          const fileUrl = mediaUrl(doc.file_url);
          const content = (
            <div className="flex items-start gap-[18px] border border-blue/[0.16] bg-surface-soft p-[26px] transition-colors hover:border-blue/45">
              <span
                className={
                  doc.file_type_label === "PDF"
                    ? "bg-blue px-[9px] py-1.5 font-mono text-[11px] font-bold tracking-[0.06em] text-surface-tint"
                    : "border border-blue/50 px-2 py-1 font-mono text-[11px] font-bold tracking-[0.06em] text-navy"
                }
              >
                {doc.file_type_label}
              </span>
              <div className="flex-1">
                <h3 className="m-0 mb-2 font-sans text-[16.5px] font-medium uppercase leading-[1.35] text-ink">
                  {doc.title}
                </h3>
                <div className="mt-3.5">
                  <div className="font-mono text-xs text-muted-3">
                    {doc.published_date?.slice(0, 4)} {doc.size_note && `· ${doc.size_note}`}
                  </div>
                  <div className="mt-3 border-t border-blue/[0.16] pt-3 text-xs font-semibold uppercase tracking-[0.12em] text-navy">
                    {doc.action_label === "view" ? "Просмотр ↗" : "Скачать ↓"}
                  </div>
                </div>
              </div>
            </div>
          );

          return fileUrl ? (
            <a key={doc.id} href={fileUrl} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          ) : (
            <div key={doc.id}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
