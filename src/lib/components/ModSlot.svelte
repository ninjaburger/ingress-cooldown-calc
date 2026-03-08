<script lang="ts">
  import heatsinkImg from "$lib/assets/heat_sink.svg";
  import multihackImg from "$lib/assets/multi_hack.svg";

  import type { ActiveMod, Mod, ModRarity } from "$lib";
  import { Popover } from "bits-ui";
  import RarityIndicator from "$lib/components/RarityIndicator.svelte";

  const {
    mod,
    onUpdate,
    popoverSide,
  }: {
    mod: Mod;
    onUpdate: (mod: Mod) => void;
    popoverSide: "left" | "right";
  } = $props();

  let isOpen = $state(false);

  const isActiveMod = (mod: Mod): mod is ActiveMod => mod.type !== "NONE";
  const rarity = $derived(isActiveMod(mod) ? mod.rarity : undefined);

  const RARITY_COLORS: Record<ModRarity, string> = {
    COMMON: "#49ebc3",
    RARE: "#b68bff",
    VERY_RARE: "#f781ff",
  };
  const EMPTY_COLOR = "#374151";
  const rarityLabels: Record<ModRarity, string> = {
    COMMON: "C",
    RARE: "R",
    VERY_RARE: "VR",
  };
  const rarityEntries = Object.entries(rarityLabels) as [ModRarity, string][];

  function colorFor(mod: Mod): string {
    return mod.type === "NONE" ? EMPTY_COLOR : RARITY_COLORS[mod.rarity];
  }

  function updateMod(mod: Mod) {
    onUpdate(mod);
    isOpen = false;
  }
</script>

{#snippet rarityPicker(mod: ActiveMod)}
  <div class="rarity-picker">
    {#each rarityEntries as [rarity, label]}
      <button
        class={`rarity-option ${rarity}`}
        onclick={() => updateMod({ type: mod.type, rarity })}>
        {label}
      </button>
    {/each}
  </div>
{/snippet}

{#snippet modOption(
  type: "MULTI_HACK" | "HEAT_SINK",
  label: string,
  img: string,
  rarity: ModRarity,
)}
  <div>
    <div class="mb-3 flex items-center gap-2">
      <div
        class="flex h-6 w-6 items-center justify-center rounded border border-slate-700 bg-slate-800">
        <div class="h-4 w-4">
          <div class="relative flex h-full w-full items-center justify-center">
            <img
              src={img}
              alt={label}
              class="h-4/5 w-4/5 object-contain"
              style="filter: drop-shadow(0 0 8px #94a3b8)"
              aria-hidden="true" />
          </div>
        </div>
      </div>
      <h3 class="text-sm font-bold tracking-widest text-slate-300">
        {label}
      </h3>
    </div>
    {@render rarityPicker({ type, rarity } as ActiveMod)}
  </div>
{/snippet}

{#snippet modImage(mod: ActiveMod)}
  <div class="relative flex h-full w-full items-center justify-center">
    {#if mod.type === "MULTI_HACK"}
      <img
        aria-hidden="true"
        src={multihackImg}
        alt="Multi-Hack"
        class="object-contain"
        style={`filter: drop-shadow(0 0 8px ${colorFor(mod)})`} />
    {:else}
      <img
        src={heatsinkImg}
        aria-hidden="true"
        alt="Heat Sink"
        class="h-4/5 w-4/5 object-contain"
        style={`filter: drop-shadow(0 0 8px ${colorFor(mod)})`} />
    {/if}
  </div>
{/snippet}

<Popover.Root bind:open={isOpen}>
  <Popover.Trigger>
    <div
      data-open={isOpen}
      data-type={mod.type}
      data-rarity={rarity}
      class="mod-slot">
      {#if isOpen}
        <div class="absolute inset-0 bg-yellow-400/10"></div>
      {/if}

      <div class="-mt-2 flex h-1/2 w-1/2 items-center justify-center">
        {#if !isActiveMod(mod)}
          <span
            class="text-xs font-bold tracking-widest text-slate-600 transition-colors group-hover:text-cyan-600/80 sm:text-sm">
            Empty
          </span>
        {:else}
          {@render modImage(mod)}
        {/if}
      </div>

      <div class="absolute bottom-3 left-1/2 -translate-x-1/2">
        <RarityIndicator {mod} />
      </div>
    </div>
  </Popover.Trigger>

  <Popover.Portal>
    <Popover.Content
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-xl border border-cyan-900/50 bg-slate-900/95 p-5 shadow-[0_0_30px_rgba(8,145,178,0.2)] backdrop-blur-xl outline-none"
      sideOffset={8}
      side={window.innerWidth >= 640 ? popoverSide : "bottom"}
      align="start">
      <div class="space-y-6" role="menu" aria-label="Select mod">
        {@render modOption("MULTI_HACK", "Multi-Hack", multihackImg, rarity!)}

        {@render modOption("HEAT_SINK", "Heat Sink", heatsinkImg, rarity!)}

        <button
          class="w-full rounded-lg border border-slate-700/50 py-3 text-sm font-bold tracking-widest text-slate-400 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-slate-300"
          onclick={() => updateMod({ type: "NONE" })}>
          Remove Mod
        </button>
      </div>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
