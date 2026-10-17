// Deep-link & hash-navigation verification (companion to verify.mjs).
// Run: node .shots/deeplink.mjs   [VERIFY_URL or VERIFY_PORT to override]
// Verifies the #section behavior: direct URLs survive the intro's scroll lock,
// headings land clear of the sticky header, nav clicks update the URL once,
// back/forward stays sensible, and nothing writes the hash during scrolling.
import puppeteer from "puppeteer-core";

const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SITE_URL = process.env.VERIFY_URL ?? process.env.VITE_SITE_URL;
const PORT = process.env.VERIFY_PORT ?? process.env.VITE_PORT;
const CANDIDATE_PORTS = ["3001", "3002", "3000"];

async function resolveBase() {
  if (SITE_URL) return SITE_URL.endsWith("/") ? SITE_URL : SITE_URL + "/";
  if (PORT) return `http://localhost:${PORT}/`;
  for (const port of CANDIDATE_PORTS) {
    try {
      const res = await fetch(`http://localhost:${port}/`, {
        redirect: "follow",
        signal: AbortSignal.timeout(4000),
      });
      const html = await res.text();
      if (res.ok && html.includes("Meet Jadhav")) return `http://localhost:${port}/`;
    } catch {}
  }
  throw new Error("No dev server found; start one or set VERIFY_URL / VERIFY_PORT.");
}
const BASE = await resolveBase();
console.log(`deeplink: targeting ${BASE}`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});

async function targetTop(page, id) {
  return page.evaluate((sel) => {
    const el = document.getElementById(sel);
    return el ? Math.round(el.getBoundingClientRect().top) : null;
  }, id);
}
const HEADER_ALLOWANCE = 140; // header ~64px + a little air

/* 1. direct deep link, first visit (intro plays, scroll was locked) */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(`${BASE}#aegisforge`, { waitUntil: "domcontentloaded" });
  await sleep(9000); // let the intro sequence complete
  const hash = await page.evaluate(() => window.location.hash);
  check("deeplink: URL hash preserved through intro", hash === "#aegisforge", hash);
  const top = await targetTop(page, "aegisforge");
  check(
    "deeplink: intro unlock scrolls to the target section",
    top !== null && top >= 0 && top <= HEADER_ALLOWANCE,
    `top=${top}`
  );
  const scrolled = await page.evaluate(() => window.scrollY);
  check("deeplink: page actually scrolled (not stuck at top)", scrolled > 200, `scrollY=${scrolled}`);
  check("deeplink: no console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await page.close();
}

/* 2. nav click + scroll stability + back button */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await sleep(8500); // intro completes
  // desktop nav is visible at lg breakpoint
  await page.evaluate(() => {
    [...document.querySelectorAll("header nav a")].find((a) =>
      a.getAttribute("href") === "#missions"
    )?.click();
  });
  await sleep(1500);
  const hash = await page.evaluate(() => window.location.hash);
  check("nav: click sets hash once", hash === "#missions", hash);
  const top = await targetTop(page, "missions");
  check(
    "nav: target clears the sticky header",
    top !== null && top >= 0 && top <= HEADER_ALLOWANCE,
    `top=${top}`
  );
  const active = await page.evaluate(() =>
    document.querySelector('header nav a[href="#missions"]')?.getAttribute("aria-current")
  );
  check("nav: active indicator tracks the section", active === "true", String(active));
  // hash must not churn while scrolling
  await page.evaluate(() => window.scrollBy(0, 600));
  await sleep(900);
  const hash2 = await page.evaluate(() => window.location.hash);
  check("nav: scrolling does not rewrite the hash", hash2 === "#missions", hash2);
  // back returns to the pre-click state
  await page.goBack();
  await sleep(1200);
  const afterBack = await page.evaluate(() => ({
    hash: window.location.hash,
    y: window.scrollY,
  }));
  check(
    "nav: browser back returns to the previous state",
    afterBack.hash === "" && afterBack.y < 200,
    JSON.stringify(afterBack)
  );
  check("nav: no console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await page.close();
}

/* 3. reduced motion + deep link (no intro at all) */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.goto(`${BASE}#contact`, { waitUntil: "domcontentloaded" });
  await sleep(2000);
  const top = await targetTop(page, "contact");
  const overlay = await page.$('[aria-label="Opening title sequence"]');
  check("reduced-motion: no intro overlay", overlay === null);
  check(
    "reduced-motion: direct link lands at the target",
    top !== null && top >= 0 && top <= HEADER_ALLOWANCE,
    `top=${top}`
  );
  await page.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} deep-link checks passed`);
if (failed.length) {
  console.log("FAILURES:\n" + failed.map((f) => " - " + f.name).join("\n"));
  process.exit(1);
}
