import { describe, expect, it } from "vitest";
import { isSiegeMachine, isSuperTroop } from "./troops";

describe("isSuperTroop", () => {
  it("recognizes super troop variants", () => {
    expect(isSuperTroop("Super Barbarian")).toBe(true);
    expect(isSuperTroop("Sneaky Goblin")).toBe(true);
    expect(isSuperTroop("Barbarian")).toBe(false);
  });

  describe("isSiegeMachine", () => {
    it("recognizes siege machines separately from troops", () => {
      expect(isSiegeMachine("Wall Wrecker")).toBe(true);
      expect(isSiegeMachine("Sky Wagon")).toBe(true);
      expect(isSiegeMachine("Air Troop Launcher")).toBe(false);
      expect(isSiegeMachine("Barbarian")).toBe(false);
    });
  });
});
