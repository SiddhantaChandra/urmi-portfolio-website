import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Urmi Chakraborty · Anime & manga storytelling · @uwummie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const portrait = await readFile(
    join(process.cwd(), "public/images/profile-social.jpg"),
  );
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 72,
        background: "#f8f5ee",
        color: "#1c1917",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: 650 }}>
        <div style={{ fontSize: 76, lineHeight: 1.1, letterSpacing: -3 }}>
          Urmi Chakraborty
        </div>
        <div style={{ fontSize: 34, marginTop: 32 }}>
          Anime & manga storytelling
        </div>
        <div style={{ fontSize: 28, marginTop: 24, color: "#ad283d" }}>
          @uwummie
        </div>
        <div style={{ fontSize: 24, marginTop: 56 }}>
          Video essays · Published features · Brand stories
        </div>
      </div>
      {/* biome-ignore lint/performance/noImgElement: next/image cannot be used inside ImageResponse. */}
      <img
        src={`data:image/jpeg;base64,${portrait.toString("base64")}`}
        alt="Urmi Chakraborty"
        width={300}
        height={360}
        style={{ objectFit: "cover", borderRadius: "48%" }}
      />
    </div>,
    size,
  );
}
