export interface HeroLoadout {
  heroId: number;
  petId?: number;
  equipmentIds: number[];
}

const EQUIPMENT_NAMES: Record<number, string> = {
  0: "Barbarian Puppet",
  1: "Rage Vial",
  2: "Archer Puppet",
  3: "Invisibility Vial",
  4: "Eternal Tome",
  5: "Life Gem",
  6: "Seeking Shield",
  7: "Royal Gem",
  8: "Earthquake Boots",
  9: "Hog Rider Doll",
  10: "Giant Gauntlet",
  11: "Vampstache",
  12: "Haste Vial",
  13: "Rocket Spear",
  14: "Spiky Ball",
  15: "Frozen Arrow",
  16: "Monolith Arrow",
  17: "Giant Arrow",
  19: "Heroic Torch",
  20: "Healer Puppet",
  22: "Fireball",
  24: "Rage Gem",
  32: "Snake Bracelet",
  34: "Healing Tome",
  35: "Dark Crown",
  39: "Magic Mirror",
  40: "Electro Boots",
  41: "Lavaloon Puppet",
  42: "Henchmen Puppet",
  43: "Dark Orb",
  44: "Metal Pants",
  47: "Noble Iron",
  48: "Action Figure",
  49: "Meteor Staff",
  50: "Frost Flake",
  51: "Stick Horse",
  52: "Fire Heart",
  53: "Rocket Backpack",
  56: "Stun Blaster",
  57: "Flame Blower",
  59: "Electro Fangs",
  60: "Revenge Deck",
  61: "Portal Pendant",
};

const HERO_NAMES: Record<number, string> = {
  0: "Barbarian King",
  1: "Archer Queen",
  2: "Grand Warden",
  4: "Royal Champion",
  6: "Minion Prince",
  7: "Dragon Duke",
};

const PET_NAMES: Record<number, string> = {
  0: "L.A.S.S.I",
  1: "Mighty Yak",
  2: "Electro Owl",
  3: "Unicorn",
  4: "Phoenix",
  7: "Poison Lizard",
  8: "Diggy",
  9: "Frosty",
  10: "Spirit Fox",
  11: "Angry Jelly",
  16: "Sneezy",
  17: "Greedy Raven",
};

export function equipmentName(id: number): string | undefined {
  return EQUIPMENT_NAMES[id];
}

export function heroName(id: number): string | undefined {
  return HERO_NAMES[id];
}

export function petName(id: number): string | undefined {
  return PET_NAMES[id];
}

// Army code ka hero wala hissa: "h0p0e0_11-1p9e17_20-2m1p2e4_34-4p10e13_6i11x5d1x2..."
// Har hero: {heroId}[m{x}]p{petId}e{equip1}_{equip2}, aur heroes "-" se alag hote hain.
// Ye format maine asli army codes se samjha hai; ids are CopyArmy catalog ids.
export function parseHeroLoadouts(code: string | undefined): HeroLoadout[] {
  if (!code) return [];

  const section = /^h([0-9pem_-]*)/.exec(code)?.[1];
  if (!section) return [];

  const loadouts: HeroLoadout[] = [];
  for (const chunk of section.split("-")) {
    const match = /^(\d+)(?:m\d+)?(?:p(\d+))?(?:e(\d+)(?:_(\d+))?)?$/.exec(chunk);
    if (!match) continue;

    const [, hero, pet, equip1, equip2] = match;
    loadouts.push({
      heroId: Number(hero),
      petId: pet === undefined ? undefined : Number(pet),
      equipmentIds: [equip1, equip2].filter((e) => e !== undefined).map(Number),
    });
  }
  return loadouts;
}

export function loadoutSummary(loadouts: HeroLoadout[]): string {
  if (loadouts.length === 0) return "No heroes";
  const pets = loadouts.filter((l) => l.petId !== undefined).length;
  const equipment = loadouts.reduce((sum, l) => sum + l.equipmentIds.length, 0);
  return `${loadouts.length} heroes · ${pets} pets · ${equipment} equipment`;
}

// Hover par dikhane ke liye asli ids
export function loadoutDetails(loadouts: HeroLoadout[]): string {
  return loadouts
    .map(
      (l) =>
        `Hero #${l.heroId}` +
        (l.petId !== undefined ? ` | Pet #${l.petId}` : "") +
        (l.equipmentIds.length ? ` | Equipment #${l.equipmentIds.join(", #")}` : "")
    )
    .join("\n");
}
