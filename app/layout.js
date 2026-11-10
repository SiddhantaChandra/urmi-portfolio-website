import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";

export const metadata = {
  title: "URMI (uwummie) — Japanese Anime Editorial Creator Portfolio",
  description:
    "Awwwards-inspired Wabi-Sabi Japanese anime editorial creator portfolio for Urmi (@uwummie). Thoughtful anime storytelling, in-depth reviews, video essays, and brand collaborations.",
  keywords: [
    "Urmi",
    "uwummie",
    "Anime Critic",
    "Video Essays",
    "Anime & Cosplay",
    "Japanese Editorial Portfolio",
    "Wabi-Sabi Editorial",
  ],
  authors: [{ name: "Urmi", url: "https://www.instagram.com/uwummie" }],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f8f5ee] text-[#1c1917] relative">
        <div className="noise" aria-hidden="true" />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
