import { describe, expect, it } from "vitest";
import { equipmentName, heroName, loadoutSummary, parseHeroLoadouts, petName } from "./army";

const REAL = "h0p0e0_11-1p9e17_20-2m1p2e4_34-4p10e13_6i11x5d1x2-1x5u16x8-4x5-1x62s7x35-1x2-2x5";

describe("parseHeroLoadouts", () => {
  it("reads heroes, pets and equipment from a real army code", () => {
    expect(parseHeroLoadouts(REAL)).toEqual([
      { heroId: 0, petId: 0, equipmentIds: [0, 11] },
      { heroId: 1, petId: 9, equipmentIds: [17, 20] },
      { heroId: 2, petId: 2, equipmentIds: [4, 34] },
      { heroId: 4, petId: 10, equipmentIds: [13, 6] },
    ]);
  });

  it("handles one hero with a single equipment and no pet", () => {
    expect(parseHeroLoadouts("h7e60u9x132")).toEqual([
      { heroId: 7, petId: undefined, equipmentIds: [60] },
    ]);
  });

  it("returns an empty list when there is no hero section", () => {
    expect(parseHeroLoadouts("u10x0-2x3s1x9")).toEqual([]);
    expect(parseHeroLoadouts(undefined)).toEqual([]);
  });
});

describe("loadoutSummary", () => {
  it("summarises counts", () => {
    expect(loadoutSummary(parseHeroLoadouts(REAL))).toBe("4 heroes · 4 pets · 8 equipment");
    expect(loadoutSummary([])).toBe("No heroes");
  });
});

describe("equipmentName", () => {
  it("maps every army-code equipment ID to its item name", () => {
    const equipment = [
      [0, "Barbarian Puppet"],
      [1, "Rage Vial"],
      [2, "Archer Puppet"],
      [3, "Invisibility Vial"],
      [4, "Eternal Tome"],
      [5, "Life Gem"],
      [6, "Seeking Shield"],
      [7, "Royal Gem"],
      [8, "Earthquake Boots"],
      [9, "Hog Rider Puppet"],
      [10, "Giant Gauntlet"],
      [11, "Vampstache"],
      [12, "Haste Vial"],
      [13, "Rocket Spear"],
      [14, "Spiky Ball"],
      [15, "Frozen Arrow"],
      [16, "Monolith Arrow"],
      [17, "Giant Arrow"],
      [19, "Heroic Torch"],
      [20, "Healer Puppet"],
      [22, "Fireball"],
      [24, "Rage Gem"],
      [32, "Snake Bracelet"],
      [34, "Healing Tome"],
      [35, "Dark Crown"],
      [39, "Magic Mirror"],
      [40, "Electro Boots"],
      [41, "Lavaloon Puppet"],
      [42, "Henchmen Puppet"],
      [43, "Dark Orb"],
      [44, "Metal Pants"],
      [47, "Noble Iron"],
      [48, "Action Figure"],
      [49, "Meteor Staff"],
      [50, "Frost Flake"],
      [51, "Stick Horse"],
      [52, "Fire Heart"],
      [53, "Rocket Backpack"],
      [56, "Stun Blaster"],
      [57, "Flame Blower"],
      [59, "Electro Fangs"],
      [60, "Revenge Deck"],
      [61, "Portal Pendant"],
    ] as const;

    for (const [id, name] of equipment) {
      expect(equipmentName(id)).toBe(name);
    }
  });

  it("returns undefined for an unrecognized equipment ID", () => {
    expect(equipmentName(999)).toBeUndefined();
  });
});

describe("heroName", () => {
  it("maps every army-code hero ID to its name", () => {
    const heroes = [
      [0, "Barbarian King"],
      [1, "Archer Queen"],
      [2, "Grand Warden"],
      [4, "Royal Champion"],
      [6, "Minion Prince"],
      [7, "Dragon Duke"],
    ] as const;

    for (const [id, name] of heroes) {
      expect(heroName(id)).toBe(name);
    }
  });

  it("returns undefined for an unrecognized hero ID", () => {
    expect(heroName(999)).toBeUndefined();
  });
});

describe("petName", () => {
  it("maps every army-code pet ID to its name", () => {
    const pets = [
      [0, "L.A.S.S.I"],
      [1, "Mighty Yak"],
      [2, "Electro Owl"],
      [3, "Unicorn"],
      [4, "Phoenix"],
      [7, "Poison Lizard"],
      [8, "Diggy"],
      [9, "Frosty"],
      [10, "Spirit Fox"],
      [11, "Angry Jelly"],
      [16, "Sneezy"],
      [17, "Greedy Raven"],
    ] as const;

    for (const [id, name] of pets) {
      expect(petName(id)).toBe(name);
    }
  });

  it("returns undefined for an unrecognized pet ID", () => {
    expect(petName(999)).toBeUndefined();
  });
});
