// Town Hall-specific level caps from Supercell game data, normalized in Wire15/clash-buddy.
export type LevelCategory =
  "heroes" | "pets" | "troops" | "spells" | "equipment" | "siege";

const LEVEL_CAPS: Record<LevelCategory, Record<string, readonly number[]>> = {
  heroes: {
    "Archer Queen": [
      0, 0, 0, 0, 0, 0, 0, 10, 30, 40, 50, 65, 75, 85, 90, 95, 100, 110,
    ],
    "Barbarian King": [
      0, 0, 0, 1, 1, 1, 10, 20, 30, 40, 50, 65, 75, 85, 90, 95, 100, 110,
    ],
    "Dragon Duke": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 15, 20, 25],
    "Grand Warden": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 40, 50, 60, 65, 70, 75, 85,
    ],
    "Minion Prince": [
      0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95,
    ],
    "Royal Champion": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 30, 40, 45, 50, 55,
    ],
  },
  pets: {
    "Angry Jelly": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10],
    Crow: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10],
    Diggy: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 15],
    "Electro Owl": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 15, 15, 15],
    Frosty: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 15, 15],
    LASSI: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 15, 15, 15, 15],
    "Mighty Yak": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 15, 15, 15, 15],
    Phoenix: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10],
    "Poison Lizard": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 15, 15],
    Sneezy: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
    "Spirit Fox": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10],
    Unicorn: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 15, 15],
  },
  troops: {
    "Apprentice Warden": [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 4, 4, 4],
    Archer: [0, 0, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9, 9, 10, 11, 12, 13, 14],
    "Azure Dragon": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    "Baby Dragon": [0, 0, 1, 1, 1, 1, 1, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    Balloon: [0, 0, 1, 2, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10, 10, 11, 12, 13],
    Barbarian: [0, 0, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9, 9, 10, 11, 12, 12, 13],
    "Barbarian Kicker": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    Barcher: [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    "Battle Ram": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    Bowler: [0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "Broom Witch": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    COOKIE: [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    Disarmer: [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    Dragon: [0, 0, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    "Dragon Rider": [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 4, 5, 6],
    Druid: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6],
    "Electro Dragon": [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    "Electro Titan": [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 4, 5],
    Elephant: [0, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    "Elephant Rider": [
      0, 0, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
    ],
    "Event Meteor Golem": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    Firecracker: [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    Furnace: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 4],
    Giant: [0, 0, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14],
    "Giant Giant": [
      0, 0, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    ],
    "Giant Skeleton": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    "Giant Thrower": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    Goblin: [0, 0, 2, 2, 3, 3, 4, 5, 6, 7, 7, 8, 8, 8, 9, 9, 9, 10],
    Golem: [0, 0, 1, 1, 1, 1, 1, 2, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15],
    Headhunter: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 4],
    Healer: [0, 0, 1, 1, 1, 1, 2, 3, 4, 4, 5, 5, 6, 7, 8, 9, 10, 11],
    "Hog Rider": [0, 0, 1, 1, 1, 1, 2, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15],
    "Hog Wizard": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    "Ice Golem": [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 5, 5, 6, 7, 8, 9, 9],
    "Ice Hound": [0, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
    "Ice Minion": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    "Ice Wizard": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    "Inferno Dragon": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 12, 12, 12, 12, 12, 12,
    ],
    KANE: [
      0, 0, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    ],
    "Lava Hound": [0, 0, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 6, 6, 7, 7, 8],
    Lavaloon: [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    MECHA: [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    Miner: [0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 5, 6, 7, 8, 9, 10, 11, 12],
    Minion: [0, 0, 1, 1, 1, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    "Party Wizard": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    PEKKA: [0, 0, 1, 1, 1, 1, 1, 3, 4, 6, 7, 8, 9, 9, 10, 11, 12, 13],
    "Pumpkin Barbarian Armored": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    "Ram Rider": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    Rider: [0, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    "Rocket Balloon": [0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    "Root Rider": [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 4],
    "Royal Ghost": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    "Ruin Witch": [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4],
    "Skeleton Barrel": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    "Snake Barrel": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    "Sneaky Goblin": [0, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    "Super Archer": [
      0, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
    ],
    "Super Barbarian": [0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    "Super Bowler": [
      0, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
    ],
    "Super Dragon": [
      0, 0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
    ],
    "Super Giant": [
      0, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
    ],
    "Super Hog Rider": [
      0, 0, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
    ],
    "Super Miner": [
      0, 0, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
    ],
    "Super Minion": [
      0, 0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
    ],
    "Super Valkyrie": [
      0, 0, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
    ],
    "Super Wall Breaker": [
      0, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
    ],
    "Super Witch": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8, 8, 8],
    "Super Wizard": [
      0, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
    ],
    "Super Yeti": [0, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
    "Tax Collector": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    Thrower: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4],
    "Totem Thrower": [
      0, 0, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
    ],
    "Trap Air Skeleton": [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    "Undead Wrestler Big Boy": [
      0, 0, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
    ],
    UndeadWrestler: [
      0, 0, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
    ],
    Valkyrie: [0, 0, 1, 1, 1, 1, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12],
    "Wall Breaker": [0, 0, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    Witch: [0, 0, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 5, 5, 6, 7, 7, 8],
    "Witch Golem": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    "Witch Golem Big Boy": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    Wizard: [0, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14],
    YEETer: [
      0, 0, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    ],
    Yeti: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8],
  },
  spells: {
    AngrySpell: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4],
    BagOfFrostmites: [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    "Bat Spell": [0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 4, 5, 5, 5, 6, 6, 7, 8],
    Birthday2017: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    Clone: [0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 5, 5, 6, 7, 8, 8, 8, 9],
    Earthquake: [0, 0, 1, 1, 1, 1, 1, 2, 3, 4, 5, 5, 5, 6, 6, 7, 7, 8],
    Freeze: [0, 0, 0, 0, 0, 0, 0, 0, 2, 5, 6, 7, 7, 7, 7, 7, 7, 8],
    Haste: [0, 0, 1, 1, 1, 1, 1, 1, 2, 4, 5, 5, 5, 5, 5, 5, 6, 7],
    Healing: [0, 0, 0, 2, 2, 3, 4, 5, 6, 7, 7, 7, 8, 8, 9, 10, 11, 12],
    "Ice Block": [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6],
    Invisibility: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 4, 4, 4, 4, 4],
    Jump: [0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 5, 5],
    Lightning: [0, 0, 2, 3, 4, 4, 4, 5, 6, 7, 8, 9, 9, 9, 10, 11, 12, 13],
    Overgrowth: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5],
    Poison: [0, 0, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    Rage: [0, 0, 0, 0, 2, 3, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7],
    Recall: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7],
    Revive: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5],
    "Santas Surprise": [
      0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
    ],
    "Skeleton Spell": [0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 4, 6, 7, 7, 8, 8, 8, 8],
    "Totem Spell": [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4],
    "Yellow Card": [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  equipment: {
    "Action Figure": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Archer Puppet": [
      0, 0, 0, 0, 0, 0, 0, 9, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18,
    ],
    "Barbarian Puppet": [
      0, 0, 0, 0, 0, 0, 0, 9, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18,
    ],
    "Portal Pendant": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Dark Crown": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Dark Orb": [0, 0, 0, 0, 0, 0, 0, 9, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18],
    "Draconic Counter": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Earthquake Boots": [
      0, 0, 0, 0, 0, 0, 0, 9, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18,
    ],
    "Electro Boots": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    ElectroAttack: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 18],
    "Eternal Tome": [
      0, 0, 0, 0, 0, 0, 0, 9, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18,
    ],
    "Fire Heart": [
      0, 0, 0, 0, 0, 0, 0, 9, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18,
    ],
    Fireball: [0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27],
    "Flame Blower": [
      0, 0, 0, 0, 0, 0, 0, 9, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18,
    ],
    "Frost Flake": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Frozen Arrow": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Giant Gauntlet": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Haste Vial": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 18, 18, 18],
    "Healer Puppet": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 18, 18, 18, 18, 18,
    ],
    "Healing Tome": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 18, 18, 18, 18, 18,
    ],
    "Henchmen Puppet": [
      0, 0, 0, 0, 0, 0, 0, 9, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18,
    ],
    "Heroic Torch": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Hog Rider Puppet": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 18, 18, 18, 18,
    ],
    "Invisibility Vial": [
      0, 0, 0, 0, 0, 0, 0, 9, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18,
    ],
    "Lavaloon Puppet": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Life Gem": [0, 0, 0, 0, 0, 0, 0, 9, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18],
    "Magic Mirror": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Metal Pants": [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 18, 18, 18,
    ],
    "Meteor Staff": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Monolith Arrow": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "MP Trap Shield": [
      0, 0, 0, 0, 0, 0, 0, 9, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18,
    ],
    "Noble Iron": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 18, 18, 18, 18, 18],
    "Piercing Arrow": [
      0, 0, 0, 0, 0, 0, 0, 0, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18,
    ],
    "Rage Gem": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 15, 15, 18, 18, 18, 18, 18],
    "Rage Vial": [
      0, 0, 0, 0, 0, 0, 0, 9, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18,
    ],
    "Revenge Deck": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 27, 27, 27],
    "Rocket Backpack": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Rocket Spear": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Royal Gem": [
      0, 0, 0, 0, 0, 0, 0, 9, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18,
    ],
    "Seeking Shield": [
      0, 0, 0, 0, 0, 0, 0, 9, 9, 12, 12, 15, 15, 18, 18, 18, 18, 18,
    ],
    "Snake Bracelet": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Spiky Ball": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Stick Horse": [
      0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 21, 24, 27, 27, 27,
    ],
    "Stun Blaster": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 18, 18],
    Vampstache: [0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 12, 15, 15, 18, 18, 18, 18, 18],
  },
  siege: {
    "Sky Wagon": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4],
    "Battle Blimp": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 5, 5, 6],
    "Battle Drill": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6],
    "Flame Flinger": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 5, 5],
    "Log Launcher": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 5, 5, 6],
    "Siege Barracks": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 5, 5, 6],
    "Stone Slammer": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 5, 5, 6],
    "Troop Launcher": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4],
    "Wall Wrecker": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 5, 5, 6],
  },
};

const UNIT_NAME_ALIASES: Record<string, string> = {
  lightningspell: "lightning",
  healingspell: "healing",
  ragespell: "rage",
  jumpspell: "jump",
  freezespell: "freeze",
  clonespell: "clone",
  invisibilityspell: "invisibility",
  recallspell: "recall",
  revivespell: "revive",
  poisonspell: "poison",
  earthquakespell: "earthquake",
  hastespell: "haste",
  iceblockspell: "iceblock",
  overgrowthspell: "overgrowth",
  santassurprise: "santassurprise",
  greedyraven: "crow",
  hogriderdoll: "hogriderpuppet",
  cosmicportal: "portalpendant",
  frostcharm: "frostflake",
};

const CATALOG_EXCLUSIONS: Partial<Record<LevelCategory, ReadonlySet<string>>> =
  {
    troops: new Set([
      "Azure Dragon",
      "Barbarian Kicker",
      "Barcher",
      "Battle Ram",
      "Broom Witch",
      "COOKIE",
      "Disarmer",
      "Elephant",
      "Elephant Rider",
      "Event Meteor Golem",
      "Firecracker",
      "Giant Giant",
      "Giant Skeleton",
      "Giant Thrower",
      "Hog Wizard",
      "Ice Minion",
      "Ice Wizard",
      "KANE",
      "Lavaloon",
      "MECHA",
      "Party Wizard",
      "Pumpkin Barbarian Armored",
      "Ram Rider",
      "Rider",
      "Royal Ghost",
      "Skeleton Barrel",
      "Snake Barrel",
      "Tax Collector",
      "Totem Thrower",
      "Trap Air Skeleton",
      "Undead Wrestler Big Boy",
      "UndeadWrestler",
      "Witch Golem",
      "Witch Golem Big Boy",
      "YEETer",
    ]),
    spells: new Set([
      "AngrySpell",
      "BagOfFrostmites",
      "Birthday2017",
      "Santas Surprise",
      "Yellow Card",
    ]),
    equipment: new Set([
      "Draconic Counter",
      "ElectroAttack",
      "MP Trap Shield",
      "Piercing Arrow",
    ]),
  };

function normalizeUnitName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function canonicalUnitName(name: string): string {
  const normalized = normalizeUnitName(name);
  return UNIT_NAME_ALIASES[normalized] ?? normalized;
}

const UNIT_UNLOCKS_BY_CATEGORY: Partial<
  Record<LevelCategory, Readonly<Record<string, number>>>
> = {
  heroes: {
    "Barbarian King": 4,
    "Archer Queen": 8,
    "Grand Warden": 11,
    "Royal Champion": 13,
    "Minion Prince": 9,
    "Dragon Duke": 15,
  },
  troops: {
    Barbarian: 1,
    Archer: 1,
    Giant: 1,
    Goblin: 2,
    "Wall Breaker": 3,
    Balloon: 4,
    Wizard: 5,
    Healer: 6,
    Dragon: 7,
    PEKKA: 8,
    "Baby Dragon": 9,
    Miner: 10,
    "Electro Dragon": 11,
    Yeti: 12,
    "Dragon Rider": 13,
    "Electro Titan": 14,
    "Root Rider": 15,
    Thrower: 16,
    Minion: 7,
    "Hog Rider": 7,
    Valkyrie: 8,
    Golem: 8,
    Witch: 9,
    "Lava Hound": 9,
    Bowler: 10,
    "Ice Golem": 11,
    Headhunter: 12,
    "Apprentice Warden": 13,
    Druid: 14,
    Furnace: 15,
    "Ruin Witch": 16,
  },
  spells: {
    Lightning: 5,
    Healing: 6,
    Rage: 7,
    Poison: 8,
    Earthquake: 8,
    Jump: 9,
    Freeze: 9,
    Haste: 9,
    "Skeleton Spell": 9,
    Clone: 10,
    "Bat Spell": 10,
    Invisibility: 11,
    Overgrowth: 12,
    Recall: 13,
    "Ice Block": 14,
    Revive: 15,
    AngrySpell: 15,
    "Totem Spell": 16,
  },
  siege: {
    "Wall Wrecker": 12,
    "Battle Blimp": 12,
    "Stone Slammer": 12,
    "Siege Barracks": 13,
    "Log Launcher": 13,
    "Flame Flinger": 14,
    "Battle Drill": 15,
    "Troop Launcher": 16,
    "Sky Wagon": 16,
  },
};

const EQUIPMENT_HERO_BY_NAME: Readonly<Record<string, string>> = {
  "Action Figure": "Archer Queen",
  "Archer Puppet": "Archer Queen",
  "Barbarian Puppet": "Barbarian King",
  "Portal Pendant": "Minion Prince",
  "Dark Crown": "Minion Prince",
  "Dark Orb": "Minion Prince",
  "Earthquake Boots": "Barbarian King",
  "Electro Boots": "Royal Champion",
  "Electro Fangs": "Dragon Duke",
  "Eternal Tome": "Grand Warden",
  "Fire Heart": "Dragon Duke",
  Fireball: "Grand Warden",
  "Flame Blower": "Dragon Duke",
  "Frost Flake": "Royal Champion",
  "Frozen Arrow": "Archer Queen",
  "Giant Arrow": "Archer Queen",
  "Giant Gauntlet": "Barbarian King",
  "Haste Vial": "Royal Champion",
  "Healer Puppet": "Archer Queen",
  "Healing Tome": "Grand Warden",
  "Henchmen Puppet": "Minion Prince",
  "Heroic Torch": "Grand Warden",
  "Hog Rider Puppet": "Royal Champion",
  "Invisibility Vial": "Archer Queen",
  "Lavaloon Puppet": "Grand Warden",
  "Life Gem": "Grand Warden",
  "Magic Mirror": "Archer Queen",
  "Metal Pants": "Minion Prince",
  "Meteor Staff": "Minion Prince",
  "Monolith Arrow": "Archer Queen",
  "Noble Iron": "Minion Prince",
  "Rage Gem": "Grand Warden",
  "Rage Vial": "Barbarian King",
  "Revenge Deck": "Dragon Duke",
  "Rocket Backpack": "Dragon Duke",
  "Rocket Spear": "Royal Champion",
  "Royal Gem": "Royal Champion",
  "Seeking Shield": "Royal Champion",
  "Snake Bracelet": "Barbarian King",
  "Spiky Ball": "Barbarian King",
  "Stick Horse": "Barbarian King",
  "Stun Blaster": "Dragon Duke",
  Vampstache: "Barbarian King",
};

const EQUIPMENT_BLACKSMITH_UNLOCK_LEVEL: Readonly<Record<string, number>> = {
  "Earthquake Boots": 1,
  "Giant Arrow": 2,
  "Metal Pants": 3,
  Vampstache: 3,
  "Rage Gem": 4,
  "Healer Puppet": 5,
  "Noble Iron": 5,
  "Healing Tome": 6,
  "Hog Rider Puppet": 7,
  "Haste Vial": 8,
  "Electro Fangs": 10,
};

const EQUIPMENT_UNLOCKED_WITH_HERO = new Set([
  "Barbarian Puppet",
  "Rage Vial",
  "Archer Puppet",
  "Invisibility Vial",
  "Eternal Tome",
  "Life Gem",
  "Royal Gem",
  "Seeking Shield",
  "Henchmen Puppet",
  "Dark Orb",
  "Fire Heart",
  "Flame Blower",
]);

export function isEquipmentUnlockedWithHero(name: string): boolean {
  const canonicalName = canonicalUnitName(name);
  return [...EQUIPMENT_UNLOCKED_WITH_HERO].some(
    (candidate) => canonicalUnitName(candidate) === canonicalName,
  );
}

const SPELL_DISPLAY_NAMES: Record<string, string> = {
  lightning: "Lightning Spell",
  healing: "Healing Spell",
  rage: "Rage Spell",
  poison: "Poison Spell",
  earthquake: "Earthquake Spell",
  jump: "Jump Spell",
  freeze: "Freeze Spell",
  haste: "Haste Spell",
  skeletonspell: "Skeleton Spell",
  clone: "Clone Spell",
  batspell: "Bat Spell",
  invisibility: "Invisibility Spell",
  overgrowth: "Overgrowth Spell",
  recall: "Recall Spell",
  iceblock: "Ice Block Spell",
  revive: "Revive Spell",
  angryspell: "Angry Spell",
  totemspell: "Totem Spell",
};

export function unitUnlockTownHall(
  category: LevelCategory,
  name: string,
): number | undefined {
  const canonicalName = canonicalUnitName(name);
  if (category === "equipment") {
    const equipmentName = Object.keys(EQUIPMENT_HERO_BY_NAME).find(
      (candidate) => canonicalUnitName(candidate) === canonicalName,
    );
    if (!equipmentName) return undefined;
    const hero = EQUIPMENT_HERO_BY_NAME[equipmentName];
    if (!hero) return undefined;

    const heroUnlockTownHall = unitUnlockTownHall("heroes", hero);
    const blacksmithLevel = Object.entries(
      EQUIPMENT_BLACKSMITH_UNLOCK_LEVEL,
    ).find(
      ([candidate]) => canonicalUnitName(candidate) === canonicalName,
    )?.[1];
    const defaultGear = EQUIPMENT_UNLOCKED_WITH_HERO.has(equipmentName);
    const blacksmithUnlockTownHall = defaultGear
      ? undefined
      : (blacksmithLevel ?? 1) + 7;

    if (heroUnlockTownHall === undefined) return blacksmithUnlockTownHall;
    return Math.max(heroUnlockTownHall, blacksmithUnlockTownHall ?? 0);
  }

  const explicitUnlock = Object.entries(
    UNIT_UNLOCKS_BY_CATEGORY[category] ?? {},
  ).find(([candidate]) => canonicalUnitName(candidate) === canonicalName)?.[1];
  if (explicitUnlock !== undefined) return explicitUnlock;

  if (category !== "heroes" && category !== "pets") {
    return undefined;
  }

  const levels = Object.entries(LEVEL_CAPS[category]).find(
    ([candidate]) => canonicalUnitName(candidate) === canonicalName,
  )?.[1];
  const firstAvailableLevel = levels?.findIndex((level) => level > 0) ?? -1;
  return firstAvailableLevel < 0 ? undefined : firstAvailableLevel + 1;
}

export function canonicalUnitDisplayName(
  category: LevelCategory,
  name: string,
): string {
  const canonicalName = canonicalUnitName(name);
  if (category === "spells") return SPELL_DISPLAY_NAMES[canonicalName] ?? name;
  if (category !== "equipment") return name;
  return (
    Object.keys(LEVEL_CAPS.equipment).find(
      (candidate) => canonicalUnitName(candidate) === canonicalName,
    ) ?? name
  );
}

export function unitCatalog(
  category: LevelCategory,
): { name: string; maxLevel: number }[] {
  return Object.entries(LEVEL_CAPS[category])
    .filter(([name, levels]) => {
      const distinctLevels = new Set(levels.filter((level) => level > 0));
      const singleLevelPet = category === "pets" && name === "Crow";
      const availableEquipment =
        category === "equipment" && levels.some((level) => level > 0);
      return (
        !CATALOG_EXCLUSIONS[category]?.has(name) &&
        unitUnlockTownHall(category, name) !== undefined &&
        (availableEquipment || distinctLevels.size > 1 || singleLevelPet)
      );
    })
    .map(([name, levels]) => ({
      name,
      maxLevel: Math.max(...levels),
    }));
}

export function maxLevelAtTownHall(
  category: LevelCategory,
  name: string,
  townHallLevel: number,
): number | undefined {
  if (!Number.isInteger(townHallLevel) || townHallLevel < 1) return undefined;
  const canonicalName = canonicalUnitName(name);
  const key = Object.keys(LEVEL_CAPS[category]).find(
    (candidate) => canonicalUnitName(candidate) === canonicalName,
  );
  const levels = key ? LEVEL_CAPS[category][key] : undefined;
  return levels?.[Math.min(townHallLevel, 18) - 1];
}
