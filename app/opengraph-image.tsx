import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mercy Luxe — Interiors, Hospitality & Lifestyle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1512 0%, #2a2018 100%)",
          color: "#f4efe6",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 34,
            letterSpacing: 14,
            color: "#c9a961",
            textTransform: "uppercase",
          }}
        >
          Mercy Luxe
        </div>
        <div
          style={{
            marginTop: 34,
            fontSize: 66,
            fontStyle: "italic",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Elevated spaces.
          <br />
          Meaningful experiences.
        </div>
        <div
          style={{
            marginTop: 44,
            width: 120,
            height: 1,
            background: "#c9a961",
          }}
        />
        <div style={{ marginTop: 28, fontSize: 24, color: "#c9b79c", letterSpacing: 4 }}>
          INTERIORS · HOSPITALITY · LIFESTYLE
        </div>
        <div style={{ marginTop: 12, fontSize: 20, color: "#8a7c6a", letterSpacing: 2 }}>
          Columbus, Ohio
        </div>
      </div>
    ),
    { ...size }
  );
}
