import type { BattleLogEntry, BattleType, GearSnapshot, Player, Resource } from "./types";

// Docs mein response ka shape "BattleLogEntryList" likha hai, par array hai ya { items }
// ye pakka nahi pata, isliye dono handle karte hain.
export type BattleLogResponse = BattleLogEntry[] | { items?: BattleLogEntry[] };

export type DisplayBattle = BattleLogEntry & { capturedAt?: Date; gear?: GearSnapshot[] };

export function toEntries(response: BattleLogResponse): BattleLogEntry[] {
  if (Array.isArray(response)) return response;
  return response.items ?? [];
}

const resourceText = (list?: Resource[]) =>
  (list ?? []).map((r) => `${r.name}:${r.amount}`).join(",");

// API entry ko koi id ya time nahi deti, isliye entry ke fields se ek "fingerprint" banate hain
export function fingerprint(e: BattleLogEntry): string {
  return [
    e.battleType,
    e.attack ? "A" : "D",
    e.opponentPlayerTag ?? "",
    e.stars,
    e.destructionPercentage,
    e.armyShareCode ?? "",
    resourceText(e.lootedResources),
    resourceText(e.extraLootedResources),
    resourceText(e.availableLoot),
    e.battleTimestamp ?? "",
  ].join("|");
}

// fetched aur known dono NEWEST PEHLE hain (ye order maana hua hai, live data se verify karna hai).
// Jo entries pehle se saved nahi hain, unhe nikalta hai.
export function findNewEntries(fetched: BattleLogEntry[], known: string[]): BattleLogEntry[] {
  if (known.length === 0) return fetched;

  const prints = fetched.map(fingerprint);
  const minOverlap = Math.min(3, known.length, prints.length);

  for (let i = 0; i < prints.length; i++) {
    const rest = prints.slice(i);
    const n = Math.min(rest.length, known.length);
    if (n < minOverlap) break;
    if (rest.slice(0, n).every((print, j) => print === known[j])) return fetched.slice(0, i);
  }
  // Koi overlap nahi mila: ya toh bohot saari nayi battles hui, ya log badal gaya. Sab nayi maan lete hain.
  return fetched;
}

export const BATTLE_TYPE_LABELS: Record<BattleType, string> = {
  HOME_VILLAGE: "Home village",
  RANKED: "Ranked",
  LEGEND: "Legend",
};

// Docs mein battleType ke values HOME_VILLAGE / RANKED / LEGEND likhe hain, par asli API
// capital letters ya alag spelling bhej sakti hai (jaise "ranked", "homeVillage").
// Isliye lowercase karke dhoondhte hain, taaki filter tabs sahi kaam karein.
export function normalizeBattleType(value: string | undefined): BattleType | null {
  const v = (value ?? "").toLowerCase();
  if (v.includes("legend")) return "LEGEND";
  if (v.includes("rank")) return "RANKED";
  if (v.includes("home")) return "HOME_VILLAGE";
  return null;
}

// Pehchana hua type ho toh uska naam, warna API ka asli text dikhate hain
export function battleTypeLabel(value: string | undefined): string {
  const type = normalizeBattleType(value);
  return type ? BATTLE_TYPE_LABELS[type] : (value ?? "Unknown");
}

export const stars = (n: number) => "★".repeat(n) + "☆".repeat(Math.max(0, 3 - n));

// Army share code se army link. Ye format mere yaad ke hisaab se hai, live check nahi kiya.
export const armyLink = (code: string) =>
  `https://link.clashofclans.com/en?action=CopyArmy&army=${encodeURIComponent(code)}`;

export function lootSummary(e: BattleLogEntry): string[] {
  return [...(e.lootedResources ?? []), ...(e.extraLootedResources ?? [])]
    .filter((r) => r.amount > 0)
    .map((r) => `${r.name} ${r.amount.toLocaleString("en-IN")}`);
}

// Player ke data se: har hero ke saath kaun sa equipment laga hai
export function gearFromPlayer(player: Pick<Player, "heroes">): GearSnapshot[] {
  return (player.heroes ?? [])
    .filter((h) => h.village === "home")
    .map((h) => ({
      hero: h.name,
      heroLevel: h.level,
      equipment: (h.equipment ?? []).map((e) => ({ name: e.name, level: e.level })),
    }));
}

// API ka time "20250101T120000.000Z" jaisa hota hai
export function parseCocTime(s: string): Date {
  const iso = `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(9, 11)}:${s.slice(11, 13)}:${s.slice(13)}`;
  return new Date(iso);
}
