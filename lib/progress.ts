import type { Unit } from "./types";
import {
  canonicalUnitDisplayName,
  canonicalUnitName,
  isEquipmentUnlockedWithHero,
  maxLevelAtTownHall,
  unitUnlockTownHall,
  unitCatalog,
  type LevelCategory,
} from "./townhall-levels";
import { isSuperTroop } from "./troops";

export interface Progress {
  current: number; // levels abhi tak ke
  max: number; // levels jitne is Town Hall par possible hain
  percent: number; // 0 se 100, ek decimal tak
  maxed: number; // kitne items poore max hain
  count: number; // kul items
}

// API locked equipment ko 1/1 placeholder ke roop mein bhejti hai.
export function isEquipmentUnlocked(equipment: Unit): boolean {
  return equipment.maxLevel > 1;
}

const EQUIPMENT_MAX_LEVELS_BY_BLACKSMITH_LEVEL = [
  { blacksmithLevel: 1, common: 9, epic: 12 },
  { blacksmithLevel: 3, common: 12, epic: 15 },
  { blacksmithLevel: 5, common: 15, epic: 18 },
  { blacksmithLevel: 7, common: 18, epic: 21 },
  { blacksmithLevel: 8, common: 18, epic: 24 },
  { blacksmithLevel: 9, common: 18, epic: 27 },
] as const;

function blacksmithLevelAtTownHall(townHallLevel: number): number {
  if (!Number.isInteger(townHallLevel) || townHallLevel < 8) return 0;
  return Math.min(townHallLevel - 7, 10);
}

export function equipmentMaxLevel(
  maxLevel: number,
  townHallLevel: number,
): number {
  if (maxLevel <= 1) return maxLevel;

  const blacksmithLevel = blacksmithLevelAtTownHall(townHallLevel);
  const caps = [...EQUIPMENT_MAX_LEVELS_BY_BLACKSMITH_LEVEL]
    .reverse()
    .find((entry) => blacksmithLevel >= entry.blacksmithLevel);
  if (!caps) return 1;

  const rarityCap = maxLevel >= 27 ? caps.epic : caps.common;
  return Math.min(maxLevel, rarityCap);
}

export function unitAtTownHall(
  unit: Unit,
  category: LevelCategory,
  townHallLevel: number,
): Unit | null {
  const equipmentUnlockedWithHero =
    category === "equipment" && isEquipmentUnlockedWithHero(unit.name);
  const equipmentUnlockTownHall =
    category === "equipment"
      ? unitUnlockTownHall(category, unit.name)
      : undefined;
  const defaultEquipmentAvailable =
    equipmentUnlockedWithHero &&
    equipmentUnlockTownHall !== undefined &&
    townHallLevel >= equipmentUnlockTownHall;

  if (
    category === "equipment" &&
    !isEquipmentUnlocked(unit) &&
    !defaultEquipmentAvailable
  ) {
    return null;
  }

  const unlockTownHall = unitUnlockTownHall(category, unit.name);
  if (unlockTownHall !== undefined && townHallLevel < unlockTownHall) {
    return null;
  }

  const townHallMax = maxLevelAtTownHall(category, unit.name, townHallLevel);
  if (townHallMax === 0 && unlockTownHall === undefined) return null;

  const maxLevel =
    (townHallMax === 0 && unlockTownHall !== undefined ? 1 : townHallMax) ??
    (category === "equipment"
      ? equipmentMaxLevel(unit.maxLevel, townHallLevel)
      : unit.maxLevel);
  if (maxLevel <= 0) return null;

  const equipment =
    unit.equipment?.flatMap((item) => {
      const current = unitAtTownHall(item, "equipment", townHallLevel);
      return current ? [current] : [];
    }) ?? unit.equipment;

  return {
    ...unit,
    name: canonicalUnitDisplayName(category, unit.name),
    level: Math.min(
      equipmentUnlockedWithHero && townHallLevel < 8
        ? Math.max(unit.level, 1)
        : unit.level,
      maxLevel,
    ),
    maxLevel,
    equipment,
  };
}

export function unitsAtTownHall(
  units: Unit[],
  category: LevelCategory,
  townHallLevel: number,
): Unit[] {
  const homeUnits = units.filter((unit) => unit.village === "home");
  const seen = new Set<string>();
  const visible = homeUnits.flatMap((unit) => {
    if (category === "troops" && isSuperTroop(unit.name)) return [];
    const canonicalName = canonicalUnitName(unit.name);
    if (seen.has(canonicalName)) return [];
    const current = unitAtTownHall(unit, category, townHallLevel);
    if (current) seen.add(canonicalName);
    return current ? [current] : [];
  });

  for (const { name, maxLevel } of unitCatalog(category)) {
    const canonicalName = canonicalUnitName(name);
    if (
      seen.has(canonicalName) ||
      (category === "troops" && isSuperTroop(name))
    ) {
      continue;
    }

    const current = unitAtTownHall(
      { name, level: 0, maxLevel, village: "home" },
      category,
      townHallLevel,
    );
    if (current) {
      seen.add(canonicalName);
      visible.push(current);
    }
  }

  return visible;
}

// Ek category (heroes, troops, ...) ka progress: sum(level) / sum(maxLevel)
export function calcProgress(units: Unit[]): Progress | null {
  const home = units.filter((u) => u.village === "home" && u.maxLevel > 0);
  if (home.length === 0) return null;

  let current = 0;
  let max = 0;
  let maxed = 0;

  for (const u of home) {
    current += Math.min(u.level, u.maxLevel); // level kabhi max se zyada count nahi hoga
    max += u.maxLevel;
    if (u.level >= u.maxLevel) maxed += 1;
  }

  return {
    current,
    max,
    percent: Math.round((current / max) * 1000) / 10,
    maxed,
    count: home.length,
  };
}
