import type { Unit } from "./types";
import { maxLevelAtTownHall, type LevelCategory } from "./townhall-levels";

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

const EQUIPMENT_MAX_LEVELS_BY_TOWN_HALL = [
  { townHall: 8, common: 9, epic: 12 },
  { townHall: 10, common: 12, epic: 15 },
  { townHall: 12, common: 15, epic: 18 },
  { townHall: 14, common: 18, epic: 21 },
  { townHall: 15, common: 18, epic: 24 },
  { townHall: 16, common: 18, epic: 27 },
] as const;

export function equipmentMaxLevel(
  maxLevel: number,
  townHallLevel: number,
): number {
  if (maxLevel <= 1) return maxLevel;

  const caps = [...EQUIPMENT_MAX_LEVELS_BY_TOWN_HALL]
    .reverse()
    .find((entry) => townHallLevel >= entry.townHall);
  if (!caps) return 1;

  const rarityCap = maxLevel >= 27 ? caps.epic : caps.common;
  return Math.min(maxLevel, rarityCap);
}

export function unitAtTownHall(
  unit: Unit,
  category: LevelCategory,
  townHallLevel: number,
): Unit | null {
  const townHallMax = maxLevelAtTownHall(category, unit.name, townHallLevel);
  if (townHallMax === 0) return null;

  if (
    category === "equipment" &&
    townHallMax === undefined &&
    !isEquipmentUnlocked(unit)
  ) {
    return null;
  }

  const maxLevel =
    townHallMax ??
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
    level: Math.min(unit.level, maxLevel),
    maxLevel,
    equipment,
  };
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
