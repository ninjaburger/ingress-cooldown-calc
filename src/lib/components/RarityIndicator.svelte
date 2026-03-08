<script lang="ts">
  import type { Mod, ModRarity } from "$lib";

  const { mod }: { mod: Mod } = $props();

  type UIRarity = ModRarity | "NONE";

  const rarity: UIRarity = $derived(mod.type === "NONE" ? "NONE" : mod.rarity);

  const RARITY_COLORS: Record<UIRarity, string> = {
    NONE: "#374151",
    COMMON: "#49ebc3",
    RARE: "#b68bff",
    VERY_RARE: "#f781ff",
  };

  const color = $derived(RARITY_COLORS[rarity]);

  const c1 = $derived(rarity !== "NONE" ? color : RARITY_COLORS.NONE);
  const c2 = $derived(
    rarity === "RARE" || rarity === "VERY_RARE" ? color : RARITY_COLORS.NONE,
  );
  const c3 = $derived(rarity === "VERY_RARE" ? color : RARITY_COLORS.NONE);
</script>

<svg width="40" height="12" viewBox="0 0 40 12" fill="none" aria-hidden="true">
  <path d="M12 2 L6 10" stroke={c1} stroke-width="3" stroke-linecap="round" />
  <path d="M22 2 L16 10" stroke={c2} stroke-width="3" stroke-linecap="round" />
  <path d="M32 2 L26 10" stroke={c3} stroke-width="3" stroke-linecap="round" />
</svg>
