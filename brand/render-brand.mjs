import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
// Renders the SVG logos to PNG. Run from anywhere: node brand/render-brand.mjs (needs playwright installed).
const root = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage();
async function render(svgPath, outPath, w, h, bg = "transparent") {
  const svg = readFileSync(svgPath, "utf8");
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<html><body style="margin:0;background:${bg}"><div style="width:${w}px;height:${h}px">${svg.replace(/width="\d+" height="\d+"/, `width="${w}" height="${h}"`)}</div></body></html>`);
  await page.screenshot({ path: outPath, omitBackground: bg === "transparent" });
}
for (const s of [1024, 512, 192, 48]) await render(`${root}/logo/ladda-mark.svg`, `${root}/exports/ladda-mark-${s}.png`, s, s);
await render(`${root}/logo/ladda-lockup.svg`, `${root}/exports/ladda-lockup-1440.png`, 1440, 327, "#ffffff");
await render(`${root}/logo/ladda-lockup-dark.svg`, `${root}/exports/ladda-lockup-dark-1440.png`, 1440, 327, "#14211B");
await browser.close();
console.log("rendered");
