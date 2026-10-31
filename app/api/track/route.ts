import { NextResponse } from "next/server";
import { syncBattleLog } from "@/lib/battlelog-store";
import { isValidTag, normalizeTag } from "@/lib/tag";

export const dynamic = "force-dynamic";

interface TrackResult {
  tag: string;
  fetched?: number;
  added?: number;
  error?: string;
}

export async function GET(request: Request) {
  const secret = process.env.TRACK_SECRET;
  const url = new URL(request.url);
  const provided =
    request.headers.get("authorization")?.replace("Bearer ", "") ?? url.searchParams.get("secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tags = (process.env.TRACK_PLAYER_TAGS ?? "")
    .split(",")
    .map(normalizeTag)
    .filter(isValidTag);

  if (tags.length === 0) {
    return NextResponse.json({ error: "TRACK_PLAYER_TAGS is empty" }, { status: 400 });
  }

  const results: TrackResult[] = [];
  for (const tag of tags) {
    try {
      results.push({ tag: `#${tag}`, ...(await syncBattleLog(tag)) });
    } catch (error) {
      results.push({
        tag: `#${tag}`,
        error: error instanceof Error ? error.message : "Tracking failed",
      });
    }
  }

  return NextResponse.json({ ok: true, results });
}
