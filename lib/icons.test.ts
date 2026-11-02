import { describe, expect, it } from "vitest";
import { iconCandidates } from "./icons";

describe("iconCandidates", () => {
  it("finds the same Ice Block asset with or without the API's Spell suffix", () => {
    expect(iconCandidates("spell", "Ice Block")).toEqual([
      "https://assets.clashk.ing/spells/ice_block.webp",
      "https://assets.clashk.ing/spells/ice_block_spell.webp",
    ]);
    expect(iconCandidates("spell", "Ice Block Spell")).toEqual([
      "https://assets.clashk.ing/spells/ice_block_spell.webp",
      "https://assets.clashk.ing/spells/ice_block.webp",
    ]);
  });

  it("tries both spell asset names without changing the requested spell name", () => {
    expect(iconCandidates("spell", "Lightning Spell")).toEqual([
      "https://assets.clashk.ing/spells/lightning_spell.webp",
      "https://assets.clashk.ing/spells/lightning.webp",
    ]);
    expect(iconCandidates("spell", "Lightning")).toEqual([
      "https://assets.clashk.ing/spells/lightning.webp",
      "https://assets.clashk.ing/spells/lightning_spell.webp",
    ]);
  });
});
