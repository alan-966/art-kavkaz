import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Webhook receiver for the Wagtail page_published/page_unpublished signal
 * (see backend/core/signals.py). Invalidates the whole site rather than
 * tracking per-page cache dependencies: this is a small brochure site, and a
 * single event/document edit can affect several pages at once (its own page,
 * the section index, and the homepage teaser) — revalidating everything on
 * every publish is simpler and cheap enough to be the right trade-off here.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  let body: { secret?: string; path?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!secret || body.secret !== secret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, path: body.path ?? null });
}
