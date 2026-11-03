import { describe, expect, it } from "vitest";
import {
  calcProgress,
  equipmentMaxLevel,
  isEquipmentUnlocked,
  unitAtTownHall,
  unitsAtTownHall,
} from "./progress";
import type { Unit } from "./types";
import { maxLevelAtTownHall } from "./townhall-levels";

const unit = (level: number, maxLevel: number, village = "home"): Unit => ({
  name: `u${level}-${maxLevel}`,
  level,
  maxLevel,
  village,
});

describe("calcProgress", () => {
  it("returns null when there is nothing to measure", () => {
    expect(calcProgress([])).toBeNull();
    expect(calcProgress([unit(3, 5, "builderBase")])).toBeNull();
  });

  describe("isEquipmentUnlocked", () => {
    it("filters locked equipment placeholders without hiding unlocked level-one gear", () => {
      expect(isEquipmentUnlocked(unit(1, 1))).toBe(false);
      expect(isEquipmentUnlocked(unit(1, 18))).toBe(true);
    });
  });

  describe("equipmentMaxLevel", () => {
    it("uses the Blacksmith cap for the player's Town Hall", () => {
      expect(equipmentMaxLevel(18, 12)).toBe(15);
      expect(equipmentMaxLevel(27, 12)).toBe(18);
    });

    it("respects common and epic caps at higher Town Halls", () => {
      expect(equipmentMaxLevel(18, 15)).toBe(18);
      expect(equipmentMaxLevel(27, 15)).toBe(24);
      expect(equipmentMaxLevel(27, 16)).toBe(27);
    });

    it("does not display equipment before the Blacksmith is unlocked", () => {
      expect(equipmentMaxLevel(18, 7)).toBe(1);
    });

    it("uses Blacksmith upgrade levels for equipment caps", () => {
      expect(equipmentMaxLevel(18, 8)).toBe(9);
      expect(equipmentMaxLevel(18, 9)).toBe(9);
      expect(equipmentMaxLevel(18, 10)).toBe(12);
      expect(equipmentMaxLevel(18, 12)).toBe(15);
      expect(equipmentMaxLevel(27, 14)).toBe(21);
      expect(equipmentMaxLevel(27, 15)).toBe(24);
      expect(equipmentMaxLevel(27, 16)).toBe(27);
      expect(equipmentMaxLevel(27, 18)).toBe(27);
    });

    it("counts a Town Hall-capped equipment level as fully upgraded", () => {
      const equipment = unit(15, equipmentMaxLevel(18, 12));
      expect(calcProgress([equipment])?.percent).toBe(100);
    });
  });

  describe("Town Hall-specific unit levels", () => {
    it("uses the matching Town Hall cap for heroes, troops, pets, and spells", () => {
      expect(maxLevelAtTownHall("heroes", "Barbarian King", 12)).toBe(65);
      expect(maxLevelAtTownHall("troops", "Barbarian", 12)).toBe(9);
      expect(maxLevelAtTownHall("pets", "Electro Owl", 12)).toBe(0);
      expect(maxLevelAtTownHall("spells", "Lightning Spell", 12)).toBe(9);
      expect(maxLevelAtTownHall("spells", "Overgrowth Spell", 12)).toBe(2);
      expect(
        unitAtTownHall(
          { ...unit(1, 1), name: "Ice Block Spell" },
          "spells",
          13,
        ),
      ).toBeNull();
      expect(maxLevelAtTownHall("spells", "Ice Block Spell", 14)).toBe(2);
      expect(maxLevelAtTownHall("siege", "Wall Wrecker", 12)).toBe(3);
      expect(maxLevelAtTownHall("siege", "Sky Wagon", 18)).toBe(4);
      expect(
        maxLevelAtTownHall("siege", "Air Troop Launcher", 18),
      ).toBeUndefined();
    });

    it("hides units not unlocked at the player's Town Hall", () => {
      const king = { ...unit(1, 110), name: "Barbarian King" };
      expect(unitAtTownHall(king, "heroes", 3)).toBeNull();
    });

    it("includes eligible but unowned units at level zero across categories", () => {
      const categories = [
        {
          category: "heroes" as const,
          name: "Archer Queen",
          townHall: 8,
          maxLevel: 10,
        },
        {
          category: "troops" as const,
          name: "Dragon",
          townHall: 7,
          maxLevel: 2,
        },
        {
          category: "spells" as const,
          name: "Lightning Spell",
          townHall: 5,
          maxLevel: 4,
        },
        {
          category: "pets" as const,
          name: "LASSI",
          townHall: 14,
          maxLevel: 10,
        },
        {
          category: "siege" as const,
          name: "Wall Wrecker",
          townHall: 12,
          maxLevel: 3,
        },
        {
          category: "equipment" as const,
          name: "Archer Puppet",
          townHall: 9,
          maxLevel: 9,
        },
      ];

      for (const { category, name, townHall, maxLevel } of categories) {
        expect(unitsAtTownHall([], category, townHall)).toContainEqual(
          expect.objectContaining({
            name,
            level: 0,
            maxLevel,
            village: "home",
          }),
        );
      }
    });

    it("shows API-locked equipment at level zero when it is available at the Town Hall", () => {
      const lockedEquipment = {
        ...unit(1, 1),
        name: "Giant Gauntlet",
      };

      expect(unitAtTownHall(lockedEquipment, "equipment", 18)).toBeNull();
      expect(
        unitsAtTownHall([lockedEquipment], "equipment", 18),
      ).toContainEqual(
        expect.objectContaining({
          name: "Giant Gauntlet",
          level: 0,
          maxLevel: 27,
        }),
      );
    });

    it("does not let a locked API placeholder suppress eligible Haste Vial", () => {
      const lockedHasteVial = {
        ...unit(1, 1),
        name: "Haste Vial",
      };

      expect(
        unitsAtTownHall([lockedHasteVial], "equipment", 16),
      ).toContainEqual(
        expect.objectContaining({
          name: "Haste Vial",
          level: 0,
          maxLevel: 18,
        }),
      );
      expect(
        unitsAtTownHall([lockedHasteVial], "equipment", 14),
      ).not.toContainEqual(expect.objectContaining({ name: "Haste Vial" }));
    });

    it("shows locked API names for renamed equipment using current catalog names", () => {
      const lockedEquipment = [
        { ...unit(1, 1), name: "Frost Flake" },
        { ...unit(1, 1), name: "Portal Pendant" },
      ];

      expect(
        unitsAtTownHall(lockedEquipment, "equipment", 16),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Frost Flake",
            level: 0,
            maxLevel: 27,
          }),
          expect.objectContaining({
            name: "Portal Pendant",
            level: 0,
            maxLevel: 27,
          }),
        ]),
      );
    });

    it("gates generated equipment by its Blacksmith unlock upgrade", () => {
      expect(unitsAtTownHall([], "equipment", 9)).not.toContainEqual(
        expect.objectContaining({ name: "Metal Pants" }),
      );
      expect(unitsAtTownHall([], "equipment", 10)).toContainEqual(
        expect.objectContaining({
          name: "Metal Pants",
          level: 0,
          maxLevel: 12,
        }),
      );

      expect(unitsAtTownHall([], "equipment", 11)).not.toContainEqual(
        expect.objectContaining({ name: "Healer Puppet" }),
      );
      expect(unitsAtTownHall([], "equipment", 12)).toContainEqual(
        expect.objectContaining({
          name: "Healer Puppet",
          level: 0,
          maxLevel: 15,
        }),
      );
    });

    it("generates Revenge Deck at Dragon Duke's Town Hall unlock with current caps", () => {
      expect(unitsAtTownHall([], "equipment", 14)).not.toContainEqual(
        expect.objectContaining({ name: "Revenge Deck" }),
      );
      expect(unitsAtTownHall([], "equipment", 15)).toContainEqual(
        expect.objectContaining({
          name: "Revenge Deck",
          level: 0,
          maxLevel: 24,
        }),
      );
      expect(unitsAtTownHall([], "equipment", 17)).toContainEqual(
        expect.objectContaining({
          name: "Revenge Deck",
          level: 0,
          maxLevel: 27,
        }),
      );
    });

    it("hides equipment for heroes not unlocked at the player's Town Hall", () => {
      for (const name of ["Heroic Torch", "Dark Orb", "Rocket Spear"]) {
        expect(unitsAtTownHall([], "equipment", 8)).not.toContainEqual(
          expect.objectContaining({ name }),
        );
      }

      expect(unitsAtTownHall([], "equipment", 10)).not.toContainEqual(
        expect.objectContaining({ name: "Heroic Torch" }),
      );
      expect(unitsAtTownHall([], "equipment", 11)).toContainEqual(
        expect.objectContaining({
          name: "Heroic Torch",
          level: 0,
          maxLevel: 15,
        }),
      );

      expect(
        unitAtTownHall(
          { ...unit(1, 27), name: "Heroic Torch" },
          "equipment",
          8,
        ),
      ).toBeNull();
    });

    it("uses actual hero unlock Town Halls for hero equipment", () => {
      expect(
        unitAtTownHall(
          { ...unit(1, 110), name: "Barbarian King" },
          "heroes",
          3,
        ),
      ).toBeNull();
      expect(unitsAtTownHall([], "heroes", 4)).toContainEqual(
        expect.objectContaining({ name: "Barbarian King" }),
      );
      expect(unitsAtTownHall([], "heroes", 7)).not.toContainEqual(
        expect.objectContaining({ name: "Archer Queen" }),
      );
      expect(unitsAtTownHall([], "heroes", 8)).toContainEqual(
        expect.objectContaining({ name: "Archer Queen" }),
      );
      expect(unitsAtTownHall([], "equipment", 8)).toContainEqual(
        expect.objectContaining({ name: "Earthquake Boots" }),
      );
      expect(unitsAtTownHall([], "equipment", 7)).not.toContainEqual(
        expect.objectContaining({ name: "Archer Puppet" }),
      );
      expect(unitsAtTownHall([], "equipment", 8)).toContainEqual(
        expect.objectContaining({ name: "Archer Puppet" }),
      );
    });

    it("starts equipment with the King's default gear before Blacksmith unlock", () => {
      const equipmentAtTownHall4 = unitsAtTownHall([], "equipment", 4);

      expect(equipmentAtTownHall4).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Barbarian Puppet",
            level: 1,
            maxLevel: 1,
          }),
          expect.objectContaining({ name: "Rage Vial", level: 1, maxLevel: 1 }),
        ]),
      );
      expect(calcProgress(equipmentAtTownHall4)).toMatchObject({
        percent: 100,
        maxed: 2,
      });
      expect(equipmentAtTownHall4).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Giant Gauntlet" }),
          expect.objectContaining({ name: "Earthquake Boots" }),
          expect.objectContaining({ name: "Frozen Arrow" }),
        ]),
      );
    });

    it("keeps API-provided default equipment at level 1 before Blacksmith unlock", () => {
      const defaultGear = unitsAtTownHall(
        [
          { ...unit(1, 1), name: "Barbarian Puppet" },
          { ...unit(1, 1), name: "Rage Vial" },
        ],
        "equipment",
        4,
      );

      expect(defaultGear).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Barbarian Puppet",
            level: 1,
            maxLevel: 1,
          }),
          expect.objectContaining({ name: "Rage Vial", level: 1, maxLevel: 1 }),
        ]),
      );
    });

    it("does not include catalog units before their Town Hall unlock", () => {
      expect(unitsAtTownHall([], "heroes", 3)).toEqual([]);
      expect(unitsAtTownHall([], "pets", 13)).toEqual([]);
      expect(unitsAtTownHall([], "troops", 8)).not.toContainEqual(
        expect.objectContaining({ name: "Baby Dragon" }),
      );
      expect(unitsAtTownHall([], "spells", 7)).not.toContainEqual(
        expect.objectContaining({ name: "Poison Spell" }),
      );
      expect(unitsAtTownHall([], "siege", 11)).toEqual([]);
    });

    it("uses the building unlock Town Hall before generating unit levels", () => {
      expect(unitsAtTownHall([], "troops", 9)).toContainEqual(
        expect.objectContaining({
          name: "Baby Dragon",
          level: 0,
          maxLevel: 2,
        }),
      );
      expect(unitsAtTownHall([], "spells", 8)).toContainEqual(
        expect.objectContaining({
          name: "Poison Spell",
          level: 0,
          maxLevel: 2,
        }),
      );
      expect(unitsAtTownHall([], "troops", 1)).toContainEqual(
        expect.objectContaining({
          name: "Barbarian",
          level: 0,
          maxLevel: 1,
        }),
      );
    });

    it("does not synthesize excluded entries from the level catalog", () => {
      const equipment = unitsAtTownHall([], "equipment", 18);
      const troops = unitsAtTownHall([], "troops", 18);
      const sieges = unitsAtTownHall([], "siege", 18);

      expect(equipment.map((item) => item.name)).not.toEqual(
        expect.arrayContaining([
          "Draconic Counter",
          "ElectroAttack",
          "MP Trap Shield",
          "Piercing Arrow",
        ]),
      );
      expect(equipment.map((item) => item.name)).toEqual(
        expect.arrayContaining(["Portal Pendant", "Frost Flake"]),
      );
      expect(troops.map((item) => item.name)).not.toEqual(
        expect.arrayContaining(["Elephant", "Rider"]),
      );
      expect(sieges.map((item) => item.name)).not.toContain(
        "Air Troop Launcher",
      );
      expect(sieges).toContainEqual(
        expect.objectContaining({ name: "Sky Wagon", level: 0, maxLevel: 4 }),
      );
    });

    it("does not synthesize placeholder-only entries with no real level progression", () => {
      expect(unitsAtTownHall([], "troops", 18)).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Azure Dragon" }),
          expect.objectContaining({ name: "Party Wizard" }),
        ]),
      );
      expect(unitsAtTownHall([], "spells", 18)).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "BagOfFrostmites" }),
        ]),
      );
      expect(unitsAtTownHall([], "pets", 18)).toContainEqual(
        expect.objectContaining({ name: "Crow", level: 0 }),
      );
    });

    it("merges API levels without duplicating aliased catalog names", () => {
      const lightningSpell = {
        ...unit(5, 13),
        name: "Lightning Spell",
      };
      const spells = unitsAtTownHall([lightningSpell], "spells", 10);

      expect(
        spells.filter((spell) => spell.name === "Lightning Spell"),
      ).toHaveLength(1);
      expect(spells).toContainEqual(
        expect.objectContaining({ name: "Lightning Spell", level: 5 }),
      );
    });

    it("deduplicates API entries with alternate names", () => {
      const spells = unitsAtTownHall(
        [
          { ...unit(1, 6), name: "Ice Block" },
          { ...unit(2, 6), name: "Ice Block Spell" },
        ],
        "spells",
        18,
      );

      expect(
        spells.filter((spell) => spell.name === "Ice Block Spell"),
      ).toHaveLength(1);
      expect(spells).toContainEqual(
        expect.objectContaining({ name: "Ice Block Spell", level: 1 }),
      );
    });

    it("clamps the displayed level and max level to the Town Hall cap", () => {
      const troop = {
        ...unit(10, 12),
        name: "Barbarian",
      };
      const cappedTroop = unitAtTownHall(troop, "troops", 12);
      expect(cappedTroop).toMatchObject({
        level: 9,
        maxLevel: 9,
      });
      expect(cappedTroop && calcProgress([cappedTroop])?.percent).toBe(100);
    });

    it("uses Town Hall caps for hero and pet progress", () => {
      const king = { ...unit(110, 110), name: "Barbarian King" };
      const owl = { ...unit(15, 15), name: "Electro Owl" };
      expect(unitAtTownHall(king, "heroes", 12)).toMatchObject({
        level: 65,
        maxLevel: 65,
      });
      expect(unitAtTownHall(owl, "pets", 14)).toMatchObject({
        level: 10,
        maxLevel: 10,
      });
    });

    it("clamps Ice Block Spell to its Town Hall 12 maximum", () => {
      for (const name of ["Ice Block", "Ice Block Spell"]) {
        const iceBlock = { ...unit(6, 6), name };
        expect(unitAtTownHall(iceBlock, "spells", 14)).toMatchObject({
          name: "Ice Block Spell",
          level: 2,
          maxLevel: 2,
        });
      }
      expect(
        calcProgress([
          unitAtTownHall({ ...unit(6, 6), name: "Ice Block" }, "spells", 14)!,
        ])?.percent,
      ).toBe(100);
    });
  });

  it("adds levels across units and rounds to one decimal", () => {
    expect(calcProgress([unit(5, 10), unit(3, 6)])).toMatchObject({
      current: 8,
      max: 16,
      percent: 50,
      maxed: 0,
      count: 2,
    });
    expect(calcProgress([unit(1, 3)])?.percent).toBe(33.3);
  });

  it("counts maxed units", () => {
    expect(calcProgress([unit(10, 10), unit(4, 8), unit(6, 6)])).toMatchObject({
      maxed: 2,
      count: 3,
    });
  });

  it("never goes above 100%", () => {
    expect(calcProgress([unit(12, 10)])?.percent).toBe(100);
  });

  it("ignores builder base units", () => {
    expect(
      calcProgress([unit(5, 10), unit(1, 100, "builderBase")])?.percent,
    ).toBe(50);
  });
});
