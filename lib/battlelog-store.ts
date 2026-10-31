import { CocError, cocFetch } from "./coc";
import {
  findNewEntries,
  fingerprint,
  gearFromPlayer,
  toEntries,
  type BattleLogResponse,
  type DisplayBattle,
} from "./battlelog";
import { getDb } from "./mongo";
import { encodeTag } from "./tag";
import type { BattleLogEntry, GearSnapshot, Player } from "./types";

export interface StoredBattle extends BattleLogEntry {
  playerTag: string;
  seq: number; // jitna bada number, utni nayi battle
  fingerprint: string;
  gear: GearSnapshot[]; // hero equipment jo battle pehli baar dikhne ke waqt laga tha
  capturedAt: Date; // jab humne pehli baar ye entry dekhi (battle ka asli time nahi)
}

export interface BattleLogResult {
  battles: DisplayBattle[];
  saved: boolean; // true = MongoDB se history aa rahi hai
  error?: string;
}

// tag = bina # ke (jaise "2PP")
export async function fetchLiveBattleLog(tag: string): Promise<BattleLogEntry[]> {
  const response = await cocFetch<BattleLogResponse>(`/players/${encodeTag(tag)}/battlelog`, 0);
  return toEntries(response);
}

const isDuplicateKey = (error: unknown) => (error as { code?: number }).code === 11000;

async function fetchPlayerGear(tag: string): Promise<GearSnapshot[]> {
  try {
    return gearFromPlayer(await cocFetch<Player>(`/players/${encodeTag(tag)}`, 0));
  } catch {
    return []; // gear nahi mila toh bhi battle save honi chahiye
  }
}

// getGear sirf tab chalta hai jab nayi battles hon
async function saveNewEntries(
  tag: string,
  live: BattleLogEntry[],
  getGear: () => Promise<GearSnapshot[]>
): Promise<number> {
  const col = (await getDb()).collection<StoredBattle>("battlelog");
  await col.createIndex({ playerTag: 1, seq: -1 }, { unique: true });

  const playerTag = `#${tag}`;
  const latest = await col
    .find({ playerTag }, { projection: { _id: 0, seq: 1, fingerprint: 1 } })
    .sort({ seq: -1 })
    .limit(50)
    .toArray();

  const fresh = findNewEntries(
    live,
    latest.map((d) => d.fingerprint)
  );
  if (fresh.length === 0) return 0;

  const lastSeq = latest[0]?.seq ?? 0;
  const now = new Date();
  const gear = await getGear();

  // fresh newest-pehle hai, isliye ulta karke sabse purani entry ko sabse chhota naya seq dete hain
  const docs: StoredBattle[] = [...fresh].reverse().map((entry, i) => ({
    ...entry,
    playerTag,
    seq: lastSeq + 1 + i,
    fingerprint: fingerprint(entry),
    gear,
    capturedAt: now,
  }));

  try {
    await col.insertMany(docs, { ordered: false });
  } catch (error) {
    // Do requests ek saath chali toh ek duplicate key par fail hogi, wo theek hai
    if (isDuplicateKey(error)) return 0;
    throw error;
  }
  return docs.length;
}

// /api/track isi ko call karta hai
export async function syncBattleLog(tag: string): Promise<{ fetched: number; added: number }> {
  const live = await fetchLiveBattleLog(tag);
  const added = await saveNewEntries(tag, live, () => fetchPlayerGear(tag));
  return { fetched: live.length, added };
}

async function getStoredBattleLog(tag: string, limit = 100): Promise<StoredBattle[]> {
  const col = (await getDb()).collection<StoredBattle>("battlelog");
  return col
    .find({ playerTag: `#${tag}` }, { projection: { _id: 0 } })
    .sort({ seq: -1 })
    .limit(limit)
    .toArray();
}

// Player page isi ko call karta hai. Ye kabhi throw nahi karta.
// player = page ne jo player data pehle se mangwaya hai (gear ke liye dobara API call nahi lagti)
export async function loadBattleLog(tag: string, player?: Player): Promise<BattleLogResult> {
  let live: BattleLogEntry[];
  try {
    live = await fetchLiveBattleLog(tag);
  } catch (error) {
    return {
      battles: [],
      saved: false,
      error: error instanceof CocError ? error.message : "Could not load the battle log.",
    };
  }

  try {
    await saveNewEntries(tag, live, () =>
      player ? Promise.resolve(gearFromPlayer(player)) : fetchPlayerGear(tag)
    );
    return { battles: await getStoredBattleLog(tag), saved: true };
  } catch {
    // MongoDB set nahi ya band hai: sirf live battles dikhate hain
    return { battles: live, saved: false };
  }
}
