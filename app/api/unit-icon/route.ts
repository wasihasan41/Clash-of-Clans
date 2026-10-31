import { NextResponse } from "next/server";
import { iconCandidates, type UnitKind } from "@/lib/icons";

const UNIT_KINDS = new Set<UnitKind>([
  "hero",
  "troop",
  "siege",
  "spell",
  "equipment",
  "pet",
]);
const VALID_NAME = /^[a-zA-Z0-9][a-zA-Z0-9 .'’?-]{0,79}$/;
const MAX_ICON_BYTES = 2 * 1024 * 1024;
const ICON_HOST = "assets.clashk.ing";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") as UnitKind | null;
  const name = url.searchParams.get("name")?.trim();

  if (!kind || !UNIT_KINDS.has(kind) || !name || !VALID_NAME.test(name)) {
    return NextResponse.json({ error: "Invalid icon request." }, { status: 400 });
  }

  for (const candidate of iconCandidates(kind, name)) {
    let iconUrl: URL;
    try {
      iconUrl = new URL(candidate);
    } catch {
      continue;
    }
    if (
      iconUrl.protocol !== "https:" ||
      iconUrl.hostname !== ICON_HOST ||
      iconUrl.port
    ) {
      continue;
    }

    try {
      const response = await fetch(iconUrl, {
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) continue;

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.startsWith("image/")) continue;
      const image = await response.arrayBuffer();
      if (image.byteLength > MAX_ICON_BYTES) continue;

      return new NextResponse(image, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch {
      // Try the next known icon URL if this one is unavailable.
    }
  }

  return NextResponse.json({ error: "Unit icon not found." }, { status: 404 });
}
