import sharp from "sharp";
import { growth, spriteAnchors, sprites } from "../lib/sakura-art.mjs";

// Bake the resting illustration once, instead of painting an atlas for every blossom.
const atlas = await sharp("public/images/sakura-branch-atlas.avif")
  .png()
  .toBuffer();
const image = `data:image/png;base64,${atlas.toString("base64")}`;
function sprite(name, width = sprites[name][2]) {
  const [left, top, spriteWidth, spriteHeight] = sprites[name];
  const [anchorX, anchorY] = spriteAnchors[name] ?? [left, top];
  const scale = width / spriteWidth;
  return `<svg x="${(left - anchorX) * scale}" y="${(top - anchorY) * scale}" width="${width}" height="${spriteHeight * scale}" viewBox="${sprites[name].join(" ")}" overflow="hidden"><image href="${image}" width="1354" height="1254"/></svg>`;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1354" height="690" viewBox="0 0 1354 690"><g transform="translate(1354 0) scale(-1 1)">${sprite("branch")}${growth.map(([x, y, name, width, angle]) => `<g transform="translate(${x} ${y}) rotate(${angle})">${sprite(name, width)}</g>`).join("")}</g></svg>`;
const result = await sharp(Buffer.from(svg))
  .avif({ quality: 50, effort: 6 })
  .toFile("public/images/sakura-branch.avif");
console.log(`Composed sakura: ${result.size} bytes`);
