# Ingress Cooldown Calculator

An interactive SvelteKit web app for calculating portal hacking stats in Ingress based on mod configurations and portal alignment.

It helps agents quickly estimate:

-   **Total hacks** before portal burnout.
-   **Cooldown time** between hacks.
-   **Time to burnout** from first hack to last hack.

Select your **Heat Sink** and **Multi‑hack** mods to instantly see the resulting cooldown and burnout stats.

## Demo

https://ingress-cooldown-calc.pages.dev/

## How the calculations work

### Total hacks

A portal allows **4 hacks by default**. Multi‑hack mods increase this limit.

|Mod                   |Extra hacks
|----------------------|-------------
|Common Multi‑hack     |+4
|Rare Multi‑hack       |+8
|Very Rare Multi‑hack  |+12

If multiple Multi‑hacks are installed:

- The **highest rarity mod uses 100% of its value**
- The **others use 50% of their value**

Example:

```
VRMH + RMH

4 base
+12
+4 (8 × 50%)

= 20 hacks
```


### Cooldown time

Base cooldown depends on portal alignment.

| Portal           | Base cooldown
|------------------|---------------
| Friendly         | 180s
| Neutral / Enemy  | 300s

Heat Sink mods reduce cooldown.

| Mod                  | Reduction
|----------------------|-----------
| Common Heat Sink     | 20%
| Rare Heat Sink       | 50%
| Very Rare Heat Sink  | 70%

When multiple Heat Sinks are installed:

- The **highest rarity applies 100%**
- The **others apply 50%**

Example:

```
VRHS + RHS + CHS
Friendly portal (180s)

180 × (1 − 0.7) × (1 − (0.5 / 2)) × (1 − (0.2 / 2)) = 36.45

≈ 36s cooldown
```

### Time to burnout

Represents the total time from the **first hack** until the portal burns
out.

`timeToBurnout = (totalHacks − 1) × cooldown`

Example:

```
x1 VRMH + x2 VRHS

16 hacks
35s cooldown

(16 − 1) × 35 = 525s = 8:45
```

## Running locally

Clone the repository:

``` bash
git clone https://github.com/ninjaburger/ingress-cooldown-calculator.git
cd ingress-cooldown-calculator
```

Install dependencies:

``` bash
pnpm install
```

Set environment variables:

`PUBLIC_BASE_URL=https://your-domain.com`

*This variable is used for canonical URLs and Open Graph metadata.*

Start the dev server:

``` bash
pnpm run dev
```

