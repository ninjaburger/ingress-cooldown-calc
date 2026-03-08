import { describe, it, expect } from "vitest";
import {
  calculateTotalHacks,
  calculateCooldown,
  calculatePortalStats,
  type Mod,
  type PortalAlignment,
} from "$lib";

describe("Multi-hack scenarios", () => {
  const scenarios = [
    {
      label: "VR",
      rarities: ["VERY_RARE"],
      expected: 16
    },
    {
      label: "VR + Rare",
      rarities: ["VERY_RARE", "RARE"],
      expected: 20
    },
    {
      label: "Common + Common",
      rarities: ["COMMON", "COMMON"],
      expected: 10
    }
  ] as const

  it.each(scenarios)(
    "$label → $expected hacks",
    ({ rarities, expected }) => {
      const mods = rarities.map(rarity => ({ type: "MULTI_HACK", rarity })) as Mod[]
      expect(calculateTotalHacks(mods)).toBe(expected)
    }
  )
})

describe("Heat sink scenarios", () => {
  const alignments: PortalAlignment[] = ["FRIENDLY", "NEUTRAL_OR_ENEMY"]
  const scenarios = [
    {
      name: "Single VR",
      mods: [{ type: "HEAT_SINK", rarity: "VERY_RARE" }] as Mod[],
      expected: {
        FRIENDLY: 54, NEUTRAL_OR_ENEMY: 90
      }
    },
    {
      name: "VR + Common",
      mods: [
        { type: "HEAT_SINK", rarity: "VERY_RARE" },
        { type: "HEAT_SINK", rarity: "COMMON" }
      ] as Mod[],
      expected: {
        FRIENDLY: 48, NEUTRAL_OR_ENEMY: 81
      }
    },
    {
      name: "VR + VR",
      mods: [
        { type: "HEAT_SINK", rarity: "VERY_RARE" },
        { type: "HEAT_SINK", rarity: "VERY_RARE" }
      ] as Mod[],
      expected: {
        FRIENDLY: 35, NEUTRAL_OR_ENEMY: 58
      }
    }
  ]

  describe("Heat Sink scenarios", () => {
    it.each(scenarios.flatMap(s =>
      alignments.map(alignment => ({
        name: `${s.name} (${alignment}) → ${s.expected[alignment]}s`,
        mods: s.mods,
        alignment,
        expected: s.expected[alignment]
      }))
    ))("$name", ({ mods, alignment, expected }) => {
      expect(calculateCooldown(mods, alignment)).toBe(expected)
    })
  })
});

describe("Combined mods", () => {
  const alignments: PortalAlignment[] = ["FRIENDLY", "NEUTRAL_OR_ENEMY"]
  const scenarios = [
    {
      name: "1 VRHS + 1 VRMH",
      mods: [
        { type: "HEAT_SINK", rarity: "VERY_RARE" },
        { type: "MULTI_HACK", rarity: "VERY_RARE" }
      ] as Mod[],
      expected: {
        hacks: 16,
        cooldown: {
          FRIENDLY: 54,
          NEUTRAL_OR_ENEMY: 90
        }
      }
    },
    {
      name: "3 VRHS + 1 VRMH",
      mods: [
        { type: "HEAT_SINK", rarity: "VERY_RARE" },
        { type: "HEAT_SINK", rarity: "VERY_RARE" },
        { type: "HEAT_SINK", rarity: "VERY_RARE" },
        { type: "MULTI_HACK", rarity: "VERY_RARE" }
      ] as Mod[],
      expected: {
        hacks: 16,
        cooldown: {
          FRIENDLY: 22,
          NEUTRAL_OR_ENEMY: 38
        }
      }
    },
    {
      name: "VRHS + Rare MH",
      mods: [
        { type: "HEAT_SINK", rarity: "VERY_RARE" },
        { type: "MULTI_HACK", rarity: "RARE" }
      ] as Mod[],
      expected: {
        hacks: 12,
        cooldown: {
          FRIENDLY: 54,
          NEUTRAL_OR_ENEMY: 90
        }
      }
    },
    {
      name: "Common HS + Common MH",
      mods: [
        { type: "HEAT_SINK", rarity: "COMMON" },
        { type: "MULTI_HACK", rarity: "COMMON" }
      ] as Mod[],
      expected: {
        hacks: 8,
        cooldown: {
          FRIENDLY: 144,
          NEUTRAL_OR_ENEMY: 240
        }
      }
    }
  ]

  it.each(
    scenarios.flatMap(s =>
      alignments.map(alignment => ({
        name: `${s.name} (${alignment}) → ${s.expected.hacks} hacks - ${s.expected.cooldown[alignment]}s`,
        mods: s.mods,
        alignment,
        expectedCooldown: s.expected.cooldown[alignment],
        expectedHacks: s.expected.hacks
      }))
    )
  )("$name", ({ mods, alignment, expectedCooldown, expectedHacks }) => {
    const { totalHacks, cooldownSeconds } = calculatePortalStats(mods, alignment)
    expect(totalHacks).toBe(expectedHacks)
    expect(cooldownSeconds).toBe(expectedCooldown)
  })
});
