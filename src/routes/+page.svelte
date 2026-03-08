<script lang="ts">
  import {
    BASE_COOLDOWN_FRIENDLY,
    BASE_COOLDOWN_NEUTRAL,
    BASE_HACKS,
    calculatePortalStats,
    formatDuration,
    type Mod,
    type PortalAlignment,
  } from "$lib";
  import ModSlot from "$lib/components/ModSlot.svelte";
  import { RotateCcw, Shield, ShieldAlert } from "@lucide/svelte";

  const EMPTY_MOD: Mod = { type: "NONE" } as const;
  let slots = $state<Mod[]>([EMPTY_MOD, EMPTY_MOD, EMPTY_MOD, EMPTY_MOD]);

  let alignment = $state<PortalAlignment>("FRIENDLY");
  let stats = $derived(calculatePortalStats(slots, alignment));
  let baseCooldown = $derived(
    alignment === "FRIENDLY" ? BASE_COOLDOWN_FRIENDLY : BASE_COOLDOWN_NEUTRAL,
  );

  function clearSlots() {
    slots = Array(4).fill(EMPTY_MOD);
  }

  function updateSlot(i: number, mod: Mod) {
    slots[i] = mod;
  }
  function getPopoverSide(index: number): "left" | "right" {
    return index === 0 || index === 2 ? "left" : "right";
  }
</script>

<div class="mx-auto flex w-full max-w-lg flex-col gap-8 pb-16">
  <!-- portal alignment toggle -->
  <div class="flex flex-col gap-3 px-2">
    <h3 class="text-[10px] font-bold tracking-[0.2em] text-slate-500">
      Portal Alignment
    </h3>
    <div
      class="grid grid-cols-2 gap-2 rounded-xl border border-slate-800/50 bg-slate-900/50 p-1">
      <button
        data-active={alignment === "FRIENDLY"}
        data-variant="green"
        class="alignment-btn"
        onclick={() => (alignment = "FRIENDLY")}>
        <Shield class="h-3.5 w-3.5" />
        Friendly
      </button>

      <button
        data-active={alignment === "NEUTRAL_OR_ENEMY"}
        data-variant="red"
        class="alignment-btn"
        onclick={() => (alignment = "NEUTRAL_OR_ENEMY")}>
        <ShieldAlert class="h-3.5 w-3.5" />
        Neutral / Enemy
      </button>
    </div>
  </div>

  <!-- action bar -->
  <div class="flex justify-end px-2">
    <button
      class="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-500 uppercase transition-colors hover:text-cyan-400"
      onclick={clearSlots}>
      <RotateCcw class="h-4 w-4" />
      Clear mods
    </button>
  </div>

  <div
    role="group"
    aria-label="Mods"
    aria-atomic="true"
    class="grid grid-cols-2 gap-4 px-2">
    {#each slots as slot, index}
      {@const popoverSide = getPopoverSide(index)}
      <ModSlot
        mod={slot}
        onUpdate={(mod: Mod) => updateSlot(index, mod)}
        {popoverSide} />
    {/each}
  </div>

  <!-- results panel -->
  <div role="status" aria-live="polite" class="mt-4 flex flex-col gap-4 px-2">
    <div
      class="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-cyan-900/50 bg-slate-900/80 p-6 shadow-[0_0_40px_rgba(8,145,178,0.1)] backdrop-blur-xl transition-colors hover:border-cyan-800/80">
      <div
        class="absolute top-0 left-0 h-full w-1 bg-linear-to-b from-[#49ebc3] to-cyan-500">
      </div>
      <div>
        <h2 class="text-xs font-bold tracking-widest text-cyan-600 sm:text-sm">
          Total hacks
        </h2>
        <p
          class="mt-1 text-[10px] tracking-wider text-slate-500 uppercase sm:text-xs">
          Before Burnout
        </p>
      </div>
      <div class="flex items-end gap-2">
        <output
          class="text-5xl font-black text-cyan-100 drop-shadow-[0_0_15px_rgba(103,232,249,0.4)] transition-all duration-300 sm:text-6xl">
          {stats.totalHacks}
        </output>
        {#if stats.totalHacks > BASE_HACKS}
          <span
            aria-hidden="true"
            class="animate-in fade-in slide-in-from-left-2 mb-2 font-bold tracking-wider text-[#49ebc3]">
            +{stats.totalHacks - BASE_HACKS}
          </span>
        {/if}
      </div>
    </div>

    <div
      class="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-cyan-900/50 bg-slate-900/80 p-6 shadow-[0_0_40px_rgba(8,145,178,0.1)] backdrop-blur-xl transition-colors hover:border-cyan-800/80">
      <div
        class="absolute top-0 left-0 h-full w-1 bg-linear-to-b from-blue-500 to-[#b68bff]">
      </div>
      <div>
        <h2 class="text-xs font-bold tracking-widest text-cyan-600 sm:text-sm">
          Cooldown time
        </h2>
        <p
          class="mt-1 text-[10px] tracking-wider text-slate-500 uppercase sm:text-xs">
          Between Hacks
        </p>
      </div>
      <div class="flex items-end gap-2">
        <time
          datetime={`PT${stats.cooldownSeconds}s`}
          class="text-5xl font-black text-cyan-100 drop-shadow-[0_0_15px_rgba(103,232,249,0.4)] transition-all duration-300 sm:text-6xl">
          {formatDuration(stats.cooldownSeconds)}
        </time>
        {#if stats.cooldownSeconds < baseCooldown}
          <span
            aria-hidden="true"
            class="animate-in fade-in slide-in-from-left-2 mb-2 font-bold tracking-wider text-[#49ebc3]">
            -{formatDuration(baseCooldown - stats.cooldownSeconds)}
          </span>
        {/if}
      </div>
    </div>

    <div
      class="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-cyan-900/50 bg-slate-900/80 p-6 shadow-[0_0_40px_rgba(8,145,178,0.1)] backdrop-blur-xl transition-colors hover:border-cyan-800/80">
      <div
        class="absolute top-0 left-0 h-full w-1 bg-linear-to-b from-[#b68bff] to-[#f781ff]">
      </div>
      <div>
        <h2
          class="text-xs font-bold tracking-widest text-cyan-600 uppercase sm:text-sm">
          Time to burnout
        </h2>
        <p
          class="mt-1 text-[10px] tracking-wider text-slate-500 uppercase sm:text-xs">
          Until portal burnout
        </p>
      </div>
      <div class="flex items-end gap-2">
        <time
          datetime={`PT${stats.timeToBurnout}s`}
          class="text-4xl font-black text-cyan-100 drop-shadow-[0_0_15px_rgba(103,232,249,0.4)] transition-all duration-300 sm:text-5xl">
          {formatDuration(stats.timeToBurnout)}
        </time>
      </div>
    </div>
  </div>
</div>
