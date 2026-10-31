import { ErrorBox } from "@/components/ErrorBox";
import { PlayerStatsDownload } from "@/components/PlayerStatsDownload";
import { Stat } from "@/components/Stat";
import { BattleLog, type BattleFilter } from "@/components/BattleLog";
import { UnitIcon } from "@/components/UnitIcon";
import { UnitList } from "@/components/UnitList";
import { loadBattleLog } from "@/lib/battlelog-store";
import { cocFetch } from "@/lib/coc";
import { isPet, townHallIconCandidates } from "@/lib/icons";
import { getLeague } from "@/lib/league";
import { encodeTag, normalizeTag } from "@/lib/tag";
import { isSiegeMachine } from "@/lib/troops";
import type { Player } from "@/lib/types";

const FILTERS: BattleFilter[] = ["ALL", "HOME_VILLAGE", "RANKED", "LEGEND"];

export default async function PlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { tag: rawTag } = await params;
  const { type } = await searchParams;
  const filter = FILTERS.find((f) => f === type) ?? "ALL";
  const tag = normalizeTag(decodeURIComponent(rawTag));

  let player: Player;
  try {
    player = await cocFetch<Player>(`/players/${encodeTag(tag)}`);
  } catch (error) {
    return <ErrorBox error={error} />;
  }

  const league = getLeague(player);
  const role = player.role?.toLowerCase() === "admin" ? "elder" : player.role;
  const battleLog = await loadBattleLog(tag, player);
  console.log(battleLog.battles[0]);
  const allTroops = player.troops ?? [];
  const troops = allTroops.filter(
    (t) => !isPet(t.name) && !isSiegeMachine(t.name),
  );
  const pets = allTroops.filter((t) => isPet(t.name));
  const sieges = allTroops.filter((t) => isSiegeMachine(t.name));

  return (
    <>
      <section className="panel profile">
        <div className="profile-icons">
          <UnitIcon
            key={`th-${player.townHallLevel}`}
            srcs={townHallIconCandidates(player.townHallLevel)}
            name={`Town Hall ${player.townHallLevel}`}
            fallback={`TH${player.townHallLevel}`}
            title={`Town Hall ${player.townHallLevel}`}
            size={64}
          />
          {league?.icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={league.icon} alt={league.name} width={64} height={64} />
          )}
        </div>
        <div>
          <h1>{player.name}</h1>
          <p className="muted">
            {player.tag}
            {league ? ` · ${league.name}` : ""}
          </p>
          {player.clan ? (
            <p>
              {player.clan.name}
              {role ? ` (${role})` : ""}
            </p>
          ) : (
            <p className="muted">Not in a clan</p>
          )}
          <PlayerStatsDownload player={player} />
        </div>
      </section>

      <section className="stats">
        <Stat label="Town Hall" value={player.townHallLevel} />
        <Stat label="XP level" value={player.expLevel} />
        <Stat label="Trophies" value={player.trophies} />
        <Stat label="Best trophies" value={player.bestTrophies} />
        <Stat label="War stars" value={player.warStars} />
        <Stat label="Donated" value={player.donations} />
        <Stat label="Received" value={player.donationsReceived} />
      </section>

      <UnitList
        title="Heroes"
        units={player.heroes ?? []}
        kind="hero"
        townHallLevel={player.townHallLevel}
      />
      <UnitList
        title="Hero equipment"
        units={player.heroEquipment ?? []}
        kind="equipment"
        townHallLevel={player.townHallLevel}
      />
      <UnitList
        title="Troops"
        units={troops}
        kind="troop"
        townHallLevel={player.townHallLevel}
      />
      <UnitList
        title="Siege Machines"
        units={sieges}
        kind="siege"
        townHallLevel={player.townHallLevel}
      />
      <UnitList
        title="Pets"
        units={pets}
        kind="pet"
        townHallLevel={player.townHallLevel}
      />
      <UnitList
        title="Spells"
        units={player.spells ?? []}
        kind="spell"
        townHallLevel={player.townHallLevel}
      />

      <BattleLog
        tag={tag}
        battles={battleLog.battles}
        filter={filter}
        saved={battleLog.saved}
        error={battleLog.error}
      />
    </>
  );
}
