import Link from "next/link";
import { UnitIcon } from "@/components/UnitIcon";
import {
  equipmentName,
  heroName,
  parseHeroLoadouts,
  petName,
} from "@/lib/army";
import {
  armyLink,
  battleTypeLabel,
  normalizeBattleType,
  parseCocTime,
  stars,
  type DisplayBattle,
} from "@/lib/battlelog";
import { iconCandidates } from "@/lib/icons";
import type { BattleType } from "@/lib/types";

export type BattleFilter = "ALL" | BattleType;

const FILTERS: { key: BattleFilter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "HOME_VILLAGE", label: "Home" },
  { key: "RANKED", label: "Ranked" },
  { key: "LEGEND", label: "Legend" },
];

const seen = (d: Date) =>
  d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });

export function BattleLog({
  tag,
  battles,
  filter,
  saved,
  error,
}: {
  tag: string;
  battles: DisplayBattle[];
  filter: BattleFilter;
  saved: boolean;
  error?: string;
}) {
  const count = (key: BattleFilter) =>
    key === "ALL"
      ? battles.length
      : battles.filter((b) => normalizeBattleType(b.battleType) === key).length;
  const shown =
    filter === "ALL"
      ? battles
      : battles.filter((b) => normalizeBattleType(b.battleType) === filter);

  return (
    <section className="panel" id="battlelog">
      <div className="panel-head">
        <h2>Battle log</h2>
        <span className="muted">
          {saved ? "History is being saved" : "Live Battle Data"}
        </span>
      </div>

      {error ? (
        <p className="field-error">{error}</p>
      ) : (
        <>
          <nav className="tabs" aria-label="Battle type">
            {FILTERS.map((f) => (
              <Link
                key={f.key}
                href={
                  f.key === "ALL"
                    ? `/player/${tag}#battlelog`
                    : `/player/${tag}?type=${f.key}#battlelog`
                }
                className={f.key === filter ? "tab active" : "tab"}
              >
                {f.label} ({count(f.key)})
              </Link>
            ))}
          </nav>

          {shown.length === 0 ? (
            <p className="muted">No battles to show.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Battle</th>
                    <th>Result</th>
                    <th>Opponent</th>
                    <th>Army</th>
                    <th>Hero gear</th>
                    <th>Pet used</th>
                    {saved && <th>When</th>}
                  </tr>
                </thead>
                <tbody>
                  {shown.map((b, i) => (
                    <tr key={`${b.capturedAt?.getTime() ?? "live"}-${i}`}>
                      <td>
                        <span className={b.attack ? "badge attack" : "badge defense"}>
                          {b.attack ? "Attack" : "Defense"}
                        </span>{" "}
                        <span className="muted">{battleTypeLabel(b.battleType)}</span>
                      </td>
                      <td>
                        {stars(b.stars)} {b.destructionPercentage}%
                      </td>
                      <td>
                        {b.opponentPlayerTag ? (
                          <>
                            <Link href={`/player/${b.opponentPlayerTag.replace("#", "")}`}>
                              {b.opponentName ?? b.opponentPlayerTag}
                            </Link>
                            {b.opponentTownHallLevel ? (
                              <span className="muted"> TH{b.opponentTownHallLevel}</span>
                            ) : null}
                          </>
                        ) : (
                          <span className="muted">-</span>
                        )}
                      </td>
                      <td>
                        {b.armyShareCode ? (
                          <a href={armyLink(b.armyShareCode)} target="_blank" rel="noreferrer">
                            {b.attack ? "Copy army" : "Copy attacker's army"}
                          </a>
                        ) : (
                          <span className="muted">-</span>
                        )}
                      </td>
                      <td>
                        {(() => {
                          const loadouts = parseHeroLoadouts(b.armyShareCode);
                          return loadouts.length > 0 ? (
                            <div className="battle-icon-list">
                              {loadouts.map((loadout) => (
                                <div className="battle-icon-group" key={loadout.heroId}>
                                  {(() => {
                                    const name = heroName(loadout.heroId) ?? `Hero #${loadout.heroId}`;
                                    return (
                                      <UnitIcon
                                        srcs={iconCandidates("hero", name)}
                                        name={name}
                                        size={30}
                                        title={name}
                                      />
                                    );
                                  })()}
                                  {loadout.equipmentIds.map((id) => {
                                    const name = equipmentName(id) ?? `Unknown equipment (#${id})`;
                                    return (
                                      <UnitIcon
                                        key={id}
                                        srcs={iconCandidates("equipment", name)}
                                        name={name}
                                        size={30}
                                        title={name}
                                      />
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="muted">Not available in battle data</span>
                          );
                        })()}
                      </td>
                      <td>
                        {(() => {
                          const loadouts = parseHeroLoadouts(b.armyShareCode);
                          const withPets = loadouts.filter((loadout) => loadout.petId !== undefined);
                          return loadouts.length > 0 ? (
                            withPets.length > 0 ? (
                              <div className="battle-icon-list">
                                {withPets.map((loadout) => {
                                  const petId = loadout.petId;
                                  if (petId === undefined) return null;
                                  const hero = heroName(loadout.heroId) ?? `Hero #${loadout.heroId}`;
                                  const pet = petName(petId) ?? `Unknown pet (#${petId})`;
                                  return (
                                    <div className="battle-icon-group" key={loadout.heroId}>
                                      <UnitIcon
                                        srcs={iconCandidates("hero", hero)}
                                        name={hero}
                                        size={30}
                                        title={hero}
                                      />
                                      <UnitIcon
                                        srcs={iconCandidates("pet", pet)}
                                        name={pet}
                                        size={30}
                                        title={`${pet} assigned to ${hero}`}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="muted">No pets encoded</span>
                            )
                          ) : (
                            <span className="muted">Not available in battle data</span>
                          );
                        })()}
                      </td>
                      {saved && (
                        <td className="muted">
                          {b.battleTimestamp
                            ? seen(parseCocTime(b.battleTimestamp))
                            : b.capturedAt
                              ? `${seen(b.capturedAt)} (first seen)`
                              : "-"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
