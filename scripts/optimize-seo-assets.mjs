import sharp from "sharp";
import { petals, sprites } from "../lib/sakura-art.mjs";

const contact = await sharp("public/contact-torii-watercolor.png")
  .webp({ quality: 75, effort: 6 })
  .toFile("public/images/contact-torii-watercolor.webp");
console.log(`Contact illustration: ${contact.size} bytes`);

const portrait = await sharp("public/images/profile.png")
  .webp({ quality: 80, effort: 6 })
  .toFile("public/images/profile.webp");
const socialPortrait = await sharp("public/images/profile.png")
  .resize(300, 360, { fit: "cover" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("public/images/profile-social.jpg");
console.log(`Portrait: ${portrait.size}; social: ${socialPortrait.size} bytes`);

// Retain atlas coordinates, but ship only the sprites used by live petal effects.
const petalSprites = await Promise.all(
  [...new Set(petals.map(([, , name]) => name))].map(async (name) => {
    const [left, top, width, height] = sprites[name];
    const input = await sharp("public/images/sakura-branch-spite.webp")
      .extract({ left, top, width, height })
      .png()
      .toBuffer();
    return { input, left, top };
  }),
);
const atlas = await sharp({
  create: {
    width: 1354,
    height: 1254,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(petalSprites)
  .webp({ quality: 75, effort: 6 })
  .toFile("public/images/sakura-branch-atlas.webp");
console.log(`Petal atlas: ${atlas.size} bytes`);

// Keep originals intact. Run from the repository root to regenerate delivery assets.
const grain = await sharp("public/images/static.gif")
  .png({ palette: true, colours: 4, compressionLevel: 9 })
  .toFile("public/images/paper-noise.png");
console.log(`Paper grain: ${grain.size} bytes`);

await import("./compose-sakura.mjs");
