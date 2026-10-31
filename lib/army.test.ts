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
  it("maps army-code equipment IDs to item names", () => {
    expect(equipmentName(0)).toBe("Barbarian Puppet");
    expect(equipmentName(14)).toBe("Spiky Ball");
    expect(equipmentName(16)).toBe("Monolith Arrow");
    expect(equipmentName(59)).toBe("Electro Fangs");
    expect(equipmentName(60)).toBe("Revenge Deck");
    expect(equipmentName(61)).toBe("Portal Pendant");
  });

  it("returns undefined for an unrecognized equipment ID", () => {
    expect(equipmentName(999)).toBeUndefined();
  });
});

describe("heroName", () => {
  it("maps army-code hero IDs to names", () => {
    expect(heroName(0)).toBe("Barbarian King");
    expect(heroName(4)).toBe("Royal Champion");
  });

  it("returns undefined for an unrecognized hero ID", () => {
    expect(heroName(999)).toBeUndefined();
  });
});

describe("petName", () => {
  it("maps army-code pet IDs to names", () => {
    expect(petName(0)).toBe("L.A.S.S.I");
    expect(petName(9)).toBe("Frosty");
    expect(petName(17)).toBe("Greedy Raven");
  });

  it("returns undefined for an unrecognized pet ID", () => {
    expect(petName(999)).toBeUndefined();
  });
});
