"use client";

import { useState } from "react";
import { calcProgress, unitsAtTownHall } from "@/lib/progress";
import {
  cleanName,
  iconCandidates,
  isPet,
  type UnitKind,
} from "@/lib/icons";
import { isSiegeMachine } from "@/lib/troops";
import { getLeague } from "@/lib/league";
import type { Unit, Player } from "@/lib/types";
import type { LevelCategory } from "@/lib/townhall-levels";

type ExportUnit = Unit & { kind: UnitKind };

const CATEGORY_LEVELS: Record<UnitKind, LevelCategory> = {
  hero: "heroes",
  equipment: "equipment",
  troop: "troops",
  siege: "siege",
  spell: "spells",
  pet: "pets",
};

function visibleUnits(units: Unit[], kind: UnitKind, townHallLevel: number) {
  return unitsAtTownHall(units, CATEGORY_LEVELS[kind], townHallLevel).map(
    (unit) => ({ ...unit, kind }),
  );
}

function getExportCategories(player: Player) {
  const allTroops = player.troops ?? [];
  const categories: { title: string; kind: UnitKind; units: ExportUnit[] }[] = [
    {
      title: "Heroes",
      kind: "hero",
      units: visibleUnits(player.heroes ?? [], "hero", player.townHallLevel),
    },
    {
      title: "Hero equipment",
      kind: "equipment",
      units: visibleUnits(
        player.heroEquipment ?? [],
        "equipment",
        player.townHallLevel,
      ),
    },
    {
      title: "Troops",
      kind: "troop",
      units: visibleUnits(
        allTroops.filter(
          (unit) => !isPet(unit.name) && !isSiegeMachine(unit.name),
        ),
        "troop",
        player.townHallLevel,
      ),
    },
    {
      title: "Siege Machines",
      kind: "siege",
      units: visibleUnits(
        allTroops.filter((unit) => isSiegeMachine(unit.name)),
        "siege",
        player.townHallLevel,
      ),
    },
    {
      title: "Pets",
      kind: "pet",
      units: visibleUnits(
        allTroops.filter((unit) => isPet(unit.name)),
        "pet",
        player.townHallLevel,
      ),
    },
    {
      title: "Spells",
      kind: "spell",
      units: visibleUnits(
        player.spells ?? [],
        "spell",
        player.townHallLevel,
      ),
    },
  ];

  return categories.filter((category) => category.units.length > 0);
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    const timeout = window.setTimeout(() => resolve(null), 12000);
    image.onload = () => {
      window.clearTimeout(timeout);
      resolve(image);
    };
    image.onerror = () => {
      window.clearTimeout(timeout);
      resolve(null);
    };
    image.src = src;
  });
}

async function loadUnitIcons(
  categories: ReturnType<typeof getExportCategories>,
): Promise<{ images: Map<string, HTMLImageElement>; missing: number }> {
  const units = categories.flatMap((category) =>
    category.units.map((unit) => ({ kind: category.kind, unit })),
  );
  const unique = new Map(
    units.map(({ kind, unit }) => [`${kind}:${unit.name}`, { kind, unit }]),
  );
  const entries = [...unique.entries()];
  const loaded = new Map<string, HTMLImageElement>();
  let next = 0;

  await Promise.all(
    Array.from({ length: Math.min(8, entries.length) }, async () => {
      while (next < entries.length) {
        const index = next++;
        const [key, { kind, unit }] = entries[index];
        const localIcon = iconCandidates(kind, unit.name).find((src) =>
          src.startsWith("/"),
        );
        const src = localIcon
          ? localIcon
          : `/api/unit-icon?kind=${encodeURIComponent(kind)}&name=${encodeURIComponent(unit.name)}`;
        const image = await loadImage(src);
        if (image) loaded.set(key, image);
      }
    }),
  );

  return { images: loaded, missing: entries.length - loaded.size };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function drawBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  unit: Pick<Unit, "level" | "maxLevel">,
  compact = false,
) {
  const width = compact ? 20 : 27;
  const height = compact ? 12 : 17;
  roundRect(ctx, x, y, width, height, compact ? 4 : 6);
  ctx.fillStyle = unit.level >= unit.maxLevel ? "#f6b92b" : "#6fd36f";
  ctx.fill();
  ctx.fillStyle = "#201a48";
  ctx.font = `800 ${compact ? 7 : 10}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(unit.level), x + width / 2, y + height / 2 + 0.5);
}

function drawUnitIcon(
  ctx: CanvasRenderingContext2D,
  unit: Unit,
  kind: UnitKind,
  x: number,
  y: number,
  size: number,
  images: Map<string, HTMLImageElement>,
  compact = false,
) {
  roundRect(ctx, x, y, size, size, 10);
  ctx.fillStyle = "#100d2b";
  ctx.fill();

  const image = images.get(`${kind}:${unit.name}`);
  if (image) {
    ctx.save();
    roundRect(ctx, x, y, size, size, 10);
    ctx.clip();
    ctx.drawImage(image, x, y, size, size);
    ctx.restore();
  } else {
    ctx.fillStyle = "#f2eeff";
    ctx.font = `800 ${compact ? 12 : 20}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(unit.name.charAt(0), x + size / 2, y + size / 2);
  }

  const badgeWidth = compact ? 20 : 27;
  drawBadge(
    ctx,
    x + size - badgeWidth,
    y + size - (compact ? 12 : 17),
    unit,
    compact,
  );
}

function createStatsImage(
  player: Player,
  categories: ReturnType<typeof getExportCategories>,
  images: Map<string, HTMLImageElement>,
  leagueImage: HTMLImageElement | null,
): HTMLCanvasElement {
  const width = 1200;
  const padding = 56;
  const gap = 16;
  const statCardHeight = 88;
  const stats = [
    ["Town Hall", player.townHallLevel],
    ["XP level", player.expLevel],
    ["Trophies", player.trophies],
    ["Best trophies", player.bestTrophies],
    ["War stars", player.warStars],
  ] as const;
  const statRows = Math.ceil(stats.length / 3);
  const statGridHeight = statRows * statCardHeight + (statRows - 1) * gap;
  const categoryLayouts = categories.map((category) => {
    const columns = 12;
    const cellWidth = (width - padding * 2) / columns;
    const rows = Math.ceil(category.units.length / columns);
    const cellHeight = 68;
    return {
      ...category,
      columns,
      cellWidth,
      rows,
      cellHeight,
      height: 48 + rows * cellHeight + 12,
    };
  });
  const height =
    54 +
    146 +
    32 +
    statGridHeight +
    42 +
    categoryLayouts.reduce((sum, category) => sum + category.height, 0) +
    58;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create an image canvas.");

  ctx.fillStyle = "#1a1640";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#262060";
  roundRect(ctx, 28, 28, width - 56, height - 56, 28);
  ctx.fill();
  ctx.fillStyle = "#f6b92b";
  roundRect(ctx, 28, 28, 12, 146, 6);
  ctx.fill();

  const league = getLeague(player);
  const role =
    player.role?.toLowerCase() === "admin" ? "elder" : player.role ?? "";
  const profileLines = [
    player.tag,
    [league?.name, player.clan?.name, role].filter(Boolean).join(" · ") ||
      "Not in a clan",
  ];
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f6b92b";
  ctx.font = "800 42px Arial, sans-serif";
  const profileTextWidth = width - padding * 2 - 82;
  ctx.fillText(player.name, padding, 92, profileTextWidth);
  ctx.fillStyle = "#c8c2ec";
  ctx.font = "22px Arial, sans-serif";
  ctx.fillText(profileLines[0], padding, 128, profileTextWidth);
  ctx.fillText(profileLines[1], padding, 158, profileTextWidth);

  if (league) {
    const iconSize = 56;
    const iconX = width - padding - iconSize;
    const iconY = 62;
    roundRect(ctx, iconX - 4, iconY - 4, iconSize + 8, iconSize + 8, 12);
    ctx.fillStyle = "#302a70";
    ctx.fill();
    if (leagueImage) {
      ctx.drawImage(leagueImage, iconX, iconY, iconSize, iconSize);
    } else {
      ctx.fillStyle = "#f6b92b";
      ctx.font = "800 22px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(league.name.slice(0, 2).toUpperCase(), iconX + iconSize / 2, iconY + iconSize / 2);
    }
  }

  const cardWidth = (width - padding * 2 - gap * 2) / 3;
  let y = 192;
  stats.forEach(([label, value], index) => {
    const row = Math.floor(index / 3);
    const rowStart = row * 3;
    const itemsInRow = Math.min(3, stats.length - rowStart);
    const rowOffset =
      itemsInRow < 3 ? ((3 - itemsInRow) * (cardWidth + gap)) / 2 : 0;
    const column = index % 3;
    const x = padding + rowOffset + column * (cardWidth + gap);
    const cardY = y + row * (statCardHeight + gap);
    roundRect(ctx, x, cardY, cardWidth, statCardHeight, 14);
    ctx.fillStyle = "#302a70";
    ctx.fill();
    ctx.fillStyle = "#a8a2d8";
    ctx.font = "600 16px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(label, x + 18, cardY + 28);
    ctx.fillStyle = "#f6b92b";
    ctx.font = "800 28px Arial, sans-serif";
    ctx.fillText(value.toLocaleString("en-IN"), x + 18, cardY + 65);
  });

  y += statGridHeight + 24;
  categoryLayouts.forEach((category) => {
    ctx.fillStyle = "#f6b92b";
    ctx.textAlign = "left";
    ctx.font = "800 23px Arial, sans-serif";
    ctx.fillText(category.title, padding, y + 24);
    const progress = calcProgress(category.units);
    if (progress) {
      ctx.fillStyle = "#f6b92b";
      ctx.textAlign = "right";
      ctx.font = "600 15px Arial, sans-serif";
      ctx.fillText(
        `${progress.percent}% · ${progress.maxed}/${progress.count} maxed`,
        width - padding,
        y + 24,
      );
    }

    category.units.forEach((unit, index) => {
      const column = index % category.columns;
      const row = Math.floor(index / category.columns);
      const cellX = padding + column * category.cellWidth;
      const cellY = y + 48 + row * category.cellHeight;
      const size = 60;
      const iconX = cellX + (category.cellWidth - size) / 2;
      drawUnitIcon(ctx, unit, category.kind, iconX, cellY, size, images);
    });
    y += category.height;
  });

  ctx.fillStyle = "#f6b92b";
  ctx.textAlign = "center";
  ctx.font = "14px Arial, sans-serif";
  ctx.fillText("Clash Of Clans Stats · Created by Dark", width / 2, height - 42);
  return canvas;
}

export function PlayerStatsDownload({ player }: { player: Player }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function download() {
    setDownloading(true);
    setError("");
    setNotice("");
    try {
      const categories = getExportCategories(player);
      const { images, missing } = await loadUnitIcons(categories);
      const league = getLeague(player);
      const leagueImage = league?.icon
        ? await loadImage(
            `/api/league-icon?src=${encodeURIComponent(league.icon)}`,
          )
        : null;
      const canvas = createStatsImage(player, categories, images, leagueImage);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error("Could not create the PNG file."));
        }, "image/png");
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const playerName = cleanName(player.name).replace(/[^a-z0-9_-]/g, "-");
      const tag = player.tag.replace(/[^a-zA-Z0-9]/g, "");
      link.href = url;
      link.download = `${playerName}-${tag}-stats.png`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      if (missing > 0) {
        setNotice("Some icons were unavailable; initials are shown in their place.");
      }
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Could not download player stats.",
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="player-stats-download">
      <button
        className="button"
        type="button"
        onClick={download}
        disabled={downloading}
      >
        {downloading ? "Preparing PNG..." : "Download player stats"}
      </button>
      {notice && <p className="muted" role="status">{notice}</p>}
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
}
