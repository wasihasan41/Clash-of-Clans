export type UnitKind =
  "hero" | "troop" | "siege" | "spell" | "equipment" | "pet";

const BASE = "https://assets.clashk.ing";

// ClashKing ka documented rule: lowercase, space -> _, aur . ? ’ hata do
export function cleanName(name: string): string {
  return name.toLowerCase().replace(/ /g, "_").replace(/[.?’]/g, "");
}

// API pets ko bhi "troops" list mein hi bhejti hai, isliye naam se pehchante hain.
// Naya pet aaye toh uska cleanName yahan add kar do.
const PET_NAMES = new Set([
  "lassi",
  "electro_owl",
  "mighty_yak",
  "unicorn",
  "frosty",
  "diggy",
  "poison_lizard",
  "phoenix",
  "spirit_fox",
  "angry_jelly",
  "sneezy",
  "greedy_raven",
]);

export function isPet(name: string): boolean {
  return PET_NAMES.has(cleanName(name));
}

// Jo icons ClashKing ke paas abhi nahi hain, unhe yahan apni file se set karo.
// Key = cleanName(naam), value = public/ folder ke andar ki file ka path
const LOCAL_ICONS: Record<string, string> = {
  portal_pendant: "/icons/equipment/portal_pendant.jpg",
  // naya_equipment: "/icons/equipment/naya_equipment.png",
};

// Ek se zyada URL isliye, kyunki hero/equipment/pet ka exact path docs mein nahi mila.
// Pehla jo load ho jaaye wahi use hota hai, koi bhi load na ho toh letter wala tile dikhta hai.
export function iconCandidates(kind: UnitKind, name: string): string[] {
  const n = cleanName(name);
  const local = LOCAL_ICONS[n];
  if (local) return [local];

  switch (kind) {
    case "troop":
    case "siege":
      return [`${BASE}/troops/${n}/icon.webp`]; // documented
    case "spell":
      return [
        `${BASE}/spells/${n}.webp`,
        `${BASE}/spells/${n.endsWith("_spell") ? n.slice(0, -6) : `${n}_spell`}.webp`,
      ]; // documented
    case "hero":
      return [`${BASE}/heroes/${n}/icon.webp`]; // guess
    case "equipment":
      return [
        `${BASE}/equipment/${n}.webp`,
        `${BASE}/equipment/${n}/icon.webp`,
        `${BASE}/heroes/equipment/${n}.webp`,
      ]; // guess
    case "pet":
      return [
        `${BASE}/pets/${n}/icon.webp`,
        `${BASE}/pets/${n}.webp`,
        `${BASE}/troops/${n}/icon.webp`,
      ]; // guess
  }
}

// Town Hall icon. Pehla URL ClashKing ke documented building path ke template se banaya hai,
// pakka nahi ki exist karta hai. Doosra tumhare apne project ka local file (public/icons/townhalls/).
export function townHallIconCandidates(level: number): string[] {
  return [
    `${BASE}/buildings/home-village/town_hall/level_${level}.webp`,
    `/icons/townhalls/th${level}.png`,
  ];
}
