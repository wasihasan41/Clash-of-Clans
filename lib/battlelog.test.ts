import { describe, expect, it } from "vitest";
import {
  battleTypeLabel,
  findNewEntries,
  fingerprint,
  gearFromPlayer,
  lootSummary,
  normalizeBattleType,
  parseCocTime,
  stars,
  toEntries,
} from "./battlelog";
import type { BattleLogEntry } from "./types";

const entry = (opponent: string, stars = 3, attack = true): BattleLogEntry => ({
  battleType: "LEGEND",
  attack,
  opponentPlayerTag: opponent,
  stars,
  destructionPercentage: 100,
  armyShareCode: "code",
  lootedResources: [{ name: "Gold", amount: 100 }],
});

const prints = (list: BattleLogEntry[]) => list.map(fingerprint);
const tags = (list: BattleLogEntry[]) => list.map((e) => e.opponentPlayerTag);

describe("toEntries", () => {
  it("accepts a plain array", () => {
    expect(toEntries([entry("#A")])).toHaveLength(1);
  });

  it("accepts an { items } object and a missing items field", () => {
    expect(toEntries({ items: [entry("#A"), entry("#B")] })).toHaveLength(2);
    expect(toEntries({})).toEqual([]);
  });
});

describe("fingerprint", () => {
  it("is the same for the same battle and different otherwise", () => {
    expect(fingerprint(entry("#A"))).toBe(fingerprint(entry("#A")));
    expect(fingerprint(entry("#A"))).not.toBe(fingerprint(entry("#B")));
    expect(fingerprint(entry("#A", 3))).not.toBe(fingerprint(entry("#A", 2)));
  });
});

describe("findNewEntries (newest first)", () => {
  const live = [entry("#E"), entry("#D"), entry("#C"), entry("#B"), entry("#A")];

  it("treats everything as new when nothing is saved", () => {
    expect(findNewEntries(live, [])).toEqual(live);
  });

  it("returns nothing when the saved history already matches", () => {
    expect(findNewEntries(live, prints(live))).toEqual([]);
  });

  it("finds only the newer battles", () => {
    const saved = prints([entry("#C"), entry("#B"), entry("#A")]);
    expect(tags(findNewEntries(live, saved))).toEqual(["#E", "#D"]);
  });

  it("treats everything as new when there is no overlap", () => {
    const saved = prints([entry("#X"), entry("#Y"), entry("#Z")]);
    expect(findNewEntries(live, saved)).toEqual(live);
  });

  it("works when the saved list is longer than the live list", () => {
    const saved = prints([
      entry("#E"),
      entry("#D"),
      entry("#C"),
      entry("#B"),
      entry("#A"),
      entry("#0"),
    ]);
    expect(findNewEntries(live, saved)).toEqual([]);
  });
});

describe("helpers", () => {
  it("draws stars", () => {
    expect(stars(2)).toBe("★★☆");
  });

  it("summarises loot and skips zero amounts", () => {
    const e = { ...entry("#A"), extraLootedResources: [{ name: "Elixir", amount: 0 }] };
    expect(lootSummary(e)).toEqual(["Gold 100"]);
  });
});

describe("normalizeBattleType", () => {
  it("understands the documented values", () => {
    expect(normalizeBattleType("HOME_VILLAGE")).toBe("HOME_VILLAGE");
    expect(normalizeBattleType("RANKED")).toBe("RANKED");
    expect(normalizeBattleType("LEGEND")).toBe("LEGEND");
  });

  it("understands other spellings and cases", () => {
    expect(normalizeBattleType("ranked")).toBe("RANKED");
    expect(normalizeBattleType("homeVillage")).toBe("HOME_VILLAGE");
    expect(normalizeBattleType("Legend League")).toBe("LEGEND");
  });

  it("returns null for unknown or missing values", () => {
    expect(normalizeBattleType("friendly")).toBeNull();
    expect(normalizeBattleType(undefined)).toBeNull();
  });
});

describe("battleTypeLabel", () => {
  it("uses a friendly label, or the raw text when unknown", () => {
    expect(battleTypeLabel("ranked")).toBe("Ranked");
    expect(battleTypeLabel("friendly")).toBe("friendly");
    expect(battleTypeLabel(undefined)).toBe("Unknown");
  });
});

describe("gearFromPlayer", () => {
  it("lists home-village heroes with their equipment", () => {
    const gear = gearFromPlayer({
      heroes: [
        {
          name: "Barbarian King",
          level: 90,
          maxLevel: 95,
          village: "home",
          equipment: [{ name: "Spiky Ball", level: 18, maxLevel: 27, village: "home" }],
        },
        { name: "Battle Machine", level: 30, maxLevel: 35, village: "builderBase" },
      ],
    });
    expect(gear).toEqual([
      { hero: "Barbarian King", heroLevel: 90, equipment: [{ name: "Spiky Ball", level: 18 }] },
    ]);
  });
});

describe("parseCocTime", () => {
  it("turns the API time format into a Date", () => {
    expect(parseCocTime("20251024T123000.000Z").toISOString()).toBe("2025-10-24T12:30:00.000Z");
  });
});
