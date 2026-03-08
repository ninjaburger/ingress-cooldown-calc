<script lang="ts">
  import "./layout.css";
  import { PUBLIC_BASE_URL } from "$env/static/public";

  let { children } = $props();

  const APP_TITLE: string = "Ingress Cooldown Calculator",
    APP_DESCRIPTION: string =
      "Easily calculate portal cooldown, total hacks, and time to burnout for any Heat Sink and Multi-hack combination.";
  const linkedData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: APP_TITLE,
    applicationCategory: "GameUtility",
    operatingSystem: "Any",
    description: APP_DESCRIPTION,
  });
</script>

<svelte:head>
  <meta name="theme-color" content="#090d15" />

  <meta name="description" content={APP_DESCRIPTION} />
  <meta
    name="keywords"
    content="portal cooldown, cooldown calculator, heat sink, multi hack, ingress tools" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content={APP_TITLE} />
  <meta property="og:description" content={APP_DESCRIPTION} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content={PUBLIC_BASE_URL} />
  <meta property="og:image" content="{PUBLIC_BASE_URL}/images/og-image.jpg" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={APP_TITLE} />
  <meta name="twitter:description" content={APP_DESCRIPTION} />
  <meta name="twitter:image" content="{PUBLIC_BASE_URL}/images/og-image.jpg" />

  {@html `<script type="application/ld+json">${linkedData}</script>`}
</svelte:head>

<div class="flex min-h-screen flex-col bg-transparent">
  <div class="container mx-auto max-w-2xl grow px-4">
    <header
      class="mb-4 flex flex-col items-center justify-center pt-6 pb-4 text-center md:pt-16 md:pb-10">
      <h1
        class="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-black tracking-wide text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.3)] sm:text-5xl">
        Ingress
      </h1>
      <h2
        class="mt-2 text-sm font-bold tracking-[0.2em] text-slate-400 sm:text-lg">
        Cooldown Calculator
      </h2>
      <div
        class="mt-6 h-1 w-32 rounded-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-50">
      </div>
    </header>
    <main>
      {@render children()}
    </main>
    <footer class="space-y-4 px-4 py-8 text-center">
      <p
        class="mx-auto max-w-lg text-[10px] leading-relaxed tracking-widest text-slate-600 uppercase">
        Ingress Fan-site. Not officially affiliated with Ingress or Niantic
        Spatial, Inc.! All visual assets belong to their respective owners.
      </p>
      <p
        class="flex items-center justify-center gap-2 text-[10px] leading-relaxed tracking-widest text-slate-500 uppercase">
        <a
          href="https://github.com/ninjaburger/ingress-cooldown-calc"
          target="_blank"
          rel="noopener noreferrer"
          title="Contribute on GitHub"
          class="flex items-center gap-1.5 text-cyan-400 transition-colors hover:text-cyan-300">
          <img
            width="24"
            height="24"
            src="/images/GitHub_Invertocat_White.svg"
            alt="GitHub logo" />
          Contribute
        </a>
      </p>
    </footer>
  </div>
</div>
