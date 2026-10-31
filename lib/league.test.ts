import { describe, expect, it } from "vitest";
import { getLeague } from "./league";

describe("getLeague", () => {
  it("returns null when the player has no league", () => {
    expect(getLeague({})).toBeNull();
  });

  it("prefers the new leagueTier over the old league", () => {
    const result = getLeague({
      league: { name: "Old League", iconUrls: { small: "old.png" } },
      leagueTier: { name: "Electro League 25", iconUrls: { small: "new.png" } },
    });
    expect(result).toEqual({ name: "Electro League 25", icon: "new.png" });
  });

  it("falls back to the old league when leagueTier is missing", () => {
    expect(getLeague({ league: { name: "Crystal League", iconUrls: { small: "c.png" } } })).toEqual({
      name: "Crystal League",
      icon: "c.png",
    });
  });

  it("picks the next available icon size", () => {
    expect(getLeague({ leagueTier: { name: "X", iconUrls: { large: "big.png" } } })?.icon).toBe(
      "big.png"
    );
  });

  it("gives a null icon when there are no icon urls", () => {
    expect(getLeague({ leagueTier: { name: "X" } })).toEqual({ name: "X", icon: null });
  });
});