import type { Player } from "./types";

export interface LeagueInfo {
  name: string;
  icon: string | null;
}

// Naya system "leagueTier" deta hai, isliye wo pehle dekhte hain.
// Sirf "leagueTier" na mile tab purana "league" use hota hai.
export function getLeague(player: Pick<Player, "league" | "leagueTier">): LeagueInfo | null {
  const league = player.leagueTier ?? player.league;
  if (!league) return null;

  const icons = league.iconUrls;
  return {
    name: league.name,
    icon:
      [icons?.small, icons?.medium, icons?.large, icons?.tiny].find(
        (url) => typeof url === "string" && url.trim().length > 0,
      ) ?? null,
  };
}