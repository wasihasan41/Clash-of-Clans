import { NextResponse } from "next/server";

const LEAGUE_ICON_HOSTS = new Set([
  "api-assets.clashofclans.com",
  "assets.clashofclans.com",
]);
const MAX_ICON_BYTES = 2 * 1024 * 1024;

function imageContentType(image: Uint8Array): string | null {
  if (
    image.length >= 8 &&
    image[0] === 0x89 &&
    image[1] === 0x50 &&
    image[2] === 0x4e &&
    image[3] === 0x47
  ) {
    return "image/png";
  }
  if (image.length >= 3 && image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    image.length >= 12 &&
    image[0] === 0x52 &&
    image[1] === 0x49 &&
    image[2] === 0x46 &&
    image[3] === 0x46 &&
    image[8] === 0x57 &&
    image[9] === 0x45 &&
    image[10] === 0x42 &&
    image[11] === 0x50
  ) {
    return "image/webp";
  }
  if (
    image.length >= 6 &&
    image[0] === 0x47 &&
    image[1] === 0x49 &&
    image[2] === 0x46
  ) {
    return "image/gif";
  }
  return null;
}

export async function GET(request: Request) {
  const source = new URL(request.url).searchParams.get("src");
  if (!source) {
    return NextResponse.json({ error: "League icon URL is required." }, { status: 400 });
  }

  let iconUrl: URL;
  try {
    iconUrl = new URL(source);
  } catch {
    return NextResponse.json({ error: "Invalid league icon URL." }, { status: 400 });
  }

  if (
    iconUrl.protocol !== "https:" ||
    !LEAGUE_ICON_HOSTS.has(iconUrl.hostname) ||
    iconUrl.port
  ) {
    return NextResponse.json({ error: "Invalid league icon URL." }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(iconUrl, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return NextResponse.json({ error: "League icon is unavailable." }, { status: 502 });
  }

  if (!response.ok) {
    return NextResponse.json({ error: "League icon is unavailable." }, { status: 502 });
  }

  const image = await response.arrayBuffer();
  if (image.byteLength > MAX_ICON_BYTES) {
    return NextResponse.json({ error: "League icon is too large." }, { status: 502 });
  }
  const contentType = imageContentType(new Uint8Array(image));
  if (!contentType) {
    return NextResponse.json({ error: "League icon response was not a supported image." }, { status: 502 });
  }

  return new NextResponse(image, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
