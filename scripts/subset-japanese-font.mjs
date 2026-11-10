import { mkdir, writeFile } from "node:fs/promises";

// Include the seals, Japanese quotations and pronunciation used in the portfolio.
const text = "物語の奥深さを、言葉と映像で紡ぐ。海うみ縁望物語はつづく。結文化";
const directory = new URL("../app/fonts/", import.meta.url);
const cssUrl = new URL("https://fonts.googleapis.com/css2");
cssUrl.search = new URLSearchParams({
  family: "Noto Serif JP:wght@400",
  text,
});
const response = await fetch(cssUrl, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  },
});
if (!response.ok) throw new Error(`Font CSS: ${response.status}`);
const css = await response.text();
const fontUrl = css.match(
  /src: url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\) format\('woff2'\)/,
)?.[1];
if (!fontUrl) throw new Error("No WOFF2 subset returned");
const [font, license] = await Promise.all([
  fetch(fontUrl),
  fetch(
    "https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifjp/OFL.txt",
  ),
]);
if (!font.ok || !license.ok) throw new Error("Font or license download failed");
await mkdir(directory, { recursive: true });
const bytes = Buffer.from(await font.arrayBuffer());
await writeFile(new URL("noto-serif-jp-subset.woff2", directory), bytes);
await writeFile(new URL("OFL.txt", directory), await license.text());
console.log(`Japanese subset: ${bytes.length} bytes`);
