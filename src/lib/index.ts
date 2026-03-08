// types
export type ModType = "NONE" | "HEAT_SINK" | "MULTI_HACK";
export type ModRarity = "COMMON" | "RARE" | "VERY_RARE";

export interface EmptyMod {
  type: "NONE";
}

export interface ActiveMod {
  type: Exclude<ModType, "NONE">;
  rarity: ModRarity;
}

export type Mod = EmptyMod | ActiveMod;

export type PortalAlignment = "FRIENDLY" | "NEUTRAL_OR_ENEMY";

// Constants
export const BASE_COOLDOWN_NEUTRAL = 300;
export const BASE_COOLDOWN_FRIENDLY = 180;
export const BASE_HACKS = 4;

const MULTI_HACK_BONUS: Record<ModRarity, number> = {
  COMMON: 4,
  RARE: 8,
  VERY_RARE: 12,
};

const HEAT_SINK_REDUCTION: Record<ModRarity, number> = {
  COMMON: 0.2,
  RARE: 0.5,
  VERY_RARE: 0.7,
};

const RARITY_ORDER: ModRarity[] = ["VERY_RARE", "RARE", "COMMON"];

// Helpers
function getBaseCooldown(alignment: PortalAlignment) {
  return alignment === "FRIENDLY"
    ? BASE_COOLDOWN_FRIENDLY
    : BASE_COOLDOWN_NEUTRAL;
}

function sortByRarityDesc(rarities: ModRarity[]) {
  return rarities.sort(
    (a, b) => RARITY_ORDER.indexOf(a) - RARITY_ORDER.indexOf(b),
  );
}

export function formatDuration(totalSeconds: number): string {
  const secondsTotal = Math.max(0, Math.floor(totalSeconds))

  const hours = Math.floor(secondsTotal / 3600)
  const minutes = Math.floor((secondsTotal % 3600) / 60)
  const seconds = secondsTotal % 60

  const mm = minutes.toString().padStart(2, "0")
  const ss = seconds.toString().padStart(2, "0")

  if (hours > 0) {
    const hh = hours.toString().padStart(2, "0")
    return `${hh}:${mm}:${ss}`
  }

  return `${minutes}:${ss}`
}
export function calculateTotalHacks(mods: Mod[]): number {
  const multiHackRarities = mods
    .filter((m): m is ActiveMod => m.type === "MULTI_HACK")
    .map((m) => m.rarity);

  if (multiHackRarities.length === 0) return BASE_HACKS;

  const sorted = sortByRarityDesc(multiHackRarities);

  let bonus = 0;

  sorted.forEach((rarity, index) => {
    const value = MULTI_HACK_BONUS[rarity];
    bonus += index === 0 ? value : value / 2;
  });

  return BASE_HACKS + bonus;
}

export function calculateCooldown(
  mods: Mod[],
  alignment: PortalAlignment,
): number {
  const base = getBaseCooldown(alignment);

  const heatSinkRarities = mods
    .filter((m): m is ActiveMod => m.type === "HEAT_SINK")
    .map((m) => m.rarity);

  if (heatSinkRarities.length === 0) return base;

  const sorted = sortByRarityDesc(heatSinkRarities);

  let multiplier = 1;

  sorted.forEach((rarity, index) => {
    const reduction = HEAT_SINK_REDUCTION[rarity];
    multiplier *= index === 0 ? 1 - reduction : 1 - reduction / 2;
  });

  return Math.floor(base * multiplier);
}

export function calculatePortalStats(mods: Mod[], alignment: PortalAlignment) {
  const totalHacks = calculateTotalHacks(mods)
  const cooldownSeconds = calculateCooldown(mods, alignment);
  const timeToBurnout = (totalHacks - 1) * cooldownSeconds;

  return {
    totalHacks,
    cooldownSeconds,
    timeToBurnout
  };
}
