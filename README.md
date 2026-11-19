# Vue / Nuxt hosting picker (decision engine)

Four answers in, one hosting model out: static host, managed platform or VPS, with concrete plans and their official list prices. This is the decision logic behind the interactive [Vue / Nuxt hosting picker on vuetelemetry.com](https://vuetelemetry.com/vue-nuxt-hosting-picker), extracted as a small MIT module so you can read it, test it or fork it.

Prices were read on the providers' own pricing pages (DigitalOcean Droplets and App Platform, Infomaniak VPS Lite: 2026-10-18, Contabo Cloud VPS 4 and 6: 2026-11-17). Nothing is estimated. If a provider changes a price, the table below is wrong until `PLANS` is updated.

## Use

```js
const { decide, PLANS } = require("./picker.js");
const r = decide({ mode: "ssr", traffic: "mid", admin: "yes", region: "any" });
// r.model = "vps", r.plans = ["doDroplet12", "ctVps4", "ikLite720", "doDroplet18"]
r.plans.map(k => PLANS[k]);
```

- `mode`: `static` (Vue SPA or `nuxt generate`), `ssr` (Nuxt SSR), `full` (SSR plus API, database, jobs)
- `traffic`: `low` (under 10k visits a month), `mid` (10k to 100k), `high` or `vhigh` (above)
- `admin`: `yes` if you are fine running a Linux server, `no` for a managed platform
- `region`: `eu` puts the Swiss host first, anything else keeps the default order

## Every answer, computed by the module (region: any)

| App | Traffic | You run a server? | Model | Plans, in order |
|---|---|---|---|---|
| Static (SPA, nuxt generate) | under 10k visits/mo | yes | staticHost | DigitalOcean App Platform, static site $0/mo, DigitalOcean Basic Droplet $4/mo, Infomaniak VPS Lite CHF 2.70/mo |
| Static (SPA, nuxt generate) | under 10k visits/mo | no | staticHost | DigitalOcean App Platform, static site $0/mo, DigitalOcean Basic Droplet $4/mo, Infomaniak VPS Lite CHF 2.70/mo |
| Static (SPA, nuxt generate) | 10k to 100k | yes | vpsStatic | DigitalOcean Basic Droplet $4/mo, DigitalOcean Basic Droplet $6/mo, Infomaniak VPS Lite CHF 2.70/mo |
| Static (SPA, nuxt generate) | 10k to 100k | no | staticHost | DigitalOcean App Platform, static site $0/mo, DigitalOcean Basic Droplet $4/mo |
| Static (SPA, nuxt generate) | over 100k | yes | vpsStatic | DigitalOcean Basic Droplet $4/mo, DigitalOcean Basic Droplet $6/mo, Infomaniak VPS Lite CHF 2.70/mo |
| Static (SPA, nuxt generate) | over 100k | no | staticHost | DigitalOcean App Platform, static site $0/mo, DigitalOcean Basic Droplet $4/mo |
| Nuxt SSR | under 10k visits/mo | yes | vps | DigitalOcean Basic Droplet $6/mo, Contabo Cloud VPS 4 €4.40/mo, Infomaniak VPS Lite CHF 2.70/mo |
| Nuxt SSR | under 10k visits/mo | no | managed | DigitalOcean App Platform, container $5/mo, DigitalOcean App Platform, container $12/mo |
| Nuxt SSR | 10k to 100k | yes | vps | DigitalOcean Basic Droplet $12/mo, Contabo Cloud VPS 4 €4.40/mo, Infomaniak VPS Lite CHF 7.20/mo, DigitalOcean Basic Droplet $18/mo |
| Nuxt SSR | 10k to 100k | no | managed | DigitalOcean App Platform, container $12/mo, DigitalOcean App Platform, container $25/mo |
| Nuxt SSR | over 100k | yes | vps | DigitalOcean Basic Droplet $24/mo, Contabo Cloud VPS 6 €6.00/mo, Infomaniak VPS Lite CHF 9.00/mo, DigitalOcean Basic Droplet $48/mo |
| Nuxt SSR | over 100k | no | managed | DigitalOcean App Platform, container $25/mo, DigitalOcean App Platform, container $50/mo |
| SSR + API + DB + jobs | under 10k visits/mo | yes | vpsFull | DigitalOcean Basic Droplet $12/mo, Contabo Cloud VPS 4 €4.40/mo, Infomaniak VPS Lite CHF 7.20/mo |
| SSR + API + DB + jobs | under 10k visits/mo | no | managedFull | DigitalOcean App Platform, container $12/mo, DigitalOcean App Platform, container $25/mo |
| SSR + API + DB + jobs | 10k to 100k | yes | vpsFull | DigitalOcean Basic Droplet $24/mo, Contabo Cloud VPS 6 €6.00/mo, Infomaniak VPS Lite CHF 7.20/mo, Infomaniak VPS Lite CHF 18.00/mo |
| SSR + API + DB + jobs | 10k to 100k | no | managedFull | DigitalOcean App Platform, container $25/mo, DigitalOcean App Platform, container $50/mo |
| SSR + API + DB + jobs | over 100k | yes | vpsFull | DigitalOcean Basic Droplet $48/mo, Contabo Cloud VPS 6 €6.00/mo, Infomaniak VPS Lite CHF 18.00/mo |
| SSR + API + DB + jobs | over 100k | no | managedFull | DigitalOcean App Platform, container $25/mo, DigitalOcean App Platform, container $50/mo |

Two rules drive most rows:

1. **Static hosting is billed on transfer.** 1 GiB of outbound is roughly 700 views of a 1.5 MB page, so a free static tier stops being free within days above 10k visits a month.
2. **A Nuxt build needs about 2 GB of memory.** An out-of-memory `nuxt build` on a 512 MB box is the most common first-deploy failure, which is why no SSR row starts below 1 GiB.

The interactive tool explains each note, in 6 languages. For the longer comparison of hosts for Vue and Nuxt, see [Best hosting for a Vue or Nuxt app](https://vuetelemetry.com/articles/best-hosting-vue-nuxt-app).

## Licence

MIT
