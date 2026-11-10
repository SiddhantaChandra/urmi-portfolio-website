import sharp from "sharp";

const contact = await sharp("public/contact-torii-watercolor.png")
  .webp({ quality: 75, effort: 6 })
  .toFile("public/images/contact-torii-watercolor.webp");
console.log(`Contact illustration: ${contact.size} bytes`);

// Keep originals intact. Run from the repository root to regenerate delivery assets.
for (const [source, destination, format] of [
  [
    "public/images/sakura-branch-spite.webp",
    "public/images/sakura-branch-atlas.avif",
    "avif",
  ],
  ["public/images/static.gif", "public/images/paper-noise.png", "png"],
]) {
  const image = sharp(source);
  const result = await (format === "avif"
    ? image.avif({ quality: 45, effort: 6 })
    : image.png({ palette: true, colours: 4, compressionLevel: 9 })
  ).toFile(destination);
  console.log(`${destination}: ${result.size} bytes`);
}
