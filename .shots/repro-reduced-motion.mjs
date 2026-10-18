// Temporary repro (not part of the app). Run: node .shots/repro-reduced-motion.mjs [url]
import puppeteer from "puppeteer-core";

const CHROME =
  process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "/usr/bin/google-chrome";
const URL = process.env.VERIFY_URL ?? process.argv[2] ?? "http://localhost:3002/";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.emulateMediaFeatures([
  { name: "prefers-reduced-motion", value: "reduce" },
]);
const errors = [];
page.on("pageerror", (e) => errors.push("PAGEERROR: " + (e.stack ?? e.message)));
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning")
    errors.push(m.type().toUpperCase() + ": " + m.text());
});
await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
await sleep(2500);
await browser.close();
if (!errors.length) {
  console.log("NO ERRORS under reduced-motion emulation");
} else {
  console.log(errors.join("\n\n"));
  process.exit(1);
}
