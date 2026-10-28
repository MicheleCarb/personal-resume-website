// Renders the site's raster assets from HTML with the site's own font and
// colours, so they can be regenerated instead of edited by hand:
//   public/favicon.png         64x64   "mc" monogram
//   public/apple-touch-icon.png 180x180 "mc" monogram
//   public/og-image.png        1200x630 link preview (LinkedIn, Slack, ...)
// Usage: npm run images (requires `npx playwright install chromium`).
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const font = readFileSync(
  new URL(
    "../node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2",
    import.meta.url,
  ),
).toString("base64");

// Same values as src/styles/tokens.css (light theme).
const ink = "#14213d";
const muted = "#3a4353";
const success = "#0e5631";
const running = "#16439c";
const pendingLine = "#8d96a2";

const page = (body, css) => `<!doctype html><html><head><style>
  @font-face { font-family: Hanken; src: url(data:font/woff2;base64,${font}) format("woff2"); font-weight: 100 900; }
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; }
  body { font-family: Hanken, sans-serif; font-variant-numeric: tabular-nums; }
  ${css}
</style></head><body>${body}</body></html>`;

const monogram = (size) =>
  page(
    `<div class="mark">mc</div>`,
    `body { display: grid; place-items: center; background: ${ink}; }
     .mark { color: #fff; font-weight: 800; font-size: ${size * 0.5}px;
             letter-spacing: -0.04em; line-height: 1; transform: translateY(-4%); }`,
  );

const check = `<svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const preview = page(
  `<div class="line">
     <span class="seg dashed" style="top:0;height:118px"></span>
     <span class="seg" style="top:118px;bottom:0"></span>
     <span class="stop pending" style="top:50px"></span>
     <span class="stop running" style="top:150px"></span>
     <span class="stop success" style="top:300px">${check}</span>
     <span class="stop success" style="top:420px">${check}</span>
   </div>
   <div class="text">
     <h1>Michele Carbone</h1>
     <p class="headline">Software Engineer · DevOps</p>
     <ul>
       <li><span class="p">linkedin.com/in/</span><b>michelecarb</b><span></span></li>
       <li><span class="p">github.com/</span><b>michelecarb</b><span></span></li>
       <li><span class="p"></span><b>michelecarb</b><b>.one</b></li>
     </ul>
   </div>`,
  `body { background: #fff; color: ${ink}; display: grid;
          grid-template-columns: 220px 1fr; align-items: center; }
   .line { position: relative; height: 630px; }
   .seg { position: absolute; left: 106px; width: 16px; background: ${ink}; }
   .seg.dashed { background: repeating-linear-gradient(to bottom, ${pendingLine} 0 14px, transparent 14px 26px); }
   .stop { position: absolute; left: 94px; width: 40px; height: 40px; border-radius: 50%;
           display: grid; place-items: center; background: #fff; }
   .stop svg { width: 70%; }
   .pending { border: 4px dashed ${pendingLine}; }
   .running { border: 9px solid ${running}; }
   .success { background: ${success}; border: 6px solid ${ink}; }
   h1 { font-size: 92px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
   .headline { margin-top: 20px; font-size: 38px; font-weight: 600; }
   ul { margin-top: 48px; padding: 0; list-style: none; display: grid;
        grid-template-columns: max-content max-content max-content; row-gap: 6px; font-size: 34px; }
   li { display: contents; }
   .p { color: ${muted}; text-align: right; }
   b { font-weight: 800; }`,
);

const outputs = [
  { file: "public/favicon.png", width: 64, height: 64, html: monogram(64) },
  {
    file: "public/apple-touch-icon.png",
    width: 180,
    height: 180,
    html: monogram(180),
  },
  { file: "public/og-image.png", width: 1200, height: 630, html: preview },
];

const browser = await chromium.launch();
for (const { file, width, height, html } of outputs) {
  const tab = await browser.newPage({ viewport: { width, height } });
  await tab.setContent(html);
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: file });
  await tab.close();
  console.log(`wrote ${file}`);
}
await browser.close();
