import { describe, expect, it } from "vitest";
import {
  calcProgress,
  equipmentMaxLevel,
  isEquipmentUnlocked,
  unitAtTownHall,
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
      expect(maxLevelAtTownHall("spells", "Ice Block Spell", 12)).toBe(1);
      expect(maxLevelAtTownHall("siege", "Wall Wrecker", 12)).toBe(3);
    });

    it("hides units not unlocked at the player's Town Hall", () => {
      const king = { ...unit(1, 110), name: "Barbarian King" };
      expect(unitAtTownHall(king, "heroes", 3)).toBeNull();
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
      const iceBlock = { ...unit(6, 6), name: "Ice Block Spell" };
      expect(unitAtTownHall(iceBlock, "spells", 12)).toMatchObject({
        level: 1,
        maxLevel: 1,
      });
      expect(
        calcProgress([unitAtTownHall(iceBlock, "spells", 12)!])?.percent,
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
