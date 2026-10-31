const SUPER_TROOP_NAMES = new Set([
  "Super Barbarian",
  "Super Archer",
  "Super Giant",
  "Sneaky Goblin",
  "Super Wall Breaker",
  "Rocket Balloon",
  "Super Wizard",
  "Super Dragon",
  "Inferno Dragon",
  "Super Minion",
  "Super Valkyrie",
  "Super Witch",
  "Ice Hound",
  "Super Bowler",
  "Super Miner",
  "Super Yeti",
  "Super Hog Rider",
]);

const SIEGE_MACHINE_NAMES = new Set([
  "Wall Wrecker",
  "Battle Blimp",
  "Stone Slammer",
  "Siege Barracks",
  "Log Launcher",
  "Flame Flinger",
  "Battle Drill",
  "Troop Launcher",
  "Air Troop Launcher",
]);

export function isSuperTroop(name: string): boolean {
  return SUPER_TROOP_NAMES.has(name);
}

export function isSiegeMachine(name: string): boolean {
  return SIEGE_MACHINE_NAMES.has(name);
}
