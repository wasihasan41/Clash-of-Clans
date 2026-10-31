export interface IconUrls {
  small?: string;
  tiny?: string;
  medium?: string;
  large?: string;
}

export interface Unit {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
  equipment?: Unit[];
}

// Purane league system mein "league", naye system mein "leagueTier" aata hai
export interface LeagueRef {
  id?: number;
  name: string;
  iconUrls?: IconUrls;
}

// Player ke data ke andar clan ki chhoti info (clan ke endpoint se nahi aati)
export interface PlayerClanRef {
  tag: string;
  name: string;
  clanLevel: number;
  badgeUrls: IconUrls;
}

export interface Player {
  tag: string;
  name: string;
  townHallLevel: number;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  warStars: number;
  attackWins: number;
  defenseWins: number;
  donations: number;
  donationsReceived: number;
  role?: string;
  clan?: PlayerClanRef;
  league?: LeagueRef;
  leagueTier?: LeagueRef;
  heroes: Unit[];
  troops: Unit[];
  spells: Unit[];
  heroEquipment?: Unit[];
  pets?: Unit[];
}

/* ---------- Battle log (GET /players/{tag}/battlelog) ---------- */

export type BattleType = "HOME_VILLAGE" | "RANKED" | "LEGEND";

export interface Resource {
  name: string;
  amount: number;
}

// Hero ke saath kaun sa equipment laga tha (player ke data se, jab humne battle pehli baar dekhi)
export interface GearSnapshot {
  hero: string;
  heroLevel: number;
  equipment: { name: string; level: number }[];
}

export interface BattleLogEntry {
  battleType: string; // docs: HOME_VILLAGE | RANKED | LEGEND (asli values live data se check karna)
  attack: boolean; // true = attack, false = defense
  armyShareCode?: string;
  opponentPlayerTag?: string;
  stars: number;
  destructionPercentage: number;
  lootedResources?: Resource[];
  extraLootedResources?: Resource[];
  availableLoot?: Resource[];
  // Ye teen fields docs mein nahi hain. ClashKing-style APIs bhejti hain, official API bheje toh use ho jaayenge.
  opponentName?: string;
  opponentTownHallLevel?: number;
  battleTimestamp?: string;
}
