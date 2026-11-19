// Vue / Nuxt hosting picker, decision engine. MIT licence.
// Interactive version with explanations in 6 languages: https://vuetelemetry.com/vue-nuxt-hosting-picker
// Vue / Nuxt hosting picker. Four answers in, one hosting model out, with the
// concrete plans and their OFFICIAL list prices.
// Prices read on the providers' own pricing pages on 2026-10-18 :
//   DigitalOcean Basic Droplets (Regular CPU)  digitalocean.com/pricing/droplets
//   DigitalOcean App Platform                   docs.digitalocean.com/products/app-platform/details/pricing/
//   Infomaniak VPS Lite                         infomaniak.com/en/hosting/vps-lite
//   Contabo Cloud VPS 4 and 6                   contabo.com/en/vps/ (read 2026-11-17 : 4.40 and 6.00 EUR
//     a month for the first 24 months, list price 5.50 and 7.50 EUR)
// Nothing here is estimated or rounded ; if a plan is not on those pages it is
// not in this file. Update PLANS when the pages change, and bump CHECKED.
const CHECKED = "2026-10-18";

const PLANS = {
  doStaticFree: { provider: "DigitalOcean", name: "App Platform, static site", specs: "Up to 3 static apps, 1 GiB outbound per app per month", price: "$0", unit: "/mo", where: "US company, data centres incl. Amsterdam and Frankfurt" },
  doDroplet4:   { provider: "DigitalOcean", name: "Basic Droplet", specs: "1 vCPU, 512 MiB RAM, 10 GiB SSD, 500 GiB transfer", price: "$4", unit: "/mo", where: "US company, data centres incl. Amsterdam and Frankfurt" },
  doDroplet6:   { provider: "DigitalOcean", name: "Basic Droplet", specs: "1 vCPU, 1 GiB RAM, 25 GiB SSD, 1,000 GiB transfer", price: "$6", unit: "/mo", where: "US company, data centres incl. Amsterdam and Frankfurt" },
  doDroplet12:  { provider: "DigitalOcean", name: "Basic Droplet", specs: "1 vCPU, 2 GiB RAM, 50 GiB SSD, 2,000 GiB transfer", price: "$12", unit: "/mo", where: "US company, data centres incl. Amsterdam and Frankfurt" },
  doDroplet18:  { provider: "DigitalOcean", name: "Basic Droplet", specs: "2 vCPUs, 2 GiB RAM, 60 GiB SSD, 3,000 GiB transfer", price: "$18", unit: "/mo", where: "US company, data centres incl. Amsterdam and Frankfurt" },
  doDroplet24:  { provider: "DigitalOcean", name: "Basic Droplet", specs: "2 vCPUs, 4 GiB RAM, 80 GiB SSD, 4,000 GiB transfer", price: "$24", unit: "/mo", where: "US company, data centres incl. Amsterdam and Frankfurt" },
  doDroplet48:  { provider: "DigitalOcean", name: "Basic Droplet", specs: "4 vCPUs, 8 GiB RAM, 160 GiB SSD, 5,000 GiB transfer", price: "$48", unit: "/mo", where: "US company, data centres incl. Amsterdam and Frankfurt" },
  doApp5:       { provider: "DigitalOcean", name: "App Platform, container", specs: "1 shared vCPU, 512 MiB RAM, 50 GiB bandwidth", price: "$5", unit: "/mo", where: "US company, data centres incl. Amsterdam and Frankfurt" },
  doApp12:      { provider: "DigitalOcean", name: "App Platform, container", specs: "1 shared vCPU, 1 GiB RAM, 150 GiB bandwidth", price: "$12", unit: "/mo", where: "US company, data centres incl. Amsterdam and Frankfurt" },
  doApp25:      { provider: "DigitalOcean", name: "App Platform, container", specs: "1 shared vCPU, 2 GiB RAM, 200 GiB bandwidth", price: "$25", unit: "/mo", where: "US company, data centres incl. Amsterdam and Frankfurt" },
  doApp50:      { provider: "DigitalOcean", name: "App Platform, container", specs: "2 shared vCPUs, 4 GiB RAM, 250 GiB bandwidth", price: "$50", unit: "/mo", where: "US company, data centres incl. Amsterdam and Frankfurt" },
  ctVps4:       { provider: "Contabo", name: "Cloud VPS 4", specs: "4 vCPU, 8 GB RAM, 200 Mbit/s port, unmetered traffic. €4.40 for the first 24 months, then €5.50", price: "€4.40", unit: "/mo", where: "German company, data centres in Europe, the US and Asia" },
  ctVps6:       { provider: "Contabo", name: "Cloud VPS 6", specs: "6 vCPU, 12 GB RAM, 300 Mbit/s port, unmetered traffic. €6.00 for the first 24 months, then €7.50", price: "€6.00", unit: "/mo", where: "German company, data centres in Europe, the US and Asia" },
  ikLite270:    { provider: "Infomaniak", name: "VPS Lite", specs: "1 vCPU, 2 GB RAM, 20 GB disk", price: "CHF 2.70", unit: "/mo", where: "Swiss company, hosted in Switzerland" },
  ikLite720:    { provider: "Infomaniak", name: "VPS Lite", specs: "2 vCPU, 4 GB RAM, 60 GB disk", price: "CHF 7.20", unit: "/mo", where: "Swiss company, hosted in Switzerland" },
  ikLite900:    { provider: "Infomaniak", name: "VPS Lite", specs: "4 vCPU, 4 GB RAM, 80 GB disk", price: "CHF 9.00", unit: "/mo", where: "Swiss company, hosted in Switzerland" },
  ikLite1800:   { provider: "Infomaniak", name: "VPS Lite", specs: "4 vCPU, 8 GB RAM, 160 GB disk", price: "CHF 18.00", unit: "/mo", where: "Swiss company, hosted in Switzerland" },
};

// The decision. Returns { model, sizing, plans[] , notes[] } keys into STR.
function decide({ mode, traffic, admin, region }) {
  const swiss = region === "eu";
  if (mode === "static") {
    if (traffic === "low") {
      return admin === "yes" && swiss
        ? { model: "vpsStatic", sizing: "staticSizing", plans: ["ikLite270", "doDroplet4"], notes: ["staticEgress", "staticNginx"] }
        : { model: "staticHost", sizing: "staticSizing", plans: ["doStaticFree", "doDroplet4", "ikLite270"], notes: ["staticEgress", "staticFreeLimit"] };
    }
    // mid and above : the free static tier's 1 GiB of outbound is gone within days.
    return admin === "yes"
      ? { model: "vpsStatic", sizing: "staticSizing", plans: swiss ? ["ikLite270", "doDroplet4", "doDroplet6"] : ["doDroplet4", "doDroplet6", "ikLite270"], notes: ["staticEgress", "staticNginx", traffic === "vhigh" ? "cdnFront" : "staticTransfer"] }
      : { model: "staticHost", sizing: "staticSizing", plans: ["doStaticFree", "doDroplet4"], notes: ["staticEgress", "staticFreeLimit", "staticManagedBeyond"] };
  }
  if (mode === "ssr") {
    if (admin === "no") {
      const plans = traffic === "low" ? ["doApp5", "doApp12"] : traffic === "mid" ? ["doApp12", "doApp25"] : ["doApp25", "doApp50"];
      return { model: "managed", sizing: "ssrSizing", plans, notes: ["buildMemory", "managedBuild", traffic === "vhigh" ? "horizontal" : "coldStartNo"] };
    }
    const plans = traffic === "low" ? (swiss ? ["ikLite270", "ctVps4", "doDroplet6"] : ["doDroplet6", "ctVps4", "ikLite270"])
      : traffic === "mid" ? (swiss ? ["ikLite720", "ctVps4", "doDroplet12", "doDroplet18"] : ["doDroplet12", "ctVps4", "ikLite720", "doDroplet18"])
      : (swiss ? ["ikLite900", "ctVps6", "doDroplet24", "ikLite1800"] : ["doDroplet24", "ctVps6", "ikLite900", "doDroplet48"]);
    return { model: "vps", sizing: "ssrSizing", plans, notes: ["buildMemory", "pm2", traffic === "vhigh" ? "horizontal" : "reverseProxy"] };
  }
  // full : SSR + API + database + jobs on the same budget
  if (admin === "no") {
    const plans = traffic === "low" ? ["doApp12", "doApp25"] : ["doApp25", "doApp50"];
    return { model: "managedFull", sizing: "fullSizing", plans, notes: ["dbExtra", "managedBuild", traffic === "vhigh" ? "horizontal" : "workers"] };
  }
  const plans = traffic === "low" ? (swiss ? ["ikLite720", "ctVps4", "doDroplet12"] : ["doDroplet12", "ctVps4", "ikLite720"])
    : traffic === "mid" ? (swiss ? ["ikLite720", "ctVps6", "doDroplet24", "ikLite1800"] : ["doDroplet24", "ctVps6", "ikLite720", "ikLite1800"])
    : (swiss ? ["ikLite1800", "ctVps6", "doDroplet48"] : ["doDroplet48", "ctVps6", "ikLite1800"]);
  return { model: "vpsFull", sizing: "fullSizing", plans, notes: ["dbSameBox", "backups", traffic === "vhigh" ? "horizontal" : "pm2"] };
}

if (typeof module !== "undefined") module.exports = { PLANS, decide, CHECKED };
