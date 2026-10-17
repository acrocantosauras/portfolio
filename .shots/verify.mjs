// Temporary verification harness (not part of the app). Run: node .shots/verify.mjs
// Target URL is configurable through the environment:
//   VERIFY_URL  — any reachable base URL (takes precedence), e.g. VERIFY_URL=https://example.com
//   VERIFY_PORT — port of the local dev server when VERIFY_URL is not set
//   Neither set  — the harness probes this project's candidate dev ports and uses
//                 whichever one is actually serving the portfolio:
//                   3001  npm run dev:vinext  (`vite dev --port 3001`)
//                   3002  vite's automatic fallback when 3001 is occupied
//                   3000  npm run dev         (`next dev`)
//   Legacy VITE_SITE_URL / VITE_PORT names are still honored.

import puppeteer from "puppeteer-core";
import { PNG } from "pngjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const CHROME = process.platform === "win32"
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "/usr/bin/google-chrome";

// --- Configuration ---
const SITE_URL = process.env.VERIFY_URL ?? process.env.VITE_SITE_URL;
const PORT = process.env.VERIFY_PORT ?? process.env.VITE_PORT;
const CANDIDATE_PORTS = ["3001", "3002", "3000"];
// Signature string that only exists in this portfolio's rendered HTML.
const SIGNATURE = "Meet Jadhav";
const normalize = (u) => (u.endsWith("/") ? u : u + "/");

async function resolveBaseUrl() {
  if (SITE_URL) return normalize(SITE_URL);
  if (PORT) return `http://localhost:${PORT}/`;
  for (const port of CANDIDATE_PORTS) {
    try {
      const res = await fetch(`http://localhost:${port}/`, {
        redirect: "follow",
        signal: AbortSignal.timeout(4000),
      });
      const html = await res.text();
      if (res.ok && html.includes(SIGNATURE)) {
        console.log(`verify: auto-detected dev server on port ${port}`);
        return `http://localhost:${port}/`;
      }
    } catch {
      /* not listening / not ours — keep probing */
    }
  }
  throw new Error(
    `No portfolio dev server found on ports ${CANDIDATE_PORTS.join(", ")}. ` +
      "Start one (npm run dev:vinext) or set VERIFY_URL / VERIFY_PORT."
  );
}
const VERIFY_TARGET_URL = await resolveBaseUrl();
console.log(`verify: targeting ${VERIFY_TARGET_URL}`);

// Screenshots go next to this script in .shots/
const OUT = path.dirname(fileURLToPath(import.meta.url));
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
}

function analyze(file) {
  const png = PNG.sync.read(fs.readFileSync(file));
  let red = 0, blue = 0, bright = 0;
  const total = png.width * png.height;
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
    if (r > 90 && r > g * 1.5 && r > b * 1.5) red++;
    if (b > 90 && b > r * 1.4 && b > g * 1.15) blue++;
    if (r + g + b > 220) bright++;
  }
  return {
    red: (red / total * 100).toFixed(2),
    blue: (blue / total * 100).toFixed(2),
    bright: (bright / total * 100).toFixed(2),
  };
}

async function makePage(browser, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console.error: " + m.text());
  });
  page.on("requestfailed", (r) =>
    errors.push("requestfailed: " + r.url() + " " + (r.failure()?.errorText ?? ""))
  );
  return { page, errors };
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});

/* ---------------- DESKTOP ---------------- */
{
  const { page, errors } = await makePage(browser, { width: 1440, height: 900 });
  await page.goto(VERIFY_TARGET_URL, { waitUntil: "domcontentloaded" });

  await page
    .waitForSelector('[aria-label="Opening title sequence"]', { timeout: 5000 })
    .then(() => check("desktop: intro overlay appears", true))
    .catch(() => check("desktop: intro overlay appears", false));

  const skipFocused = await page.evaluate(() =>
    document.activeElement?.textContent?.includes("Skip")
  );
  check("desktop: skip button receives focus", Boolean(skipFocused));

  await sleep(2400);
  await page.screenshot({ path: `${OUT}/01-intro-trace.png` });

  await sleep(1600);
  await page.screenshot({ path: `${OUT}/02-intro-type.png` });
  const introTitle = await page.evaluate(
    () => document.querySelector('[aria-label="Opening title sequence"] h1')?.getAttribute("aria-label")
  );
  check("desktop: intro reveals MEET JADHAV", introTitle === "Meet Jadhav");

  await sleep(2500);
  const overlayGone = !(await page.$('[aria-label="Opening title sequence"]'));
  check("desktop: intro unmounts after sequence", overlayGone);
  await page.screenshot({ path: `${OUT}/03-hero.png` });

  const hero = await page.evaluate(() => {
    const h1 = document.querySelector("#top h1");
    const letter = h1?.querySelector('span[aria-hidden] > span');
    const t = letter ? getComputedStyle(letter).transform : "MISSING-SELECTOR";
    const overflow = document.documentElement.scrollWidth - window.innerWidth;
    const replay = document.querySelector(
      'button[aria-label="Replay the opening title sequence"]'
    );
    return { label: h1?.getAttribute("aria-label"), t, overflow, replay: Boolean(replay) };
  });
  check("desktop: hero title present", hero.label === "Meet Jadhav");
  check("desktop: hero letters revealed", hero.t === "none" || hero.t === "matrix(1, 0, 0, 1, 0, 0)", hero.t);
  check("desktop: hero letter selector resolves", hero.t !== "MISSING-SELECTOR");
  check("desktop: replay control present", hero.replay);
  check("desktop: no horizontal overflow (hero)", hero.overflow <= 1, `overflow=${hero.overflow}`);

  // intro seen on reload
  await page.reload({ waitUntil: "domcontentloaded" });
  await sleep(900);
  check(
    "desktop: intro not replayed on next visit (session)",
    !(await page.$('[aria-label="Opening title sequence"]'))
  );

  // replay + skip
  await page.click('button[aria-label="Replay the opening title sequence"]');
  const replayed = await page
    .waitForSelector('[aria-label="Opening title sequence"]', { timeout: 2500 })
    .then(() => true)
    .catch(() => false);
  check("desktop: replay restarts the intro", replayed);
  if (replayed) {
    await page.evaluate(() => {
      [...document.querySelectorAll('[aria-label="Opening title sequence"] button')].find((b) =>
        b.textContent?.includes("Skip")
      )?.click();
    });
    await sleep(300);
    check(
      "desktop: skip dismisses intro immediately",
      !(await page.$('[aria-label="Opening title sequence"]'))
    );
  }

  // sections + nav
  const sections = await page.evaluate(() =>
    ["aegisforge", "experience", "missions", "workshop", "identity", "contact"].map((id) =>
      Boolean(document.getElementById(id))
    )
  );
  check("desktop: all nav targets exist", sections.every(Boolean), JSON.stringify(sections));

  await page.evaluate(() => document.getElementById("aegisforge")?.scrollIntoView());
  await sleep(900);

  // pipeline: click a desktop SVG stage node
  await page.evaluate(() => {
    const g = document.querySelectorAll('#aegisforge svg g[role="button"]');
    g[2]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await sleep(300);
  const stageReadout = await page.evaluate(
    () => document.querySelector('#aegisforge [role="status"]')?.textContent ?? ""
  );
  check(
    "desktop: pipeline stage click updates inspector",
    /STAGE 03/.test(stageReadout),
    stageReadout.slice(0, 70)
  );
  const hasTrace = await page.evaluate(
    () => document.querySelectorAll("#aegisforge .trace-run").length > 0
  );
  check("desktop: pipeline signal traces render", hasTrace);
  const simLabel = await page.evaluate(
    () => document.getElementById("aegisforge")?.textContent ?? ""
  );
  check("desktop: pipeline labelled conceptual simulation", /conceptual simulation/i.test(simLabel));

  // agent registry
  await page.evaluate(() => {
    [...document.querySelectorAll("#aegisforge button[aria-pressed]")]
      .find((b) => b.textContent?.includes("Research Agent"))
      ?.click();
  });
  await sleep(300);
  const readouts = await page.evaluate(() =>
    [...document.querySelectorAll("#aegisforge [role=\"status\"]")].map(
      (el) => el.textContent ?? ""
    )
  );
  // AegisForge has two live regions: the stage inspector (first) and the
  // agent-registry readout (last). An agent click updates the latter.
  const agentReadout = readouts[readouts.length - 1] ?? "";
  check(
    "desktop: agent node click updates readout",
    /Research Agent/.test(agentReadout),
    agentReadout.slice(0, 60)
  );
  await page.screenshot({ path: `${OUT}/04-aegisforge.png` });

  // project dossier
  await page.evaluate(() => document.getElementById("missions")?.scrollIntoView());
  await sleep(500);
  await page.evaluate(() => document.querySelector("#missions button")?.click());
  await sleep(500);
  const dossier = await page.$('[aria-label$="dossier"]');
  check("desktop: project dossier opens", Boolean(dossier));
  await page.screenshot({ path: `${OUT}/05-dossier.png` });
  await page.keyboard.press("Escape");
  await sleep(400);
  check("desktop: dossier closes on Escape", !(await page.$('[aria-label$="dossier"]')));

  // recruiter mode
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);
  await page.evaluate(() => {
    [...document.querySelectorAll("header button")].find((b) =>
      b.textContent?.includes("Recruiter")
    )?.click();
  });
  await sleep(500);
  const recruiterOpen = await page.evaluate(() =>
    [...document.querySelectorAll('[role="dialog"], aside, div')].some(
      (el) => el.textContent?.includes("Recruiter Mode") && getComputedStyle(el).position === "fixed"
    )
  );
  check("desktop: recruiter drawer opens", recruiterOpen);
  await page.keyboard.press("Escape");
  await sleep(300);

  // uchit vision honesty labels
  await page.evaluate(() => document.getElementById("experience")?.scrollIntoView());
  await sleep(700);
  await page.screenshot({ path: `${OUT}/06-uchitvision.png` });
  const uchitText = await page.evaluate(
    () => document.getElementById("experience")?.textContent ?? ""
  );
  check(
    "desktop: UchitVision labelled as simulation",
    /simulat|sample/i.test(uchitText)
  );
  check("desktop: Uchit dates corrected", /September – October 2026/.test(uchitText));
  check("desktop: Uchit role corrected", /AI \/ Video Analytics Trainee/.test(uchitText));
  check("desktop: no fake LIVE feed claim", !/LIVE FEED/.test(uchitText));

  // contact + resume + footer
  await page.evaluate(() => document.getElementById("contact")?.scrollIntoView());
  await sleep(600);
  await page.screenshot({ path: `${OUT}/07-contact.png` });
  const links = await page.evaluate(() => ({
    resume: document.querySelector('a[download]')?.getAttribute("href") ?? "",
    github: document.querySelector('a[href*="github.com"]')?.href ?? "",
    linkedin: document.querySelector('a[href*="linkedin.com"]')?.href ?? "",
    mail: document.querySelector('a[href^="mailto:"]')?.href ?? "",
  }));
  check("desktop: resume link intact", links.resume.includes("resume/"), links.resume);
  check("desktop: github link intact", links.github.includes("github.com"));
  check("desktop: linkedin link intact", links.linkedin.includes("linkedin.com"));
  check("desktop: mailto link intact", links.mail.startsWith("mailto:"));

  const overflowAll = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  check("desktop: no horizontal overflow (page)", overflowAll <= 1, `overflow=${overflowAll}`);

  const s0 = analyze(`${OUT}/03-hero.png`);
  check(
    "desktop: hero frame has red/blue luminance (not blank)",
    Number(s0.bright) > 1 && (Number(s0.red) > 0.2 || Number(s0.blue) > 0.2),
    JSON.stringify(s0)
  );

  check("desktop: no console/page/network errors", errors.length === 0, errors.slice(0, 5).join(" | "));
  await page.close();
}

/* ---------------- MOBILE ---------------- */
{
  const { page, errors } = await makePage(browser, {
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  await page.goto(VERIFY_TARGET_URL, { waitUntil: "domcontentloaded" });
  await page
    .waitForSelector('[aria-label="Opening title sequence"]', { timeout: 5000 })
    .then(() => check("mobile: intro overlay appears", true))
    .catch(() => check("mobile: intro overlay appears", false));
  await sleep(4200);
  await page.screenshot({ path: `${OUT}/m1-intro.png` });
  await sleep(2200);
  await page.screenshot({ path: `${OUT}/m2-hero.png` });

  const m = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    menuBtn: Boolean(document.querySelector('header button[aria-label="Toggle menu"]')),
    h1: document.querySelector("#top h1")?.getAttribute("aria-label") ?? "",
  }));
  check("mobile: no horizontal overflow", m.overflow <= 1, `overflow=${m.overflow}`);
  check("mobile: menu button present", m.menuBtn);
  check("mobile: hero title present", m.h1 === "Meet Jadhav");

  await page.evaluate(() => document.querySelector('header button[aria-label="Toggle menu"]')?.click());
  await sleep(400);
  const menuOpen = await page.evaluate(() =>
    Boolean(document.querySelector('[aria-label="Mobile"]'))
  );
  check("mobile: nav menu opens", menuOpen);
  await page.screenshot({ path: `${OUT}/m3-menu.png` });

  await page.evaluate(() => document.getElementById("experience")?.scrollIntoView());
  await sleep(800);
  await page.screenshot({ path: `${OUT}/m4-uchit.png` });
  await page.evaluate(() => document.getElementById("missions")?.scrollIntoView());
  await sleep(800);
  await page.screenshot({ path: `${OUT}/m5-missions.png` });
  const overflowEnd = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  check("mobile: no horizontal overflow (deep page)", overflowEnd <= 1, `overflow=${overflowEnd}`);

  check("mobile: no console/page/network errors", errors.length === 0, errors.slice(0, 5).join(" | "));
  await page.close();
}

/* ---------------- REDUCED MOTION ---------------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.goto(VERIFY_TARGET_URL, { waitUntil: "domcontentloaded" });
  await sleep(900);
  check(
    "reduced-motion: intro bypassed",
    !(await page.$('[aria-label="Opening title sequence"]'))
  );
  const st = await page.evaluate(() => {
    const letter = document.querySelector("#top h1 span[aria-hidden] > span");
    return {
      t: letter ? getComputedStyle(letter).transform : "MISSING-SELECTOR",
      h1: document.querySelector("#top h1")?.getAttribute("aria-label") ?? "",
    };
  });
  check("reduced-motion: hero title visible", st.h1 === "Meet Jadhav");
  check(
    "reduced-motion: hero letters settled",
    st.t === "none" || st.t === "matrix(1, 0, 0, 1, 0, 0)",
    st.t
  );
  await page.screenshot({ path: `${OUT}/08-reduced-motion.png` });
  await page.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log("FAILURES:\n" + failed.map((f) => ` - ${f.name}: ${f.detail}`).join("\n"));
  process.exit(1);
}
