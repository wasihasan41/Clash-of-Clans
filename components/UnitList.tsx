import { iconCandidates, type UnitKind } from "@/lib/icons";
import {
  calcProgress,
  isEquipmentUnlocked,
  unitsAtTownHall,
} from "@/lib/progress";
import type { LevelCategory } from "@/lib/townhall-levels";
import { isSuperTroop } from "@/lib/troops";
import type { Unit } from "@/lib/types";
import { UnitIcon } from "./UnitIcon";

const LEVEL_CATEGORY_BY_KIND: Record<UnitKind, LevelCategory> = {
  hero: "heroes",
  pet: "pets",
  troop: "troops",
  siege: "siege",
  spell: "spells",
  equipment: "equipment",
};

const EQUIPMENT_DISPLAY_ORDER = [
  "Barbarian Puppet",
  "Rage Vial",
  "Earthquake Boots",
  "Vampstache",
  "Giant Gauntlet",
  "Spiky Ball",
  "Snake Bracelet",
  "Stick Horse",
  "Archer Puppet",
  "Invisibility Vial",
  "Healer Puppet",
  "Giant Arrow",
  "Frozen Arrow",
  "Monolith Arrow",
  "Magic Mirror",
  "Action Figure",
  "Henchmen Puppet",
  "Dark Orb",
  "Metal Pants",
  "Noble Iron",
  "Dark Crown",
  "Meteor Staff",
  "Portal Pendant",
  "Eternal Tome",
  "Life Gem",
  "Rage Gem",
  "Healing Tome",
  "Heroic Torch",
  "Fireball",
  "Lavaloon Puppet",
  "Seeking Shield",
  "Royal Gem",
  "Hog Rider Puppet",
  "Rocket Spear",
  "Electro Boots",
  "Haste Vial",
  "Frost Flake",
  "Fire Heart",
  "Flame Blower",
  "Rocket Backpack",
  "Stun Blaster",
  "Electro Fangs",
  "Revenge Deck",
] as const;

const EQUIPMENT_DISPLAY_INDEX = new Map<string, number>(
  EQUIPMENT_DISPLAY_ORDER.map((name, index) => [name, index]),
);

export function UnitList({
  title,
  units,
  kind,
  townHallLevel,
}: {
  title: string;
  units: Unit[];
  kind: UnitKind;
  townHallLevel?: number;
}) {
  const homeUnits = units.filter(
    (unit) =>
      unit.village === "home" && !(kind === "troop" && isSuperTroop(unit.name)),
  );
  const home =
    townHallLevel === undefined
      ? homeUnits.filter(
          (unit) => kind !== "equipment" || isEquipmentUnlocked(unit),
        )
      : unitsAtTownHall(homeUnits, LEVEL_CATEGORY_BY_KIND[kind], townHallLevel);
  if (home.length === 0) return null;

  const displayUnits =
    kind === "equipment"
      ? [...home].sort(
          (a, b) =>
            (EQUIPMENT_DISPLAY_INDEX.get(a.name) ?? Infinity) -
            (EQUIPMENT_DISPLAY_INDEX.get(b.name) ?? Infinity),
        )
      : home;
  const progress = calcProgress(home);

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>{title}</h2>
        {progress && (
          <div className="progress-chip">
            <span
              className={
                progress.percent >= 100
                  ? "progress-text complete"
                  : "progress-text"
              }
            >
              {progress.percent}%
            </span>
            <div
              className="bar"
              role="progressbar"
              aria-label={`${title} progress`}
              aria-valuenow={progress.percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={
                  progress.percent >= 100 ? "bar-fill maxed" : "bar-fill"
                }
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <span className="progress-sub muted">
              {progress.maxed}/{progress.count} maxed
            </span>
          </div>
        )}
      </div>

      <ul className="units">
        {displayUnits.map((u) => (
          <li key={u.name}>
            <div className="unit-head">
              <span className="unit-name">
                <UnitIcon srcs={iconCandidates(kind, u.name)} name={u.name} />
                {u.name}
              </span>
              <span className="muted">
                {u.level} / {u.maxLevel}
              </span>
            </div>
            <div
              className="bar"
              role="progressbar"
              aria-valuenow={u.level}
              aria-valuemax={u.maxLevel}
              aria-label={`${u.name} level`}
            >
              <div
                className={
                  u.level >= u.maxLevel ? "bar-fill maxed" : "bar-fill"
                }
                style={{
                  width: `${Math.min(100, (u.level / u.maxLevel) * 100)}%`,
                }}
              />
            </div>

            {u.equipment && u.equipment.length > 0 && (
              <ul className="equipped">
                {u.equipment
                  .filter(
                    (equipment) =>
                      townHallLevel !== undefined ||
                      isEquipmentUnlocked(equipment),
                  )
                  .map((e) => (
                    <li key={e.name}>
                      <span className="unit-name">
                        <UnitIcon
                          srcs={iconCandidates("equipment", e.name)}
                          name={e.name}
                          size={24}
                        />
                        {e.name}
                      </span>
                      <span className="muted">
                        {e.level} / {e.maxLevel}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
