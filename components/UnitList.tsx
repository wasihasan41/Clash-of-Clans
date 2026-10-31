import { iconCandidates, type UnitKind } from "@/lib/icons";
import {
  calcProgress,
  isEquipmentUnlocked,
  unitAtTownHall,
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
      : homeUnits.flatMap((unit) => {
          const current = unitAtTownHall(
            unit,
            LEVEL_CATEGORY_BY_KIND[kind],
            townHallLevel,
          );
          return current ? [current] : [];
        });
  if (home.length === 0) return null;

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
        {home.map((u) => (
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
